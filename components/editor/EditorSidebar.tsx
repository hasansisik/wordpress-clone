"use client";

import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout, Type, Settings, Image } from "lucide-react";

interface EditorSidebarProps {
  layoutContent?: ReactNode;
  contentContent?: ReactNode;
  styleContent?: ReactNode;
  mediaContent?: ReactNode;
  sectionTypeSelector?: ReactNode;
  defaultTab?: "layout" | "content" | "style" | "media";
}

export default function EditorSidebar({
  layoutContent,
  contentContent, 
  styleContent,
  mediaContent,
  sectionTypeSelector,
  defaultTab = "layout"
}: EditorSidebarProps) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid grid-cols-4 m-2">
        <TabsTrigger value="layout" className="px-2">
          <Layout className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger value="content" className="px-2">
          <Type className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger value="style" className="px-2">
          <Settings className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger value="media" className="px-2">
          <Image className="h-4 w-4" />
        </TabsTrigger>
      </TabsList>
      
      {/* Layout Tab */}
      <TabsContent value="layout" className="m-0 p-3 border-t">
        <div className="space-y-3">
          {sectionTypeSelector}
          {layoutContent}
        </div>
      </TabsContent>
      
      {/* Content Tab */}
      <TabsContent value="content" className="m-0 p-3 border-t">
        <div className="space-y-4">
          {contentContent}
        </div>
      </TabsContent>
      
      {/* Style Tab */}
      <TabsContent value="style" className="m-0 p-3 border-t">
        <div className="space-y-3">
          {styleContent || (
            <p className="text-xs text-gray-500">Style options will appear here (padding, margins, colors, etc.)</p>
          )}
        </div>
      </TabsContent>
      
      {/* Media Tab */}
      <TabsContent value="media" className="m-0 p-3 border-t">
        <div className="space-y-4">
          {mediaContent}
        </div>
      </TabsContent>
    </Tabs>
  );
} 