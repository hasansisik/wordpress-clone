"use client";

import { useEffect, useState } from "react";
import Services5 from "@/components/sections/Services5";
import Project2 from "@/components/sections/Project2";
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

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Common Styles
const CommonStyles = () => (
  <style jsx global>{`
    * {
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
      width: 100%;
      overflow-x: hidden;
    }
    
    /* Bootstrap-like spacing */
    .py-2 {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
    
    .px-3 {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    
    .px-4 {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
    
    .ms-2 {
      margin-left: 0.5rem;
    }
    
    .mt-3 {
      margin-top: 1rem;
    }
    
    .my-3 {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
    
    .mb-2 {
      margin-bottom: 0.5rem;
    }
    
    .mb-3 {
      margin-bottom: 1rem;
    }
    
    .mt-8 {
      margin-top: 3rem;
    }
    
    .rounded-pill {
      border-radius: 50rem;
    }
    
    .rounded-3 {
      border-radius: 0.5rem;
    }
    
    /* Flex utilities */
    .d-flex {
      display: flex;
    }
    
    .align-items-center {
      align-items: center;
    }
    
    .align-items-end {
      align-items: flex-end;
    }
    
    .justify-content-center {
      justify-content: center;
    }
    
    .justify-content-start {
      justify-content: flex-start;
    }
    
    .position-relative {
      position: relative;
    }
    
    .position-absolute {
      position: absolute;
    }
    
    .d-inline-flex {
      display: inline-flex;
    }
    
    /* Background utilities */
    .bg-primary-soft {
      background-color: rgba(99, 66, 236, 0.1);
    }
    
    .border {
      border: 1px solid;
    }
    
    .border-2 {
      border-width: 2px;
    }
    
    .border-white {
      border-color: #fff;
    }
    
    /* Text utilities */
    .fs-7 {
      font-size: 0.875rem;
    }
    
    .fs-5 {
      font-size: 1.25rem;
    }
    
    .fw-bold {
      font-weight: 700;
    }
    
    .fw-medium {
      font-weight: 500;
    }
    
    .text-linear-2 {
      background: linear-gradient(90deg, #6342EC 0%, #BA3FDA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .ms-2 {
      margin-left: 0.5rem;
    }
    
    .text-uppercase {
      text-transform: uppercase;
    }
    
    .text-primary {
      color: #6342EC;
    }
    
    /* Grid system */
    .container {
      width: 100%;
      padding-right: 15px;
      padding-left: 15px;
      margin-right: auto;
      margin-left: auto;
      max-width: 100%;
    }
    
    @media (min-width: 576px) {
      .container {
        max-width: 540px;
      }
    }
    
    @media (min-width: 768px) {
      .container {
        max-width: 720px;
      }
    }
    
    @media (min-width: 992px) {
      .container {
        max-width: 960px;
      }
    }
    
    @media (min-width: 1200px) {
      .container {
        max-width: 1140px;
      }
    }
    
    .row {
      display: flex;
      flex-wrap: wrap;
      margin-right: -15px;
      margin-left: -15px;
      width: 100%;
    }
    
    .col-lg-4, .col-md-6, .col {
      position: relative;
      width: 100%;
      padding-right: 15px;
      padding-left: 15px;
    }
    
    .col-lg-6 {
      position: relative;
      width: 100%;
      padding-right: 15px;
      padding-left: 15px;
    }
    
    .col-lg-10 {
      position: relative;
      width: 100%;
      padding-right: 15px;
      padding-left: 15px;
    }
    
    .col {
      flex: 1 0 0%;
    }
    
    .me-auto {
      margin-right: auto;
    }
    
    .mx-lg-auto {
      margin-left: auto;
      margin-right: auto;
    }
    
    @media (min-width: 992px) {
      .col-lg-4 {
        flex: 0 0 33.333333%;
        max-width: 33.333333%;
      }
      
      .col-lg-6 {
        flex: 0 0 50%;
        max-width: 50%;
      }
      
      .col-lg-10 {
        flex: 0 0 83.333333%;
        max-width: 83.333333%;
      }
    }
    
    @media (min-width: 768px) {
      .col-md-6 {
        flex: 0 0 50%;
        max-width: 50%;
      }
    }
    
    /* Fix for text sizes */
    .ds-5 {
      font-size: 30px;
      line-height: 1.3;
      font-weight: 700;
    }
    
    .ds-3 {
      font-size: 36px;
      line-height: 1.3;
      font-weight: 700;
    }
    
    /* Fix for section spacing */
    .pt-120 {
      padding-top: 120px;
    }
    
    .pb-80 {
      padding-bottom: 80px;
    }
    
    /* Section padding */
    .section-padding {
      padding: 80px 0;
    }
    
    .section-team-1 {
      padding: 80px 0;
      width: 100%;
      overflow: visible;
      display: block;
    }
    
    .section-project-2 {
      padding: 80px 0;
      width: 100%;
      overflow: visible;
      display: block;
    }
    
    /* Text alignment */
    .text-start {
      text-align: left;
    }
    
    .text-center {
      text-align: center;
    }
    
    /* Z-index */
    .z-1 {
      z-index: 1;
    }
    
    .z-0 {
      z-index: 0;
    }
    
    .z-2 {
      z-index: 2;
    }
    
    /* Project card styles */
    .card-team {
      margin-bottom: 0;
      background-color: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(5px);
    }
    
    .filter-item {
      transition: all 0.3s ease;
    }
    
    /* Buttons and badges */
    .btn {
      display: inline-block;
      font-weight: 500;
      text-align: center;
      vertical-align: middle;
      user-select: none;
      border: 1px solid transparent;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      line-height: 1.5;
      border-radius: 0.25rem;
      transition: all 0.15s ease-in-out;
      cursor: pointer;
    }
    
    .btn-gradient {
      background: linear-gradient(90deg, #6342EC 0%, #BA3FDA 100%);
      color: white;
      border: none;
    }
    
    .btn-filter {
      background-color: transparent;
      border: 1px solid #e0e0e0;
      color: #666;
      font-size: 0.875rem;
      padding: 0.5rem 1rem;
    }
    
    .btn-filter.active {
      background-color: #6342EC;
      color: white;
      border-color: #6342EC;
    }
    
    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 700;
      line-height: 1;
      text-align: center;
      white-space: nowrap;
      vertical-align: baseline;
      border-radius: 0.25rem;
    }
    
    /* Animation effects */
    .rotate-center {
      animation: rotate 15s linear infinite;
    }
    
    .rotate-center-rev {
      animation: rotate-rev 15s linear infinite;
    }
    
    @keyframes rotate {
      0% {
        transform: rotate(0);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    
    @keyframes rotate-rev {
      0% {
        transform: rotate(0);
      }
      100% {
        transform: rotate(-360deg);
      }
    }
    
    .hover-up {
      transition: transform 0.3s ease;
    }
    
    .hover-up:hover {
      transform: translateY(-5px);
    }
    
    .zoom-img {
      overflow: hidden;
    }
    
    .zoom-img img {
      transition: transform 0.5s ease;
    }
    
    .zoom-img:hover img {
      transform: scale(1.05);
    }
    
    /* Project swiper */
    .swiper {
      width: 100%;
      overflow: visible;
    }
    
    .swiper-button-next,
    .swiper-button-prev {
      width: 40px !important;
      height: 40px !important;
      background: white;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      color: #333 !important;
    }
    
    .swiper-button-next:after,
    .swiper-button-prev:after {
      font-size: 18px !important;
    }
    
    /* Fix for ellipses */
    .ellipse-rotate-success, .ellipse-rotate-primary {
      width: 300px;
      height: 300px;
      border-radius: 50%;
      opacity: 0.2;
      position: absolute;
    }
    
    .ellipse-rotate-success {
      background-color: #28a745;
      top: 20%;
      left: 10%;
    }
    
    .ellipse-rotate-primary {
      background-color: #6342EC;
      bottom: 20%;
      right: 10%;
    }
  `}</style>
);

