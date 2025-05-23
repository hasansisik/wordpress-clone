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
    
    console.log("Hero Data from URL:", heroDataParam);
    
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
    
    // Listen for messages from parent frame
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      
      console.log("Received message in iframe:", event.data);
      
      if (event.data.type === "UPDATE_HERO_DATA") {
        console.log("Updating hero data in iframe:", event.data.heroData);
        setHeroData(event.data.heroData);
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [searchParams]);

  if (!heroData || !isLoaded) {
    return <div className="w-full h-full flex items-center justify-center text-lg">Loading hero preview...</div>;
  }

  // Render the appropriate hero component
  const renderHeroComponent = () => {
    const activeComponent = heroData.activeHero || "hero1";
    
    console.log("Rendering hero component:", activeComponent);
    
    switch (activeComponent) {
      case "hero1":
        return <Hero1 previewData={heroData} />;
      case "hero3":
        return <Hero3 previewData={heroData} />;
      default:
        return <Hero1 previewData={heroData} />;
    }
  };

  return (
    <>
      <Script src="/assets/js/vendors/bootstrap.bundle.min.js" strategy="beforeInteractive" />
      <style jsx global>{fixHeroStyles}</style>
      <div style={{ overflow: "hidden" }}>
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