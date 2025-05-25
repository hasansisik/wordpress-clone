import { Metadata } from "next"
import { getSeoData } from "@/lib/seo"
import Layout from "@/components/layout/Layout"
import { notFound } from "next/navigation"
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import parse from 'html-react-parser';

// Type definitions
interface BlogPost {
  id: number;
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

interface Project {
  id: number;
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

// Helper function to read JSON data
function readJsonData(filePath: string) {
  const fullPath = path.join(process.cwd(), filePath);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(fileContents);
}

// Function to convert title to slug (same function used in components)
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
};

type Props = {
  params: { slug: string }
}

// Generate dynamic metadata for each page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Ensure params is properly awaited by using Promise.resolve
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;
  
  try {
    // Try to find in blog data
    let blogData: BlogPost[] = [];
    try {
      blogData = readJsonData('data/blog.json');
    } catch (error) {
      console.error('Failed to load blog data:', error);
    }
    
    // Try to find in project data
    let projectData: Project[] = [];
    try {
      const projectsJson = readJsonData('data/projects.json');
      projectData = projectsJson.projects;
    } catch (error) {
      console.error('Failed to load project data:', error);
    }
    
    // Find the content by slugified title in either data set
    const blogPost = blogData.find(post => slugify(post.title) === slug);
    const project = projectData.find(proj => slugify(proj.title) === slug);
    
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

export default async function SlugPage({ params }: Props) {
  // Ensure params is properly awaited by using Promise.resolve
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;
  
  // Try to find in blog data
  let blogData: BlogPost[] = [];
  try {
    blogData = readJsonData('data/blog.json');
  } catch (error) {
    console.error('Failed to load blog data:', error);
  }
  
  // Try to find in project data
  let projectData: Project[] = [];
  try {
    const projectsJson = readJsonData('data/projects.json');
    projectData = projectsJson.projects;
  } catch (error) {
    console.error('Failed to load project data:', error);
  }
  
  // Find the content by slugified title in either data set
  const blogPost = blogData.find(post => slugify(post.title) === slug);
  const project = projectData.find(proj => slugify(proj.title) === slug);
  
  // Determine content type or return 404 if not found
  const contentType = blogPost ? 'blog' : project ? 'project' : null;
  if (!contentType) {
    notFound();
  }
  
  // Render the appropriate content
  const content = blogPost || project;
  
  return (
    <Layout>
      {contentType === 'blog' && blogPost && (
        <section>
          <img 
            className="w-100"
            src={blogPost.content.mainImage} 
            alt={blogPost.title}
          />
          <div className="container mt-10">
            <div className="row">
              <div className="col-md-8 mx-auto">
                <div className="d-flex gap-2">
                  {Array.isArray(blogPost.category) ? (
                    blogPost.category.map((cat, index) => (
                      <Link
                        key={index}
                        href="#"
                        className="bg-primary-soft rounded-pill px-3 fw-bold py-2 text-primary text-uppercase fs-7"
                      >
                        {cat}
                      </Link>
                    ))
                  ) : (
                    <Link
                      href="#"
                      className="bg-primary-soft rounded-pill px-3 fw-bold py-2 text-primary text-uppercase fs-7"
                    >
                      {blogPost.category}
                    </Link>
                  )}
                </div>
                <h5 className="ds-5 mt-3 mb-4">{blogPost.title}</h5>
                <p className="fs-5 text-900 mb-0">{blogPost.content.intro}</p>
                <div className="d-flex align-items-center justify-content-between mt-7 py-3 border-top border-bottom">
                  <div className="d-flex align-items-center position-relative z-1">
                    <div className="icon-shape rounded-circle border border-2 border-white">
                      <img
                        className="rounded-circle"
                        src={blogPost.content.author.avatar}
                        alt={blogPost.content.author.name}
                      />
                    </div>
                    <div className="ms-3">
                      <h6 className="fs-7 m-0">{blogPost.content.author.name}</h6>
                      <p className="mb-0 fs-8">{blogPost.content.author.date}</p>
                    </div>
                    <Link
                      href="#"
                      className="position-absolute bottom-0 start-0 end-0 top-0 z-0"
                    />
                  </div>
                  <div className="d-flex align-items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12C4.75 16.0041 7.99594 19.25 12 19.25Z"
                        stroke="#111827"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M12 8V12L14 14"
                        stroke="#111827"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <span className="ms-2 fs-7 text-900">{blogPost.content.readTime} to read</span>
                  </div>
                </div>
              </div>
              <div className="col-md-10 mx-auto my-7">
                <img
                  className="rounded-4"
                  src={blogPost.content.mainImage}
                  alt={blogPost.title}
                />
              </div>
              <div className="col-md-8 mx-auto">
                <div className="blog-content tw-prose tw-prose-lg tw-max-w-none">
                  {parse(blogPost.content.fullContent)}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {contentType === 'project' && project && (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header section */}
            <div className="mb-8">
              <div className="flex mb-2">
                {project.categories && project.categories.map((cat, index) => (
                  <span key={index} className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                    {cat}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
              <p className="text-gray-600 mb-4">{project.description}</p>
              
              {/* Project info */}
              <div className="flex items-center mb-6">
                <div>
                  <p className="font-medium">{project.company}</p>
                  <p className="text-gray-500">{project.subtitle}</p>
                </div>
              </div>
            </div>
            
            {/* Main image */}
            <img 
              src={project.content?.mainImage} 
              alt={project.title} 
              className="w-full h-auto rounded-lg mb-8" 
            />
            
            {/* Content */}
            <div className="prose max-w-none">
              {project.content?.fullContent && (
                <div dangerouslySetInnerHTML={{ __html: project.content.fullContent }} />
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
