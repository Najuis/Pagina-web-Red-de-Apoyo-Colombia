"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { POST_CATEGORY_LABELS, POST_KIND_LABELS } from "@/types";
import { cn } from "@/lib/utils";

type HeroPost = {
  slug: string;
  title: string;
  excerpt?: string | null;
  image?: string | null;
  category: string;
  kind: string;
};

const AUTOPLAY_MS = 7000;

export function HeroCarousel({ posts }: { posts: HeroPost[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = posts.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [next, paused, count]);

  if (count === 0) return null;
  const post = posts[index];

  return (
    <section
      className="relative h-[70vh] min-h-[420px] max-h-[680px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carrusel"
      aria-label="Publicaciones destacadas"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={post.slug}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {post.image ? (
            <Image src={post.image} alt="" fill priority className="object-cover" sizes="100vw" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary/60" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/15 text-white backdrop-blur-sm">
                  {POST_KIND_LABELS[post.kind as keyof typeof POST_KIND_LABELS] ?? post.kind}
                </Badge>
                <Badge className="bg-white/15 text-white backdrop-blur-sm">
                  {POST_CATEGORY_LABELS[post.category as keyof typeof POST_CATEGORY_LABELS] ??
                    post.category}
                </Badge>
              </div>
              <h1 className="font-heading mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mt-4 line-clamp-3 max-w-xl text-sm text-white/85 sm:text-base">
                  {post.excerpt}
                </p>
              )}
              <Button
                asChild
                size="lg"
                className="mt-6 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <Link href={`/${post.kind === "NOTICIA" ? "noticias" : "publicaciones"}/${post.slug}`}>
                  Leer más
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {count > 1 && (
        <>
          <div className="absolute inset-y-0 left-0 z-20 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={prev}
              className="ml-2 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              aria-label="Anterior"
            >
              <ChevronLeft className="size-6" />
            </Button>
          </div>
          <div className="absolute inset-y-0 right-0 z-20 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              className="mr-2 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              aria-label="Siguiente"
            >
              <ChevronRight className="size-6" />
            </Button>
          </div>
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {posts.map((p, i) => (
              <button
                key={p.slug}
                onClick={() => setIndex(i)}
                aria-label={`Ir a la publicación ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "w-8 bg-secondary" : "w-2 bg-white/50 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
