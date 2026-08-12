import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LostForm } from "@/components/forms/lost-form";
import { Card, CardContent } from "@/components/ui/card";
import type { LostReportInput } from "@/lib/validations";

export const metadata = {
  title: "Editar reporte",
};

export default async function AdminEditarPerdidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await prisma.lostReport.findUnique({ where: { id } });
  if (!report) notFound();

  const initial: LostReportInput & { id: string } = {
    id: report.id,
    type: report.type as LostReportInput["type"],
    status: report.status as LostReportInput["status"],
    name: report.name,
    description: report.description,
    characteristics: report.characteristics,
    lastLocation: report.lastLocation,
    latitude: report.latitude,
    longitude: report.longitude,
    lostDate: report.lostDate,
    photo: report.photo,
    contactType: report.contactType as LostReportInput["contactType"],
    contactValue: report.contactValue,
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Editar reporte</h1>
        <p className="text-muted-foreground">Actualiza los datos del reporte.</p>
      </div>
      <Card>
        <CardContent className="p-6 sm:p-8">
          <LostForm mode="edit" includeStatus initial={initial} redirectTo="/admin/perdidos" />
        </CardContent>
      </Card>
    </div>
  );
}
