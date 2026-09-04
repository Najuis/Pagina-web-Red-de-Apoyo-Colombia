"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LOCATION_TYPES, LOCATION_TYPE_LABELS } from "@/types";
import type { MapLocation } from "@prisma/client";

const CommunityMap = dynamic(
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

type Location = Pick<
  MapLocation,
  "id" | "name" | "type" | "latitude" | "longitude" | "address" | "hours" | "phone" | "description"
>;

export function MapSection({ locations }: { locations: Location[] }) {
  const [filter, setFilter] = useState<string>("ALL");

  const filtered = useMemo(
    () => (filter === "ALL" ? locations : locations.filter((l) => l.type === filter)),
    [filter, locations]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-2">
            <div className="h-[480px]">
              <CommunityMap locations={filtered} />
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filtrar por tipo">
          <Badge
            variant="secondary"
            className={cn("cursor-pointer", filter === "ALL" && "bg-primary text-primary-foreground")}
            onClick={() => setFilter("ALL")}
          >
            Todos
          </Badge>
          {LOCATION_TYPES.map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className={cn("cursor-pointer", filter === t && "bg-primary text-primary-foreground")}
              onClick={() => setFilter(t)}
            >
              {LOCATION_TYPE_LABELS[t]}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No hay ubicaciones de este tipo.
          </p>
        )}
        {filtered.map((loc) => (
          <Card key={loc.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-heading font-semibold">{loc.name}</h3>
                <Badge variant="outline">
                  {LOCATION_TYPE_LABELS[loc.type as keyof typeof LOCATION_TYPE_LABELS] ?? loc.type}
                </Badge>
              </div>
              {loc.address && <p className="mt-1 text-sm text-muted-foreground">{loc.address}</p>}
              {loc.hours && <p className="text-sm text-muted-foreground">🕐 {loc.hours}</p>}
              {loc.phone && <p className="text-sm text-muted-foreground">📞 {loc.phone}</p>}
              {loc.description && (
                <p className="mt-1 text-sm text-muted-foreground">{loc.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
