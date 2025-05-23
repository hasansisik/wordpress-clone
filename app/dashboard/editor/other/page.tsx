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
import Blog1 from "@/components/sections/Blog1";
import Blog2 from "@/components/sections/Blog2";
import Blog3 from "@/components/sections/Blog3";
import Blog5 from "@/components/sections/Blog5";
import Contact1 from "@/components/sections/Contact1";

// Other component type options
const otherTypes = [
  { value: "blog1", label: "Blog 1" },
  { value: "blog2", label: "Blog 2" },
  { value: "blog3", label: "Blog 3" },
  { value: "blog5", label: "Blog 5" },
  { value: "contact1", label: "Contact 1" },
];

// Fallback preview component that renders directly in the editor
const DirectPreview = ({ data }: { data: any }) => {
  if (!data) return <div>No data available</div>;

  const activeComponent = data.activeOther || "blog1";

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

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="preview-container editor-preview">
      {activeComponent === "blog1" ? (
        <Blog1 previewData={data} />
      ) : activeComponent === "blog2" ? (
        <Blog2 previewData={data} />
      ) : activeComponent === "blog3" ? (
        <Blog3 previewData={data} />
      ) : activeComponent === "blog5" ? (
        <Blog5 previewData={data} />
      ) : (
        <Contact1 previewData={data} />
      )}
    </div>
  );
};

export default function OtherEditor() {
  const router = useRouter();
  const [otherData, setOtherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const iframeLoadAttempts = useRef(0);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/other?t=${timestamp}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOtherData(data);
        } else {
          console.error("Error fetching other data:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching other data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handler for changing component type
  const handleOtherTypeChange = (newType: string) => {
    if (!otherData) return;

    setOtherData({
      ...otherData,
      activeOther: newType,
    });
  };

  // Function to handle iframe load failures and success messages
  useEffect(() => {
    if (!otherData) return;

    // Listen for preview ready messages from iframe
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      if (
        event.data.type === "PREVIEW_READY" ||
        event.data.type === "PREVIEW_UPDATED"
      ) {
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
  }, [otherData]);

  // Render the sidebar content
  const renderSidebarContent = (data: any) => {
    if (!data) return null;

    const activeOther = data.activeOther || "blog1";

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
            value={activeOther}
            options={otherTypes}
            onChange={handleOtherTypeChange}
          />
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="m-0 p-3 border-t">
          {activeOther === "blog1" ? (
            <Blog1ContentForm data={data.blog1 || {}} />
          ) : activeOther === "blog2" ? (
            <Blog2ContentForm data={data.blog2 || {}} />
          ) : activeOther === "blog3" ? (
            <Blog3ContentForm data={data.blog3 || {}} />
          ) : activeOther === "blog5" ? (
            <Blog5ContentForm data={data.blog5 || {}} />
          ) : (
            <Contact1ContentForm data={data.contact1 || {}} />
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
          {activeOther === "blog1" ? (
            <Blog1MediaForm data={data.blog1 || {}} />
          ) : activeOther === "blog2" ? (
            <Blog2MediaForm data={data.blog2 || {}} />
          ) : activeOther === "blog3" ? (
            <Blog3MediaForm data={data.blog3 || {}} />
          ) : activeOther === "blog5" ? (
            <Blog5MediaForm data={data.blog5 || {}} />
          ) : (
            <Contact1MediaForm data={data.contact1 || {}} />
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
      apiEndpoint="/api/other"
      sectionType="other"
      uploadHandler={uploadImageToCloudinary}
      initialData={otherData}
    >
      <EditorLayout
        title="Other Components Editor"
        sidebarContent={<EditorSidebar>{renderSidebarContent}</EditorSidebar>}
      >
        {useFallback ? (
          <DirectPreview data={otherData} />
        ) : (
          <SectionPreview previewUrl="/preview/other" paramName="otherData" />
        )}
      </EditorLayout>
    </EditorProvider>
  );
}

// Blog 1 Content Form
function Blog1ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <TextField
        label="Badge"
        value={data?.badge || ""}
        path="blog1.badge"
        placeholder="e.g. From Blog"
      />

      <TextField
        label="Title"
        value={data?.title || ""}
        path="blog1.title"
        placeholder="Enter blog section title"
      />

      <TextField
        label="Subtitle"
        value={data?.subtitle || ""}
        path="blog1.subtitle"
        placeholder="Enter section subtitle"
      />

      <LinkField
        label="See All Link"
        value={data?.seeAllLink || ""}
        path="blog1.seeAllLink"
      />
    </div>
  );
}

// Blog 2 Content Form
function Blog2ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <TextField
        label="Badge"
        value={data?.badge || ""}
        path="blog2.badge"
        placeholder="e.g. From Blog"
      />

      <TextField
        label="Title"
        value={data?.title || ""}
        path="blog2.title"
        placeholder="Enter blog section title"
      />

      <TextField
        label="Subtitle"
        value={data?.subtitle || ""}
        path="blog2.subtitle"
        placeholder="Enter section subtitle"
      />

      <LinkField
        label="See All Link"
        value={data?.seeAllLink || ""}
        path="blog2.seeAllLink"
      />
    </div>
  );
}

// Blog 3 Content Form
function Blog3ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <TextField
        label="Title"
        value={data?.title || ""}
        path="blog3.title"
        placeholder="Enter blog section title"
      />
    </div>
  );
}

// Blog 5 Content Form
function Blog5ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <TextField
        label="Title"
        value={data?.title || ""}
        path="blog5.title"
        placeholder="Enter blog section title"
      />

      <TextField
        label="Subtitle"
        value={data?.subtitle || ""}
        path="blog5.subtitle"
        placeholder="Enter section subtitle"
      />
    </div>
  );
}

