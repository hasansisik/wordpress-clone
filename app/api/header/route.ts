import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { server } from '@/config';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Path to header.json file (for backward compatibility)
    const filePath = path.join(process.cwd(), 'data', 'header.json');
    
    // Ensure all required properties exist
    const safeData = {
      logo: {
        src: data.logo?.src || "/assets/imgs/template/favicon.svg",
        alt: data.logo?.alt || "infinia",
        text: data.logo?.text || "Infinia"
      },
      links: {
        freeTrialLink: {
          href: data.links?.freeTrialLink?.href || "#",
          text: data.links?.freeTrialLink?.text || "Join For Free Trial"
        }
      },
      mainMenu: Array.isArray(data.mainMenu) ? data.mainMenu.map((item, index) => ({
        _id: item._id || `menu-${index}`,
        name: item.name || "Menu Item",
        link: item.link || "#",
        order: typeof item.order === 'number' ? item.order : index
      })) : [],
      socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks.map((item, index) => ({
        _id: item._id || `social-${index}`,
        name: item.name || "Social Link",
        link: item.link || "#",
        order: typeof item.order === 'number' ? item.order : index
      })) : [],
      topBarItems: Array.isArray(data.topBarItems) ? data.topBarItems.map((item, index) => ({
        _id: item._id || `topbar-${index}`,
        name: item.name || "Info Item",
        content: item.content || "",
        order: typeof item.order === 'number' ? item.order : index
      })) : [],
      showDarkModeToggle: typeof data.showDarkModeToggle === 'boolean' ? data.showDarkModeToggle : true,
      showActionButton: typeof data.showActionButton === 'boolean' ? data.showActionButton : true,
      actionButtonText: data.actionButtonText || "Join For Free Trial",
      actionButtonLink: data.actionButtonLink || "#",
      headerComponent: data.headerComponent || "Header1"
    };
    
    // Update the server via API
    try {
      // Server-side API call - tokens need to be handled client-side in a different way
      await axios.put(`${server}/header`, safeData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.warn('Failed to update server via API, using local file instead:', error);
    }
    
    // Convert data to a JSON string for local file (backup)
    const jsonData = JSON.stringify(safeData, null, 2);
    
    // Use async fs for better compatibility with development server
    await fs.writeFile(filePath, jsonData, 'utf8');
    
    // Add a small delay to ensure the file is written and picked up by the file watcher
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Header data saved successfully',
      data: safeData 
    });
  } catch (error) {
    console.error('Error saving header data:', error);
    return NextResponse.json({ success: false, message: 'Failed to save header data' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Try to get data from server API first
    try {
      // Server-side API call
      const response = await axios.get(`${server}/header`);
      if (response.data && response.data.header) {
        return NextResponse.json(response.data.header);
      }
    } catch (error) {
      console.warn('Failed to fetch header from server API, falling back to local file:', error);
    }
    
    // Fallback to local file if server API fails
    // Path to header.json file
    const filePath = path.join(process.cwd(), 'data', 'header.json');
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (e) {
      // Create a default header data structure if the file doesn't exist
      const defaultData = {
        logo: {
          src: "/assets/imgs/template/favicon.svg",
          alt: "infinia",
          text: "Infinia"
        },
        links: {
          freeTrialLink: {
            href: "#",
            text: "Join For Free Trial"
          }
        },
        mainMenu: [
          { _id: "1", name: "Home", link: "/", order: 0 },
          { _id: "2", name: "About", link: "/about", order: 1 },
          { _id: "3", name: "Services", link: "/services", order: 2 },
          { _id: "4", name: "Blog", link: "/blog", order: 3 },
          { _id: "5", name: "Contact", link: "/contact", order: 4 }
        ],
        socialLinks: [],
        topBarItems: [],
        showDarkModeToggle: true,
        showActionButton: true,
        actionButtonText: "Join For Free Trial",
        actionButtonLink: "#",
        headerComponent: "Header1"
      };
      
      await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
      return NextResponse.json(defaultData);
    }
    
    // Read the file
    const fileData = await fs.readFile(filePath, 'utf8');
    
    // Parse the JSON data
    const data = JSON.parse(fileData);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading header data:', error);
    return NextResponse.json({ success: false, message: 'Failed to read header data' }, { status: 500 });
  }
} 