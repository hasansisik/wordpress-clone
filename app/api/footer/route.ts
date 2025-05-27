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
      copyright: data.copyright || "Copyright © 2024 Infinia. All Rights Reserved",
      description: data.description || "You may also realize cost savings from your energy efficient choices in your custom home.",
      socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks.map((item: any, index: number) => ({
        _id: item._id || `social-${index}`,
        name: item.name || "Social Link",
        link: item.link || "#",
        order: typeof item.order === 'number' ? item.order : index
      })) : [],
      columns: Array.isArray(data.columns) ? data.columns.map((column: any, index: number) => ({
        _id: column._id || `column-${index}`,
        title: column.title || "Menu",
        order: typeof column.order === 'number' ? column.order : index,
        links: Array.isArray(column.links) ? column.links.map((link: any, linkIndex: number) => ({
          _id: link._id || `link-${linkIndex}`,
          name: link.name || "Link",
          link: link.link || "#",
          order: typeof link.order === 'number' ? link.order : linkIndex
        })) : []
      })) : [],
      contactItems: {
        address: data.contactItems?.address || "0811 Erdman Prairie, Joaville CA",
        phone: data.contactItems?.phone || "+01 (24) 568 900",
        email: data.contactItems?.email || "contact@infinia.com",
        hours: data.contactItems?.hours || "Mon-Fri: 9am-5pm"
      },
      instagramPosts: Array.isArray(data.instagramPosts) ? data.instagramPosts : [],
      appLinks: Array.isArray(data.appLinks) ? data.appLinks : [],
      showAppLinks: typeof data.showAppLinks === 'boolean' ? data.showAppLinks : false,
      showInstagram: typeof data.showInstagram === 'boolean' ? data.showInstagram : false,
      showPrivacyLinks: typeof data.showPrivacyLinks === 'boolean' ? data.showPrivacyLinks : true,
      showSocialLinks: typeof data.showSocialLinks === 'boolean' ? data.showSocialLinks : true,
      privacyLinks: Array.isArray(data.privacyLinks) ? data.privacyLinks.map((item: any, index: number) => ({
        _id: item._id || `privacy-${index}`,
        name: item.name || "Privacy Link",
        link: item.link || "#",
        order: typeof item.order === 'number' ? item.order : index
      })) : [],
      footerComponent: data.footerComponent || "Footer1"
    };
    
    try {
      // Update the MongoDB model via the server API
      const response = await axios.put(`${server}/footer`, safeData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Footer data saved successfully',
        data: response.data.footer 
      });
    } catch (error) {
      console.error('Failed to update server via API:', error);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to update footer data in database'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error saving footer data:', error);
    return NextResponse.json({ success: false, message: 'Failed to save footer data' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Get data from MongoDB via server API
    const response = await axios.get(`${server}/footer`);
    
    if (response.data && response.data.footer) {
      return NextResponse.json(response.data.footer);
    } else {
      throw new Error('Invalid response from server API');
    }
  } catch (error) {
    console.error('Error fetching footer data from server:', error);
    
    // Return default data structure if server API fails
    const defaultData = {
      logo: {
        src: "/assets/imgs/template/favicon.svg",
        alt: "infinia",
        text: "Infinia"
      },
      copyright: "Copyright © 2024 Infinia. All Rights Reserved",
      description: "You may also realize cost savings from your energy efficient choices in your custom home.",
      socialLinks: [
        {
          _id: "1",
          name: "Facebook",
          link: "https://www.facebook.com/",
          order: 0
        },
        {
          _id: "2",
          name: "Twitter",
          link: "https://twitter.com/",
          order: 1
        },
        {
          _id: "3",
          name: "LinkedIn",
          link: "https://www.linkedin.com/",
          order: 2
        },
        {
          _id: "4",
          name: "Instagram",
          link: "https://www.instagram.com/",
          order: 3
        }
      ],
      columns: [
        {
          _id: "1",
          title: "Company",
          order: 0,
          links: [
            {
              _id: "1",
              name: "Mission & Vision",
              link: "#",
              order: 0
            },
            {
              _id: "2",
              name: "Our Team",
              link: "#",
              order: 1
            },
            {
              _id: "3",
              name: "Careers",
              link: "#",
              order: 2
            }
          ]
        },
        {
          _id: "2",
          title: "Resource",
          order: 1,
          links: [
            {
              _id: "1",
              name: "Knowledge Base",
              link: "#",
              order: 0
            },
            {
              _id: "2",
              name: "Documents",
              link: "#",
              order: 1
            }
          ]
        }
      ],
      contactItems: {
        address: "0811 Erdman Prairie, Joaville CA",
        phone: "+01 (24) 568 900",
        email: "contact@infinia.com",
        hours: "Mon-Fri: 9am-5pm"
      },
      instagramPosts: [],
      appLinks: [],
      showAppLinks: false,
      showInstagram: false,
      showPrivacyLinks: true,
      showSocialLinks: true,
      privacyLinks: [
        {
          _id: "1",
          name: "Privacy policy",
          link: "#",
          order: 0
        },
        {
          _id: "2",
          name: "Cookies",
          link: "#",
          order: 1
        },
        {
          _id: "3",
          name: "Terms of service",
          link: "#",
          order: 2
        }
      ],
      footerComponent: "Footer1"
    };
    
    return NextResponse.json(defaultData);
  }
} 