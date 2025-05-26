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
  SectionTypeSelector,
  EditorButton
} from "@/components/editor/FormFields";
import { Layout, Type, Settings, Image, Plus, Trash2, GripVertical, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import Faqs2 from "@/components/sections/Faqs2";
import Faqs3 from "@/components/sections/Faqs3";
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

// FAQ type options
const faqTypes = [
  { value: "faqs2", label: "FAQs 2" },
  { value: "faqs3", label: "FAQs 3" }
];

// Fallback preview component that renders directly in the editor
const DirectPreview = ({ data }: { data: any }) => {
  if (!data) return <div>No data available</div>;
  
  const activeComponent = data.activeFaq || "faqs2";
  
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
      {activeComponent === "faqs2" ? (
        <Faqs2 previewData={data} />
      ) : (
        <Faqs3 previewData={data} />
      )}
    </div>
  );
};

// Sortable FAQ Item component
interface SortableFaqItemProps {
  id: string;
  index: number;
  faq: any;
  faqType: string;
  handleRemove: () => void;
  handleInsert: () => void;
}

function SortableFaqItem({ id, index, faq, faqType, handleRemove, handleInsert }: SortableFaqItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const basePath = `${faqType}.questions.${index}`;
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="p-4 bg-white rounded-md shadow-sm border border-gray-100 space-y-3 mb-4 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <div 
            {...attributes} 
            {...listeners}
            className="cursor-grab hover:bg-gray-100 p-1 rounded"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-xs font-medium text-gray-700">FAQ Item {index + 1}</div>
        </div>
        <button 
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors duration-200"
          aria-label="Remove FAQ item"
          title="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <TextAreaField
        label="Question (HTML)"
        value={faq.question || ""}
        path={`${basePath}.question`}
        placeholder="Enter the question with HTML formatting if needed"
      />
      
      <TextAreaField
        label="Answer"
        value={faq.answer || ""}
        path={`${basePath}.answer`}
        placeholder="Enter the answer to the question"
        rows={3}
      />
    </div>
  );
}

