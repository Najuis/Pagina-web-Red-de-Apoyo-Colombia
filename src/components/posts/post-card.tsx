import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, User } from "lucide-react";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { POST_CATEGORY_LABELS } from "@/types";

export function PostImage({
  src,
  alt,
  className,
  children,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  children?: React.ReactNode;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-secondary/70",
        className
      )}
    >
      {children}
    </div>
  );
}

export function PostCard({
  post,
}: {
  post: {
    slug: string;
    title: string;
    excerpt?: string | null;
    image?: string | null;
    category: string;
    kind: string;
    createdAt: Date;
    author?: { name: string } | null;
  };
}) {
  return (
    <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
      <PostImage src={post.image} alt={post.title} className="aspect-[16/10]">
        <Badge className="bg-primary/80 text-primary-foreground backdrop-blur-sm">
          {POST_CATEGORY_LABELS[post.category as keyof typeof POST_CATEGORY_LABELS] ?? post.category}
        </Badge>
      </PostImage>
      <CardContent className="p-5">
        <h3 className="font-heading text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {formatDate(post.createdAt)}
          </span>
          {post.author && (
            <span className="flex items-center gap-1">
              <User className="size-3.5" aria-hidden="true" />
              {post.author.name}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
