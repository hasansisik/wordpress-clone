"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { EditorProvider } from "@/components/editor/EditorProvider";
import EditorLayout from "@/components/editor/EditorLayout";
import EditorSidebar from "@/components/editor/EditorSidebar";
import SectionPreview from "@/components/editor/SectionPreview";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  TextField,
  TextAreaField,
  LinkField,
  FormGroup,
  ImageUploadField,
  SectionTypeSelector
} from "@/components/editor/FormFields";
import { Layout, Type, Settings, Image } from "lucide-react";
import Services2 from "@/components/sections/Services2";

// Service type options
const serviceTypes = [
  { value: "services2", label: "Services 2" }
];

// Fallback preview component that renders directly in the editor
const DirectPreview = ({ data }: { data: any }) => {
  if (!data) return <div>No data available</div>;
  
  // Apply direct preview styles
  useEffect(() => {
    const style = document.createElement('style');
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
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div className="preview-container editor-preview">
      <Services2 previewData={data} />
    </div>
  );
};

export default function ServicesEditor() {
  const router = useRouter();
  const [servicesData, setServicesData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const iframeLoadAttempts = useRef(0);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/services?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
          }
      });
      
      if (response.ok) {
          const data = await response.json();
          setServicesData(data);
      } else {
          console.error('Error fetching Services data:', await response.text());
          // Use mock data if API request fails
          setServicesData(require('@/data/services.json'));
      }
    } catch (error) {
        console.error('Error fetching Services data:', error);
        // Use mock data if API request fails
        setServicesData(require('@/data/services.json'));
    } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handler for changing Service type
  const handleServiceTypeChange = (newType: string) => {
    if (!servicesData) return;
    
    setServicesData({
      ...servicesData,
      activeService: newType
    });
  };

  // Function to handle iframe load failures
  useEffect(() => {
    if (!servicesData) return;
    
    // Listen for preview ready messages from iframe
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      
      if (event.data.type === "PREVIEW_READY" || event.data.type === "PREVIEW_UPDATED") {
        console.log("Preview is ready:", event.data);
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
        console.log("Iframe failed to load properly, using fallback");
        setUseFallback(true);
      }
    }, 3000);
    
    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(timeoutId);
    };
  }, [servicesData]);

  // Render the sidebar content
  const renderSidebarContent = (data: any) => {
    if (!data) return null;
    
    const activeService = data.activeService || "services2";

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
            label="Service Type"
            value={activeService}
            options={serviceTypes}
            onChange={handleServiceTypeChange}
          />
        </TabsContent>
        
        {/* Content Tab */}
        <TabsContent value="content" className="m-0 p-3 border-t">
          <Services2ContentForm data={data.services2 || {}} />
        </TabsContent>
        
        {/* Style Tab */}
        <TabsContent value="style" className="m-0 p-3 border-t">
          <div className="text-xs text-gray-500">
            Style options will be implemented in future updates.
                        </div>
              </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="m-0 p-3 border-t">
          <Services2MediaForm data={data.services2 || {}} />
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
      apiEndpoint="/api/services"
      sectionType="services"
      uploadHandler={uploadImageToCloudinary}
      initialData={servicesData}
    >
      <EditorLayout
        title="Services Editor"
        sidebarContent={
          <EditorSidebar>
            {renderSidebarContent}
          </EditorSidebar>
        }
      >
        {useFallback ? (
          <DirectPreview data={servicesData} />
        ) : (
          <SectionPreview previewUrl="/preview/services" paramName="servicesData" />
        )}
      </EditorLayout>
    </EditorProvider>
  );
}

// Services2 Content Form
function Services2ContentForm({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="space-y-4">
      <FormGroup title="Heading">
        <TextField
          label="Tag Text"
          value={data?.heading?.tag || ""}
          path="services2.heading.tag"
          placeholder="e.g. What we offers"
        />
        <TextAreaField
          label="Title (HTML)"
          value={data?.heading?.title || ""}
          path="services2.heading.title"
          placeholder="Enter title with HTML formatting"
        />
      </FormGroup>
      
      <FormGroup title="Services">
        {(data?.services || []).map((service: any, index: number) => (
          <div key={index} className="p-3 bg-gray-50 rounded-md space-y-3 mb-4">
            <div className="text-xs font-medium text-gray-700 mb-2">Service {index + 1}</div>
            <TextField
              label="Title"
              value={service.title || ""}
              path={`services2.services.${index}.title`}
              placeholder="e.g. Business Analytics"
            />
            <TextAreaField
              label="Description"
              value={service.description || ""}
              path={`services2.services.${index}.description`}
              placeholder="Enter service description"
            />
            <TextField
              label="Link Text"
              value={service.linkText || ""}
              path={`services2.services.${index}.linkText`}
              placeholder="e.g. Learn More"
            />
            <LinkField
              label="Link URL"
              value={service.link || ""}
              path={`services2.services.${index}.link`}
            />
          </div>
        ))}
      </FormGroup>
      
      <FormGroup title="Primary Button">
        <TextField
          label="Text"
          value={data?.buttons?.primary?.text || ""}
          path="services2.buttons.primary.text"
          placeholder="e.g. Explore Now"
        />
        <LinkField
          label="Link"
          value={data?.buttons?.primary?.link || ""}
          path="services2.buttons.primary.link"
        />
      </FormGroup>
      
      <FormGroup title="Secondary Button">
        <TextField
          label="Text"
          value={data?.buttons?.secondary?.text || ""}
          path="services2.buttons.secondary.text"
          placeholder="e.g. Contact Us"
        />
        <LinkField
          label="Link"
          value={data?.buttons?.secondary?.link || ""}
          path="services2.buttons.secondary.link"
        />
      </FormGroup>
    </div>
  );
}

// Services2 Media Form
function Services2MediaForm({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="space-y-4">
      <ImageUploadField
        label="Tag Image"
        value={data?.tagImage || ""}
        path="services2.tagImage"
      />
      
      <ImageUploadField
        label="Background Image"
        value={data?.backgroundImage || ""}
        path="services2.backgroundImage"
      />
      
      <FormGroup title="Service Icons">
        {(data?.services || []).map((service: any, index: number) => (
          <div key={index} className="p-3 bg-gray-50 rounded-md space-y-3 mb-4">
            <div className="text-xs font-medium text-gray-700 mb-2">Service {index + 1} Icon</div>
            <ImageUploadField
              label={`Icon for ${service.title || `Service ${index + 1}`}`}
              value={service.icon || ""}
              path={`services2.services.${index}.icon`}
            />
          </div>
        ))}
      </FormGroup>
    </div>
  );
}
