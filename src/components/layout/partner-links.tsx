"use client";

import { useState, useEffect } from "react";

type PartnerLink = {
  src: string;
  alt: string;
  href: string;
  title: string;
};

export function PartnerLinks({
  partners,
  className,
}: {
  partners: PartnerLink[];
  className: string;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const check = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(check);
  }, [partners]);

  if (!loaded) return null;

  return (
    <div className={cn("py-16", className)}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {partners.map((link, index) => (
            <div
              key={index}
              className="rounded-full bg-muted p-2 hover:bg-primary hover:text-primary-foreground transition"
            >
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-full border border-secondary"
              >
                <img
                  src={link.src}
                  alt={link.alt}
                  width={40}
                  height={40}
                  loading="lazy"
                  className="object-contain"
                />
              </a>
              <p className="text-xs mt-1 text-muted-foreground truncate">{link.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter((c) => c).join(" ");
}