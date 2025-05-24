"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Settings, 
  Layout, 
  Eye, 
  Save, 
  Code, 
  CheckCircle2, 
  Layers,
  MoveVertical,
  Home,
  Film,
  Users,
  Sparkles,
  HelpCircle,
  MessageCircle,
  BookOpen,
  Share2,
  Briefcase
} from "lucide-react";
import { Toaster, toast } from "sonner";
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

// Define Section Type
interface Section {
  id: string;
  name: string;
  type: string;
  description?: string;
}

// Component selector for the available sections with icons
const availableSections = [
  { 
    id: "hero1", 
    name: "Hero 1", 
    type: "Hero1",
    description: "Main hero with floating card and shapes",
    icon: Home
  },
  { 
    id: "hero3", 
    name: "Hero 3", 
    type: "Hero3",
    description: "Hero with overlapping images",
    icon: Home
  },
  { 
    id: "cta1", 
    name: "CTA 1", 
    type: "Cta1",
    description: "Team showcase with social links",
    icon: Users
  },
  { 
    id: "cta4", 
    name: "CTA 4", 
    type: "Cta4",
    description: "Feature showcase with video",
    icon: Film
  },
  { 
    id: "cta9", 
    name: "CTA 9", 
    type: "Cta9",
    description: "Video showcase with background",
    icon: Film
  },
  { 
    id: "services2", 
    name: "Services 2", 
    type: "Services2",
    description: "Services grid with icons",
    icon: Briefcase
  },
  { 
    id: "faqs2", 
    name: "FAQs 2", 
    type: "Faqs2",
    description: "Two-column FAQ accordion",
    icon: HelpCircle
  },
  { 
    id: "faqs3", 
    name: "FAQs 3", 
    type: "Faqs3",
    description: "FAQ with side content",
    icon: MessageCircle
  },
  { 
    id: "features1", 
    name: "Features 1", 
    type: "Features1",
    description: "Features with icons grid",
    icon: Sparkles
  },
  { 
    id: "features2", 
    name: "Features 2", 
    type: "Features2",
    description: "Features with alternating layout",
    icon: Sparkles
  },
  { 
    id: "features3", 
    name: "Features 3", 
    type: "Features3",
    description: "Features with statistics",
    icon: BookOpen
  }
];