export default function ProjectPreview() {
  const [projectData, setProjectData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [Component, setComponent] = useState<React.ReactNode>(null);

  // Initialize AOS for animations if needed
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
          
          console.log("AOS initialized in project preview");
        }
      } catch (error) {
        console.error("Error initializing AOS:", error);
      }
    };
    
    loadAOS();
  }, []);

  // Get query params for preview data
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const projectDataParam = searchParams.get("projectData");

    if (projectDataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(projectDataParam));
        console.log("Received project data:", decodedData);
        setProjectData(decodedData);
      } catch (error) {
        console.error("Error parsing project data:", error);
      }
    } else {
      // If no data passed, fetch from API
      fetchProjectData();
    }

    setIsLoading(false);

    // Notify parent that preview is ready
    if (window.parent) {
      window.parent.postMessage(
        { type: "PREVIEW_READY", message: "Project preview is ready" },
        "*"
      );
    }
  }, []);

  // Fetch project data from API
  const fetchProjectData = async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/project?t=${timestamp}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProjectData(data);
      } else {
        console.error("Error fetching project data:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

  // Move the component rendering logic to a top-level useEffect
  useEffect(() => {
    if (!projectData) return;
    
    const activeComponent = projectData.activeProject || "services5";
    
    if (typeof window !== 'undefined') {
      if (activeComponent === "services5") {
        setComponent(<Services5 previewData={projectData} />);
      } else if (activeComponent === "project2") {
        setComponent(<Project2 previewData={projectData} />);
      } else {
        setComponent(<div>Unknown component type: {activeComponent}</div>);
      }
    }
  }, [projectData]);

  // Render the appropriate component
  const renderProjectComponent = () => {
    if (!projectData) return <div>Loading...</div>;
    return Component;
  };

  return (
    <>
      <CommonStyles />
      <Script
        id="notify-parent"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.onload = function() {
              if (window.parent) {
                window.parent.postMessage(
                  { type: "PREVIEW_UPDATED", message: "Project preview updated" },
                  "*"
                );
              }
            };
          `,
        }}
      />
      
      {/* Bootstrap JS */}
      <Script 
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
        strategy="afterInteractive"
      />
      
      {isLoading ? <div>Loading...</div> : renderProjectComponent()}
    </>
  );
} 