import { Metadata } from "next"
import SlugPageClient from './SlugPageClient';

// Type definitions
export interface BlogPost {
  id: number;
  _id?: string;
  title: string;
  description: string;
  image: string;
  content: {
    intro: string;
    readTime: string;
    author: {
      name: string;
      avatar: string;
      date: string;
    };
    mainImage: string;
    fullContent: string;
  };
  category: string[];
  author: string;
  date: string;
}

export interface Project {
  id: number;
  _id?: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
  company: string;
  subtitle: string;
  fullDescription: string;
  tag: string;
  content: {
    intro: string;
    readTime: string;
    author: {
      name: string;
      avatar: string;
      date: string;
    };
    mainImage: string;
    fullContent: string;
  };
}

// Function to convert title to slug (same function used in components)
export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
};

// Fetch blogs from API endpoint
const fetchBlogs = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/local-blogs`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
};

// Fetch projects from API endpoint
const fetchProjects = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/local-projects`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.status}`);
    }
    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

// Generate dynamic metadata for each page
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
  // Properly await the params before accessing properties
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;
  
  try {
    // Fetch blog and project data from API endpoints
    const blogData = await fetchBlogs();
    const projectData = await fetchProjects();
    
    // Find the content by slugified title in either data set
    const blogPost = blogData.find((post: BlogPost) => slugify(post.title) === slug);
    const project = projectData.find((proj: Project) => slugify(proj.title) === slug);
    
    // If we have a blog post
    if (blogPost) {
      return {
        title: `${blogPost.title} | WordPress Clone Blog`,
        description: blogPost.description,
        keywords: blogPost.category.join(', '),
        openGraph: {
          title: blogPost.title,
          description: blogPost.description,
          images: [blogPost.image],
          type: 'article',
        },
      };
    }
    
    // If we have a project
    if (project) {
      return {
        title: `${project.title} | WordPress Clone Projects`,
        description: project.description,
        keywords: project.categories.join(', '),
        openGraph: {
          title: project.title,
          description: project.description,
          images: [project.image],
          type: 'article',
        },
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }
  
  // Default metadata if not found
  return {
    title: "Content Not Found | WordPress Clone",
    description: "The requested content could not be found.",
  };
}

export default async function SlugPage({ 
  params 
}: { 
  params: { slug: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // Properly await the params before accessing properties
  const resolvedParams = await Promise.resolve(params);
  
  // Pass the slug to the client component
  return <SlugPageClient slug={resolvedParams.slug} />;
}
