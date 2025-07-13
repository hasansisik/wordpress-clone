import { NextResponse } from 'next/server';
import { store } from '@/redux/store';
import { getGeneral } from '@/redux/actions/generalActions';

// Function to generate robots.txt content
async function generateRobotsTxt() {
  // Initialize store and fetch general settings
  await store.dispatch(getGeneral());
  const state = store.getState();
  const general = state.general.general;
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wordpress-clone.com';
  
  // Get robots.txt settings if available
  const robotsSettings = general?.seo?.robotsTxt || {
    customRules: "",
    enableDefaultRules: true
  };
  
  let robotsTxt = `# robots.txt for ${baseUrl}\n`;
  
  // Add default rules if enabled
  if (robotsSettings.enableDefaultRules !== false) {
    robotsTxt += `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin and dashboard paths
User-agent: *
Disallow: /dashboard/
Disallow: /api/
Disallow: /giris/
Disallow: /kayit/
Disallow: /sifremi-unuttum/
Disallow: /sifre-sifirla/
Disallow: /mail-dogrulama/
`;
  }

  // Add custom rules if provided
  if (robotsSettings.customRules) {
    robotsTxt += `
# Custom rules
${robotsSettings.customRules}
`;
  }

  return robotsTxt;
}

// Route handler for robots.txt
export async function GET() {
  try {
    const robotsTxt = await generateRobotsTxt();
    
    // Return text response
    return new NextResponse(robotsTxt, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    
    // Return a default robots.txt in case of error
    const defaultRobotsTxt = `User-agent: *
Allow: /
Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://wordpress-clone.com'}/sitemap.xml`;
    
    return new NextResponse(defaultRobotsTxt, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
} 