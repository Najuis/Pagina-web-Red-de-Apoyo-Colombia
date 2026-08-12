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
import { deleteItem } from "@/app/actions/item-actions";
import { money } from "@/lib/format";
import { ITEM_CATEGORY_LABELS } from "@/types";
import type { Item } from "@prisma/client";

export function ItemsAdminTable({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
        No hay insumos o servicios todavía.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-14">Imagen</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead className="w-24 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {item.image ? (
                  <div className="relative size-10 overflow-hidden rounded">
                    <Image src={item.image} alt="" fill className="object-cover" sizes="40px" />
                  </div>
                ) : (
                  <div className="size-10 rounded bg-muted" />
                )}
              </TableCell>
              <TableCell>
                <p className="max-w-[220px] truncate font-medium">{item.name}</p>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {ITEM_CATEGORY_LABELS[item.category as keyof typeof ITEM_CATEGORY_LABELS] ?? item.category}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{money(item.price) || "—"}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button asChild variant="ghost" size="icon" aria-label="Editar">
                    <Link href={`/admin/insumos/${item.id}/editar`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <DeleteButton action={deleteItem} id={item.id} label="¿Eliminar este insumo?" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
