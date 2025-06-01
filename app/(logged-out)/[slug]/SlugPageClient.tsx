"use client"

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "@/redux/actions/blogActions";
import { getAllServices } from "@/redux/actions/serviceActions";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import parse from "html-react-parser";
import { notFound } from "next/navigation";
import { Award } from "lucide-react";

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
  premium?: boolean;
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
  // Turkish character mapping
  const turkishMap: {[key: string]: string} = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  };
  
  // Replace Turkish characters
  let result = text.toString();
  for (const [turkishChar, latinChar] of Object.entries(turkishMap)) {
    result = result.replace(new RegExp(turkishChar, 'g'), latinChar);
  }
  
  return result
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

        // First try to find in Redux
        const foundBlog = blogs.find(post => slugify(post.title) === slug);
        const foundProject = services.find(service => slugify(service.title) === slug);
        
        if (foundBlog) {
          setBlogPost(foundBlog);
          setContentType('blog');
          return;
        } 
        
        if (foundProject) {
          setProject(foundProject);
          setContentType('project');
          return;
        }
        
        // If not found in Redux, try local JSON as fallback
        setUsingFallback(true);
        
        try {
          // Try to find in local blog data
          const localBlogs = await getLocalBlogData();
          const localBlog = localBlogs.find((post: BlogPost) => slugify(post.title) === slug);
          
          if (localBlog) {
            setBlogPost(localBlog);
            setContentType('blog');
            return;
          }
          
          // Try to find in local project data
          const localProjects = await getLocalProjectData();
          const localProject = localProjects.find((proj: Project) => slugify(proj.title) === slug);
          
          if (localProject) {
            setProject(localProject);
            setContentType('project');
            return;
          }
          
          // If still not found, show 404
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
        <section className={blogPost.premium ? "premium-content" : ""}>
          {blogPost.premium && (
         <div className="position-absolute left-0 w-100" style={{ background: 'linear-gradient(to bottom, rgba(245, 158, 11, 1), rgba(245, 158, 11, 0))', height: '300px' }}>
              <div className="container mx-auto relative z-10">
                <div className="flex items-center justify-center gap-2 pt-5">
                <Award className="w-8 h-8" color="white" />

                  <span className="font-bold text-white text-xl">Premium İçerik</span>
                </div>
              </div>
            </div>
          )}
          <img 
            className="w-100"
            src={blogPost.image} 
            alt={blogPost.title}
            style={{ maxWidth: '1920px', maxHeight: '400px', objectFit: 'cover', width: '100%' }}
          />
          <div className="container mt-10 mb-10">
            <div className="row">
              <div className="col-md-8 mx-auto">
                <div className="d-flex gap-2">
                  {Array.isArray(blogPost.category) ? (
                    blogPost.category.map((cat, index) => (
                      <Link
                        key={index}
                        href={`/blog/kategori?category=${encodeURIComponent(cat)}`}
                        className="rounded-pill px-3 fw-bold py-2  tag-spacing fs-7 fw-bold text-uppercase"
                        style={{
                          backgroundColor: blogPost.premium ? "#FFEDD5" : "#f5f5f5",
                          color: blogPost.premium ? "#C2410C" : "#333333"
                        }}
                      >
                        {cat}
                      </Link>
                    ))
                  ) : (
                    <Link
                      href={`/blog/kategori?category=${encodeURIComponent(blogPost.category)}`}
                      className={`${
                        blogPost.premium 
                          ? "bg-amber-100 text-amber-800" 
                          : "bg-primary-soft text-primary"
                      } rounded-pill px-3 fw-bold py-2 text-uppercase fs-7`}
                    >
                      {blogPost.category}
                    </Link>
                  )}
                  {blogPost.premium && (
                    <span className="bg-amber-500 text-white rounded-pill px-3 fw-bold py-2 text-uppercase fs-7 ml-2">
                      Premium
                    </span>
                  )}
                </div>
                <h5 className={`ds-5 mt-3 mb-4 ${blogPost.premium ? "text-amber-800" : ""}`}>
                  {blogPost.title}
                </h5>
                <p className="fs-5 text-900 mb-0">{parse(blogPost.content.intro)}</p>
                <div className={`d-flex align-items-center justify-content-between mt-7 py-3 border-top border-bottom ${
                  blogPost.premium ? "border-amber-200" : ""
                }`}>
                  <div className="d-flex align-items-center position-relative z-1">
                    <div className={`icon-shape rounded-circle border border-2 border-white ${
                      blogPost.premium ? "bg-amber-500" : "bg-primary"
                    } d-flex justify-content-center align-items-center`} style={{ width: '40px', height: '40px' }}>
                      <span className="text-white font-weight-bold">
                        {blogPost.content.author.name.substring(0, 2).toUpperCase()}
                      </span>
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
                    <span className="ms-2 fs-7 text-900">{blogPost.content.readTime} okuma süresi</span>
                  </div>
                </div>
              </div>
              <div className="col-md-10 mx-auto my-7">
                <img
                  className={`rounded-4 ${blogPost.premium ? "shadow-lg" : ""}`}
                  src={blogPost.content.mainImage}
                  alt={blogPost.title}
                />
              </div>
              <div className="col-md-8 mx-auto">
                <div className={`blog-content tw-prose tw-prose-lg tw-max-w-none ${
                  blogPost.premium ? "premium-blog-content" : ""
                }`}>
                  {blogPost.content.fullContent && parse(blogPost.content.fullContent)}
                </div>
                
                {blogPost.premium && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-8">
                    <div className="flex items-center gap-2 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                        <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"></path>
                      </svg>
                      <h5 className=" m-0 text-md">Premium İçerik</h5>
                    </div>
                    <p className="text-amber-700 mb-0">
                      Premium kalitesinde içerik görüntülüyorsunuz. Değerli premium abonemiz olduğunuz için teşekkür ederiz.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Add premium styling */}
          {blogPost.premium && (
            <style jsx global>{`
              .premium-container {
                position: relative;
              }
              
              .premium-container::before {
                content: '';
                position: absolute;
                top: -60px;
                left: 0;
                right: 0;
                height: 60px;
                background: linear-gradient(to bottom, rgba(251, 191, 36, 0.1), transparent);
                pointer-events: none;
              }
              
              .premium-blog-content {
                font-family: 'Georgia', serif;
                line-height: 1.8;
              }
              
              .premium-blog-content h1, 
              .premium-blog-content h2, 
              .premium-blog-content h3 {
                color: #92400e;
              }
              
              .premium-blog-content blockquote {
                border-left-color: #f59e0b;
                background-color: rgba(251, 191, 36, 0.1);
              }
              
              .premium-blog-content a {
                color: #b45309;
                text-decoration: underline;
              }
            `}</style>
          )}
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