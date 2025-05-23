"use client";

import { ReactNode } from "react";
import { useEditor } from "./EditorProvider";

interface EditorSidebarProps {
  children: ReactNode | ((data: any) => ReactNode);
}

export default function EditorSidebar({ children }: EditorSidebarProps) {
  const { sectionData } = useEditor();

  return (
    <div className="p-3 space-y-6">
      {typeof children === 'function' 
        ? children(sectionData) 
        : children
      }
    </div>
  );
} 