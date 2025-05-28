import { Suspense } from "react";
import { server } from "@/config";
import Hero1 from "@/components/sections/Hero1";
import Cta4 from "@/components/sections/Cta4";
import Services2 from "@/components/sections/Services2";
import Faqs1 from "@/components/sections/Faqs1";
import Faqs2 from "@/components/sections/Faqs2";
import Faqs3 from "@/components/sections/Faqs3";
import Hero3 from "@/components/sections/Hero3";
import Cta1 from "@/components/sections/Cta1";
import Cta3 from "@/components/sections/Cta3";
import Services5 from "@/components/sections/Services5";
import Contact1 from "@/components/sections/Contact1";
import Project2 from "@/components/sections/Project2";
import Blog1 from "@/components/sections/Blog1";
import Blog2 from "@/components/sections/Blog2";
import Blog3 from "@/components/sections/Blog3";
import Blog5 from "@/components/sections/Blog5";

// Define section type
interface Section {
  id: string;
  name: string;
  type: keyof typeof sectionComponents;
  description?: string;
}

// Map section types to components
const sectionComponents = {
  Hero1,
  Hero3,
  Cta1,
  Cta4,
  Cta3,
  Services2,
  Services5,
  Faqs1,
  Faqs2,
  Faqs3,
  Contact1,
  Project2,
  Blog1,
  Blog2,
  Blog3,
  Blog5,
};

// Fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
}

// Component to render dynamic sections
async function PageSections() {
  try {
    // Fetch page data from API
    const response = await fetch(`${server}/page/home`, {
      next: { revalidate: 10 },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch page data: ${response.status}`);
    }
    
    const data = await response.json();

    if (!data || !data.page || !data.page.sections) {
      // Fallback to default sections if no data
      return (
        <>
          <Hero1 />
          <Cta4 />
          <Services2 />
          <Faqs2 />
        </>
      );
    }

    // Render sections from database
    return (
      <>
        {data.page.sections.map((section: Section) => {
          const SectionComponent =
            sectionComponents[section.type as keyof typeof sectionComponents];
          return SectionComponent ? <SectionComponent key={section.id} /> : null;
        })}
      </>
    );
  } catch (error) {
    console.error("Error loading page data:", error);
    // Fallback to default sections if error
    return (
      <>
        <Hero1 />
        <Cta4 />
        <Services2 />
        <Faqs2 />
      </>
    );
  }
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PageSections />
    </Suspense>
  );
}
