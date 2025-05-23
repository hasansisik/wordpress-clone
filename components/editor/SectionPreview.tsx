"use client";

import { useEditor } from "./EditorProvider";
import { useEffect, FC, useRef } from "react";

interface SectionPreviewProps {
  previewUrl: string;
  additionalParams?: Record<string, string>;
  paramName?: string;
}

export const SectionPreview: FC<SectionPreviewProps> = ({ 
  previewUrl, 
  additionalParams = {},
  paramName
}) => {
  const { 
    iframeRef, 
    previewMode, 
    sectionData,
    sectionType,
    savedData
  } = useEditor();
  
  const initialLoadRef = useRef(false);

  // Update iframe URL only on initial load and when saved data changes
  useEffect(() => {
    // Only load initially or when saved data changes
    if (!initialLoadRef.current || savedData) {
      if (sectionData && iframeRef.current) {
        const queryParams = new URLSearchParams();
        
        // Determine the parameter name based on section type
        const dataParamName = paramName || (sectionType === "hero" ? "heroData" : "sectionData");
        
        // Add the main section data
        queryParams.append(dataParamName, JSON.stringify(sectionData));
        
        // Only add section type for non-hero sections
        if (sectionType !== "hero") {
          queryParams.append('sectionType', sectionType);
        }
        
        // Add any additional params
        Object.entries(additionalParams).forEach(([key, value]) => {
          queryParams.append(key, value);
        });
        
        const fullPreviewUrl = `${previewUrl}?${queryParams.toString()}`;
        
        console.log("Setting iframe URL:", fullPreviewUrl);
        
        // Update iframe src
        iframeRef.current.src = fullPreviewUrl;
        initialLoadRef.current = true;
      }
    }
  }, [sectionData, previewUrl, sectionType, additionalParams, paramName, savedData]);

  // Only update iframe width when preview mode changes
  useEffect(() => {
    if (iframeRef.current) {
      // Update iframe width class without reloading the content
      iframeRef.current.className = `
        border-none transition-all duration-300 ease-in-out bg-white h-full
        ${getPreviewWidthClass()} mx-auto
      `;
    }
  }, [previewMode]);

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
      src={`${previewUrl}`} 
      className={`
        border-none transition-all duration-300 ease-in-out bg-white h-full
        ${getPreviewWidthClass()} mx-auto
      `}
      title={`${sectionType} Preview`}
    />
  );
};

export default SectionPreview; 