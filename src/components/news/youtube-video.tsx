"use client";

import { useEffect, useState } from "react";

export function YoutubeVideo({
  videoId,
}: {
  videoId: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const checkReady = setTimeout(() => {
      setReady(true);
    }, 1000);
    return () => clearTimeout(checkReady);
  }, [videoId]);

  if (!ready) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-xl border bg-secondary p-8 text-center">
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Video de apoyo colombiano"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}