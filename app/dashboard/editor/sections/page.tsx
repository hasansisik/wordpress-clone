"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EditorProvider } from "@/components/editor/EditorProvider";
import EditorLayout from "@/components/editor/EditorLayout";
import EditorSidebar from "@/components/editor/EditorSidebar";
import SectionPreview from "@/components/editor/SectionPreview";
import { 
  TextField, 
  TextAreaField, 
  LinkField, 
  FormGroup, 
  ImageUploadField, 
  ImagePreview, 
  SectionTypeSelector 
} from "@/components/editor/FormFields";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { Layout, Type, Settings, Image } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Available section types
const sectionTypes = [
  { value: "hero1", label: "Hero 1" },
  { value: "hero3", label: "Hero 3" },
  { value: "features1", label: "Features 1" },
  { value: "features2", label: "Features 2" },
  { value: "testimonial1", label: "Testimonial 1" },
  { value: "testimonial2", label: "Testimonial 2" },
  { value: "team1", label: "Team 1" },
  { value: "team2", label: "Team 2" },
  { value: "pricing1", label: "Pricing 1" },
  { value: "pricing2", label: "Pricing 2" },
  { value: "cta1", label: "CTA 1" },
  { value: "cta2", label: "CTA 2" }
];

export default function SectionsEditor() {
  const router = useRouter();
  const [sectionsData, setSectionsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/sections?t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setSectionsData(data);
        } else {
          console.error('Error fetching sections data:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching sections data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Handler for changing section type
  const handleSectionTypeChange = (newType: string) => {
    if (!sectionsData) return;
    
    setSectionsData({
      ...sectionsData,
      activeSection: newType
    });
  };
  
  // Render the sidebar content
  const renderSidebarContent = (data: any) => {
    if (!data) return null;
    
    const activeSection = data.activeSection || "hero1";
    
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
            label="Section Type"
            value={activeSection}
            options={sectionTypes}
            onChange={handleSectionTypeChange}
          />
        </TabsContent>
        
        {/* Content Tab */}
        <TabsContent value="content" className="m-0 p-3 border-t">
          {renderFormFieldsForSection(activeSection, data)}
        </TabsContent>
        
        {/* Style Tab */}
        <TabsContent value="style" className="m-0 p-3 border-t">
          <div className="text-xs text-gray-500">
            Style options will be implemented in future updates.
          </div>
        </TabsContent>
        
        {/* Media Tab */}
        <TabsContent value="media" className="m-0 p-3 border-t">
          {renderMediaFieldsForSection(activeSection, data)}
        </TabsContent>
      </Tabs>
    );
  };

  // Function to render form fields based on section type
  const renderFormFieldsForSection = (sectionType: string, data: any) => {
    const sectionData = data[sectionType] || {};
    
    switch (sectionType) {
      case "hero1":
        return <Hero1ContentForm data={sectionData} />;
      case "hero3":
        return <Hero3ContentForm data={sectionData} />;
      case "features1":
        return <Features1ContentForm data={sectionData} />;
      // Add more section form renderers as needed
      default:
        return (
          <div className="text-xs text-gray-500">
            Choose a section type to edit its content.
          </div>
        );
    }
  };
  
  // Function to render media fields based on section type
  const renderMediaFieldsForSection = (sectionType: string, data: any) => {
    const sectionData = data[sectionType] || {};
    
    switch (sectionType) {
      case "hero1":
        return <Hero1MediaForm data={sectionData} />;
      case "hero3":
        return <Hero3MediaForm data={sectionData} />;
      case "features1":
        return <Features1MediaForm data={sectionData} />;
      // Add more section media renderers as needed
      default:
        return (
          <div className="text-xs text-gray-500">
            Choose a section type to edit its media.
          </div>
        );
    }
  };
  
  // If still loading, return empty div
  if (isLoading) {
    return <div></div>;
  }

  return (
    <EditorProvider
      apiEndpoint="/api/sections"
      sectionType="section"
      uploadHandler={uploadImageToCloudinary}
      initialData={sectionsData}
    >
      <EditorLayout
        title="Section Editor"
        sidebarContent={
          <EditorSidebar>
            {renderSidebarContent}
          </EditorSidebar>
        }
      >
        <SectionPreview previewUrl="/preview/sections" />
      </EditorLayout>
    </EditorProvider>
  );
}

// Hero 1 Content Form
function Hero1ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Badge">
        <TextField
          label="Label"
          value={data?.badge?.label || ""}
          path="hero1.badge.label"
          placeholder="e.g. New, Hot"
        />
        <TextField
          label="Text"
          value={data?.badge?.text || ""}
          path="hero1.badge.text"
          placeholder="e.g. Free Lifetime Update"
        />
        <LinkField
          label="Link"
          value={data?.badge?.link || ""}
          path="hero1.badge.link"
        />
      </FormGroup>
      
      <TextField
        label="Title"
        value={data?.title || ""}
        path="hero1.title"
        placeholder="Enter hero title"
      />
      
      <TextAreaField
        label="Description"
        value={data?.description || ""}
        path="hero1.description"
        placeholder="Enter hero description"
      />
      
      <FormGroup title="Primary Button">
        <TextField
          label="Text"
          value={data?.primaryButton?.text || ""}
          path="hero1.primaryButton.text"
          placeholder="e.g. Get Started"
        />
        <LinkField
          label="Link"
          value={data?.primaryButton?.link || ""}
          path="hero1.primaryButton.link"
        />
      </FormGroup>
      
      <FormGroup title="Secondary Button">
        <TextField
          label="Text"
          value={data?.secondaryButton?.text || ""}
          path="hero1.secondaryButton.text"
          placeholder="e.g. Contact Sales"
        />
        <LinkField
          label="Link"
          value={data?.secondaryButton?.link || ""}
          path="hero1.secondaryButton.link"
        />
      </FormGroup>
    </div>
  );
}

