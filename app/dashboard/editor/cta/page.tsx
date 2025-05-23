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
import Cta4 from "@/components/sections/Cta4";
import Cta9 from "@/components/sections/Cta9";

// CTA type options
const ctaTypes = [
  { value: "cta4", label: "CTA 4" },
  { value: "cta9", label: "CTA 9" }
];

// Fallback preview component that renders directly in the editor
const DirectPreview = ({ data }: { data: any }) => {
  if (!data) return <div>No data available</div>;
  
  const activeComponent = data.activeCta || "cta4";
  
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
      {activeComponent === "cta4" ? (
        <Cta4 previewData={data} />
      ) : (
        <Cta9 previewData={data} />
      )}
    </div>
  );
};

export default function CtaEditor() {
  const router = useRouter();
  const [ctaData, setCtaData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const iframeLoadAttempts = useRef(0);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/cta?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
          }
      });
      
      if (response.ok) {
          const data = await response.json();
          setCtaData(data);
      } else {
          console.error('Error fetching CTA data:', await response.text());
          // Use mock data if API request fails
          setCtaData(require('@/data/cta.json'));
      }
    } catch (error) {
        console.error('Error fetching CTA data:', error);
        // Use mock data if API request fails
        setCtaData(require('@/data/cta.json'));
    } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handler for changing CTA type
  const handleCtaTypeChange = (newType: string) => {
    if (!ctaData) return;
    
    setCtaData({
      ...ctaData,
      activeCta: newType
    });
  };

  // Function to handle iframe load failures
  useEffect(() => {
    if (!ctaData) return;
    
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
  }, [ctaData]);

  // Render the sidebar content
  const renderSidebarContent = (data: any) => {
    if (!data) return null;
    
    const activeCta = data.activeCta || "cta4";

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
            label="CTA Type"
            value={activeCta}
            options={ctaTypes}
            onChange={handleCtaTypeChange}
          />
        </TabsContent>
        
        {/* Content Tab */}
        <TabsContent value="content" className="m-0 p-3 border-t">
          {activeCta === "cta4" ? (
            <Cta4ContentForm data={data.cta4 || {}} />
          ) : (
            <Cta9ContentForm data={data.cta9 || {}} />
          )}
        </TabsContent>
        
        {/* Style Tab */}
        <TabsContent value="style" className="m-0 p-3 border-t">
          <div className="text-xs text-gray-500">
            Style options will be implemented in future updates.
                        </div>
              </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="m-0 p-3 border-t">
          {activeCta === "cta4" ? (
            <Cta4MediaForm data={data.cta4 || {}} />
          ) : (
            <Cta9MediaForm data={data.cta9 || {}} />
          )}
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
      apiEndpoint="/api/cta"
      sectionType="cta"
      uploadHandler={uploadImageToCloudinary}
      initialData={ctaData}
    >
      <EditorLayout
        title="CTA Editor"
        sidebarContent={
          <EditorSidebar>
            {renderSidebarContent}
          </EditorSidebar>
        }
      >
        {useFallback ? (
          <DirectPreview data={ctaData} />
        ) : (
          <SectionPreview previewUrl="/preview/cta" paramName="ctaData" />
        )}
      </EditorLayout>
    </EditorProvider>
  );
}

