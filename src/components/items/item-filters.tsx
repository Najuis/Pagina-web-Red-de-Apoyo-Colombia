"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ITEM_CATEGORIES, ITEM_CATEGORY_LABELS } from "@/types";

export function ItemFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "ALL";

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/insumos?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          placeholder="Buscar insumo o servicio..."
          defaultValue={q}
          className="pl-9"
          onChange={(e) => {
            if (e.target.value.length > 2 || e.target.value.length === 0) {
              update("q", e.target.value);
            }
          }}
        />
      </div>
      <Select value={category} onValueChange={(v) => update("category", v)}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todas</SelectItem>
          {ITEM_CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>
              {ITEM_CATEGORY_LABELS[c]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
