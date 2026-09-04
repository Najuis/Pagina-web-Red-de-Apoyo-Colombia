"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ImageUploadField({
  value,
  onChange,
  id,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  id?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al subir la imagen");
      onChange(data.url);
      toast.success("Imagen subida correctamente");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <input
        ref={inputRef}
        type="file"
        id={id}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <div
        className={cn(
          "relative flex aspect-[16/10] w-40 items-center justify-center overflow-hidden rounded-lg border border-dashed",
          !value && "bg-muted"
        )}
      >
        {value ? (
          <>
            <Image src={value} alt="Imagen" fill className="object-cover" sizes="160px" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow transition hover:bg-destructive hover:text-white"
              aria-label="Quitar imagen"
            >
              <X className="size-4" />
            </button>
          </>
        ) : (
          <span className="text-xs text-muted-foreground">Sin imagen</span>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <ImagePlus className="size-4" aria-hidden="true" />
        )}
        {value ? "Cambiar" : "Subir imagen"}
      </Button>
    </div>
  );
}
