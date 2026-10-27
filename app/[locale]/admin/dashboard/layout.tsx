"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebarProvider } from "@/components/admin/dashboard/AdminSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  return (
    <AdminSidebarProvider>
      <SidebarInset className="md:ml-0 ">
        <div className="flex bg-gradient-to-b from-brand-black/95 to-brand-black/90 h-12 shrink-0 items-center gap-2 border-b px-4 z-40">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>
        <div className="flex-1 overflow-x-auto bg-gradient-to-b from-brand-black to-brand-black/90 p-4">
          {children}
        </div>
      </SidebarInset>
    </AdminSidebarProvider>
  );
}

