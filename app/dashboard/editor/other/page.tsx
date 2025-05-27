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
import Services2 from "@/components/sections/Services2";
import Services5 from "@/components/sections/Services5";
import Project2 from "@/components/sections/Project2";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getOther, updateOther } from "@/redux/actions/otherActions";
import { AppDispatch } from "@/redux/store";

// Add CSS styles for toggle switches
const toggleStyles = `
  .toggle-checkbox:checked {
    right: 0;
    border-color: #6342EC;
  }
  .toggle-checkbox:checked + .toggle-label {
    background-color: #6342EC;
  }
  .toggle-checkbox {
    right: 0;
    transition: all 0.3s;
    left: 0;
  }
  .toggle-label {
    transition: all 0.3s;
  }
`;

// Other component type options
const otherTypes = [
  { value: "blog1", label: "Blog 1" },
  { value: "blog2", label: "Blog 2" },
  { value: "blog3", label: "Blog 3" },
  { value: "blog5", label: "Blog 5" },
  { value: "services2", label: "Services 2" },
  { value: "services5", label: "Services 5" },
  { value: "project2", label: "Project 2" },
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
      ) : activeComponent === "services2" ? (
        <Services2 previewData={data} />
      ) : activeComponent === "services5" ? (
        <Services5 previewData={data} />
      ) : activeComponent === "project2" ? (
        <Project2 previewData={data} />
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
  const dispatch = useDispatch<AppDispatch>();
  const { other, loading } = useSelector((state: RootState) => state.other);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use Redux to fetch other data
        await dispatch(getOther());
      } catch (error) {
        console.error("Error fetching other data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // Update local state when other data changes in Redux
  useEffect(() => {
    if (other) {
      setOtherData(other);
    }
  }, [other]);

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
          ) : activeOther === "services2" ? (
            <Services2ContentForm data={data.services2 || {}} />
          ) : activeOther === "services5" ? (
            <Services5ContentForm data={data.services5 || {}} />
          ) : activeOther === "project2" ? (
            <Project2ContentForm data={data.project2 || {}} />
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
          ) : activeOther === "services2" ? (
            <Services2MediaForm data={data.services2 || {}} />
          ) : activeOther === "services5" ? (
            <Services5MediaForm data={data.services5 || {}} />
          ) : activeOther === "project2" ? (
            <Project2MediaForm data={data.project2 || {}} />
          ) : (
            <Contact1MediaForm data={data.contact1 || {}} />
          )}
        </TabsContent>
      </Tabs>
    );
  };

  // If still loading, return empty div
  if (isLoading || loading) {
    return <div>Loading...</div>;
  }

  return (
    <EditorProvider
      apiEndpoint="/api/other"
      sectionType="other"
      uploadHandler={uploadImageToCloudinary}
      initialData={otherData}
      saveHandler={async (data) => {
        try {
          // Use Redux to update other data
          await dispatch(updateOther(data));
          return { success: true };
        } catch (error) {
          console.error("Error saving other data:", error);
          return { success: false, error: "Failed to save other data" };
        }
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: toggleStyles }} />
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

// Services 2 Content Form
function Services2ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <FormGroup title="Heading">
        <TextField
          label="Tag"
          value={data?.heading?.tag || ""}
          path="services2.heading.tag"
          placeholder="e.g. What we offer"
        />
        
        <TextAreaField
          label="Title"
          value={data?.heading?.title || ""}
          path="services2.heading.title"
          placeholder="Enter section title with HTML formatting if needed"
        />
      </FormGroup>
      
      <FormGroup title="Buttons">
        <TextField
          label="Primary Button Text"
          value={data?.buttons?.primary?.text || ""}
          path="services2.buttons.primary.text"
          placeholder="e.g. Explore Now"
        />
        
        <LinkField
          label="Primary Button Link"
          value={data?.buttons?.primary?.link || ""}
          path="services2.buttons.primary.link"
        />
        
        <TextField
          label="Primary Button Class"
          value={data?.buttons?.primary?.btnClass || ""}
          path="services2.buttons.primary.btnClass"
          placeholder="e.g. btn-gradient"
        />
        
        <TextField
          label="Secondary Button Text"
          value={data?.buttons?.secondary?.text || ""}
          path="services2.buttons.secondary.text"
          placeholder="e.g. Contact Us"
        />
        
        <LinkField
          label="Secondary Button Link"
          value={data?.buttons?.secondary?.link || ""}
          path="services2.buttons.secondary.link"
        />
        
        <TextField
          label="Secondary Button Class"
          value={data?.buttons?.secondary?.btnClass || ""}
          path="services2.buttons.secondary.btnClass"
          placeholder="e.g. btn-outline-secondary"
        />
      </FormGroup>
      
      <FormGroup title="Services">
        {(data?.services || []).map((service: any, index: number) => (
          <div key={index} className="p-3 bg-sidebar rounded-md space-y-3 mb-4">
            <div className="text-xs font-medium text-gray-700 mb-2">
              Service {index + 1}
            </div>
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
              label="Icon Background Color"
              value={service.iconBgColor || ""}
              path={`services2.services.${index}.iconBgColor`}
              placeholder="e.g. bg-primary-soft"
            />
          </div>
        ))}
      </FormGroup>
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

      <FormGroup title="Email Section">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Show Email Section</label>
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input 
              type="checkbox" 
              name="showEmail" 
              id="showEmail"
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              checked={data?.showEmail !== false}
              onChange={(e) => {
                // Use the EditorContext to update the value
                const editorContext = (window as any).editorContext;
                if (editorContext?.updateValue) {
                  editorContext.updateValue('contact1.showEmail', e.target.checked);
                }
              }}
            />
            <label 
              htmlFor="showEmail" 
              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
            ></label>
          </div>
        </div>

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
      </FormGroup>

      <FormGroup title="Phone Section">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Show Phone Section</label>
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input 
              type="checkbox" 
              name="showPhone" 
              id="showPhone"
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              checked={data?.showPhone !== false}
              onChange={(e) => {
                // Use the EditorContext to update the value
                const editorContext = (window as any).editorContext;
                if (editorContext?.updateValue) {
                  editorContext.updateValue('contact1.showPhone', e.target.checked);
                }
              }}
            />
            <label 
              htmlFor="showPhone" 
              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
            ></label>
          </div>
        </div>

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
      </FormGroup>

      <FormGroup title="Colors">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Button Color
          </label>
          <div className="flex items-center">
            <input
              type="color"
              value={data?.buttonColor || "#6342EC"}
              onChange={(e) => {
                const editorContext = (window as any).editorContext;
                if (editorContext?.updateValue) {
                  editorContext.updateValue('contact1.buttonColor', e.target.value);
                }
              }}
              className="h-8 w-8 rounded border p-0"
            />
            <input
              type="text"
              value={data?.buttonColor || "#6342EC"}
              onChange={(e) => {
                const editorContext = (window as any).editorContext;
                if (editorContext?.updateValue) {
                  editorContext.updateValue('contact1.buttonColor', e.target.value);
                }
              }}
              className="ml-2 h-8 w-full border rounded px-2"
              placeholder="#6342EC"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Badge Background Color
          </label>
          <div className="flex items-center">
            <input
              type="color"
              value={data?.badgeColor || "rgba(99, 66, 236, 0.1)"}
              onChange={(e) => {
                const editorContext = (window as any).editorContext;
                if (editorContext?.updateValue) {
                  editorContext.updateValue('contact1.badgeColor', e.target.value);
                }
              }}
              className="h-8 w-8 rounded border p-0"
            />
            <input
              type="text"
              value={data?.badgeColor || "rgba(99, 66, 236, 0.1)"}
              onChange={(e) => {
                const editorContext = (window as any).editorContext;
                if (editorContext?.updateValue) {
                  editorContext.updateValue('contact1.badgeColor', e.target.value);
                }
              }}
              className="ml-2 h-8 w-full border rounded px-2"
              placeholder="rgba(99, 66, 236, 0.1)"
            />
          </div>
        </div>
      </FormGroup>
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

// Services 2 Media Form
function Services2MediaForm({ data }: { data: any }) {
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
          <div key={index} className="mb-3">
            <ImageUploadField
              label={`Service ${index + 1} Icon`}
              value={service.icon || ""}
              path={`services2.services.${index}.icon`}
            />
          </div>
        ))}
      </FormGroup>
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

