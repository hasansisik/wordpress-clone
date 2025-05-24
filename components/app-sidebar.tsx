"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  FilePenLine,
  Home,
  Users,
  Laptop,
  FileText,
  Database,
  Layout,
  MessageSquare,
  FolderGit2,
  Search,
  Globe,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Section Editor",
      url: "#",
      icon: Layout,
      isActive: true,
      items: [
        {
          title: "Header",
          url: "/dashboard/editor/header",
        },
        {
          title: "Hero",
          url: "/dashboard/editor/hero",
        },
        {
          title: "Cta",
          url: "/dashboard/editor/cta",
        },
        {
          title: "Services",
          url: "/dashboard/editor/services",
        },
        {
          title: "Faq",
          url: "/dashboard/editor/faq",
        },
        {
          title: "Footer",
          url: "/dashboard/editor/footer",
        },
      ],
    },
    {
      title: "Page",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "Home",
          url: "/dashboard/page/home",
        }
      ],
    },
    {
      title: "Users",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Users",
          url: "/dashboard/users",
        }
      ],
    },
    {
      title: "Editor",
      url: "#",
      icon: FilePenLine,
      items: [
        {
          title: "Blog",
          url: "/dashboard/blog",
        },
        {
          title: "Project",
          url: "/dashboard/project",
        }
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/dashboard/settings/general",
        },
        {
          title: "SEO",
          url: "/dashboard/settings/seo",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Blog",
      url: "/dashboard/blog",
      icon: MessageSquare,
    },
    {
      title: "Project",
      url: "/dashboard/project",
      icon: FolderGit2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  B
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Birim Ajans</span>
                  <span className="truncate text-xs">Admin</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
