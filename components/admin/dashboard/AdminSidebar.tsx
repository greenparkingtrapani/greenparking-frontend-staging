"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAdminDashboardAuth } from "@/hooks/admin/dashboard/useAdminDashboardAuth"
import { Calendar, Settings, Car, LogOut, FilePenLine } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarGroup
} from "@/components/ui/sidebar"

const navigation = [
  { name: "Gestione Sito Web", href: "/admin/dashboard/content", icon: FilePenLine },
  {
    name: "Prenotazioni",
    href: "/admin/dashboard/reservations",
    icon: Calendar,
  },
  {
    name: "Configurazione Veicoli", 
    href: "/admin/dashboard/config",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const { logout } = useAdminDashboardAuth()
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="z-50 top-16 h-[calc(100vh-4rem)] ">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton variant="default" size="lg" className="data-[state=open]:bg-sidebar-accent">
              <div className="text-primary flex aspect-square size-8 items-center justify-center rounded-lg">
                <Car className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Admin Dashboard</span>
                <span className="truncate text-xs text-muted-foreground">Gestisci il tuo parcheggio</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navigation.map((item) => {
              const isActive = pathname.includes(item.href)
              return (
                <SidebarMenuItem key={item.name}>
                <SidebarMenuButton variant="primary"  asChild isActive={isActive}>
                  <Link href={item.href}>
                    <item.icon className="size-4" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={logout}
              className={cn(
                "text-destructive hover:bg-destructive/10 hover:text-destructive",
                "data-[active=true]:bg-destructive/10 data-[active=true]:text-destructive"
              )}
            >
              <LogOut className="size-4" />
              <span>Esci</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export function AdminSidebarProvider({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      {children}
    </SidebarProvider>
  )
}
