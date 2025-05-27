import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { server } from '@/config';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
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
      mainMenu: Array.isArray(data.mainMenu) ? data.mainMenu.map((item: any, index: number) => ({
        _id: item._id || `menu-${index}`,
        name: item.name || "Menu Item",
        link: item.link || "#",
        order: typeof item.order === 'number' ? item.order : index
      })) : [],
      socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks.map((item: any, index: number) => ({
        _id: item._id || `social-${index}`,
        name: item.name || "Social Link",
        link: item.link || "#",
        order: typeof item.order === 'number' ? item.order : index
      })) : [],
      topBarItems: Array.isArray(data.topBarItems) ? data.topBarItems.map((item: any, index: number) => ({
        _id: item._id || `topbar-${index}`,
        name: item.name || "Info Item",
        content: item.content || "",
        order: typeof item.order === 'number' ? item.order : index
      })) : [],
      showDarkModeToggle: typeof data.showDarkModeToggle === 'boolean' ? data.showDarkModeToggle : true,
      showActionButton: typeof data.showActionButton === 'boolean' ? data.showActionButton : true,
      actionButtonText: data.actionButtonText || "Join For Free Trial",
      actionButtonLink: data.actionButtonLink || "#",
      headerComponent: data.headerComponent || "Header1",
      workingHours: data.workingHours || "Mon-Fri: 10:00am - 09:00pm",
      topBarColor: data.topBarColor || "#3b71fe"
    };
    
    try {
      // Update the MongoDB model via the server API
      const response = await axios.put(`${server}/header`, safeData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Header data saved successfully',
        data: response.data.header 
      });
    } catch (error) {
      console.error('Failed to update server via API:', error);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to update header data in database'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error saving header data:', error);
    return NextResponse.json({ success: false, message: 'Failed to save header data' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Get data from MongoDB via server API
    const response = await axios.get(`${server}/header`);
    
    if (response.data && response.data.header) {
      return NextResponse.json(response.data.header);
    } else {
      throw new Error('Invalid response from server API');
    }
  } catch (error) {
    console.error('Error fetching header data from server:', error);
    
    // Return default data structure if server API fails
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
      headerComponent: "Header1",
      workingHours: "Mon-Fri: 10:00am - 09:00pm",
      topBarColor: "#3b71fe"
    };
    
    return NextResponse.json(defaultData);
  }
} 