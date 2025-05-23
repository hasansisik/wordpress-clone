"use client";

import { useEditor } from "./EditorProvider";
import { useEffect, FC } from "react";

interface SectionPreviewProps {
  previewUrl: string;
}

export const SectionPreview: FC<SectionPreviewProps> = ({ previewUrl }) => {
  const { 
    iframeRef, 
    previewMode, 
    sectionData,
    sectionType
  } = useEditor();

  // Update iframe URL when necessary
  useEffect(() => {
    if (sectionData && iframeRef.current) {
      const queryParams = new URLSearchParams();
      queryParams.append('sectionData', JSON.stringify(sectionData));
      queryParams.append('sectionType', sectionType);
      
      const fullPreviewUrl = `${previewUrl}?${queryParams.toString()}`;
      
      // Only update src if it's changed to prevent unnecessary reloads
      if (iframeRef.current.src !== fullPreviewUrl) {
        iframeRef.current.src = fullPreviewUrl;
      }
    }
  }, [sectionData, previewUrl, sectionType]);

  // Determine preview width class based on responsive mode
  const getPreviewWidthClass = () => {
    switch (previewMode) {
      case "desktop": return "w-full";
      case "tablet": return "w-[768px]";
      case "mobile": return "w-[375px]";
      default: return "w-full";
    }
  };

  return (
    <iframe 
      ref={iframeRef}
      className={`
        border-none transition-all duration-300 ease-in-out bg-white h-full
        ${getPreviewWidthClass()} mx-auto
      `}
      title={`${sectionType} Preview2`}
    />
  );
};

export default SectionPreview; 