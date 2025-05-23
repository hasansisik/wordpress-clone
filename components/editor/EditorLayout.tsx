"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { useEditor } from "./EditorProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Check,
  ArrowLeft,
  Monitor,
  Smartphone,
  Tablet,
  Maximize2,
  Minimize2,
  Save,
  Eye,
  Layout,
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
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

// CSS styles for editor layout mode
const editorStyles = `
.editor-layout-mode {
  position: relative;
}

.editor-layout-mode h1, 
.editor-layout-mode h2, 
.editor-layout-mode h3,
.editor-layout-mode p,
.editor-layout-mode .btn {
  position: relative;
  outline: 2px dashed #3b82f6 !important;
  outline-offset: 2px;
  transition: outline 0.2s ease;
}

.editor-layout-mode h1:hover, 
.editor-layout-mode h2:hover, 
.editor-layout-mode h3:hover,
.editor-layout-mode p:hover,
.editor-layout-mode .btn:hover {
  outline: 2px solid #3b82f6 !important;
  cursor: pointer;
  background-color: rgba(59, 130, 246, 0.05);
}

.editor-layout-mode h1:hover::before, 
.editor-layout-mode h2:hover::before, 
.editor-layout-mode h3:hover::before,
.editor-layout-mode p:hover::before,
.editor-layout-mode .btn:hover::before {
  content: "Edit Text";
  position: absolute;
  top: -20px;
  left: 0;
  background: #3b82f6;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 2px;
  z-index: 100;
}

.editor-layout-mode img {
  position: relative;
  outline: 2px dashed #f97316 !important;
  outline-offset: 2px;
  transition: outline 0.2s ease;
}

.editor-layout-mode img:hover {
  outline: 2px solid #f97316 !important;
  cursor: pointer;
  filter: brightness(0.95);
}

.editor-layout-mode img:hover::before {
  content: "Replace Image";
  position: absolute;
  top: -20px;
  left: 0;
  background: #f97316;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 2px;
  z-index: 100;
}

/* Make edit mode more visible */
.editor-mode-active .editor-layout-mode::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  border: 3px solid #3b82f6;
  z-index: 1;
}

/* Style for the edit/live toggle buttons */
.mode-toggle-btn {
  font-weight: 600;
  transition: all 0.2s ease;
}

.mode-toggle-btn.active {
  background-color: #3b82f6 !important;
  color: white !important;
  box-shadow: 0 2px 5px rgba(59, 130, 246, 0.3);
}

.mode-toggle-btn.active svg {
  color: white !important;
}
`;

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
    editorMode,
    setEditorMode,
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
      {/* Include editor styles */}
      <style jsx global>{editorStyles}</style>
      
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

      {/* Main editor layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Sidebar */}
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
          
          {sidebarCollapsed && (
            <div className="flex flex-col items-center pt-4 space-y-6">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Layout className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Preview Area */}
        <div className="flex-1 bg-gray-100 flex flex-col overflow-hidden">
          <div className="p-3 border-b bg-white flex justify-between items-center">
            <h3 className="text-sm font-medium">Preview</h3>
            <div className="flex items-center">
              <div className="mr-4 border rounded-md bg-gray-50 flex overflow-hidden">
                <Button
                  variant={editorMode === "live" ? "default" : "ghost"}
                  className={`px-4 rounded-none h-8 text-xs mode-toggle-btn ${editorMode === "live" ? 'active' : ''}`}
                  onClick={() => setEditorMode("live")}
                >
                  <Eye className="h-3 w-3 mr-1.5" />
                  Live Preview
                </Button>
                <Button 
                  variant={editorMode === "editor" ? "default" : "ghost"}
                  className={`px-4 rounded-none h-8 text-xs mode-toggle-btn ${editorMode === "editor" ? 'active' : ''}`}
                  onClick={() => setEditorMode("editor")}
                >
                  <Layout className="h-3 w-3 mr-1.5" />
                  Editor Mode
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto relative">
            <div className={`
              mx-auto transition-all duration-300 ease-in-out bg-gray-100 h-full overflow-y-auto
              ${previewMode === "desktop" ? "w-full" : previewMode === "tablet" ? "w-[768px]" : "w-[375px]"}
            `}>
              {sectionData && (
                <div className="relative h-full">
                  {editorMode === "editor" && (
                    <div className="absolute left-4 top-4 z-50 bg-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded shadow-md">
                      <Layout className="h-3 w-3 mr-1.5 inline" /> Editor Mode
                    </div>
                  )}
                  {children}
                </div>
              )}
            </div>

            {/* Floating help message when in layout mode */}
            {editorMode === "editor" && (
              <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-sm px-6 py-3 rounded-full shadow-lg z-50 flex items-center">
                <Layout className="h-4 w-4 mr-2" />
                <span className="font-medium">Editor Mode:</span> <span className="ml-1">Click on elements in the preview to edit them</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 