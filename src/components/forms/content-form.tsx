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
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUploadField } from "@/components/forms/image-upload-field";
import { postSchema } from "@/lib/validations";
import { slugify } from "@/lib/format";
import { createPost, updatePost } from "@/app/actions/post-actions";
import {
  POST_CATEGORIES,
  POST_CATEGORY_LABELS,
  POST_STATUSES,
  POST_STATUS_LABELS,
  type PostCategory,
  type PostKind,
  type PostStatus,
} from "@/types";

type FormValues = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string | null;
  kind: PostKind;
  category: PostCategory;
  status: PostStatus;
  featured: boolean;
};

type Props = {
  mode: "create" | "edit";
  kind: "PUBLICACION" | "NOTICIA";
  initial?: (FormValues & { id?: string }) | null;
  redirectTo?: string;
};

export function ContentForm({ mode, kind, initial, redirectTo = "/admin/publicaciones" }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(postSchema) as Resolver<FormValues>,
    defaultValues: initial ?? {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      image: null,
      kind,
      category: "COMUNIDAD",
      status: "PUBLICADO",
      featured: false,
    },
  });

  const title = form.watch("title");

  function generateSlug() {
    const slug = slugify(title);
    if (slug) form.setValue("slug", slug, { shouldValidate: true });
  }

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result =
        mode === "edit" && initial?.id
          ? await updatePost(initial.id, values)
          : await createPost(values);

      if (!result.ok) {
        toast.error(result.error ?? "No se pudo guardar");
        return;
      }
      toast.success(mode === "edit" ? "Cambios guardados" : "Publicación creada");
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
                <Input placeholder="Título de la publicación" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug (URL)</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input placeholder="url-de-la-publicacion" {...field} />
                  <Button type="button" variant="outline" onClick={generateSlug}>
                    Generar
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                Identificador único para la URL. Se genera automáticamente desde el título.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {POST_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {POST_CATEGORY_LABELS[c]}
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
                    {POST_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {POST_STATUS_LABELS[s]}
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
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resumen (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  rows={2}
                  placeholder="Breve resumen que se muestra en las tarjetas"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagen destacada</FormLabel>
              <FormControl>
                <ImageUploadField value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenido</FormLabel>
              <FormControl>
                <Textarea rows={10} placeholder="Escribe el contenido completo..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-lg border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1">
                <FormLabel>Destacado</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Muestra esta publicación en el carousel principal de la portada.
                </p>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {mode === "edit" ? "Guardar cambios" : "Crear publicación"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
