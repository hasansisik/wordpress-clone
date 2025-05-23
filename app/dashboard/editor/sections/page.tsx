"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EditorProvider } from "@/components/editor/EditorProvider";
import EditorLayout from "@/components/editor/EditorLayout";
import EditorSidebar from "@/components/editor/EditorSidebar";
import SectionPreview from "@/components/editor/SectionPreview";
import { SectionTypeSelector, 
         TextField, 
         TextAreaField, 
         LinkField, 
         FormGroup, 
         ImageUploadField, 
         ImagePreview } from "@/components/editor/FormFields";
import { uploadImageToCloudinary } from "@/utils/cloudinary";

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
  const [selectedSectionType, setSelectedSectionType] = useState("hero1");
  
  // Section type change handler
  const handleSectionTypeChange = (newType: string) => {
    setSelectedSectionType(newType);
  };
  
  // Render the sidebar content
  const renderSidebarContent = (sectionData: any) => {
    return (
      <>
        <div className="mb-6">
          <SectionTypeSelector
            label="Section Component"
            value={selectedSectionType}
            options={sectionTypes}
            onChange={handleSectionTypeChange}
          />
        </div>
        
        {renderFormFields(sectionData)}
      </>
    );
  };
  
  // Render form fields based on section type
  const renderFormFields = (sectionData: any) => {
    if (!sectionData) return null;
    
    switch (sectionData.activeSection) {
      case "hero1":
        return renderHero1Fields(sectionData);
      case "hero3":
        return renderHero3Fields(sectionData);
      case "features1":
        return renderFeatures1Fields(sectionData);
      default:
        return (
          <p className="text-xs text-gray-500">
            Select a section type to edit its content
          </p>
        );
    }
  };
  
  // Hero1 fields
  const renderHero1Fields = (sectionData: any) => {
    const hero1 = sectionData.hero1 || {};
    
    return (
      <>
        <FormGroup title="Badge">
          <TextField
            label="Label"
            value={hero1.badge?.label || ""}
            path="hero1.badge.label"
            placeholder="e.g. New, Hot"
          />
          <TextField
            label="Text"
            value={hero1.badge?.text || ""}
            path="hero1.badge.text"
            placeholder="e.g. Free Lifetime Update"
          />
          <LinkField
            label="Link"
            value={hero1.badge?.link || ""}
            path="hero1.badge.link"
          />
        </FormGroup>
        
        <TextField
          label="Title"
          value={hero1.title || ""}
          path="hero1.title"
          placeholder="Enter hero title"
        />
        
        <TextAreaField
          label="Description"
          value={hero1.description || ""}
          path="hero1.description"
          placeholder="Enter hero description"
          rows={4}
        />
        
        <FormGroup title="Primary Button">
          <TextField
            label="Text"
            value={hero1.primaryButton?.text || ""}
            path="hero1.primaryButton.text"
            placeholder="e.g. Get Started"
          />
          <LinkField
            label="Link"
            value={hero1.primaryButton?.link || ""}
            path="hero1.primaryButton.link"
          />
        </FormGroup>
        
        <FormGroup title="Secondary Button">
          <TextField
            label="Text"
            value={hero1.secondaryButton?.text || ""}
            path="hero1.secondaryButton.text"
            placeholder="e.g. Contact Sales"
          />
          <LinkField
            label="Link"
            value={hero1.secondaryButton?.link || ""}
            path="hero1.secondaryButton.link"
          />
        </FormGroup>
        
        <FormGroup title="Card Settings">
          <TextField
            label="Card Title"
            value={hero1.card?.title || ""}
            path="hero1.card.title"
            placeholder="e.g. Join Our Community"
          />
          <TextField
            label="Card Description"
            value={hero1.card?.description || ""}
            path="hero1.card.description"
            placeholder="e.g. Over 2,500+ happy customers"
          />
          <TextField
            label="Button Label"
            value={hero1.card?.button?.label || ""}
            path="hero1.card.button.label"
            placeholder="e.g. Get"
          />
          <TextField
            label="Button Text"
            value={hero1.card?.button?.text || ""}
            path="hero1.card.button.text"
            placeholder="e.g. Free Update"
          />
          <LinkField
            label="Button Link"
            value={hero1.card?.button?.link || ""}
            path="hero1.card.button.link"
          />
        </FormGroup>
        
        <FormGroup title="Images">
          <ImageUploadField
            label="Background Image"
            value={hero1.images?.background || ""}
            path="hero1.images.background"
          />
          
          <ImageUploadField
            label="Shape 1 Image"
            value={hero1.images?.shape1 || ""}
            path="hero1.images.shape1"
          />
          
          <ImageUploadField
            label="Shape 2 Image"
            value={hero1.images?.shape2 || ""}
            path="hero1.images.shape2"
          />
          
          <ImageUploadField
            label="Shape 3 Image"
            value={hero1.images?.shape3 || ""}
            path="hero1.images.shape3"
          />
          
          <ImageUploadField
            label="Card Image"
            value={hero1.card?.image || ""}
            path="hero1.card.image"
          />
        </FormGroup>
      </>
    );
  };
  
  // Hero3 fields
  const renderHero3Fields = (sectionData: any) => {
    const hero3 = sectionData.hero3 || {};
    
    return (
      <>
        <TextField
          label="Badge Text"
          value={hero3.badge?.text || ""}
          path="hero3.badge.text"
          placeholder="e.g. Build Without Limits"
        />
        
        <TextField
          label="Title (First Line)"
          value={hero3.title?.part1 || ""}
          path="hero3.title.part1"
          placeholder="Enter first line of title"
        />
        
        <TextField
          label="Title (Second Line)"
          value={hero3.title?.part2 || ""}
          path="hero3.title.part2"
          placeholder="Enter second line of title"
        />
        
        <TextAreaField
          label="Description"
          value={hero3.description || ""}
          path="hero3.description"
          placeholder="Enter hero description"
          rows={4}
        />
        
        <FormGroup title="Button Settings">
          <TextField
            label="Button Text"
            value={hero3.button?.text || ""}
            path="hero3.button.text"
            placeholder="e.g. Try It Free"
          />
          <LinkField
            label="Button Link"
            value={hero3.button?.link || ""}
            path="hero3.button.link"
          />
        </FormGroup>
        
        <FormGroup title="Images">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {["image1", "image2", "image3", "image4"].map((key) => (
                <ImagePreview 
                  key={key}
                  src={hero3.images?.[key] || "/placeholder.jpg"}
                  path={`hero3.images.${key}`}
                  alt={`Grid Image ${key}`}
                />
              ))}
            </div>
          </div>
          
          <ImageUploadField
            label="Star Image"
            value={hero3.images?.star || ""}
            path="hero3.images.star"
          />
        </FormGroup>
        
        <FormGroup title="Avatars">
          <div className="space-y-4">
            {(hero3.avatars || []).map((avatar: any, index: number) => (
              <div key={index} className="flex gap-2 items-center">
                <ImagePreview 
                  src={avatar.image || "/placeholder.jpg"}
                  path={`hero3.avatars.${index}.image`}
                  alt={avatar.alt || `User avatar ${index + 1}`}
                  className="h-12 w-12 rounded-full"
                />
                <div className="flex-1">
                  <TextField
                    label="Alt Text"
                    value={avatar.alt || ""}
                    path={`hero3.avatars.${index}.alt`}
                    placeholder="e.g. User avatar"
                  />
                </div>
              </div>
            ))}
          </div>
        </FormGroup>
      </>
    );
  };
  
  // Features1 fields
  const renderFeatures1Fields = (sectionData: any) => {
    // Features1 form fields...
    return (
      <p className="text-xs text-gray-500">
        Features1 editing form will be implemented here
      </p>
    );
  };

  return (
    <EditorProvider
      apiEndpoint="/api/sections"
      sectionType="section"
      uploadHandler={uploadImageToCloudinary}
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