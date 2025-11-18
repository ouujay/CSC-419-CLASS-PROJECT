"use client";
import * as React from "react";
import {
  Bell,
  CalendarDays,
  Frame,
  Image,
  Leaf,
  Send,
  TreeDeciduous,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
// import { NavProjects } from "./nav-projects";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Families",
      url: "/dashboard/families",
      icon: TreeDeciduous,
      isActive: true,
      items: [],
    },
    {
      title: "Family Members",
      url: "/dashboard/family-members",
      icon: Users,
      isActive: true,
      items: [],
    },
    {
      title: "Media",
      url: "/dashboard/media",
      icon: Image,
      isActive: true,
      items: [],
    },
    {
      title: "Events",
      url: "/dashboard/events",
      icon: CalendarDays,
      isActive: true,
      items: [],
    },
  ],

  navSecondary: [
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
    },
    {
      title: "Feedback",
      url: "/dashboard/feedback",
      icon: Send,
    },
  ],

  projects: [
    {
      name: "Print Family",
      url: "#",
      icon: Frame,
    },
    {
      name: "Genealogist Service",
      url: "#",
      icon: Frame,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Leaf className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Osisi</span>
                  <span className="truncate text-xs opacity-75 font-light">
                    Remember your Roots
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
