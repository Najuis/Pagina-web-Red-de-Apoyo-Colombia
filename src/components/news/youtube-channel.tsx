"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function YoutubeChannel({
  channelId,
  className,
}: {
  channelId: string;
  className?: string;
}) {
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = `https://www.youtube.com/channel/${channelId}?sub_confirmation=1`;
    setWidgetUrl(url);
  }, [channelId]);

  if (!widgetUrl) return null;

  return (
    <section className={cn("py-16", className ?? undefined)}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-xl border bg-secondary p-8 text-center">
          <a
            href={widgetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-64 w-full rounded-xl border bg-secondary p-8 text-center"
          >
            <iframe
              width="100%"
              height="400"
              src={widgetUrl.replace("sub_confirmation=1", "")}
              title="YouTube channel embed"
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              loading="lazy"
            />
          </a>
        </div>
      </div>
    </section>
  );
}