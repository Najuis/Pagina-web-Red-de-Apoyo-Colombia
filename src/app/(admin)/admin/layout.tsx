import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <AdminSidebar />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
