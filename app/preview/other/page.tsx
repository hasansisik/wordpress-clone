"use client";

import { useEffect, useState } from "react";
import Blog1 from "@/components/sections/Blog1";
import Blog2 from "@/components/sections/Blog2";
import Blog3 from "@/components/sections/Blog3";
import Blog5 from "@/components/sections/Blog5";
import Contact1 from "@/components/sections/Contact1";
import Script from "next/script";

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
    
    .section-blog-1, .section-blog-2, .section-blog-6, .section-blog-8, .section-contact-3 {
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
    
    /* Card styles */
    .card {
      margin-bottom: 1.5rem;
      width: 100%;
      background-color: #fff;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      display: block;
    }
    
    .card-body {
      padding: 1.25rem;
      width: 100%;
    }
    
    .card-body p {
      margin-top: 0.5rem;
      margin-bottom: 0;
    }
    
    /* Fix for card images */
    .card img.rounded-3, .card img.rounded-top-3 {
      width: 100%;
      height: auto;
      object-fit: cover;
    }
    
    /* Animation */
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
    
    /* Fix for contact form */
    .section-contact-3 form {
      width: 100%;
      margin-bottom: 2rem;
    }
    
    .section-contact-3 .row {
      display: flex;
      flex-wrap: wrap;
    }
    
    .section-contact-3 .col-lg-6 {
      flex: 0 0 100%;
      max-width: 100%;
    }
    
    @media (min-width: 992px) {
      .section-contact-3 .col-lg-6 {
        flex: 0 0 50%;
        max-width: 50%;
      }
    }
    
    .section-contact-3 .input-group {
      margin-bottom: 1rem;
    }
    
    /* Fix spacing in all sections */
    .section-blog-1 .container, 
    .section-blog-2 .container, 
    .section-blog-6 .container, 
    .section-blog-8 .container, 
    .section-contact-3 .container {
      max-width: 1140px;
      margin-left: auto;
      margin-right: auto;
      padding-left: 15px;
      padding-right: 15px;
    }
    
    /* Proper spacing for article cards */
    .section-blog-1 .card, 
    .section-blog-2 .card, 
    .section-blog-6 .card, 
    .section-blog-8 .card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .section-blog-1 .card-body, 
    .section-blog-2 .card-body, 
    .section-blog-6 .card-body, 
    .section-blog-8 .card-body {
      flex: 1 1 auto;
    }
    
    /* Swiper fixes */
    .swiper-slide {
      height: auto;
    }
    
    /* Global section fixes */
    section {
      width: 100%;
      overflow: hidden;
      position: relative;
    }
    
    /* Fix for blog badges */
    .bg-primary-soft {
      display: inline-block;
      padding: 0.25rem 0.75rem;
    }
    
    /* Fix for contact form elements */
    .form-check {
      position: relative;
      padding-left: 1.25rem;
      margin-bottom: 1rem;
    }
    
    .form-check-input {
      position: absolute;
      margin-top: 0.25rem;
      margin-left: -1.25rem;
    }
    
    .form-check-label {
      margin-bottom: 0;
    }
    
    .btn {
      display: inline-block;
      font-weight: 500;
      text-align: center;
      vertical-align: middle;
      user-select: none;
      border: 1px solid transparent;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      line-height: 1.5;
      border-radius: 0.25rem;
      transition: all 0.15s ease-in-out;
      cursor: pointer;
    }
    
    .bg-primary {
      background-color: #6342EC !important;
    }
    
    .text-white {
      color: #fff !important;
    }
    
    .hover-up:hover {
      transform: translateY(-3px);
    }
    
    /* Fix for social icons layout */
    .socials {
      display: inline-flex;
      align-items: center;
    }
    
    .socials ul {
      display: flex;
      margin: 0;
      padding: 0;
    }
    
    .socials li {
      margin-left: 0.5rem;
      list-style: none;
    }
    
    /* Better heading styles */
    h3, h4, h5, h6 {
      margin-top: 0;
      line-height: 1.2;
    }
    
    h6 {
      font-size: 1rem;
      font-weight: 700;
    }
    
    /* Fix article link positioning */
    .position-absolute.bottom-0.start-0.end-0.top-0 {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }
    
    /* Basic form elements */
    .input-group {
      display: flex;
      width: 100%;
    }
    
    .icon-input {
      padding: 0.75rem;
    }
    
    .form-control {
      display: block;
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      line-height: 1.5;
      background-color: #fff;
      border: 1px solid #ced4da;
    }
    
    /* Better spacing for rows */
    .row > * {
      margin-bottom: 1.5rem;
    }
    
    /* Fix for swiper slider */
    .swiper {
      width: 100%;
      overflow: hidden;
    }
    
    /* Fix for ellipses */
    .ellipse-rotate-success, .ellipse-rotate-primary, .ellipse-rotate-info {
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
    
    .ellipse-rotate-info {
      background-color: #17a2b8;
      bottom: 30%;
      left: 30%;
    }
    
    /* Additional fixes to ensure proper full-width layout */
    html, body {
      min-height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }
    
    section {
      width: 100vw;
      max-width: 100%;
      margin: 0;
      padding: 80px 0;
      box-sizing: border-box;
    }
    
    img {
      max-width: 100%;
      height: auto;
    }
    
    /* Reset default margins */
    p {
      margin-top: 0;
      margin-bottom: 1rem;
    }
    
    /* Clear floating elements */
    .clearfix::after {
      display: block;
      clear: both;
      content: "";
    }
    
    /* Fix for contact section */
    .section-contact-3 {
      width: 100vw;
      max-width: 100%;
      overflow: hidden;
    }
    
    /* Fix for article cards to use full width */
    .section-blog-1 .col-lg-4, 
    .section-blog-2 .col-lg-4, 
    .section-blog-3 .col-lg-4, 
    .section-blog-5 .col-lg-4,
    .section-blog-6 .col-lg-4, 
    .section-blog-8 .col-lg-4 {
      width: 100%;
      max-width: 100%;
    }
    
    @media (min-width: 992px) {
      .section-blog-1 .col-lg-4, 
      .section-blog-2 .col-lg-4, 
      .section-blog-3 .col-lg-4, 
      .section-blog-5 .col-lg-4,
      .section-blog-6 .col-lg-4, 
      .section-blog-8 .col-lg-4 {
        flex: 0 0 33.333333%;
        max-width: 33.333333%;
      }
    }
  `}</style>
);

export default function OtherPreview() {
  const [otherData, setOtherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get query params for preview data
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const otherDataParam = searchParams.get("otherData");

    if (otherDataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(otherDataParam));
        console.log("Received other data:", decodedData);
        setOtherData(decodedData);
      } catch (error) {
        console.error("Error parsing other data:", error);
      }
    } else {
      // If no data passed, fetch from API
      fetchOtherData();
    }

    setIsLoading(false);

    // Notify parent that preview is ready
    if (window.parent) {
      window.parent.postMessage(
        { type: "PREVIEW_READY", message: "Other preview is ready" },
        "*"
      );
    }
  }, []);

  // Fetch other data from API
  const fetchOtherData = async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/other?t=${timestamp}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOtherData(data);
      } else {
        console.error("Error fetching other data:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching other data:", error);
    }
  };

  // Render the appropriate component
  const renderOtherComponent = () => {
    if (!otherData) return <div>Loading...</div>;

    const activeComponent = otherData.activeOther || "blog1";

    console.log("Rendering other component:", activeComponent);
    
    switch(activeComponent) {
      case "blog1":
        return <Blog1 previewData={otherData} />;
      case "blog2":
        return <Blog2 previewData={otherData} />;
      case "blog3":
        return <Blog3 previewData={otherData} />;
      case "blog5":
        return <Blog5 previewData={otherData} />;
      case "contact1":
        return <Contact1 previewData={otherData} />;
      default:
        return <div>Unknown component type: {activeComponent}</div>;
    }
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
                  { type: "PREVIEW_UPDATED", message: "Other preview updated" },
                  "*"
                );
              }
            };
          `,
        }}
      />
      {isLoading ? <div>Loading...</div> : renderOtherComponent()}
    </>
  );
} 