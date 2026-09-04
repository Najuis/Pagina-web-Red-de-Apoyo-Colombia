import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, MessageCircle } from "lucide-react";
import { PostImage } from "@/components/posts/post-card";
import { money } from "@/lib/format";
import { contactHref, formatContactValue } from "@/lib/contact";
import { CONTACT_TYPE_LABELS, ITEM_CATEGORY_LABELS } from "@/types";

export function ItemCard({
  item,
}: {
  item: {
    id: string;
    name: string;
    description: string;
    category: string;
    image?: string | null;
    price?: number | null;
    location?: string | null;
    contactType: string;
    contactValue: string;
  };
}) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <PostImage src={item.image} alt={item.name} className="aspect-[16/10]">
        <Badge className="bg-primary/80 text-primary-foreground">
          {ITEM_CATEGORY_LABELS[item.category as keyof typeof ITEM_CATEGORY_LABELS] ??
            item.category}
        </Badge>
      </PostImage>
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-lg font-semibold">{item.name}</h3>
          {item.price !== null && item.price !== undefined && (
            <p className="shrink-0 font-semibold text-primary">{money(item.price)}</p>
          )}
        </div>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
          {item.description}
        </p>
        {item.location && (
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            {item.location}
          </p>
        )}
        <Button asChild variant="outline" className="mt-4 w-full">
          <Link
            href={contactHref(item.contactType, item.contactValue)}
            target={item.contactType === "WHATSAPP" ? "_blank" : undefined}
            rel="noopener noreferrer"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Contactar por{" "}
            {CONTACT_TYPE_LABELS[item.contactType as keyof typeof CONTACT_TYPE_LABELS] ??
              item.contactType}
          </Link>
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {formatContactValue(item.contactType, item.contactValue)}
        </p>
      </CardContent>
    </Card>
  );
}
