"use client";

import dynamic from "next/dynamic";

const CommunityMapInner = dynamic(
  () => import("@/components/map/community-map").then((m) => m.CommunityMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted">
        <span className="text-sm text-muted-foreground">Cargando mapa…</span>
      </div>
    ),
  }
);

export function MapView(props: React.ComponentProps<typeof CommunityMapInner>) {
  return <CommunityMapInner {...props} />;
}
