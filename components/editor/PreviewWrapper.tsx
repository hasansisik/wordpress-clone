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

interface PreviewWrapperProps {
  children: (previewData: any) => ReactNode;
}

export default function PreviewWrapper({ children }: PreviewWrapperProps) {
  const searchParams = useSearchParams();
  const [sectionData, setSectionData] = useState<any>(null);
  const [sectionType, setSectionType] = useState<string>("");
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
    
    console.log("Section data from URL:", sectionDataParam);
    console.log("Section type from URL:", sectionTypeParam);
    
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
    
    // Listen for messages from parent frame
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      
      console.log("Received message in iframe:", event.data);
      
      if (event.data.type === "UPDATE_SECTION_DATA") {
        console.log("Updating section data in iframe:", event.data.sectionData);
        setSectionData(event.data.sectionData);
        setSectionType(event.data.sectionType);
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [searchParams]);

  if (!sectionData || !isLoaded) {
    return <div className="w-full h-full flex items-center justify-center text-lg">Loading preview...</div>;
  }

  return (
    <>
      <Script src="/assets/js/vendors/bootstrap.bundle.min.js" strategy="beforeInteractive" />
      <style jsx global>{fixCommonStyles}</style>
      <div style={{ overflow: "hidden" }}>
        {children(sectionData)}
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