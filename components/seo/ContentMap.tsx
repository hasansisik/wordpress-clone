"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContentItem {
  id: string;
  name: string;
  url: string;
}

interface ContentMapProps {
  title?: string;
  items: ContentItem[];
  className?: string;
  onItemsGenerated?: (items: { name: string; url: string }[]) => void;
}

export default function ContentMap({
  title = "İçerik Haritası",
  items,
  className,
  onItemsGenerated
}: ContentMapProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Pass items to parent component for schema generation
  useEffect(() => {
    if (onItemsGenerated && items) {
      onItemsGenerated(items.map(item => ({
        name: item.name,
        url: item.url
      })));
    }
  }, [items, onItemsGenerated]);
  
  if (!items || items.length === 0) {
    return null;
  }
  
  return (
    <Card className={cn("mb-6", className)}>
      <CardHeader className="py-3">
        <CardTitle className="flex items-center justify-between text-lg font-medium">
          <div className="flex items-center gap-2">
            <List size={18} />
            <span>{title}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="text-sm"
          >
            {isOpen ? "Gizle" : "Göster"}
          </Button>
        </CardTitle>
      </CardHeader>
      {isOpen && (
        <CardContent>
          <nav aria-label="İçerik Haritası" className="text-sm">
            <ol className="list-decimal pl-5 space-y-1">
              {items.map((item) => (
                <li key={item.id} className="py-1">
                  <Link 
                    href={item.url}
                    className="text-primary hover:underline"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </CardContent>
      )}
    </Card>
  );
} 