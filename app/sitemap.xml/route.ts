import { NextResponse } from 'next/server';
import { store } from '@/redux/store';
import { getGeneral } from '@/redux/actions/generalActions';
import { getAllBlogs } from '@/redux/actions/blogActions';
import { getAllHizmetler } from '@/redux/actions/hizmetActions';
import { slugify } from '@/utils/slugify';

// Function to generate sitemap XML
async function generateSitemapXml() {
  // Initialize store and fetch data
  await store.dispatch(getGeneral());
  await store.dispatch(getAllBlogs());
  await store.dispatch(getAllHizmetler());
  
  const state = store.getState();
  const general = state.general.general;
  const blogs = state.blog.blogs || [];
  const hizmetler = state.hizmet.hizmetler || [];
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wordpress-clone.com';
  
  // Get sitemap settings if available
  const sitemapSettings = general?.seo?.sitemap || {
    excludeUrls: [],
    additionalUrls: [],
    changeFrequencies: {
      homepage: "daily",
      pages: "weekly",
      posts: "monthly"
    },
    priorities: {
      homepage: 1.0,
      pages: 0.8,
      posts: 0.7
    }
  };
  
  // Start XML content
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add homepage
  xml += `  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${sitemapSettings.changeFrequencies.homepage}</changefreq>
    <priority>${sitemapSettings.priorities.homepage}</priority>
  </url>\n`;
  
  // Add SEO pages from general settings
  if (general?.seo?.pages) {
    general.seo.pages.forEach((page: any) => {
      // Skip excluded URLs
      if (page.url && page.url !== '/' && !sitemapSettings.excludeUrls.includes(page.url)) {
        xml += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastUpdated || new Date().toISOString()}</lastmod>
    <changefreq>${sitemapSettings.changeFrequencies.pages}</changefreq>
    <priority>${sitemapSettings.priorities.pages}</priority>
  </url>\n`;
      }
    });
  }
  
  // Add blog posts
  if (blogs && blogs.length > 0) {
    blogs.forEach((blog: any) => {
      const slug = slugify(blog.title);
      const url = `/${slug}`;
      
      // Skip excluded URLs
      if (!sitemapSettings.excludeUrls.includes(url)) {
        const lastmod = blog.updatedAt || blog.date || new Date().toISOString();
        
        xml += `  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${sitemapSettings.changeFrequencies.posts}</changefreq>
    <priority>${sitemapSettings.priorities.posts}</priority>
  </url>\n`;
      }
    });
  }
  
  // Add services/hizmetler
  if (hizmetler && hizmetler.length > 0) {
    hizmetler.forEach((hizmet: any) => {
      const slug = slugify(hizmet.title);
      const url = `/${slug}`;
      
      // Skip excluded URLs
      if (!sitemapSettings.excludeUrls.includes(url)) {
        const lastmod = hizmet.updatedAt || new Date().toISOString();
        
        xml += `  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${sitemapSettings.changeFrequencies.posts}</changefreq>
    <priority>${sitemapSettings.priorities.posts}</priority>
  </url>\n`;
      }
    });
  }
  
  // Add additional URLs from settings
  if (sitemapSettings.additionalUrls && sitemapSettings.additionalUrls.length > 0) {
    sitemapSettings.additionalUrls.forEach((urlObj: any) => {
      xml += `  <url>
    <loc>${baseUrl}${urlObj.url}</loc>
    <lastmod>${urlObj.lastmod || new Date().toISOString()}</lastmod>
    <changefreq>${urlObj.changefreq || sitemapSettings.changeFrequencies.pages}</changefreq>
    <priority>${urlObj.priority || sitemapSettings.priorities.pages}</priority>
  </url>\n`;
    });
  }
  
  // Close XML
  xml += '</urlset>';
  
  return xml;
}

// Route handler for sitemap.xml
export async function GET() {
  try {
    const xml = await generateSitemapXml();
    
    // Return XML response
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
} 