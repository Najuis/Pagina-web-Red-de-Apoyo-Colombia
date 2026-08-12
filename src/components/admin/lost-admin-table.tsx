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
import { deleteLostReport, markFound } from "@/app/actions/lost-actions";
import { formatDate } from "@/lib/format";
import { LOST_STATUS_LABELS, LOST_TYPE_LABELS } from "@/types";
import { cn } from "@/lib/utils";
import type { LostReport } from "@prisma/client";

const statusClass = (status: string) => {
  switch (status) {
    case "ENCONTRADO":
      return "bg-success text-white";
    case "PERDIDO":
      return "bg-destructive text-white";
    default:
      return "";
  }
};

export function LostAdminTable({ reports }: { reports: LostReport[] }) {
  if (reports.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
        No hay reportes todavía.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-14">Foto</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="w-48">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>
                {report.photo ? (
                  <div className="relative size-10 overflow-hidden rounded">
                    <Image src={report.photo} alt="" fill className="object-cover" sizes="40px" />
                  </div>
                ) : (
                  <div className="size-10 rounded bg-muted" />
                )}
              </TableCell>
              <TableCell>
                <p className="max-w-[200px] truncate font-medium">{report.name}</p>
                <p className="max-w-[200px] truncate text-xs text-muted-foreground">
                  {report.lastLocation}
                </p>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {LOST_TYPE_LABELS[report.type as keyof typeof LOST_TYPE_LABELS] ?? report.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={cn(statusClass(report.status))}>
                  {LOST_STATUS_LABELS[report.status as keyof typeof LOST_STATUS_LABELS] ?? report.status}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm">
                {formatDate(report.lostDate)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <ToggleButton
                    action={markFound}
                    id={report.id}
                    active={report.status === "ENCONTRADO"}
                    activeLabel="Encontrado"
                    inactiveLabel="Marcar encontrado"
                    successMessage="Estado actualizado"
                  />
                  <Button asChild variant="ghost" size="icon" aria-label="Editar">
                    <Link href={`/admin/perdidos/${report.id}/editar`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <DeleteButton
                    action={deleteLostReport}
                    id={report.id}
                    label="¿Eliminar este reporte?"
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