// Hero 3 Content Form
function Hero3ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <TextField
        label="Badge Text"
        value={data?.badge?.text || ""}
        path="hero3.badge.text"
        placeholder="e.g. Build Without Limits"
      />
      
      <TextField
        label="Title (First Line)"
        value={data?.title?.part1 || ""}
        path="hero3.title.part1"
        placeholder="Enter first line of title"
      />
      
      <TextField
        label="Title (Second Line)"
        value={data?.title?.part2 || ""}
        path="hero3.title.part2"
        placeholder="Enter second line of title"
      />
      
      <TextAreaField
        label="Description"
        value={data?.description || ""}
        path="hero3.description"
        placeholder="Enter hero description"
      />
      
      <FormGroup title="Button Settings">
        <TextField
          label="Button Text"
          value={data?.button?.text || ""}
          path="hero3.button.text"
          placeholder="e.g. Try It Free"
        />
        <LinkField
          label="Button Link"
          value={data?.button?.link || ""}
          path="hero3.button.link"
        />
      </FormGroup>
    </div>
  );
}

// Features1 Content Form (example)
function Features1ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <TextField
        label="Section Title"
        value={data?.title || ""}
        path="features1.title"
        placeholder="Enter features section title"
      />
      
      <TextAreaField
        label="Section Description"
        value={data?.description || ""}
        path="features1.description"
        placeholder="Enter features section description"
      />
      
      <FormGroup title="Features">
        <div className="text-xs text-gray-500 mb-2">
          Feature items editor will be implemented in future updates.
        </div>
      </FormGroup>
    </div>
  );
}

// Hero 1 Media Form
function Hero1MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <ImageUploadField
        label="Background Image"
        value={data?.images?.background || ""}
        path="hero1.images.background"
      />
      
      <ImageUploadField
        label="Shape 1 Image"
        value={data?.images?.shape1 || ""}
        path="hero1.images.shape1"
      />
      
      <ImageUploadField
        label="Shape 2 Image"
        value={data?.images?.shape2 || ""}
        path="hero1.images.shape2"
      />
      
      <ImageUploadField
        label="Shape 3 Image"
        value={data?.images?.shape3 || ""}
        path="hero1.images.shape3"
      />
    </div>
  );
}

// Hero 3 Media Form
function Hero3MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-xs text-gray-500 mb-2">Image Grid</div>
        <div className="grid grid-cols-2 gap-2">
          {["image1", "image2", "image3", "image4"].map((key) => (
            <ImagePreview 
              key={key}
              src={data?.images?.[key] || "/placeholder.jpg"}
              path={`hero3.images.${key}`}
              alt={`Grid Image ${key}`}
            />
          ))}
        </div>
      </div>
      
      <ImageUploadField
        label="Star Image"
        value={data?.images?.star || ""}
        path="hero3.images.star"
      />
    </div>
  );
}

// Features1 Media Form (example)
function Features1MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <ImageUploadField
        label="Feature Icon 1"
        value={data?.icons?.icon1 || ""}
        path="features1.icons.icon1"
      />
      
      <ImageUploadField
        label="Feature Icon 2"
        value={data?.icons?.icon2 || ""}
        path="features1.icons.icon2"
      />
      
      <ImageUploadField
        label="Feature Icon 3"
        value={data?.icons?.icon3 || ""}
        path="features1.icons.icon3"
      />
    </div>
  );
}