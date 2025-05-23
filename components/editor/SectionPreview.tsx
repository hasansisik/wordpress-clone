"use client";

import { useEditor } from "./EditorProvider";
import { useEffect, FC, useRef, useState } from "react";

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
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());

  // Update iframe URL when data changes (with debounce)
  useEffect(() => {
    // Always load on initial render
    if (!initialLoadRef.current) {
      updateIframe();
      initialLoadRef.current = true;
      return;
    }

    // Debounce updates to prevent too frequent refreshes
    const now = Date.now();
    if (now - lastUpdateTime > 1000) { // Only update if more than 1 second has passed
      updateIframe();
      setLastUpdateTime(now);
    } else {
      // Schedule an update if it's too soon
      const timerId = setTimeout(() => {
        updateIframe();
        setLastUpdateTime(Date.now());
      }, 1000);
      
      return () => clearTimeout(timerId);
    }
  }, [sectionData]);

  // Function to update the iframe
  const updateIframe = () => {
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
    }
  };

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