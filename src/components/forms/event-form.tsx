"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploadField } from "@/components/forms/image-upload-field";
import { eventSchema, type EventInput } from "@/lib/validations";
import { toDateTimeLocal } from "@/lib/format";
import { createEvent, updateEvent } from "@/app/actions/event-actions";
import { EVENT_TYPES, EVENT_TYPE_LABELS, type EventType } from "@/types";

type Props = {
  mode: "create" | "edit";
  initial?: (EventInput & { id?: string }) | null;
  redirectTo?: string;
};

type FormValues = {
  title: string;
  description: string;
  type: EventType;
  location: string;
  image: string | null;
  startAt: string;
  endAt?: string;
};

export function EventForm({ mode, initial, redirectTo = "/admin/avisos" }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(eventSchema) as unknown as Resolver<FormValues>,
    defaultValues: initial
      ? {
          title: initial.title,
          description: initial.description ?? "",
          type: initial.type,
          location: initial.location ?? "",
          image: initial.image ?? null,
          startAt: toDateTimeLocal(initial.startAt),
          endAt: initial.endAt ? toDateTimeLocal(initial.endAt) : undefined,
        }
      : {
          title: "",
          description: "",
          type: "EVENTO",
          location: "",
          image: null,
          startAt: "",
        },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const payload = {
        title: values.title,
        description: values.description || null,
        type: values.type,
        location: values.location || null,
        image: values.image || null,
        startAt: values.startAt,
        endAt: values.endAt || null,
      };

      const result =
        mode === "edit" && initial?.id
          ? await updateEvent(initial.id, payload)
          : await createEvent(payload);

      if (!result.ok) {
        toast.error(result.error ?? "No se pudo guardar");
        return;
      }
      toast.success(mode === "edit" ? "Cambios guardados" : "Aviso creado");
      router.push(redirectTo);
      router.refresh();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ej. Jornada de acopio de alimentos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de aviso" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EVENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {EVENT_TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lugar</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Centro de acopio principal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="startAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inicio</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fin (opcional)</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagen (opcional)</FormLabel>
              <FormControl>
                <ImageUploadField value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (opcional)</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Detalles del aviso..." {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {mode === "edit" ? "Guardar cambios" : "Crear aviso"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
