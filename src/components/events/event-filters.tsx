"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EVENT_TYPES, EVENT_TYPE_LABELS } from "@/types";

export function EventFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "ALL";

  function update(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set("type", value);
    } else {
      params.delete("type");
    }
    router.push(`/avisos?${params.toString()}`);
  }

  return (
    <Select value={type} onValueChange={update}>
      <SelectTrigger className="w-full sm:w-52">
        <SelectValue placeholder="Tipo de aviso" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">Todos</SelectItem>
        {EVENT_TYPES.map((t) => (
          <SelectItem key={t} value={t}>
            {EVENT_TYPE_LABELS[t]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
