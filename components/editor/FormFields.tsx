"use client";

import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useEditor } from "./EditorProvider";

// Form group component
export function FormGroup({ 
  title, 
  children 
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="p-3 bg-gray-50 rounded-md space-y-3">
      <Label className="text-xs font-medium text-gray-700">{title}</Label>
      {children}
    </div>
  );
}

// Text input field
export function TextField({
  label,
  value,
  path,
  placeholder = ""
}: {
  label: string;
  value: string;
  path: string;
  placeholder?: string;
}) {
  const { handleTextChange } = useEditor();
  
  return (
    <div className="space-y-2">
      <Label className="text-xs text-gray-500">{label}</Label>
      <Input
        value={value || ""}
        onChange={(e) => handleTextChange(e.target.value, path)}
        placeholder={placeholder}
        className="h-8 text-xs"
      />
    </div>
  );
}

// Textarea field
export function TextAreaField({
  label,
  value,
  path,
  placeholder = "",
  rows = 3
}: {
  label: string;
  value: string;
  path: string;
  placeholder?: string;
  rows?: number;
}) {
  const { handleTextChange } = useEditor();
  
  return (
    <div className="space-y-2">
      <Label className="text-xs text-gray-500">{label}</Label>
      <Textarea
        value={value || ""}
        onChange={(e) => handleTextChange(e.target.value, path)}
        placeholder={placeholder}
        className={`min-h-[${rows * 24}px] text-xs resize-y`}
      />
    </div>
  );
}

// Link URL field
export function LinkField({
  label,
  value,
  path,
  placeholder = "e.g. /page or https://example.com"
}: {
  label: string;
  value: string;
  path: string;
  placeholder?: string;
}) {
  const { handleTextChange } = useEditor();
  
  return (
    <div className="space-y-2">
      <Label className="text-xs text-gray-500">{label}</Label>
      <Input
        value={value || ""}
        onChange={(e) => handleTextChange(e.target.value, path)}
        placeholder={placeholder}
        className="h-8 text-xs"
      />
    </div>
  );
}

// Section type selector
export function SectionTypeSelector({
  label = "Section Type",
  value,
  options,
  onChange
}: {
  label?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-gray-500">{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Image upload field
export function ImageUploadField({
  label,
  value,
  path,
  withPreview = true
}: {
  label: string;
  value: string;
  path: string;
  withPreview?: boolean;
}) {
  const { handleImageUpload, imageUploading } = useEditor();

  return (
    <div className="space-y-2">
      <Label className="text-xs text-gray-500">{label}</Label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
            onChange={(e) => handleImageUpload(e, path)}
          />
          <Input
            readOnly
            value={value || ""}
            placeholder="Upload image"
            className="h-8 text-xs pr-20"
          />
          <Button
            type="button"
            variant="outline"
            disabled={imageUploading}
            className="absolute right-0 top-0 h-8 rounded-l-none text-xs"
            size="sm"
          >
            {imageUploading ? (
              "Uploading..."
            ) : (
              <>
                <Upload className="w-3 h-3 mr-1" />
                Upload
              </>
            )}
          </Button>
        </div>
      </div>
      {withPreview && value && (
        <div className="mt-2 border rounded overflow-hidden w-full h-24">
          <img 
            src={value} 
            alt={label} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}

// Simple image preview
export function ImagePreview({
  src,
  alt = "Preview",
  path,
  className = "h-16 w-16"
}: {
  src: string;
  alt?: string;
  path: string;
  className?: string;
}) {
  const { handleImageUpload, imageUploading } = useEditor();

  return (
    <div className="relative">
      <img 
        src={src} 
        alt={alt} 
        className={`object-cover rounded-md ${className}`}
      />
      <Button
        variant="secondary"
        size="sm"
        className="absolute bottom-1 right-1 h-6 text-[10px] bg-white bg-opacity-90"
        onClick={() => {
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.accept = 'image/*';
          fileInput.onchange = (e) => handleImageUpload(e as any, path);
          fileInput.click();
        }}
        disabled={imageUploading}
      >
        <Upload className="w-3 h-3 mr-1" />
        Change
      </Button>
    </div>
  );
} 