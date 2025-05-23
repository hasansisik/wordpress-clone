"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Hero1 from "@/components/sections/Hero1";
import Hero3 from "@/components/sections/Hero3";
import Script from "next/script";

// Import all the necessary CSS directly in this component
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
  cursor: pointer;
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
  top: -24px;
  left: 0;
  background: #3b82f6;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 2px;
  z-index: 1001;
  font-weight: 600;
  pointer-events: none;
}

.editor-mode img {
  position: relative;
  outline: 2px dashed #f97316 !important;
  outline-offset: 2px;
  transition: all 0.2s ease;
  cursor: pointer;
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
  top: -24px;
  left: 0;
  background: #f97316;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 2px;
  z-index: 1001;
  font-weight: 600;
  pointer-events: none;
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
`;

// Additional styles to properly render Hero1
const fixHeroStyles = `
/* Force section padding for hero content */
.section-padding {
  padding: 80px 0;
}

/* Fix for hero image */
.hero-img {
  max-width: 100%;
  height: auto;
}

/* Make cards visible */
.card-hero {
  right: 0;
  bottom: 60px;
  max-width: 280px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
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

/* Fix for text sizes */
.ds-3 {
  font-size: 36px;
  line-height: 1.2;
  font-weight: 700;
}

.backdrop-filter {
  backdrop-filter: blur(10px);
}

/* Background linear gradient */
.bg-linear-1 {
  background: linear-gradient(to right, rgba(99, 66, 236, 0.1), rgba(99, 66, 236, 0.05));
}
`;

export default function HeroPreview() {
  const searchParams = useSearchParams();
  const [heroData, setHeroData] = useState<any>(null);
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize AOS (Animate on Scroll) for Hero1 component
  useEffect(() => {
    // Load AOS library dynamically
    const loadAOS = async () => {
      try {
        if (typeof window !== 'undefined') {
          const AOS = (await import('aos')).default;
          
          // Initialize AOS with default settings
          AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
          });
          
          console.log("AOS initialized in preview");
        }
      } catch (error) {
        console.error("Error initializing AOS:", error);
      }
    };
    
    loadAOS();
    
    // Re-initialize AOS whenever the hero data changes
    if (heroData) {
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.AOS) {
          window.AOS.refresh();
          console.log("AOS refreshed after data change");
        }
      }, 200);
    }
  }, [heroData]);

  useEffect(() => {
    // Get data from URL parameters
    const heroDataParam = searchParams.get("heroData");
    const modeParam = searchParams.get("mode");
    
    console.log("Hero Data from URL:", heroDataParam);
    console.log("Mode from URL:", modeParam);
    
    if (heroDataParam) {
      try {
        const parsedData = JSON.parse(heroDataParam);
        console.log("Parsed hero data:", parsedData);
        setHeroData(parsedData);
        
        // Mark as loaded after a short delay to ensure CSS is applied
        setTimeout(() => setIsLoaded(true), 200);
      } catch (error) {
        console.error("Error parsing hero data:", error);
      }
    }
    
    // Set editor mode
    setIsEditorMode(modeParam === "editor");
    
    // Listen for messages from parent frame
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      
      console.log("Received message in iframe:", event.data);
      
      if (event.data.type === "UPDATE_HERO_DATA") {
        console.log("Updating hero data in iframe:", event.data.heroData);
        setHeroData(event.data.heroData);
      }
      
      if (event.data.type === "UPDATE_MODE") {
        console.log("Updating mode in iframe:", event.data.mode);
        setIsEditorMode(event.data.mode === "editor");
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [searchParams]);

  if (!heroData || !isLoaded) {
    return <div className="w-full h-full flex items-center justify-center text-lg">Loading hero preview...</div>;
  }

  // Handle element click for editor mode with improved error handling
  const handleElementClick = (event: React.MouseEvent, fieldPath: string) => {
    if (!isEditorMode) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    // Get current value to display in edit dialog
    const parts = fieldPath.split('.');
    let current: any = heroData;
    
    try {
      for (const part of parts) {
        if (current && typeof current === 'object') {
          current = current[part];
        } else {
          current = '';
          break;
        }
      }
    } catch (error) {
      console.error("Error getting field value:", error);
      current = '';
    }
    
    console.log("Element clicked in iframe, value:", current);
    
    // Send message to parent frame
    window.parent.postMessage({
      type: "ELEMENT_CLICKED",
      fieldPath: fieldPath,
      currentValue: current || ''
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

  // Render the appropriate hero component
  const renderHeroComponent = () => {
    const activeComponent = heroData.activeHero || "hero1";
    
    console.log("Rendering hero component:", activeComponent);
    
    switch (activeComponent) {
      case "hero1":
        return <Hero1 previewData={heroData} editorContext={editorContext} />;
      case "hero3":
        return <Hero3 previewData={heroData} editorContext={editorContext} />;
      default:
        return <Hero1 previewData={heroData} editorContext={editorContext} />;
    }
  };

  return (
    <>
      <Script src="/assets/js/vendors/bootstrap.bundle.min.js" strategy="beforeInteractive" />
      
      <style jsx global>{editorModeStyles}</style>
      <style jsx global>{fixHeroStyles}</style>
      
      <div className={isEditorMode ? "editor-mode" : ""} style={{ overflow: "hidden" }}>
        {renderHeroComponent()}
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