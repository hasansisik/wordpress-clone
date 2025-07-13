"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Script from "next/script";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { 
  generateOrganizationSchema, 
  generateWebPageSchema, 
  generateBlogPostingSchema,
  generateItemListSchema
} from "@/lib/schema";

interface SchemaMarkupProps {
  isHomePage?: boolean;
  isBlogPost?: boolean;
  blogData?: {
    title: string;
    description: string;
    image: string;
    author: string;
    datePublished: string;
    dateModified?: string;
    content: string;
  };
  contentItems?: { name: string; url: string }[];
}

export default function SchemaMarkup({
  isHomePage = false,
  isBlogPost = false,
  blogData,
  contentItems
}: SchemaMarkupProps) {
  const pathname = usePathname();
  const { general } = useSelector((state: RootState) => state.general);
  const [schemas, setSchemas] = useState<string[]>([]);
  
  useEffect(() => {
    if (!general) return;
    
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://wordpress-clone.com';
    const currentPageUrl = pathname || '/';
    const schemaSettings = general.seo?.schema;
    
    // Find SEO data for current page
    let title = general.siteName || 'WordPress Clone';
    let description = general.siteDescription || 'Modern CMS Solution';
    let lastModified = new Date().toISOString();
    
    // Try to find page-specific SEO data
    if (general.seo && general.seo.pages) {
      const currentPage = general.seo.pages.find((page: any) => page.url === currentPageUrl);
      if (currentPage) {
        title = currentPage.title;
        description = currentPage.description;
        lastModified = currentPage.lastUpdated;
      } else if (general.seo.general) {
        // Use general SEO data if page-specific not found
        title = general.seo.general.title;
        description = general.seo.general.description;
      }
    }
    
    // Generate schemas
    const schemaArray = [];
    
    // WebPage schema for all pages if enabled
    if (!schemaSettings || schemaSettings.enableWebPageSchema !== false) {
      const webPageSchema = generateWebPageSchema(currentPageUrl, title, description, lastModified);
      schemaArray.push(webPageSchema);
    }
    
    // Organization schema for homepage
    if (isHomePage) {
      const organizationSchema = generateOrganizationSchema();
      schemaArray.push(organizationSchema);
    }
    
    // BlogPosting schema for blog posts if enabled
    if (isBlogPost && blogData && (!schemaSettings || schemaSettings.enableBlogPostingSchema !== false)) {
      const blogPostingSchema = generateBlogPostingSchema(
        blogData.title,
        blogData.description,
        blogData.image,
        blogData.author,
        blogData.datePublished,
        blogData.dateModified,
        blogData.content,
        currentPageUrl
      );
      schemaArray.push(blogPostingSchema);
    }
    
    // ItemList schema for content map/table of contents if enabled
    if (contentItems && contentItems.length > 0 && (!schemaSettings || schemaSettings.enableItemListSchema !== false)) {
      const itemListSchema = generateItemListSchema(contentItems);
      schemaArray.push(itemListSchema);
    }
    
    // Convert schemas to strings
    setSchemas(schemaArray.map(schema => JSON.stringify(schema)));
    
  }, [general, pathname, isHomePage, isBlogPost, blogData, contentItems]);
  
  if (schemas.length === 0) return null;
  
  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={`schema-${index}`}
          id={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema }}
        />
      ))}
    </>
  );
} 