// Services 5 Content Form
function Services5ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <TextField
        label="Title"
        value={data?.title || ""}
        path="services5.title"
        placeholder="Enter section title"
      />

      <TextField
        label="Subtitle"
        value={data?.subtitle || ""}
        path="services5.subtitle"
        placeholder="Enter section subtitle"
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
        label="Link Text"
        value={data?.linkText || ""}
        path="services5.linkText"
        placeholder="e.g. How We Work"
      />

      <LinkField
        label="Link URL"
        value={data?.linkUrl || ""}
        path="services5.linkUrl"
      />

      <TextField
        label="Background Color"
        value={data?.backgroundColor || ""}
        path="services5.backgroundColor"
        placeholder="e.g. #ffffff"
      />

      <TextField
        label="Title Color"
        value={data?.titleColor || ""}
        path="services5.titleColor"
        placeholder="e.g. #333333"
      />

      <TextField
        label="Button Color"
        value={data?.buttonColor || ""}
        path="services5.buttonColor"
        placeholder="e.g. #6342EC"
      />
    </div>
  );
}

// Project 2 Content Form
function Project2ContentForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <TextField
        label="Title"
        value={data?.title || ""}
        path="project2.title"
        placeholder="Enter section title"
      />

      <TextField
        label="Subtitle"
        value={data?.subtitle || ""}
        path="project2.subtitle"
        placeholder="Enter section subtitle"
      />

      <TextAreaField
        label="Description"
        value={data?.description || ""}
        path="project2.description"
        placeholder="Enter section description"
      />

      <TextField
        label="Background Color"
        value={data?.backgroundColor || ""}
        path="project2.backgroundColor"
        placeholder="e.g. #f8f9fa"
      />

      <TextField
        label="Title Color"
        value={data?.titleColor || ""}
        path="project2.titleColor"
        placeholder="e.g. #333333"
      />

      <TextField
        label="Badge Color"
        value={data?.badgeColor || ""}
        path="project2.badgeColor"
        placeholder="e.g. rgba(99, 66, 236, 0.1)"
      />
    </div>
  );
}

// Services 5 Media Form
function Services5MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 mb-2">
        Services images are managed from a separate source.
      </div>
    </div>
  );
}

// Project 2 Media Form
function Project2MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 mb-2">
        Project images are managed from a separate source.
      </div>
    </div>
  );
}
