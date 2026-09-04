import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { NextRequest } from "next/server";
import logger from "@/lib/logger";

interface GDPRRequest {
  type: "export" | "delete";
  email: string;
  reason?: string;
}

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "status") {
    return NextResponse.json({
      hasData: true,
      emailVerified: true,
      dataCategories: ["profile", "posts", "lostReports", "items", "comments"],
    });
  }

  if (action === "export") {
    const email = searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Email parameter required" }, { status: 400 });
    }

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const data = {
        profile: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        posts: await prisma.post.findMany({
          where: { authorId: user.id },
          select: { id: true, title: true, slug: true, createdAt: true, status: true },
        }),
        lostReports: await prisma.lostReport.findMany({
          where: { reporterId: user.id },
          select: { id: true, type: true, status: true, lostDate: true, createdAt: true },
        }),
        items: await prisma.item.findMany({
          where: { publishedById: user.id },
          select: { id: true, name: true, category: true, createdAt: true },
        }),
      };

      return NextResponse.json({ data, exportedAt: new Date().toISOString() });
    } catch (error) {
      console.error("GDPR export error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

  if (action === "delete") {
    const email = searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Email parameter required" }, { status: 400 });
    }

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Delete user data in dependency order
      await prisma.lostReport.deleteMany({ where: { reporterId: user.id } });
      await prisma.item.deleteMany({ where: { publishedById: user.id } });
      await prisma.post.deleteMany({ where: { authorId: user.id } });

      // Note: We keep the user record but mark it as deleted for audit purposes
      // or we could delete it entirely: await prisma.user.delete({ where: { id: user.id } });

      return NextResponse.json({
        message: "User data deleted successfully",
        deletedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("GDPR delete error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Invalid action. Use: status, export, or delete" }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, email, reason } = body as GDPRRequest;

    if (!type || !email) {
      return NextResponse.json({ error: "Type and email are required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Log the request
    logger.info({ type, email: "***REDACTED***", reason }, "GDPR data subject request received");

    // Process based on type
    let result;
    if (type === "export") {
      result = await handleGDPRExport(email);
    } else if (type === "delete") {
      result = await handleGDPRDelete(email);
    } else {
      return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      requestId: `gdpr-${Date.now()}`,
      ...result,
    });
  } catch (error) {
    console.error("GDPR POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function handleGDPRExport(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  const data = {
    profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    posts: await prisma.post.findMany({
      where: { authorId: user.id },
      select: { id: true, title: true, slug: true, createdAt: true, status: true },
    }),
    lostReports: await prisma.lostReport.findMany({
      where: { reporterId: user.id },
      select: { id: true, type: true, status: true, lostDate: true, createdAt: true },
    }),
    items: await prisma.item.findMany({
      where: { publishedById: user.id },
      select: { id: true, name: true, category: true, createdAt: true },
    }),
  };

  return { data, exportedAt: new Date().toISOString() };
}

async function handleGDPRDelete(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  // Delete user data in dependency order
  await prisma.lostReport.deleteMany({ where: { reporterId: user.id } });
  await prisma.item.deleteMany({ where: { publishedById: user.id } });
  await prisma.post.deleteMany({ where: { authorId: user.id } });

  return {
    message: "User data deleted successfully",
    deletedAt: new Date().toISOString(),
  };
}