export default function FaqEditor() {
  const router = useRouter();
  const [faqData, setFaqData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const iframeLoadAttempts = useRef(0);

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/faq?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
          }
      });
      
      if (response.ok) {
          const data = await response.json();
          setFaqData(data);
      } else {
          console.error('Error fetching FAQ data:', await response.text());
      }
    } catch (error) {
        console.error('Error fetching FAQ data:', error);
    } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handler for changing FAQ type
  const handleFaqTypeChange = (newType: string) => {
    if (!faqData) return;
    
    setFaqData({
      ...faqData,
      activeFaq: newType
    });
  };

  // Function to handle iframe load failures and success messages
  useEffect(() => {
    if (!faqData) return;
    
    // Listen for preview ready messages from iframe
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      
      if (event.data.type === "PREVIEW_READY" || event.data.type === "PREVIEW_UPDATED") {
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
  }, [faqData]);

  // Function to add a new FAQ item
  const addFaqItem = (faqType: string) => {
    if (!faqData) return;

    const newFaqItem = {
      question: "New FAQ Question",
      answer: "Enter the answer to the question here."
    };

    const updatedData = { ...faqData };
    updatedData[faqType].questions = [
      ...updatedData[faqType].questions,
      newFaqItem
    ];

    // Update local state
    setFaqData(updatedData);
    
    // Save to API immediately to ensure the data is persisted
    saveFaqData(updatedData);
  };

  // Function to insert a new FAQ item at a specific position
  const insertFaqItem = (faqType: string, index: number) => {
    if (!faqData) return;

    const newFaqItem = {
      question: "New FAQ Question",
      answer: "Enter the answer to the question here."
    };

    const updatedData = { ...faqData };
    const updatedQuestions = [...updatedData[faqType].questions];
    
    // Insert at the specified index
    updatedQuestions.splice(index + 1, 0, newFaqItem);
    updatedData[faqType].questions = updatedQuestions;

    // Update local state
    setFaqData(updatedData);
    
    // Save to API immediately to ensure the data is persisted
    saveFaqData(updatedData);
  };

  // Function to remove a FAQ item
  const removeFaqItem = (faqType: string, index: number) => {
    if (!faqData) return;

    const updatedData = { ...faqData };
    updatedData[faqType].questions = updatedData[faqType].questions.filter(
      (_: any, i: number) => i !== index
    );

    // Update local state
    setFaqData(updatedData);
    
    // Save to API immediately to ensure the data is persisted
    saveFaqData(updatedData);
  };

  // Add a helper function to save FAQ data immediately
  const saveFaqData = async (data: any) => {
    try {
      const response = await fetch('/api/faq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        console.error('Failed to save FAQ data');
      }
    } catch (error) {
      console.error('Error saving FAQ data:', error);
    }
  };

  // Handle FAQ item reordering via drag and drop
  const handleDragEnd = (faqType: string, event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString().split('-')[1]);
      const newIndex = parseInt(over.id.toString().split('-')[1]);
      
      const updatedData = { ...faqData };
      updatedData[faqType].questions = arrayMove(
        updatedData[faqType].questions,
        oldIndex,
        newIndex
      );
      
      setFaqData(updatedData);
    }
  };

  // Render the sidebar content
  const renderSidebarContent = (data: any) => {
    if (!data) return null;
    
    const activeFaq = data.activeFaq || "faqs2";

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
            label="FAQ Type"
            value={activeFaq}
            options={faqTypes}
            onChange={handleFaqTypeChange}
          />
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="m-0 p-3 border-t">
          {activeFaq === "faqs2" ? (
            <Faqs2ContentForm 
              data={data.faqs2 || {}} 
              addFaqItem={() => addFaqItem("faqs2")} 
              removeFaqItem={(index: number) => removeFaqItem("faqs2", index)}
              handleDragEnd={(event: DragEndEvent) => handleDragEnd("faqs2", event)}
              insertFaqItem={(index: number) => insertFaqItem("faqs2", index)}
            />
          ) : (
            <Faqs3ContentForm 
              data={data.faqs3 || {}} 
              addFaqItem={() => addFaqItem("faqs3")} 
              removeFaqItem={(index: number) => removeFaqItem("faqs3", index)}
              handleDragEnd={(event: DragEndEvent) => handleDragEnd("faqs3", event)}
              insertFaqItem={(index: number) => insertFaqItem("faqs3", index)}
            />
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
          {activeFaq === "faqs2" ? (
            <Faqs2MediaForm data={data.faqs2 || {}} />
          ) : (
            <Faqs3MediaForm data={data.faqs3 || {}} />
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
      apiEndpoint="/api/faq"
      sectionType="faq"
      uploadHandler={uploadImageToCloudinary}
      initialData={faqData}
    >
      <EditorLayout
        title="FAQ Editor"
        sidebarContent={
          <EditorSidebar>
            {renderSidebarContent}
          </EditorSidebar>
        }
      >
        {useFallback ? (
          <DirectPreview data={faqData} />
        ) : (
          <SectionPreview previewUrl="/preview/faq" paramName="faqData" />
        )}
      </EditorLayout>
    </EditorProvider>
  );
}

// Faqs2 Content Form
function Faqs2ContentForm({ 
  data, 
  addFaqItem, 
  removeFaqItem,
  handleDragEnd,
  insertFaqItem
}: { 
  data: any, 
  addFaqItem: () => void, 
  removeFaqItem: (index: number) => void,
  handleDragEnd: (event: DragEndEvent) => void,
  insertFaqItem: (index: number) => void
}) {
  const questions = data?.questions || [];
  
  return (
    <div className="space-y-4">
      <FormGroup title="Heading">
        <TextField
          label="Tag Text"
          value={data?.heading?.tag || ""}
          path="faqs2.heading.tag"
          placeholder="e.g. Pricing FAQs"
        />
        <TextField
          label="Title"
          value={data?.heading?.title || ""}
          path="faqs2.heading.title"
          placeholder="e.g. Ask us anything"
        />
        <TextField
          label="Description"
          value={data?.heading?.description || ""}
          path="faqs2.heading.description"
          placeholder="e.g. Have any questions? We're here to assist you."
        />
      </FormGroup>
      
      <FormGroup title="FAQ Items">
        <div className="bg-sidebar p-4 rounded-md">
          <div className="mb-4">
            <EditorButton 
              onClick={addFaqItem} 
              icon={<Plus className="h-4 w-4 mr-2" />}
              className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Add FAQ Item
            </EditorButton>
          </div>
          
          <DndContext 
            sensors={useSensors(
              useSensor(PointerSensor),
              useSensor(KeyboardSensor, {
                coordinateGetter: sortableKeyboardCoordinates,
              })
            )}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={questions.map((_: any, i: number) => `faq-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              {questions.map((faq: any, index: number) => (
                <SortableFaqItem
                  key={`faq-${index}`}
                  id={`faq-${index}`}
                  index={index}
                  faq={faq}
                  faqType="faqs2"
                  handleRemove={() => removeFaqItem(index)}
                  handleInsert={() => insertFaqItem(index)}
                />
              ))}
            </SortableContext>
          </DndContext>
          
          {questions.length === 0 && (
            <div className="text-center p-6 text-gray-500 border border-dashed border-gray-300 rounded-md mt-4">
              <p className="mb-2">No FAQ items yet</p>
              <p className="text-sm">Click the button above to add your first FAQ</p>
            </div>
          )}
        </div>
      </FormGroup>
    </div>
  );
}

// Faqs3 Content Form
function Faqs3ContentForm({ 
  data, 
  addFaqItem, 
  removeFaqItem,
  handleDragEnd,
  insertFaqItem
}: { 
  data: any, 
  addFaqItem: () => void, 
  removeFaqItem: (index: number) => void,
  handleDragEnd: (event: DragEndEvent) => void,
  insertFaqItem: (index: number) => void
}) {
  const questions = data?.questions || [];
  
  return (
    <div className="space-y-4">
      <FormGroup title="Heading">
        <TextField
          label="Tag Text"
          value={data?.heading?.tag || ""}
          path="faqs3.heading.tag"
          placeholder="e.g. Frequently Asked questions"
        />
        <TextAreaField
          label="Title (HTML)"
          value={data?.heading?.title || ""}
          path="faqs3.heading.title"
          placeholder="Enter title with HTML formatting if needed"
        />
        <TextAreaField
          label="Description"
          value={data?.heading?.description || ""}
          path="faqs3.heading.description"
          placeholder="Enter description with HTML formatting if needed"
        />
      </FormGroup>
      
      <FormGroup title="Buttons">
        <TextField
          label="Primary Button Text"
          value={data?.buttons?.primary?.text || ""}
          path="faqs3.buttons.primary.text"
          placeholder="e.g. Get in touch"
        />
        <LinkField
          label="Primary Button Link"
          value={data?.buttons?.primary?.link || ""}
          path="faqs3.buttons.primary.link"
          placeholder="#"
        />
        <TextField
          label="Secondary Button Text"
          value={data?.buttons?.secondary?.text || ""}
          path="faqs3.buttons.secondary.text"
          placeholder="e.g. Help Center"
        />
        <LinkField
          label="Secondary Button Link"
          value={data?.buttons?.secondary?.link || ""}
          path="faqs3.buttons.secondary.link"
          placeholder="#"
        />
      </FormGroup>
      
      <FormGroup title="FAQ Items">
        <div className="bg-sidebar p-4 rounded-md">
          <div className="mb-4">
            <EditorButton 
              onClick={addFaqItem} 
              icon={<Plus className="h-4 w-4 mr-2" />}
              className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Add FAQ Item
            </EditorButton>
          </div>
          
          <DndContext 
            sensors={useSensors(
              useSensor(PointerSensor),
              useSensor(KeyboardSensor, {
                coordinateGetter: sortableKeyboardCoordinates,
              })
            )}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={questions.map((_: any, i: number) => `faq-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              {questions.map((faq: any, index: number) => (
                <SortableFaqItem
                  key={`faq-${index}`}
                  id={`faq-${index}`}
                  index={index}
                  faq={faq}
                  faqType="faqs3"
                  handleRemove={() => removeFaqItem(index)}
                  handleInsert={() => insertFaqItem(index)}
                />
              ))}
            </SortableContext>
          </DndContext>
          
          {questions.length === 0 && (
            <div className="text-center p-6 text-gray-500 border border-dashed border-gray-300 rounded-md mt-4">
              <p className="mb-2">No FAQ items yet</p>
              <p className="text-sm">Click the button above to add your first FAQ</p>
            </div>
          )}
        </div>
      </FormGroup>
    </div>
  );
}

// Faqs2 Media Form
function Faqs2MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <ImageUploadField
        label="Tag Image"
        value={data?.tagImage || ""}
        path="faqs2.tagImage"
      />
    </div>
  );
}

// Faqs3 Media Form
function Faqs3MediaForm({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <ImageUploadField
        label="Tag Image"
        value={data?.tagImage || ""}
        path="faqs3.tagImage"
      />
      
      <FormGroup title="User Images">
        <ImageUploadField
          label="Image 1"
          value={data?.images?.image1 || ""}
          path="faqs3.images.image1"
        />
        <ImageUploadField
          label="Image 2"
          value={data?.images?.image2 || ""}
          path="faqs3.images.image2"
        />
      </FormGroup>
    </div>
  );
} 