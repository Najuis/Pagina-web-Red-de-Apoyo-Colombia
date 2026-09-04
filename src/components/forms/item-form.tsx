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
import { itemSchema, type ItemInput } from "@/lib/validations";
import { createItem, updateItem } from "@/app/actions/item-actions";
import { CONTACT_TYPES, CONTACT_TYPE_LABELS, ITEM_CATEGORIES, ITEM_CATEGORY_LABELS, type ContactType, type ItemCategory } from "@/types";

type Props = {
  mode: "create" | "edit";
  initial?: (ItemInput & { id?: string }) | null;
  redirectTo?: string;
};

type FormValues = {
  name: string;
  description: string;
  category: ItemCategory;
  image: string | null;
  price?: string;
  location: string;
  contactType: ContactType;
  contactValue: string;
};

export function ItemForm({ mode, initial, redirectTo = "/insumos" }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(itemSchema) as Resolver<FormValues>,
    defaultValues: initial
      ? {
          name: initial.name,
          description: initial.description,
          category: initial.category,
          image: initial.image ?? null,
          price: initial.price?.toString() ?? "",
          location: initial.location ?? "",
          contactType: initial.contactType,
          contactValue: initial.contactValue,
        }
      : {
          name: "",
          description: "",
          category: "OTROS",
          image: null,
          price: "",
          location: "",
          contactType: "WHATSAPP",
          contactValue: "",
        },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const payload = {
        name: values.name,
        description: values.description,
        category: values.category,
        image: values.image || null,
        price: values.price ? Number(values.price) : null,
        location: values.location || null,
        contactType: values.contactType,
        contactValue: values.contactValue,
      };

      const result =
        mode === "edit" && initial?.id
          ? await updateItem(initial.id, payload)
          : await createItem(payload);

      if (!result.ok) {
        toast.error(result.error ?? "No se pudo guardar");
        return;
      }
      toast.success(mode === "edit" ? "Cambios guardados" : "Insumo/servicio publicado");
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
                  <Input placeholder="Ej. Despensa de emergencia" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ITEM_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {ITEM_CATEGORY_LABELS[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Describe el insumo o la ayuda que ofreces..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio (opcional)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min={0} placeholder="0.00" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ubicación (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Punto de acopio del barrio" {...field} value={field.value ?? ""} />
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
            {mode === "edit" ? "Guardar cambios" : "Publicar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
