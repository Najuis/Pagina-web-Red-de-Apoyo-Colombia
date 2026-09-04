import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/admin/delete-button";
import { ToggleButton } from "@/components/admin/toggle-button";
import { deletePost, toggleFeatured } from "@/app/actions/post-actions";
import { formatDate } from "@/lib/format";
import { POST_CATEGORY_LABELS, POST_STATUS_LABELS } from "@/types";
import type { Post } from "@prisma/client";

type AdminPost = Post & { author?: { name: string } | null };

export function PostsAdminTable({
  posts,
  basePath,
}: {
  posts: AdminPost[];
  basePath: "/admin/publicaciones" | "/admin/noticias";
}) {
  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
        No hay elementos todavía.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-14">Imagen</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Destacado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="w-28 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                {post.image ? (
                  <div className="relative size-10 overflow-hidden rounded">
                    <Image src={post.image} alt="" fill className="object-cover" sizes="40px" />
                  </div>
                ) : (
                  <div className="size-10 rounded bg-muted" />
                )}
              </TableCell>
              <TableCell>
                <p className="max-w-[220px] truncate font-medium">{post.title}</p>
                <p className="text-xs text-muted-foreground">{post.author?.name}</p>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {POST_CATEGORY_LABELS[post.category as keyof typeof POST_CATEGORY_LABELS] ?? post.category}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={post.status === "PUBLICADO" ? "secondary" : "outline"}
                >
                  {POST_STATUS_LABELS[post.status as keyof typeof POST_STATUS_LABELS] ?? post.status}
                </Badge>
              </TableCell>
              <TableCell>
                <ToggleButton
                  action={toggleFeatured}
                  id={post.id}
                  active={post.featured}
                  activeLabel="Destacado"
                  inactiveLabel="Destacar"
                  successMessage="Destacado actualizado"
                />
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm">
                {formatDate(post.createdAt)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button asChild variant="ghost" size="icon" aria-label="Editar">
                    <Link href={`${basePath}/${post.id}/editar`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <DeleteButton
                    action={deletePost}
                    id={post.id}
                    label="¿Eliminar esta publicación?"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
