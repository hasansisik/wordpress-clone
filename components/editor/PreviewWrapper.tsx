"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import Script from "next/script";

// Import common CSS styles
import "@/public/assets/css/vendors/bootstrap.min.css";
import "@/public/assets/css/vendors/swiper-bundle.min.css";
import "@/public/assets/css/vendors/aos.css";
import "@/public/assets/css/vendors/odometer.css";
import "@/public/assets/css/vendors/carouselTicker.css";
import "@/public/assets/css/vendors/magnific-popup.css";
import "@/public/assets/fonts/bootstrap-icons/bootstrap-icons.min.css";
import "@/public/assets/fonts/boxicons/boxicons.min.css";
import "@/public/assets/fonts/satoshi/satoshi.css";
import "@/public/assets/css/main.css";

// CSS style for editor mode with improved visual cues
const editorModeStyles = `
.editor-mode h1, 
.editor-mode h2, 
.editor-mode h3,
.editor-mode p,
.editor-mode .btn,
.editor-mode span {
  position: relative;
  outline: 2px dashed #3b82f6 !important;
  outline-offset: 2px;
  transition: all 0.2s ease;
  cursor: pointer !important;
}

.editor-mode h1:hover, 
.editor-mode h2:hover, 
.editor-mode h3:hover,
.editor-mode p:hover,
.editor-mode .btn:hover,
.editor-mode span:hover {
  outline: 2px solid #3b82f6 !important;
  background-color: rgba(59, 130, 246, 0.1) !important;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  z-index: 1000;
}

.editor-mode h1:hover::before, 
.editor-mode h2:hover::before, 
.editor-mode h3:hover::before,
.editor-mode p:hover::before,
.editor-mode .btn:hover::before,
.editor-mode span:hover::before {
  content: "Edit Text";
  position: absolute;
  top: -30px;
  left: 0;
  background: #3b82f6;
  color: white;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 4px;
  z-index: 1001;
  font-weight: 600;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.editor-mode img {
  position: relative;
  outline: 2px dashed #f97316 !important;
  outline-offset: 2px;
  transition: all 0.2s ease;
  cursor: pointer !important;
}

.editor-mode img:hover {
  outline: 2px solid #f97316 !important;
  filter: brightness(0.95);
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.15);
  z-index: 1000;
}

.editor-mode img:hover::before {
  content: "Replace Image";
  position: absolute;
  top: -30px;
  left: 0;
  background: #f97316;
  color: white;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 4px;
  z-index: 1001;
  font-weight: 600;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

/* Add visual indicator for the entire editor mode */
.editor-mode {
  position: relative;
}

.editor-mode::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 3px solid rgba(59, 130, 246, 0.3);
  pointer-events: none;
  z-index: 999;
}

/* Better hover indicators that don't shift layout */
.editor-mode a:hover,
.editor-mode button:hover,
.editor-mode div[role="button"]:hover {
  color: inherit;
}

/* Make sure links don't navigate in editor mode */
.editor-mode a {
  pointer-events: none;
}
.editor-mode a * {
  pointer-events: auto;
}

/* Highlight editable areas */
.editor-mode .cursor-pointer {
  position: relative;
  z-index: 1;
}

.editor-mode .cursor-pointer:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(59, 130, 246, 0.05);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.editor-mode .cursor-pointer:hover:after {
  opacity: 1;
}
`;

// Fix common styling issues
const fixCommonStyles = `
/* Force section padding for content */
.section-padding {
  padding: 80px 0;
}

/* Fix for hero image */
.hero-img {
  max-width: 100%;
  height: auto;
}

/* Fix animation classes */
.alltuchtopdown {
  animation: alltuchtopdown 1.5s ease-in-out infinite alternate-reverse both;
}

@keyframes alltuchtopdown {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-10px);
  }
}

.rightToLeft {
  animation: rightToLeft 2s ease-in-out infinite alternate-reverse both;
}

@keyframes rightToLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-10px);
  }
}

.backdrop-filter {
  backdrop-filter: blur(10px);
}

/* Background linear gradient */
.bg-linear-1 {
  background: linear-gradient(to right, rgba(99, 66, 236, 0.1), rgba(99, 66, 236, 0.05));
}
`;

interface EditorContext {
  layoutMode: boolean;
  handleElementClick: (event: React.MouseEvent, fieldPath: string) => void;
  handleImageClick: (event: React.MouseEvent, imagePath: string) => void;
}

interface PreviewWrapperProps {
  children: (previewData: any, editorContext: EditorContext) => ReactNode;
}

