"use client"

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "@/redux/actions/blogActions";
import { getAllServices } from "@/redux/actions/serviceActions";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import parse from "html-react-parser";
import { notFound } from "next/navigation";

// Import the types and slugify function
interface BlogPost {
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

interface Project {
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

// Function to convert title to slug
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

// Function to get local JSON blog data
const getLocalBlogData = async () => {
  try {
    const response = await fetch('/api/local-blogs');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch local blog data:', error);
    return [];
  }
};

// Function to get local JSON project data
const getLocalProjectData = async () => {
  try {
    const response = await fetch('/api/local-projects');
    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error('Failed to fetch local project data:', error);
    return [];
  }
};

interface SlugPageClientProps {
  slug: string;
}

export default function SlugPageClient({ slug }: SlugPageClientProps) {
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state
  const { blogs, loading: blogsLoading } = useSelector((state: RootState) => state.blog);
  const { services, loading: servicesLoading } = useSelector((state: RootState) => state.service);
  
  // Local state for content
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [contentType, setContentType] = useState<'blog' | 'project' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  
  // Fetch data from Redux
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only dispatch if blogs and services are not already loaded
        if (blogs.length === 0) {
          await dispatch(getAllBlogs());
        }
        
        if (services.length === 0) {
          await dispatch(getAllServices());
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        // If Redux data fetch fails, we'll still continue but will use fallback
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [dispatch, blogs.length, services.length]);
  
  // Find the content by slug once data is loaded
  useEffect(() => {
    if (!isLoading) {
      const findContent = async () => {
        console.log("Looking for content with slug:", slug);
        console.log("Redux blogs length:", blogs.length);
        console.log("Redux services length:", services.length);
        
        // First try to find in Redux
        const foundBlog = blogs.find(post => slugify(post.title) === slug);
        const foundProject = services.find(service => slugify(service.title) === slug);
        
        if (foundBlog) {
          console.log("Found blog in Redux:", foundBlog.title);
          setBlogPost(foundBlog);
          setContentType('blog');
          return;
        } 
        
        if (foundProject) {
          console.log("Found project in Redux:", foundProject.title);
          setProject(foundProject);
          setContentType('project');
          return;
        }
        
        // If not found in Redux, try local JSON as fallback
        console.log("Content not found in Redux, trying local JSON...");
        setUsingFallback(true);
        
        try {
          // Try to find in local blog data
          const localBlogs = await getLocalBlogData();
          const localBlog = localBlogs.find((post: BlogPost) => slugify(post.title) === slug);
          
          if (localBlog) {
            console.log("Found blog in local JSON:", localBlog.title);
            setBlogPost(localBlog);
            setContentType('blog');
            return;
          }
          
          // Try to find in local project data
          const localProjects = await getLocalProjectData();
          const localProject = localProjects.find((proj: Project) => slugify(proj.title) === slug);
          
          if (localProject) {
            console.log("Found project in local JSON:", localProject.title);
            setProject(localProject);
            setContentType('project');
            return;
          }
          
          // If still not found, show 404
          console.log("Content not found in local JSON either, showing 404");
          notFound();
        } catch (error) {
          console.error("Error with fallback:", error);
          notFound();
        }
      };
      
      findContent();
    }
  }, [isLoading, blogs, services, slug]);
  
  // Show loading state
  if (isLoading || blogsLoading || servicesLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }
  
  // Show 404 if content not found
  if (!contentType) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center flex-col h-[60vh]">
          <h1 className="text-3xl font-bold mb-4">Content Not Found</h1>
          <p className="text-gray-600">The requested content could not be found.</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
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
                  {blogPost.content.fullContent && parse(blogPost.content.fullContent)}
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
    </>
  );
} 