"use client"

import * as React from "react"
import { useState, useEffect } from "react"
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
  FileCode,
  Loader2,
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
import { UserRole } from "@/lib/types"

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
      roles: ["admin"],
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
          title: "Project",
          url: "/dashboard/editor/project",
        },
        {
          title: "Faq",
          url: "/dashboard/editor/faq",
        },
        {
          title: "Other",
          url: "/dashboard/editor/other",
        },
        {
          title: "Footer",
          url: "/dashboard/editor/footer",
        },
      ],
    },
    {
      title: "Page Builder",
      url: "#",
      icon: FileCode,
      roles: ["admin"],
      items: [
        {
          title: "Home Page",
          url: "/dashboard/page/home",
          description: "Drag and drop page builder"
        },
        {
          title: "Privacy Policy",
          url: "/dashboard/page/privacy",
        },
        {
          title: "Terms and Conditions",
          url: "/dashboard/page/terms",
        }
      ],
    },
    {
      title: "Users",
      url: "#",
      icon: Users,
      roles: ["admin"],
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
      roles: ["admin", "editor"],
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
      roles: ["admin"],
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
      roles: ["admin", "editor"],
    },
    {
      title: "Project",
      url: "/dashboard/project",
      icon: FolderGit2,
      roles: ["admin", "editor"],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/me');
        
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.user.role);
        } else {
          // Default to editor if not authenticated
          setUserRole('editor');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('editor'); // Fallback to editor on error
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUserRole();
  }, []);

  // Filter navMain items based on user role
  const filteredNavMain = data.navMain.filter(item => 
    item.roles && item.roles.includes(userRole as string)
  );
  
  // Filter navSecondary items based on user role
  const filteredNavSecondary = data.navSecondary.filter(item => 
    item.roles && item.roles.includes(userRole as string)
  );

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
                  <span className="truncate text-xs capitalize">{userRole || 'Loading...'}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {isLoading ? (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <NavMain items={filteredNavMain} />
            <NavSecondary items={filteredNavSecondary} className="mt-auto" />
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}