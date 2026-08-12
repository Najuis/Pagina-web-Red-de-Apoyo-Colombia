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
import { mapLocationSchema, type MapLocationInput } from "@/lib/validations";
import { createLocation, updateLocation } from "@/app/actions/location-actions";
import { LOCATION_TYPES, LOCATION_TYPE_LABELS, type LocationType } from "@/types";

type Props = {
  mode: "create" | "edit";
  initial?: (MapLocationInput & { id?: string }) | null;
  redirectTo?: string;
};

type FormValues = {
  name: string;
  type: LocationType;
  latitude: string;
  longitude: string;
  address: string;
  hours: string;
  phone: string;
  description: string;
};

export function LocationForm({ mode, initial, redirectTo = "/admin/ubicaciones" }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(mapLocationSchema) as unknown as Resolver<FormValues>,
    defaultValues: initial
      ? {
          name: initial.name,
          type: initial.type,
          latitude: initial.latitude.toString(),
          longitude: initial.longitude.toString(),
          address: initial.address ?? "",
          hours: initial.hours ?? "",
          phone: initial.phone ?? "",
          description: initial.description ?? "",
        }
      : {
          name: "",
          type: "CENTRO_ACOPIO",
          latitude: "",
          longitude: "",
          address: "",
          hours: "",
          phone: "",
          description: "",
        },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const payload = {
        name: values.name,
        type: values.type,
        latitude: values.latitude ?? "",
        longitude: values.longitude ?? "",
        address: values.address || null,
        hours: values.hours || null,
        phone: values.phone || null,
        description: values.description || null,
      };

      const result =
        mode === "edit" && initial?.id
          ? await updateLocation(initial.id, payload)
          : await createLocation(payload);

      if (!result.ok) {
        toast.error(result.error ?? "No se pudo guardar");
        return;
      }
      toast.success(mode === "edit" ? "Cambios guardados" : "Ubicación creada");
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Centro de acopio principal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de ubicación" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LOCATION_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {LOCATION_TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <FormLabel>Latitud</FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="4.5333" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitud</FormLabel>
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Calle y número" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horario (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Lun a Vie 9:00 - 18:00" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="+57 300 000 0000" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (opcional)</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Información adicional..." {...field} value={field.value ?? ""} />
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
            {mode === "edit" ? "Guardar cambios" : "Crear ubicación"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
