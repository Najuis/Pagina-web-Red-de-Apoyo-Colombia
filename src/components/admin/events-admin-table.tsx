import Link from "next/link";
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
import { deleteEvent } from "@/app/actions/event-actions";
import { formatDateTime } from "@/lib/format";
import { EVENT_TYPE_LABELS } from "@/types";
import type { Event } from "@prisma/client";

export function EventsAdminTable({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
        No hay avisos todavía.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Inicio</TableHead>
            <TableHead>Lugar</TableHead>
            <TableHead className="w-24 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <p className="max-w-[240px] truncate font-medium">{event.title}</p>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {EVENT_TYPE_LABELS[event.type as keyof typeof EVENT_TYPE_LABELS] ?? event.type}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm">
                {formatDateTime(event.startAt)}
              </TableCell>
              <TableCell className="max-w-[160px] truncate text-sm text-muted-foreground">
                {event.location ?? "—"}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button asChild variant="ghost" size="icon" aria-label="Editar">
                    <Link href={`/admin/avisos/${event.id}/editar`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <DeleteButton action={deleteEvent} id={event.id} label="¿Eliminar este aviso?" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
