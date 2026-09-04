import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, User } from "lucide-react";
import { formatDate } from "@/lib/format";
import { POST_CATEGORY_LABELS, POST_KIND_LABELS } from "@/types";

export function PostDetail({
  post,
}: {
  post: {
    title: string;
    content: string;
    excerpt?: string | null;
    image?: string | null;
    category: string;
    kind: string;
    createdAt: Date;
    author?: { name: string } | null;
  };
}) {
  return (
    <article className="mx-auto max-w-3xl">
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">
          {POST_KIND_LABELS[post.kind as keyof typeof POST_KIND_LABELS] ?? post.kind}
        </Badge>
        <Badge>
          {POST_CATEGORY_LABELS[post.category as keyof typeof POST_CATEGORY_LABELS] ?? post.category}
        </Badge>
      </div>

      <h1 className="font-heading mt-4 text-3xl font-bold leading-tight sm:text-4xl">
        {post.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-4" aria-hidden="true" />
          {formatDate(post.createdAt)}
        </span>
        {post.author && (
          <span className="flex items-center gap-1.5">
            <User className="size-4" aria-hidden="true" />
            {post.author.name}
          </span>
        )}
      </div>

      {post.excerpt && (
        <p className="font-heading mt-6 text-lg italic leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
      )}

      {post.image && (
        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-xl">
          <Image src={post.image} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
        </div>
      )}

      <div className="mt-8 space-y-4 whitespace-pre-wrap text-base leading-relaxed">
        {post.content}
      </div>
    </article>
  );
}
