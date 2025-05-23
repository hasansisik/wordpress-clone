"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Services2 from "@/components/sections/Services2";
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

// Additional styles for Services preview
const fixServicesStyles = `
/* Force section padding for service content */
.section-padding {
  padding: 80px 0;
}

/* Fix for services card */
.card-service {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-service .icon-shape {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  margin-bottom: 20px;
}

.card-service p {
  flex-grow: 1;
}

/* Fix animation classes */
.icon-flip {
  animation: icon-flip 3s infinite alternate;
}

@keyframes icon-flip {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}

.hover-up:hover {
  transform: translateY(-5px);
  transition: all 0.3s ease-in-out;
}

/* Ellipse animations */
.rotate-center {
  animation: rotate-center 20s linear infinite both;
}

.rotate-center-rev {
  animation: rotate-center-rev 20s linear infinite both;
}

@keyframes rotate-center {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes rotate-center-rev {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(-360deg);
  }
}

/* Ellipse styles */
.ellipse-rotate-success {
  width: 40px;
  height: 40px;
  top: 20%;
  left: 20%;
  border-radius: 50%;
  background: rgba(5, 178, 90, 0.1);
}

.ellipse-rotate-primary {
  width: 60px;
  height: 60px;
  top: 60%;
  left: 75%;
  border-radius: 50%;
  background: rgba(99, 66, 236, 0.1);
}

/* Fix for text sizes */
.ds-3 {
  font-size: 36px;
  line-height: 1.3;
  font-weight: 700;
}

/* Text styles */
.text-linear-2 {
  background: linear-gradient(to right, #6342EC, #5333EA);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-primary {
  color: #6342EC !important;
}

.bg-primary-soft {
  background-color: rgba(99, 66, 236, 0.1);
}

/* Fix button styling */
.btn-gradient {
  background: linear-gradient(90deg, #6342EC 0%, #4731D8 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
}

.tag-spacing {
  letter-spacing: 1px;
}

/* Spacing */
.mt-6 {
  margin-top: 3rem;
}

.p-6 {
  padding: 1.5rem;
}

.gap-3 {
  gap: 0.75rem;
}
`;

export default function ServicesPreview() {
  const searchParams = useSearchParams();
  const [servicesData, setServicesData] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize AOS (Animate on Scroll)
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
          
          // Signal to parent that the preview is ready
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: "PREVIEW_READY" }, "*");
          }
        }
      } catch (error) {
        console.error("Error initializing AOS:", error);
      }
    };
    
    loadAOS();
    
    // Re-initialize AOS whenever the data changes
    if (servicesData) {
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.AOS) {
          window.AOS.refresh();
          console.log("AOS refreshed after data change");
          
          // Signal to parent that the preview has updated
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ 
              type: "PREVIEW_UPDATED", 
              activeService: servicesData.activeService 
            }, "*");
          }
        }
      }, 200);
    }
  }, [servicesData]);

  useEffect(() => {
    // Get data from URL parameters
    const servicesDataParam = searchParams.get("servicesData");
    
    console.log("Services Data from URL:", servicesDataParam);
    
    if (servicesDataParam) {
      try {
        const parsedData = JSON.parse(servicesDataParam);
        console.log("Parsed Services data:", parsedData);
        setServicesData(parsedData);
        
        // Mark as loaded after a short delay to ensure CSS is applied
        setTimeout(() => setIsLoaded(true), 200);
      } catch (error) {
        console.error("Error parsing Services data:", error);
      }
    }
    
    // Listen for messages from parent frame
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      
      console.log("Received message in iframe:", event.data);
      
      if (event.data.type === "UPDATE_SECTION_DATA" && event.data.sectionType === "services") {
        console.log("Updating Services data in iframe:", event.data.sectionData);
        setServicesData(event.data.sectionData);
        
        // Mark as loaded if not already
        if (!isLoaded) {
          setTimeout(() => setIsLoaded(true), 200);
        }
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [searchParams, isLoaded]);

  if (!servicesData || !isLoaded) {
    return <div className="w-full h-full flex items-center justify-center text-lg">Loading Services preview...</div>;
  }

  return (
    <>
      <Script 
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" 
        strategy="beforeInteractive" 
        integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" 
        crossOrigin="anonymous"
      />
      <style jsx global>{fixServicesStyles}</style>
      <div style={{ overflow: "hidden" }}>
        <Services2 previewData={servicesData} />
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