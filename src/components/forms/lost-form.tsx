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
  FormDescription,
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
import { lostReportSchema, type LostReportInput } from "@/lib/validations";
import { toDateTimeLocal } from "@/lib/format";
import { createLostReport, updateLostReport } from "@/app/actions/lost-actions";
import {
  CONTACT_TYPES,
  CONTACT_TYPE_LABELS,
  LOST_STATUSES,
  LOST_STATUS_LABELS,
  LOST_TYPES,
  LOST_TYPE_LABELS,
  type ContactType,
  type LostStatus,
  type LostType,
} from "@/types";

type Props = {
  mode: "create" | "edit";
  includeStatus?: boolean;
  initial?: (LostReportInput & { id?: string }) | null;
  redirectTo?: string;
};

type FormValues = {
  type: LostType;
  status: LostStatus;
  name: string;
  description: string;
  characteristics: string;
  lastLocation: string;
  latitude?: string;
  longitude?: string;
  lostDate: string;
  photo: string | null;
  contactType: ContactType;
  contactValue: string;
};

export function LostForm({ mode, includeStatus, initial, redirectTo = "/perdidos" }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(lostReportSchema) as unknown as Resolver<FormValues>,
    defaultValues: initial
      ? {
          type: initial.type,
          status: initial.status,
          name: initial.name,
          description: initial.description,
          characteristics: initial.characteristics ?? "",
          lastLocation: initial.lastLocation,
          latitude: initial.latitude?.toString() ?? "",
          longitude: initial.longitude?.toString() ?? "",
          lostDate: toDateTimeLocal(initial.lostDate),
          photo: initial.photo ?? null,
          contactType: initial.contactType,
          contactValue: initial.contactValue,
        }
      : {
          type: "PERSONA",
          status: "PERDIDO",
          name: "",
          description: "",
          characteristics: "",
          lastLocation: "",
          latitude: "",
          longitude: "",
          lostDate: "",
          photo: null,
          contactType: "WHATSAPP",
          contactValue: "",
        },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const payload = {
        type: values.type,
        status: values.status ?? "PERDIDO",
        name: values.name,
        description: values.description,
        characteristics: values.characteristics || null,
        lastLocation: values.lastLocation,
        latitude: values.latitude ? Number(values.latitude) : null,
        longitude: values.longitude ? Number(values.longitude) : null,
        lostDate: values.lostDate,
        photo: values.photo || null,
        contactType: values.contactType,
        contactValue: values.contactValue,
      };

      const result =
        mode === "edit" && initial?.id
          ? await updateLostReport(initial.id, payload)
          : await createLostReport(payload);

      if (!result.ok) {
        toast.error(result.error ?? "No se pudo guardar");
        return;
      }
      toast.success(mode === "edit" ? "Reporte actualizado" : "Reporte enviado, ¡gracias!");
      router.push(redirectTo);
      router.refresh();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>¿Qué es?</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LOST_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {LOST_TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {includeStatus && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LOST_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {LOST_STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder={form.watch("type") === "PERSONA" ? "Nombre de la persona" : "Nombre del animal"} {...field} />
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
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Describe su apariencia, vestimenta, señales particulares..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="characteristics"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Características (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ej. 72 años, cabello cano, cicatriz en la mano" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="lastLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Última ubicación</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Calle 15, Armenia, Quindío" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lostDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de pérdida</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitud (opcional)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="4.5333" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormDescription>Para mostrar un marcador en el mapa.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitud (opcional)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="-75.6889" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto (opcional)</FormLabel>
              <FormControl>
                <ImageUploadField value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="contactType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contacto vía</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Medio de contacto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CONTACT_TYPES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {CONTACT_TYPE_LABELS[c]}
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
            name="contactValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor de contacto</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. +57 300 123 4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {mode === "edit" ? "Guardar cambios" : "Publicar reporte"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
