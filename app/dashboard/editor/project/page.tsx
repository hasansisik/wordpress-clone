"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { EditorProvider } from "@/components/editor/EditorProvider";
import EditorLayout from "@/components/editor/EditorLayout";
import EditorSidebar from "@/components/editor/EditorSidebar";
import SectionPreview from "@/components/editor/SectionPreview";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TextField,
  TextAreaField,
  LinkField,
  FormGroup,
  ImageUploadField,
  SectionTypeSelector,
} from "@/components/editor/FormFields";
import { Layout, Type, Settings, Image } from "lucide-react";
import Services5 from "@/components/sections/Services5";
import Project2 from "@/components/sections/Project2";

// These CSS files should already be loaded in the editor layout,
// but we're importing Swiper styles which are specific to this page
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Project section type options
const projectTypes = [
  { value: "services5", label: "Services Grid (Filter)" },
  { value: "project2", label: "Project Slider" },
];

// Fallback preview component that renders directly in the editor
const DirectPreview = ({ data }: { data: any }) => {
  if (!data) return <div>No data available</div>;

  const activeComponent = data.activeProject || "services5";
  const [Component, setComponent] = useState<React.ReactNode>(null);

  // Apply direct preview styles
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .preview-container {
        transform: scale(0.8);
        transform-origin: top center;
        height: 100%;
        overflow: auto;
      }
      .section-padding {
        padding: 80px 0;
      }
      .editor-preview {
        overflow: auto;
        height: 100%;
      }
    `;
    document.head.appendChild(style);

    // Dynamically load the component based on the active component type
    if (activeComponent === "services5") {
      setComponent(<Services5 previewData={data} />);
    } else {
      setComponent(<Project2 previewData={data} />);
    }

    return () => {
      document.head.removeChild(style);
    };
  }, [activeComponent, data]);

  return (
    <div className="preview-container editor-preview">
      {Component}
    </div>
  );
};

export default function ProjectEditor() {
  const router = useRouter();
  const [projectData, setProjectData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const iframeLoadAttempts = useRef(0);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/project?t=${timestamp}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProjectData(data);
        } else {
          // If no data is available yet, create initial data structure
          setProjectData({
            activeProject: "services5",
            services5: {
              title: "Explore Our Projects",
              subtitle: "What we offer",
              description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
              buttonText: "Get Free Quote",
              buttonLink: "#",
              linkText: "How We Work",
              linkUrl: "#"
            },
            project2: {
              title: "Our featured projects",
              subtitle: "Recent work",
              description: "⚡Don't miss any contact. Stay connected.",
              backgroundColor: "#f8f9fa"
            }
          });
          console.error("Error fetching project data, using defaults");
        }
      } catch (error) {
        // Use default data if fetch fails
        setProjectData({
          activeProject: "services5",
          services5: {
            title: "Explore Our Projects",
            subtitle: "What we offer",
            description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
            buttonText: "Get Free Quote",
            buttonLink: "#",
            linkText: "How We Work",
            linkUrl: "#"
          },
          project2: {
            title: "Our featured projects",
            subtitle: "Recent work",
            description: "⚡Don't miss any contact. Stay connected.",
            backgroundColor: "#f8f9fa"
          }
        });
        console.error("Error fetching project data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handler for changing component type
  const handleProjectTypeChange = (newType: string) => {
    if (!projectData) return;

    setProjectData({
      ...projectData,
      activeProject: newType,
    });
  };

  // Function to handle iframe load failures and success messages
  useEffect(() => {
    if (!projectData) return;

    // Listen for preview ready messages from iframe
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      if (
        event.data.type === "PREVIEW_READY" ||
        event.data.type === "PREVIEW_UPDATED"
      ) {
        // Reset attempts and make sure we're using iframe
        iframeLoadAttempts.current = 0;
        setUseFallback(false);
      }
    };

    window.addEventListener("message", handleMessage);

    // Set a timeout to check if iframe loads properly
    const timeoutId = setTimeout(() => {
      iframeLoadAttempts.current += 1;

      if (iframeLoadAttempts.current >= 3) {
        setUseFallback(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(timeoutId);
    };
  }, [projectData]);

  // Render the sidebar content
  const renderSidebarContent = (data: any) => {
    if (!data) return null;

    const activeProject = data.activeProject || "services5";

    return (
      <Tabs defaultValue="layout" className="w-full">
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
          <SectionTypeSelector
            label="Component Type"
            value={activeProject}
            options={projectTypes}
            onChange={handleProjectTypeChange}
          />
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="m-0 p-3 border-t">
          {activeProject === "services5" ? (
            <Services5ContentForm data={data.services5 || {}} />
          ) : (
            <Project2ContentForm data={data.project2 || {}} />
          )}
        </TabsContent>

        {/* Style Tab */}
        <TabsContent value="style" className="m-0 p-3 border-t">
          {activeProject === "services5" ? (
            <Services5StyleForm data={data.services5 || {}} />
          ) : (
            <Project2StyleForm data={data.project2 || {}} />
          )}
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="m-0 p-3 border-t">
          <div className="text-xs text-gray-500">
            Project images are managed from the Projects tab in the dashboard.
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  // If still loading, return empty div
  if (isLoading) {
    return <div></div>;
  }

  return (
    <EditorProvider
      apiEndpoint="/api/project"
      sectionType="project"
      uploadHandler={uploadImageToCloudinary}
      initialData={projectData}
    >
      <EditorLayout
        title="Project Components Editor"
        sidebarContent={<EditorSidebar>{renderSidebarContent}</EditorSidebar>}
      >
        {useFallback ? (
          <DirectPreview data={projectData} />
        ) : (
          <SectionPreview previewUrl="/preview/project" paramName="projectData" />
        )}
      </EditorLayout>
    </EditorProvider>
  );
}

// Services5 Content Form
function Services5ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <TextField
        label="Subtitle Badge"
        value={data?.subtitle || ""}
        path="services5.subtitle"
        placeholder="e.g. What we offers"
      />

      <TextField
        label="Title"
        value={data?.title || ""}
        path="services5.title"
        placeholder="Enter section title"
      />

      <TextAreaField
        label="Description"
        value={data?.description || ""}
        path="services5.description"
        placeholder="Enter section description"
      />

      <TextField
        label="Button Text"
        value={data?.buttonText || ""}
        path="services5.buttonText"
        placeholder="e.g. Get Free Quote"
      />

      <LinkField
        label="Button Link"
        value={data?.buttonLink || ""}
        path="services5.buttonLink"
      />

      <TextField
        label="Secondary Link Text"
        value={data?.linkText || ""}
        path="services5.linkText"
        placeholder="e.g. How We Work"
      />

      <LinkField
        label="Secondary Link URL"
        value={data?.linkUrl || ""}
        path="services5.linkUrl"
      />
    </div>
  );
}

// Project2 Content Form
function Project2ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <TextField
        label="Subtitle Badge"
        value={data?.subtitle || ""}
        path="project2.subtitle"
        placeholder="e.g. Recent work"
      />

      <TextField
        label="Title"
        value={data?.title || ""}
        path="project2.title"
        placeholder="Enter section title"
      />

      <TextAreaField
        label="Description"
        value={data?.description || ""}
        path="project2.description"
        placeholder="Enter section description"
      />
    </div>
  );
}

// Services5 Style Form
function Services5StyleForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <TextField
        label="Background Color"
        value={data?.backgroundColor || "#ffffff"}
        path="services5.backgroundColor"
        placeholder="#ffffff"
      />

      <TextField
        label="Title Color"
        value={data?.titleColor || "#333333"}
        path="services5.titleColor"
        placeholder="#333333"
      />

      <TextField
        label="Button Color"
        value={data?.buttonColor || "#6342EC"}
        path="services5.buttonColor"
        placeholder="#6342EC"
      />
    </div>
  );
}

// Project2 Style Form
function Project2StyleForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <TextField
        label="Background Color"
        value={data?.backgroundColor || "#f8f9fa"}
        path="project2.backgroundColor"
        placeholder="#f8f9fa"
      />

      <TextField
        label="Title Color"
        value={data?.titleColor || "#333333"}
        path="project2.titleColor"
        placeholder="#333333"
      />

      <TextField
        label="Badge Background Color"
        value={data?.badgeColor || "rgba(99, 66, 236, 0.1)"}
        path="project2.badgeColor"
        placeholder="rgba(99, 66, 236, 0.1)"
      />
    </div>
  );
} 