// Contact 1 Content Form
function Contact1ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <TextField
        label="Badge"
        value={data?.badge || ""}
        path="contact1.badge"
        placeholder="e.g. Get in Touch"
      />

      <TextField
        label="Title"
        value={data?.title || ""}
        path="contact1.title"
        placeholder="Enter contact section title"
      />

      <TextAreaField
        label="Description"
        value={data?.description || ""}
        path="contact1.description"
        placeholder="Enter contact section description"
      />

      <TextField
        label="Form Title"
        value={data?.formTitle || ""}
        path="contact1.formTitle"
        placeholder="e.g. Leave a message"
      />

      <TextField
        label="Chat Title"
        value={data?.chatTitle || ""}
        path="contact1.chatTitle"
        placeholder="e.g. Chat with us"
      />

      <TextField
        label="Chat Description"
        value={data?.chatDescription || ""}
        path="contact1.chatDescription"
        placeholder="Chat description text"
      />

      <LinkField
        label="WhatsApp Link"
        value={data?.whatsappLink || ""}
        path="contact1.whatsappLink"
      />

      <LinkField
        label="Viber Link"
        value={data?.viberLink || ""}
        path="contact1.viberLink"
      />

      <LinkField
        label="Messenger Link"
        value={data?.messengerLink || ""}
        path="contact1.messengerLink"
      />

      <TextField
        label="Email Title"
        value={data?.emailTitle || ""}
        path="contact1.emailTitle"
        placeholder="e.g. Send us an email"
      />

      <TextField
        label="Email Description"
        value={data?.emailDescription || ""}
        path="contact1.emailDescription"
        placeholder="Email description text"
      />

      <TextField
        label="Support Email"
        value={data?.supportEmail || ""}
        path="contact1.supportEmail"
        placeholder="e.g. support@example.com"
      />

      <TextField
        label="Sales Email"
        value={data?.salesEmail || ""}
        path="contact1.salesEmail"
        placeholder="e.g. sales@example.com"
      />

      <TextField
        label="Inquiry Title"
        value={data?.inquiryTitle || ""}
        path="contact1.inquiryTitle"
        placeholder="e.g. For more inquiry"
      />

      <TextField
        label="Inquiry Description"
        value={data?.inquiryDescription || ""}
        path="contact1.inquiryDescription"
        placeholder="Inquiry description text"
      />

      <TextField
        label="Phone Number"
        value={data?.phoneNumber || ""}
        path="contact1.phoneNumber"
        placeholder="e.g. +1 234 567 890"
      />
    </div>
  );
}

// Blog 1 Media Form
function Blog1MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 mb-2">
        Blog images are managed from a separate source.
      </div>
    </div>
  );
}

// Blog 2 Media Form
function Blog2MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 mb-2">
        Blog images are managed from a separate source.
      </div>
    </div>
  );
}

// Blog 3 Media Form
function Blog3MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 mb-2">
        Blog images are managed from a separate source.
      </div>
    </div>
  );
}

// Blog 5 Media Form
function Blog5MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 mb-2">
        Blog images are managed from a separate source.
      </div>
    </div>
  );
}

// Contact 1 Media Form
function Contact1MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Services">
        {(data?.services || []).map((service: string, index: number) => (
          <div key={index} className="mb-2">
            <TextField
              label={`Service ${index + 1}`}
              value={service || ""}
              path={`contact1.services.${index}`}
              placeholder="e.g. Research planning"
            />
          </div>
        ))}
      </FormGroup>
    </div>
  );
}
