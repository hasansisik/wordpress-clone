"use client";

import { ReactNode } from "react";
import { useEditor } from "./EditorProvider";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Check,
  Monitor,
  Smartphone,
  Tablet,
  Maximize2,
  Minimize2,
  Save,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

interface EditorLayoutProps {
  children: ReactNode;
  title: string;
  dashboardUrl?: string;
  sidebarContent: ReactNode;
}

export default function EditorLayout({
  children,
  title,
  dashboardUrl = "/dashboard",
  sidebarContent
}: EditorLayoutProps) {
  const router = useRouter();
  const {
    sectionType,
    sectionData,
    previewMode,
    setPreviewMode,
    sidebarCollapsed,
    setSidebarCollapsed,
    showAlert,
    alertType,
    alertMessage,
    saveChangesToAPI
  } = useEditor();

  // Handler for the "Save Changes" button click
  const handleSaveChanges = async () => {
    try {
      await saveChangesToAPI(sectionData);
      
      // Redirect to dashboard after successful save (with small delay)
      setTimeout(() => {
        router.push(dashboardUrl);
      }, 1000);
    } catch (error) {
      // Error is handled inside saveChangesToAPI
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-white px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={dashboardUrl}>Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <div className="border rounded-md bg-gray-50 p-1 flex">
            <Button
              variant={previewMode === "desktop" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setPreviewMode("desktop")}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === "tablet" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setPreviewMode("tablet")}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === "mobile" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setPreviewMode("mobile")}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            className="bg-black hover:bg-gray-800 text-white h-8"
            size="sm"
            onClick={handleSaveChanges}
          >
            <Save className="h-4 w-4 mr-1" />
            <span className="text-xs">Save Changes</span>
          </Button>
        </div>
      </header>

      {showAlert && (
        <Alert
          className={`mx-4 mt-4 ${
            alertType === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {alertType === "success" ? (
            <Check className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle className="text-sm font-medium">
            {alertType === "success" ? "Success" : "Error"}
          </AlertTitle>
          <AlertDescription className="text-xs">{alertMessage}</AlertDescription>
        </Alert>
      )}

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`border-r bg-gray-50 flex flex-col ${sidebarCollapsed ? 'w-16' : 'w-80'} transition-all duration-300 ease-in-out`}>
          <div className="p-3 border-b bg-white flex justify-between items-center">
            <h3 className={`text-sm font-medium ${sidebarCollapsed ? 'hidden' : 'block'}`}>Edit {title}</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
          </div>
          
          {!sidebarCollapsed && (
            <div className="overflow-y-auto flex-1">
              {/* Sidebar Content */}
              {sidebarContent}
            </div>
          )}
        </div>
        
        {/* Preview Area */}
        <div className="flex-1 bg-gray-100 flex flex-col overflow-hidden">
          <div className="p-3 border-b bg-white">
            <h3 className="text-sm font-medium">Preview</h3>
          </div>
          
          <div className="flex-1 overflow-auto relative">
            <div className={`
              mx-auto transition-all duration-300 ease-in-out bg-gray-100 h-full overflow-y-auto
              ${previewMode === "desktop" ? "w-full" : previewMode === "tablet" ? "w-[768px]" : "w-[375px]"}
            `}>
              {sectionData && (
                <div className="relative h-full">
                  {children}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 