// Component to show section thumbnails
function SectionThumbnail({ section, onClick }: { section: Section & { icon: any }, onClick: () => void }) {
  const Icon = section.icon;
  
  return (
    <div 
      className="border rounded-md hover:shadow-md cursor-pointer transition-all duration-200 overflow-hidden group"
      onClick={onClick}
    >
      <div className="p-3">
        <div className="bg-gray-50 rounded-md p-4 flex items-center justify-center h-24 mb-3">
          <Icon className="h-12 w-12 text-gray-400 group-hover:text-primary transition-colors" />
        </div>
        <h3 className="font-medium text-sm">{section.name}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{section.description}</p>
        <div className="mt-3">
          <Button size="sm" variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

// Sortable section item with improved styling
function SortableSectionItem({ id, section, handleRemove }: { id: string, section: Section, handleRemove: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };
  
  const sectionInfo = availableSections.find(s => s.type === section.type) || { 
    icon: Layout,
    description: `${section.type} Component` 
  };
  
  const Icon = sectionInfo.icon || Layout;
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`bg-card rounded-lg border shadow-sm mb-4 transition-all duration-200 
        ${isDragging ? 'shadow-lg ring-2 ring-primary/20 border-primary/30' : 'hover:border-border/80 hover:shadow'}`}
    >
      <div className="flex items-center p-3 border-b">
        <div 
          {...attributes} 
          {...listeners}
          className="cursor-grab hover:bg-muted p-2 rounded mr-2"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground/70" />
        </div>
        
        <div className="bg-muted w-10 h-10 flex items-center justify-center rounded mr-3">
          <Icon className="h-5 w-5 text-foreground/70" />
        </div>
        
        <div className="flex-1">
          <div className="font-medium text-foreground">{section.name}</div>
          <div className="text-xs text-muted-foreground">{sectionInfo.description || `${section.type} Component`}</div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 rounded-full text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function HomePageEditor() {
  const router = useRouter();
  const [pageData, setPageData] = useState<any>({
    sections: [],
    headerStyle: 1,
    footerStyle: 1
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("layout");

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch initial data if available
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/homepage', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setPageData(data);
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
        // Set default data if fetch fails
        setPageData({
          sections: [],
          headerStyle: 1,
          footerStyle: 1
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add a section to the page
  const addSection = (sectionType: string) => {
    const sectionToAdd = availableSections.find(s => s.id === sectionType);
    if (!sectionToAdd) return;
    
    const newSection = {
      id: `${sectionType}-${Date.now()}`, // Generate a unique ID
      name: sectionToAdd.name,
      type: sectionToAdd.type,
      description: sectionToAdd.description
    };
    
    setPageData({
      ...pageData,
      sections: [...pageData.sections, newSection]
    });
    
    // Show notification
    toast.success("Section added", {
      description: `${sectionToAdd.name} has been added to your page`
    });
    
    setIsSaved(false);
  };

  // Remove a section from the page
  const removeSection = (sectionId: string) => {
    const sectionToRemove = pageData.sections.find((s: any) => s.id === sectionId);
    
    setPageData({
      ...pageData,
      sections: pageData.sections.filter((section: any) => section.id !== sectionId)
    });
    
    // Show notification
    if (sectionToRemove) {
      toast.success("Section removed", {
        description: `${sectionToRemove.name} has been removed from your page`
      });
    }
    
    setIsSaved(false);
  };

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = pageData.sections.findIndex((section: any) => section.id === active.id);
      const newIndex = pageData.sections.findIndex((section: any) => section.id === over.id);
      
      setPageData({
        ...pageData,
        sections: arrayMove(pageData.sections, oldIndex, newIndex)
      });
      
      toast.success("Order updated", {
        description: "Section order has been rearranged"
      });
      
      setIsSaved(false);
    }
  };

  // Handle header/footer style change
  const handleStyleChange = (type: 'headerStyle' | 'footerStyle', value: number) => {
    setPageData({
      ...pageData,
      [type]: value
    });
    
    toast.success(`${type === 'headerStyle' ? 'Header' : 'Footer'} style updated`, {
      description: `Style changed to option ${value}`
    });
    
    setIsSaved(false);
  };

  // Save the page data
  const savePageData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/homepage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pageData)
      });
      
      if (response.ok) {
        setIsSaved(true);
        toast.success("Page saved successfully", {
          description: "Your changes have been applied to the live site"
        });
      } else {
        toast.error("Error saving page", {
          description: "There was a problem saving your changes"
        });
      }
    } catch (error) {
      console.error('Error saving homepage data:', error);
      toast.error("Error saving page", {
        description: "There was a problem saving your changes"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate the code for the page
  const generatePageCode = () => {
    let imports = `import Layout from "@/components/layout/Layout"\n`;
    
    // Add imports for sections
    const usedSections = new Set<string>();
    pageData.sections.forEach((section: Section) => {
      usedSections.add(section.type);
    });
    
    // Add each import only once
    usedSections.forEach((type: string) => {
      imports += `import ${type} from "@/components/sections/${type}"\n`;
    });
    
    let sectionsJSX = pageData.sections.map((section: any) => {
      return `\t\t\t\t<${section.type} />`;
    }).join('\n');
    
    const code = `${imports}
export default function Home() {
\treturn (
\t\t<>
\t\t\t<Layout headerStyle={${pageData.headerStyle}} footerStyle={${pageData.footerStyle}}>
${sectionsJSX}
\t\t\t</Layout>
\t\t</>
\t)
}`;
    
    return code;
  };

  const PageContent = (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            Page Builder
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Drag and drop sections to build your custom home page
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/')} className="flex items-center gap-2 text-xs h-8">
            <Eye className="h-3.5 w-3.5" />
            <span>Preview</span>
          </Button>
          <Button 
            onClick={savePageData} 
            disabled={isLoading} 
            className={`${isSaved ? 'bg-green-600 hover:bg-green-700' : ''} flex items-center gap-2 text-xs h-8`}
          >
            {isLoading ? (
              <>
                <span className="animate-spin h-3.5 w-3.5 border-2 border-t-transparent rounded-full mr-1" />
                <span>Saving...</span>
              </>
            ) : isSaved ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs moved to the top */}
      <Tabs defaultValue="layout" className="w-full mb-4">
        <TabsList className="w-full mb-4 grid grid-cols-2">
          <TabsTrigger value="layout" className="flex items-center gap-2 h-9 text-xs">
            <Layout className="h-3.5 w-3.5" />
            Page Layout
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2 h-9 text-xs">
            <Code className="h-3.5 w-3.5" />
            Code Preview
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="code" className="border-none p-0 mt-0">
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <Code className="h-3.5 w-3.5 mr-2 text-primary" />
              Generated Code
            </h3>
            
            <div className="flex justify-between items-center mb-3">
              <div className="text-xs text-muted-foreground">
                This code will be automatically applied when you save changes
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs"
                onClick={() => {
                  navigator.clipboard.writeText(generatePageCode());
                  toast.success("Code copied to clipboard");
                }}
              >
                Copy Code
              </Button>
            </div>
            
            <pre className="bg-muted p-4 rounded-md overflow-auto text-xs max-h-[500px] border">
              <code className="text-foreground">{generatePageCode()}</code>
            </pre>
          </div>
        </TabsContent>
        
        <TabsContent value="layout" className="border-none p-0 mt-0">
          {/* Available Sections - Grid with equal heights */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <Plus className="h-3.5 w-3.5 mr-2 text-primary" />
              Available Sections
              <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                Drag to add
              </span>
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
              {availableSections.map(section => (
                <div 
                  key={section.id}
                  className="border rounded-lg shadow-sm hover:shadow cursor-pointer transition-all duration-200 overflow-hidden group flex flex-col h-full"
                  onClick={() => addSection(section.id)}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", section.id);
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                >
                  <div className="p-2 border-b bg-muted/30 flex-grow-0">
                    <div className="bg-white rounded-md p-2 flex items-center justify-center h-12 shadow-sm">
                      <section.icon className="h-5 w-5 text-primary/70 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                  <div className="p-2 bg-white flex flex-col flex-grow">
                    <h3 className="font-medium text-xs mb-1 line-clamp-1">{section.name}</h3>
                    <p className="text-[10px] text-muted-foreground mb-2 line-clamp-2 flex-grow">{section.description}</p>
                    <Button size="sm" variant="secondary" className="w-full h-6 text-[10px]">
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-card rounded-lg border shadow-sm p-4">                 
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Layout Options</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground/80 mb-1">Header Style</label>
                    <select 
                      className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={pageData.headerStyle}
                      onChange={(e) => handleStyleChange('headerStyle', parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={`header-${num}`} value={num}>Header Style {num}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground/80 mb-1">Footer Style</label>
                    <select 
                      className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={pageData.footerStyle}
                      onChange={(e) => handleStyleChange('footerStyle', parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4].map(num => (
                        <option key={`footer-${num}`} value={num}>Footer Style {num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Layers className="h-3.5 w-3.5 mr-2 text-primary" />
                  Page Sections
                  <span className="ml-2 text-xs bg-muted rounded-full px-2 py-0.5">
                    {pageData.sections.length} {pageData.sections.length === 1 ? 'section' : 'sections'}
                  </span>
                </h3>
                <div 
                  className="bg-muted/40 p-4 rounded-lg border-2 border-dashed border-border min-h-[300px]"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "copy";
                    e.currentTarget.classList.add("bg-primary/5", "border-primary/30");
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove("bg-primary/5", "border-primary/30");
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("bg-primary/5", "border-primary/30");
                    const sectionId = e.dataTransfer.getData("text/plain");
                    if (sectionId) {
                      addSection(sectionId);
                    }
                  }}
                >
                  {pageData.sections.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                      <Layers className="h-12 w-12 mb-3 text-muted" />
                      <p className="mb-1 text-sm font-medium">No sections added yet</p>
                      <p className="text-xs text-center max-w-md">
                        Drag sections from above or click on them to add to your page
                      </p>
                    </div>
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext 
                        items={pageData.sections.map((s: any) => s.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {pageData.sections.map((section: any) => (
                          <SortableSectionItem
                            key={section.id}
                            id={section.id}
                            section={section}
                            handleRemove={() => removeSection(section.id)}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  )}
                </div>
              </div>
              
              <div className="mt-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2 flex-1 text-xs text-blue-700">
                  <p>Drag and drop sections to reorder them. Click the save button to apply changes to your live site.</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Page Builder</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <Toaster richColors position="top-right" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {PageContent}
      </div>
    </>
  );
}
