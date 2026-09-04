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
import { LOST_STATUS_LABELS, LOST_STATUSES, LOST_TYPE_LABELS, LOST_TYPES } from "@/types";

export function LostFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const type = searchParams.get("type") ?? "ALL";
  const status = searchParams.get("status") ?? "ALL";

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/perdidos?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          placeholder="Buscar por nombre o descripción..."
          defaultValue={q}
          className="pl-9"
          onChange={(e) => {
            if (e.target.value.length > 2 || e.target.value.length === 0) {
              update("q", e.target.value);
            }
          }}
        />
      </div>
      <Select value={type} onValueChange={(v) => update("type", v)}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos</SelectItem>
          {LOST_TYPES.map((t) => (
            <SelectItem key={t} value={t}>
              {LOST_TYPE_LABELS[t]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={status} onValueChange={(v) => update("status", v)}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos</SelectItem>
          {LOST_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {LOST_STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
