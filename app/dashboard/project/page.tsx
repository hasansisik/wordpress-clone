"use client";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
  import { Separator } from "@/components/ui/separator"
  import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
  } from "@/components/ui/sidebar"
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Textarea } from "@/components/ui/textarea";
  import { useState, useEffect, useRef } from "react";
  import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import { Badge } from "@/components/ui/badge";
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
  import projectsData from "@/data/projects.json";
  import Link from "next/link";
  import { uploadImageToCloudinary } from "@/utils/cloudinary";
  import Image from "next/image";
  import RichTextEditor from "@/components/RichTextEditor";

interface Author {
  name: string;
  avatar: string;
  date: string;
}

interface Content {
  intro: string;
  readTime: string;
  author: Author;
  mainImage: string;
  fullContent: string;
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
  content?: Content;
}

export default function ProjectEditor() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mainImageFileInputRef = useRef<HTMLInputElement>(null);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);
  
  // Uploading state for images
  const [isUploading, setIsUploading] = useState({
    thumbnail: false,
    mainImage: false
  });

  const initialFormState = {
    title: "",
    description: "",
    image: "",
    company: "",
    subtitle: "",
    fullDescription: "",
    tag: "",
    categories: [] as string[],
    category: "",
    intro: "",
    fullContent: "",
    mainImage: "",
    author: "",
    authorAvatar: "/assets/imgs/blog-4/avatar-1.png",
    readTime: "10 mins",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [activeTab, setActiveTab] = useState("all");

  // Load projects from data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // For now we'll use the local JSON data, but in a real app you would fetch from an API
        setProjects(projectsData.projects);
        setFilteredProjects(projectsData.projects);
      } catch (error) {
        console.error('Error loading projects:', error);
        setNotification({
          type: 'error',
          message: 'Failed to load projects. Please try again later.'
        });
      }
    };
    
    fetchProjects();
  }, []);

  // Filter projects when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProjects(projects);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = projects.filter(project => 
        project.title.toLowerCase().includes(lowercasedFilter) ||
        project.categories.some(cat => cat.toLowerCase().includes(lowercasedFilter)) ||
        project.company.toLowerCase().includes(lowercasedFilter) ||
        project.tag.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredProjects(filtered);
    }
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, projects]);

  // Handle image uploads
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(prev => ({ ...prev, thumbnail: true }));
      const imageUrl = await uploadImageToCloudinary(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      setIsUploading(prev => ({ ...prev, thumbnail: false }));
      
      setNotification({
        type: "success",
        message: "Thumbnail image uploaded successfully!"
      });
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      setIsUploading(prev => ({ ...prev, thumbnail: false }));
      setNotification({
        type: "error",
        message: "Failed to upload thumbnail image. Please try again."
      });
    }
  };
  
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(prev => ({ ...prev, mainImage: true }));
      const imageUrl = await uploadImageToCloudinary(file);
      setFormData(prev => ({ ...prev, mainImage: imageUrl }));
      setIsUploading(prev => ({ ...prev, mainImage: false }));
      
      setNotification({
        type: "success",
        message: "Main image uploaded successfully!"
      });
    } catch (error) {
      console.error("Error uploading main image:", error);
      setIsUploading(prev => ({ ...prev, mainImage: false }));
      setNotification({
        type: "error",
        message: "Failed to upload main image. Please try again."
      });
    }
  };

  // Remove a category from the list
  const removeCategory = (category: string) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter((cat) => cat !== category),
    });
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData(initialFormState);
    setIsUploading({
      thumbnail: false,
      mainImage: false
    });
    setActiveTab("all");
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (
      !formData.title ||
      !formData.description ||
      !formData.image ||
      formData.categories.length === 0 ||
      !formData.company ||
      !formData.subtitle ||
      !formData.fullDescription ||
      !formData.tag
    ) {
      setNotification({
        type: "error",
        message: "Please fill all required fields.",
      });
      return;
    }

    try {
      // Prepare content object if details are provided
      const contentObject = formData.intro || formData.mainImage || formData.fullContent ? {
        intro: formData.intro,
        readTime: formData.readTime,
        author: {
          name: formData.author || "Admin",
          avatar: formData.authorAvatar,
          date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        },
        mainImage: formData.mainImage || formData.image,
        fullContent: formData.fullContent
      } : undefined;

      if (isEditMode && editingProjectId) {
        // Update existing project
        const updatedProject: Project = {
          id: editingProjectId,
          title: formData.title,
          description: formData.description,
          image: formData.image,
          categories: formData.categories,
          company: formData.company,
          subtitle: formData.subtitle,
          fullDescription: formData.fullDescription,
          tag: formData.tag,
          ...(contentObject && { content: contentObject })
        };
        
        // In a real application, you would save this to an API
        // For now, we'll just update the local state
        const updatedProjects = projects.map(project => 
          project.id === editingProjectId ? updatedProject : project
        );
        
        setProjects(updatedProjects);
        
        setNotification({
          type: "success",
          message: "Project updated successfully!",
        });
        
        // Reset edit mode
        setIsEditMode(false);
        setEditingProjectId(null);
      } else {
        // Create new project with next available ID
        const maxId = projects.length > 0 
          ? Math.max(...projects.map(project => project.id)) 
          : 0;
          
        const newProject: Project = {
          id: maxId + 1,
          title: formData.title,
          description: formData.description,
          image: formData.image,
          categories: formData.categories,
          company: formData.company,
          subtitle: formData.subtitle,
          fullDescription: formData.fullDescription,
          tag: formData.tag,
          ...(contentObject && { content: contentObject })
        };
        
        // In a real application, you would save this to an API
        // For now, we'll just update the local state
        const updatedProjects = [...projects, newProject];
        setProjects(updatedProjects);
        
        // Success notification
        setNotification({
          type: "success",
          message: "Project created successfully!",
        });
      }
      
      // Reset form
      resetForm();
      setActiveTab("all");
    } catch (error) {
      console.error('Error saving project:', error);
      setNotification({
        type: "error",
        message: "Failed to save project. Please try again.",
      });
    }
  };

  // Add function to generate and trigger download of JSON file
  const generateJsonDownload = (updatedProjects: Project[]) => {
    // Create a full projects object including categories
    const fullProjectsData = {
      categories: projectsData.categories,
      projects: updatedProjects
    };
    
    const jsonString = JSON.stringify(fullProjectsData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'updated_projects.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  // Add function to handle project.json import
  const handleImportJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const importedProjects = JSON.parse(event.target?.result as string) as Project[];
        
        // Save to server using our API
        const response = await fetch('/api/projects/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(importedProjects),
        });
        
        if (!response.ok) {
          throw new Error('Failed to import project posts');
        }
        
        setProjects(importedProjects);
        setFilteredProjects(importedProjects);
        setNotification({
          type: "success",
          message: "Project posts imported successfully!",
        });
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing project posts:', error);
      setNotification({
        type: "error",
        message: "Failed to import project posts. Invalid JSON format.",
      });
    }
  };

  // Edit project handler
  const handleEditProject = (projectId: number) => {
    const projectToEdit = projects.find(project => project.id === projectId);
    if (!projectToEdit) return;
    
    // Set form data
    setFormData({
      title: projectToEdit.title,
      description: projectToEdit.description,
      image: projectToEdit.image,
      categories: projectToEdit.categories,
      category: "",
      company: projectToEdit.company,
      subtitle: projectToEdit.subtitle,
      fullDescription: projectToEdit.fullDescription,
      tag: projectToEdit.tag,
      intro: projectToEdit.content?.intro || "",
      fullContent: projectToEdit.content?.fullContent || "",
      mainImage: projectToEdit.content?.mainImage || "",
      author: projectToEdit.content?.author?.name || "",
      authorAvatar: projectToEdit.content?.author?.avatar || "/assets/imgs/blog-4/avatar-1.png",
      readTime: projectToEdit.content?.readTime || "10 mins",
    });
    
    // Set edit mode
    setIsEditMode(true);
    setEditingProjectId(projectId);
    setActiveTab("add");
    
    // Reset uploading states
    setIsUploading({
      thumbnail: false,
      mainImage: false
    });
  };

  // Delete project handler
  const handleDeleteProject = (projectId: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const updatedProjects = projects.filter(project => project.id !== projectId);
        setProjects(updatedProjects);
        
        setNotification({
          type: "success",
          message: "Project deleted successfully!",
        });
      } catch (error) {
        console.error('Error deleting project:', error);
        setNotification({
          type: "error",
          message: "Failed to delete project. Please try again.",
        });
      }
    }
  };

  // Pagination logic
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Pagination component
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
            // Show first page, last page, and pages around current page
            if (
              page === 1 || 
              page === totalPages || 
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={page}>
                  <PaginationLink 
                    isActive={page === currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            
            // Add ellipsis for skipped pages
            if (page === 2 && currentPage > 3) {
              return <PaginationItem key="ellipsis-start"><PaginationEllipsis /></PaginationItem>;
            }
            
            if (page === totalPages - 1 && currentPage < totalPages - 2) {
              return <PaginationItem key="ellipsis-end"><PaginationEllipsis /></PaginationItem>;
            }
            
            return null;
          })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Project Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {notification && (
          <div className={`p-4 mb-4 rounded-lg ${notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            <div className="flex items-center">
              <span className="font-medium">{notification.type === "success" ? "Success!" : "Error!"}</span>
              <span className="ml-2">{notification.message}</span>
              <button 
                className="ml-auto" 
                onClick={() => setNotification(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="add">{isEditMode ? "Edit Project" : "Add New Project"}</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2 items-center">
              <div className="w-full md:w-auto">
                <Input
                  placeholder="Search projects by title, category, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => generateJsonDownload(projects)} 
                title="Export current projects"
              >
                Export
              </Button>
            </div>
          </div>
          
          <TabsContent value="all" className="space-y-4">
            <Table>
              <TableCaption>A list of your projects.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Tag</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No projects found. {searchTerm && "Try a different search term."}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {project.image && (
                            <div className="relative w-10 h-10 rounded-md overflow-hidden">
                              <img 
                                src={project.image} 
                                alt={project.title}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          )}
                          <span className="line-clamp-1">{project.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {project.categories.map((cat, i) => (
                            <Badge key={i} variant="outline">{cat}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{project.company}</TableCell>
                      <TableCell>
                        <Badge>{project.tag}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/project/${project.id}`} target="_blank">
                            <Button variant="outline" size="sm">View</Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditProject(project.id)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {renderPagination()}
          </TabsContent>
          
          <TabsContent value="add">
            <div className="grid grid-cols-1 gap-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 space-y-4">
                    <Card className="shadow-sm">
                      <CardHeader className="pb-2 ">
                        <CardTitle className="text-base font-medium">{isEditMode ? "Edit Project" : "Basic Information"}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 ">
                        <div className="space-y-1">
                          <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                          <Input 
                            id="title" 
                            placeholder="Enter project title" 
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="h-9"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="description" className="text-sm font-medium">Short Description</Label>
                          <Textarea 
                            id="description" 
                            placeholder="Brief description of the project"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="min-h-[70px]"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="company" className="text-sm font-medium">Company</Label>
                            <Input 
                              id="company" 
                              placeholder="Company name" 
                              value={formData.company}
                              onChange={(e) => setFormData({...formData, company: e.target.value})}
                              className="h-9"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor="tag" className="text-sm font-medium">Tag</Label>
                            <Input 
                              id="tag" 
                              placeholder="e.g. Software Development" 
                              value={formData.tag}
                              onChange={(e) => setFormData({...formData, tag: e.target.value})}
                              className="h-9"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="subtitle" className="text-sm font-medium">Subtitle</Label>
                            <Input 
                              id="subtitle" 
                              placeholder="Project subtitle" 
                              value={formData.subtitle}
                              onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                              className="h-9"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor="fullDescription" className="text-sm font-medium">Full Description</Label>
                            <Textarea 
                              id="fullDescription" 
                              placeholder="Detailed description" 
                              value={formData.fullDescription}
                              onChange={(e) => setFormData({...formData, fullDescription: e.target.value})}
                              className="min-h-[70px]"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-sm">
                      <CardHeader className="">
                        <CardTitle className="text-base font-medium">Additional Content (Optional)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 ">
                        <div className="space-y-1">
                          <Label htmlFor="intro" className="text-sm font-medium">Introduction</Label>
                          <RichTextEditor
                            content={formData.intro}
                            onChange={(html) => setFormData({ ...formData, intro: html })}
                            className="min-h-[150px]"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="fullContent" className="text-sm font-medium">Main Content</Label>
                          <RichTextEditor
                            content={formData.fullContent}
                            onChange={(html) => setFormData({ ...formData, fullContent: html })}
                            className="min-h-[350px]"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="author" className="text-sm font-medium">Author (Optional)</Label>
                            <Input 
                              id="author" 
                              placeholder="Author name" 
                              value={formData.author}
                              onChange={(e) => setFormData({...formData, author: e.target.value})}
                              className="h-9"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor="readTime" className="text-sm font-medium">Read Time</Label>
                            <Input 
                              id="readTime" 
                              placeholder="10 mins" 
                              value={formData.readTime}
                              onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                              className="h-9"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-4">
                    <Card className="shadow-sm">
                      <CardContent className="">
                        <div className="flex justify-between gap-3">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              resetForm();
                              if (isEditMode) {
                                setIsEditMode(false);
                                setEditingProjectId(null);
                              }
                              setActiveTab("all");
                            }}
                            className="w-1/2 h-9"
                          >
                            Cancel
                          </Button>
                          <Button type="submit" className="w-1/2 h-9">
                            {isEditMode ? "Update" : "Create"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-sm">
                      <CardHeader className="pb-2 pt-3">
                        <CardTitle className="text-base font-medium">Thumbnail Image</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <Input 
                                id="image" 
                                placeholder="/assets/imgs/project-2/img-1.png" 
                                value={formData.image}
                                onChange={(e) => setFormData({...formData, image: e.target.value})}
                                className="h-9"
                              />
                            </div>
                            <div>
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleThumbnailUpload}
                                className="hidden"
                                accept="image/*"
                              />
                              <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading.thumbnail}
                                size="sm"
                                className="h-9"
                              >
                                {isUploading.thumbnail ? "Uploading..." : "Upload"}
                              </Button>
                            </div>
                          </div>
                          {formData.image && (
                            <div className="mt-3 relative w-full aspect-video rounded-md overflow-hidden border">
                              <img 
                                src={formData.image} 
                                alt="Thumbnail preview" 
                                className="object-cover w-full h-full"
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-sm">
                      <CardHeader className="">
                        <CardTitle className="text-base font-medium">Main Banner Image (Optional)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 pt-0 ">
                        <div className="space-y-1">
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <Input 
                                id="mainImage" 
                                placeholder="/assets/imgs/blog-details/img-1.png" 
                                value={formData.mainImage}
                                onChange={(e) => setFormData({...formData, mainImage: e.target.value})}
                                className="h-9"
                              />
                            </div>
                            <div>
                              <input
                                type="file"
                                ref={mainImageFileInputRef}
                                onChange={handleMainImageUpload}
                                className="hidden"
                                accept="image/*"
                              />
                              <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => mainImageFileInputRef.current?.click()}
                                disabled={isUploading.mainImage}
                                size="sm"
                                className="h-9"
                              >
                                {isUploading.mainImage ? "Uploading..." : "Upload"}
                              </Button>
                            </div>
                          </div>
                          {formData.mainImage && (
                            <div className="mt-3 relative w-full aspect-video rounded-md overflow-hidden border">
                              <img 
                                src={formData.mainImage} 
                                alt="Main image preview" 
                                className="object-cover w-full h-full"
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-sm">
                      <CardHeader className="">
                        <CardTitle className="text-base font-medium">Categories</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 ">
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1 min-h-[36px]">
                            {formData.categories.map((cat, index) => (
                              <Badge key={index} variant="secondary" className="px-2 py-1 text-xs">
                                {cat}
                                <button 
                                  type="button"
                                  className="ml-1 text-xs hover:text-destructive"
                                  onClick={() => removeCategory(cat)}
                                >
                                  ✕
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add category"
                              value={formData.category}
                              onChange={(e) => setFormData({...formData, category: e.target.value})}
                              className="h-9"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && formData.category.trim()) {
                                  e.preventDefault();
                                  if (!formData.categories.includes(formData.category.trim())) {
                                    setFormData({
                                      ...formData,
                                      categories: [...formData.categories, formData.category.trim()],
                                      category: ''
                                    });
                                  }
                                }
                              }}
                            />
                            <Button 
                              type="button" 
                              size="sm"
                              className="h-9"
                              onClick={() => {
                                if (formData.category.trim() && !formData.categories.includes(formData.category.trim())) {
                                  setFormData({
                                    ...formData,
                                    categories: [...formData.categories, formData.category.trim()],
                                    category: ''
                                  });
                                }
                              }}
                            >
                              Add
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">Press Enter or click Add to add a category</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
  