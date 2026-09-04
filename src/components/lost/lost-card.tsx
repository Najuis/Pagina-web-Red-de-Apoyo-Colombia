import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, CalendarDays, MessageCircle } from "lucide-react";
import { PostImage } from "@/components/posts/post-card";
import { formatDate } from "@/lib/format";
import { contactHref, formatContactValue } from "@/lib/contact";
import { CONTACT_TYPE_LABELS, LOST_STATUS_LABELS, LOST_TYPE_LABELS } from "@/types";

import { cn } from "@/lib/utils";

const statusClass = (status: string) => {
  switch (status) {
    case "ENCONTRADO":
      return "bg-success text-white";
    case "PERDIDO":
      return "bg-destructive text-destructive-foreground";
    default:
      return "";
  }
};

export function LostCard({
  report,
}: {
  report: {
    id: string;
    type: string;
    status: string;
    name: string;
    description: string;
    characteristics?: string | null;
    lastLocation: string;
    lostDate: Date;
    photo?: string | null;
    contactType: string;
    contactValue: string;
  };
}) {
  const statusLabel =
    LOST_STATUS_LABELS[report.status as keyof typeof LOST_STATUS_LABELS] ?? report.status;

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative">
        <PostImage src={report.photo} alt={report.name} className="aspect-[4/3]">
          <Badge variant="secondary">
            {LOST_TYPE_LABELS[report.type as keyof typeof LOST_TYPE_LABELS] ?? report.type}
          </Badge>
        </PostImage>
        <Badge className={cn("absolute right-2 top-2", statusClass(report.status))}>
          {statusLabel}
        </Badge>
      </div>
      <CardContent className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-semibold">{report.name}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
          {report.description}
        </p>
        <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            {report.lastLocation}
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
            Perdido/a el {formatDate(report.lostDate)}
          </p>
        </div>
        <Button asChild variant="outline" className="mt-4 w-full">
          <Link
            href={contactHref(report.contactType, report.contactValue)}
            target={report.contactType === "WHATSAPP" ? "_blank" : undefined}
            rel="noopener noreferrer"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Contactar por{" "}
            {CONTACT_TYPE_LABELS[report.contactType as keyof typeof CONTACT_TYPE_LABELS] ??
              report.contactType}
          </Link>
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {formatContactValue(report.contactType, report.contactValue)}
        </p>
      </CardContent>
    </Card>
  );
}
