import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, MapPin, Clock } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import { EVENT_TYPE_LABELS } from "@/types";

export function EventCard({
  event,
}: {
  event: {
    id: string;
    title: string;
    description?: string | null;
    type: string;
    location?: string | null;
    startAt: Date;
    endAt?: Date | null;
  };
}) {
  return (
    <Card className="h-full transition-shadow hover:shadow-lg">
      <CardContent className="p-5">
        <Badge variant="secondary">{EVENT_TYPE_LABELS[event.type as keyof typeof EVENT_TYPE_LABELS] ?? event.type}</Badge>
        <h3 className="mt-3 font-heading text-lg font-semibold leading-snug">{event.title}</h3>
        {event.description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
        )}
        <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <CalendarDays className="size-4" aria-hidden="true" />
            {formatDateTime(event.startAt)}
          </p>
          {event.location && (
            <p className="flex items-center gap-2">
              <MapPin className="size-4" aria-hidden="true" />
              {event.location}
            </p>
          )}
          {event.endAt && (
            <p className="flex items-center gap-2">
              <Clock className="size-4" aria-hidden="true" />
              Hasta {formatDateTime(event.endAt, "HH:mm")}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