// CTA 4 Content Form
function Cta4ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Heading">
        <TextField
          label="Small Heading"
          value={data?.heading?.small || ""}
          path="cta4.heading.small"
          placeholder="e.g. What We Do"
        />
        <TextField
          label="Title"
          value={data?.heading?.title || ""}
          path="cta4.heading.title"
          placeholder="e.g. Custom Services For Your Business"
        />
      </FormGroup>
      
      <TextAreaField
        label="Description"
        value={data?.description || ""}
        path="cta4.description"
        placeholder="Enter CTA description"
      />
      
      <FormGroup title="Features">
        <TextField
          label="Feature 1"
          value={data?.features?.[0] || ""}
          path="cta4.features.0"
          placeholder="e.g. Creative Ideas"
        />
        <TextField
          label="Feature 2"
          value={data?.features?.[1] || ""}
          path="cta4.features.1"
          placeholder="e.g. Web Development"
        />
        <TextField
          label="Feature 3"
          value={data?.features?.[2] || ""}
          path="cta4.features.2"
          placeholder="e.g. Digital Marketing"
        />
        <TextField
          label="Feature 4"
          value={data?.features?.[3] || ""}
          path="cta4.features.3"
          placeholder="e.g. App Development"
        />
      </FormGroup>
      
      <FormGroup title="Primary Button">
        <TextField
          label="Text"
          value={data?.buttons?.primary?.text || ""}
          path="cta4.buttons.primary.text"
          placeholder="e.g. Get Free Quote"
        />
        <LinkField
          label="Link"
          value={data?.buttons?.primary?.link || ""}
          path="cta4.buttons.primary.link"
        />
      </FormGroup>
      
      <FormGroup title="Secondary Button">
        <TextField
          label="Text"
          value={data?.buttons?.secondary?.text || ""}
          path="cta4.buttons.secondary.text"
          placeholder="e.g. How We Work"
        />
        <LinkField
          label="Link"
          value={data?.buttons?.secondary?.link || ""}
          path="cta4.buttons.secondary.link"
        />
      </FormGroup>
      
      <FormGroup title="Video Settings">
        <TextField
          label="Button Text"
          value={data?.videoGuide?.buttonText || ""}
          path="cta4.videoGuide.buttonText"
          placeholder="e.g. Video Guide"
        />
        <TextField
          label="Video ID"
          value={data?.videoGuide?.videoId || ""}
          path="cta4.videoGuide.videoId"
          placeholder="e.g. YouTube video ID"
        />
      </FormGroup>
    </div>
  );
}

// CTA 9 Content Form
function Cta9ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Heading">
        <TextField
          label="Tag Text"
          value={data?.heading?.tag || ""}
          path="cta9.heading.tag"
          placeholder="e.g. How It Works"
        />
        <TextAreaField
          label="Title (HTML)"
          value={data?.heading?.title || ""}
          path="cta9.heading.title"
          placeholder="Enter title with HTML formatting"
        />
      </FormGroup>
      
      <FormGroup title="Video Settings">
        <TextField
          label="Button Text"
          value={data?.videoGuide?.buttonText || ""}
          path="cta9.videoGuide.buttonText"
          placeholder="e.g. Video Guide"
        />
        <TextField
          label="Video ID"
          value={data?.videoGuide?.videoId || ""}
          path="cta9.videoGuide.videoId"
          placeholder="e.g. YouTube video ID"
        />
      </FormGroup>
    </div>
  );
}

// CTA 4 Media Form
function Cta4MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <ImageUploadField
        label="Video Image"
        value={data?.videoGuide?.image || ""}
        path="cta4.videoGuide.image"
      />
      
      <ImageUploadField
        label="Vector Image"
        value={data?.vector?.image || ""}
        path="cta4.vector.image"
      />
    </div>
  );
}

// CTA 9 Media Form
function Cta9MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <ImageUploadField
        label="Video Image"
        value={data?.videoGuide?.image || ""}
        path="cta9.videoGuide.image"
      />
      
      <ImageUploadField
        label="Tag Image"
        value={data?.tagImage || ""}
        path="cta9.tagImage"
      />
      
      <FormGroup title="Vector Images">
        <ImageUploadField
          label="Vector 1"
          value={data?.vectors?.vector1 || ""}
          path="cta9.vectors.vector1"
        />
        
        <ImageUploadField
          label="Vector 2"
          value={data?.vectors?.vector2 || ""}
          path="cta9.vectors.vector2"
        />
        
        <ImageUploadField
          label="Background Line"
          value={data?.vectors?.bgLine || ""}
          path="cta9.vectors.bgLine"
        />
      </FormGroup>
    </div>
  );
}