export default function PreviewWrapper({ children }: PreviewWrapperProps) {
  const searchParams = useSearchParams();
  const [sectionData, setSectionData] = useState<any>(null);
  const [sectionType, setSectionType] = useState<string>("");
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize libraries and AOS
  useEffect(() => {
    const loadLibraries = async () => {
      try {
        if (typeof window !== 'undefined') {
          // Initialize AOS if available
          try {
            const AOS = (await import('aos')).default;
            
            AOS.init({
              duration: 800,
              easing: 'ease-in-out',
              once: true,
              mirror: false
            });
            
            console.log("AOS initialized in preview");
          } catch (error) {
            console.log("AOS not available, skipping initialization");
          }
        }
      } catch (error) {
        console.error("Error initializing libraries:", error);
      }
    };
    
    loadLibraries();
    
    // Refresh AOS when section data changes
    if (sectionData) {
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.AOS) {
          window.AOS.refresh();
          console.log("AOS refreshed after data change");
        }
      }, 200);
    }
  }, [sectionData]);

  useEffect(() => {
    // Get data from URL parameters
    const sectionDataParam = searchParams.get("sectionData");
    const sectionTypeParam = searchParams.get("sectionType");
    const modeParam = searchParams.get("mode");
    
    console.log("Section data from URL:", sectionDataParam);
    console.log("Section type from URL:", sectionTypeParam);
    console.log("Mode from URL:", modeParam);
    
    if (sectionDataParam && sectionTypeParam) {
      try {
        const parsedData = JSON.parse(sectionDataParam);
        console.log("Parsed section data:", parsedData);
        setSectionData(parsedData);
        setSectionType(sectionTypeParam);
        
        // Mark as loaded after a short delay to ensure CSS is applied
        setTimeout(() => setIsLoaded(true), 200);
      } catch (error) {
        console.error("Error parsing section data:", error);
      }
    }
    
    // Set editor mode
    setIsEditorMode(modeParam === "editor");
    
    // Listen for messages from parent frame
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      
      console.log("Received message in iframe:", event.data);
      
      if (event.data.type === "UPDATE_SECTION_DATA") {
        console.log("Updating section data in iframe:", event.data.sectionData);
        setSectionData(event.data.sectionData);
        setSectionType(event.data.sectionType);
      }
      
      if (event.data.type === "UPDATE_MODE") {
        console.log("Updating mode in iframe:", event.data.mode);
        setIsEditorMode(event.data.mode === "editor");
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [searchParams]);

  if (!sectionData || !isLoaded) {
    return <div className="w-full h-full flex items-center justify-center text-lg">Loading preview...</div>;
  }

  // Handle element click for editor mode with improved error handling
  const handleElementClick = (event: React.MouseEvent, fieldPath: string) => {
    if (!isEditorMode) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    // Get current value to display in edit dialog with better error checking
    const parts = fieldPath.split('.');
    let current: any = JSON.parse(JSON.stringify(sectionData)); // Deep copy to avoid reference issues
    let currentValue = '';
    
    try {
      // Navigate through object path
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (current && typeof current === 'object' && part in current) {
          if (i === parts.length - 1) {
            // Last part in path - this is our value
            currentValue = current[part] !== null ? String(current[part]) : '';
          } else {
            current = current[part];
          }
        } else {
          // Path doesn't exist or is invalid
          currentValue = '';
          break;
        }
      }
    } catch (error) {
      console.error("Error getting field value:", error, fieldPath);
      currentValue = '';
    }
    
    // Log the extracted value for debugging
    console.log(`Element clicked in iframe: ${fieldPath}, Current value: "${currentValue}"`);
    
    // Send detailed message to parent frame with both the path and current value
    window.parent.postMessage({
      type: "ELEMENT_CLICKED",
      fieldPath: fieldPath,
      currentValue: currentValue
    }, "*");
  };

  // Handle image click for editor mode
  const handleImageClick = (event: React.MouseEvent, imagePath: string) => {
    if (!isEditorMode) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    console.log("Image clicked in iframe:", imagePath);
    
    // Send message to parent frame
    window.parent.postMessage({
      type: "IMAGE_CLICKED",
      imagePath: imagePath
    }, "*");
  };

  // Set editor context
  const editorContext = {
    layoutMode: isEditorMode,
    handleElementClick,
    handleImageClick
  };

  return (
    <>
      <Script src="/assets/js/vendors/bootstrap.bundle.min.js" strategy="beforeInteractive" />
      
      <style jsx global>{editorModeStyles}</style>
      <style jsx global>{fixCommonStyles}</style>
      
      <div className={isEditorMode ? "editor-mode" : ""} style={{ overflow: "hidden" }}>
        {children(sectionData, editorContext)}
      </div>
    </>
  );
}

// Add type definition for AOS in the window object
declare global {
  interface Window {
    AOS: any;
  }
} 