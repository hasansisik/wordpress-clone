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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Image, ImagePlus, Search, ExternalLink, AlertCircle, CheckCircle2 } from "lucide-react"
import { getGeneralSeoData } from "@/lib/seo"

interface SeoPageConfig {
  id: string;
  name: string;
  url: string;
  title: string;
  description: string;
  lastUpdated: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

// Sample Cloudinary images
const cloudinaryImages = [
  {
    id: "1",
    url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/c_thumb,w_200,g_face/v1312461204/sample.jpg",
    name: "Sample Image"
  },
  {
    id: "2",
    url: "https://res.cloudinary.com/demo/image/upload/v1493119370/sample2.jpg",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/c_thumb,w_200,g_face/v1493119370/sample2.jpg",
    name: "Sample Image 2"
  },
  {
    id: "3",
    url: "https://res.cloudinary.com/demo/image/upload/v1493119383/sample3.jpg",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/c_thumb,w_200,g_face/v1493119383/sample3.jpg",
    name: "Sample Image 3"
  },
  {
    id: "4",
    url: "https://res.cloudinary.com/demo/image/upload/v1493118464/sample4.jpg",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/c_thumb,w_200,g_face/v1493118464/sample4.jpg",
    name: "Sample Image 4"
  },
  {
    id: "5",
    url: "https://res.cloudinary.com/demo/image/upload/v1493118555/sample5.jpg",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/c_thumb,w_200,g_face/v1493118555/sample5.jpg",
    name: "Sample Image 5"
  },
  {
    id: "6",
    url: "https://res.cloudinary.com/demo/image/upload/v1493118854/sample6.jpg",
    thumbnail: "https://res.cloudinary.com/demo/image/upload/c_thumb,w_200,g_face/v1493118854/sample6.jpg",
    name: "Sample Image 6"
  }
];

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview");
  const [seoScore, setSeoScore] = useState(0);
  
  useEffect(() => {
    // Animate SEO score on load
    const timer = setTimeout(() => {
      setSeoScore(78);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Get general SEO data from the utility
  const generalSeoData = getGeneralSeoData();
  
  const seoPages: SeoPageConfig[] = [
    {
      id: "general",
      name: "Genel SEO",
      url: "/",
      title: generalSeoData.title,
      description: generalSeoData.description,
      lastUpdated: "2023-06-20",
      keywords: generalSeoData.keywords || "",
      ogTitle: generalSeoData.ogTitle || generalSeoData.title,
      ogDescription: generalSeoData.ogDescription || generalSeoData.description,
      ogImage: generalSeoData.ogImage || "",
    },
    {
      id: "home",
      name: "Ana Sayfa",
      url: "/",
      title: "Ana Sayfa | WordPress Clone",
      description: "WordPress Clone ile web sitenizi hızlı ve kolay bir şekilde oluşturun.",
      lastUpdated: "2023-06-15",
      keywords: "wordpress, clone, website, cms, blog",
      ogTitle: "WordPress Clone | Modern CMS",
      ogDescription: "WordPress Clone ile web sitenizi hızlı ve kolay bir şekilde oluşturun.",
      ogImage: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    },
    {
      id: "blog",
      name: "Blog",
      url: "/blog",
      title: "Blog | WordPress Clone",
      description: "En son makalelerimizi keşfedin ve bilgi birikimimizden yararlanın.",
      lastUpdated: "2023-06-14",
      keywords: "blog, makaleler, wordpress, içerik, yazılar",
      ogTitle: "Blog Makaleleri | WordPress Clone",
      ogDescription: "En son makalelerimizi keşfedin ve bilgi birikimimizden yararlanın.",
      ogImage: "https://res.cloudinary.com/demo/image/upload/v1493119370/sample2.jpg",
    },
    {
      id: "about",
      name: "Hakkımızda",
      url: "/hakkimizda",
      title: "Hakkımızda | WordPress Clone",
      description: "WordPress Clone'un arkasındaki hikayeyi ve ekibi tanıyın.",
      lastUpdated: "2023-06-12",
      keywords: "hakkımızda, şirket, ekip, misyon, vizyon",
      ogTitle: "Hakkımızda | WordPress Clone",
      ogDescription: "WordPress Clone'un arkasındaki hikayeyi ve ekibi tanıyın.",
      ogImage: "https://res.cloudinary.com/demo/image/upload/v1493119383/sample3.jpg",
    },
    {
      id: "contact",
      name: "İletişim",
      url: "/iletisim",
      title: "İletişim | WordPress Clone",
      description: "Bizimle iletişime geçin. Sorularınızı yanıtlamaktan memnuniyet duyarız.",
      lastUpdated: "2023-06-10",
      keywords: "iletişim, bize ulaşın, adres, telefon, email",
      ogTitle: "İletişim | WordPress Clone",
      ogDescription: "Bizimle iletişime geçin. Sorularınızı yanıtlamaktan memnuniyet duyarız.",
      ogImage: "https://res.cloudinary.com/demo/image/upload/v1493118464/sample4.jpg",
    },
    {
      id: "service",
      name: "Hizmetler",
      url: "/hizmetler",
      title: "Hizmetlerimiz | WordPress Clone",
      description: "Sunduğumuz profesyonel hizmetleri keşfedin ve ihtiyaçlarınıza uygun çözümleri bulun.",
      lastUpdated: "2023-06-08",
      keywords: "hizmetler, çözümler, servisler, örnekler, işler",
      ogTitle: "Hizmetlerimiz | WordPress Clone",
      ogDescription: "Sunduğumuz profesyonel hizmetleri keşfedin ve ihtiyaçlarınıza uygun çözümleri bulun.",
      ogImage: "https://res.cloudinary.com/demo/image/upload/v1493118555/sample5.jpg",
    },
  ];

  const [selectedPage, setSelectedPage] = useState<SeoPageConfig>(seoPages[0]);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  // Filter images based on search term
  const filteredImages = cloudinaryImages.filter(img => 
    img.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (field: keyof SeoPageConfig, value: string) => {
    setSelectedPage({
      ...selectedPage,
      [field]: value,
    });
  };

  const handleImageSelect = (imageUrl: string) => {
    handleChange('ogImage', imageUrl);
    setSelectedImage(imageUrl);
  };

  const handleSave = () => {
    // In a real application, this would save to a database or API
    alert("SEO settings saved! In a real application, this would update the lib/seo.ts file or save to a database.");
    setEditMode(false);
  };
  
  // SEO Performance Metrics
  const seoMetrics = [
    { 
      name: "Title Length", 
      score: selectedPage.title.length >= 40 && selectedPage.title.length <= 60 ? 100 : 70,
      status: selectedPage.title.length >= 40 && selectedPage.title.length <= 60 ? "optimal" : "warning",
      recommendation: "Title should be between 40-60 characters"
    },
    { 
      name: "Meta Description", 
      score: selectedPage.description.length >= 120 && selectedPage.description.length <= 160 ? 100 : 60,
      status: selectedPage.description.length >= 120 && selectedPage.description.length <= 160 ? "optimal" : "warning",
      recommendation: "Description should be between 120-160 characters"
    },
    { 
      name: "Keywords", 
      score: selectedPage.keywords.split(',').length >= 3 ? 100 : 50,
      status: selectedPage.keywords.split(',').length >= 3 ? "optimal" : "warning",
      recommendation: "Use at least 3 relevant keywords"
    },
    { 
      name: "Open Graph Image", 
      score: selectedPage.ogImage ? 100 : 0,
      status: selectedPage.ogImage ? "optimal" : "critical",
      recommendation: "Include an Open Graph image for social sharing"
    },
  ];
  
  // Calculate overall SEO score
  const overallScore = Math.round(
    seoMetrics.reduce((total, metric) => total + metric.score, 0) / seoMetrics.length
  );
  
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
                  <BreadcrumbLink href="/dashboard/settings">
                    Settings
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>SEO Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="editor">SEO Editor</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Website SEO Settings</CardTitle>
                  <CardDescription>
                    Manage SEO settings for your website pages to improve search engine rankings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Page</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="hidden md:table-cell">Description</TableHead>
                        <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {seoPages.map((page) => (
                        <TableRow key={page.id}>
                          <TableCell className="font-medium">{page.name}</TableCell>
                          <TableCell>{page.url}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{page.title}</TableCell>
                          <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                            {page.description}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{page.lastUpdated}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setSelectedPage(page);
                                  setEditMode(true);
                                  setActiveTab("editor");
                                }}
                              >
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={page.url} target="_blank" rel="noopener noreferrer">
                                  View
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>General SEO Settings</CardTitle>
                  <CardDescription>
                    Site-wide SEO settings that apply to your entire website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Site Title</h3>
                      <p className="text-sm text-muted-foreground mb-4">{seoPages[0].title}</p>
                      
                      <h3 className="text-sm font-medium mb-2">Site Description</h3>
                      <p className="text-sm text-muted-foreground mb-4">{seoPages[0].description}</p>
                      
                      <h3 className="text-sm font-medium mb-2">Global Keywords</h3>
                      <p className="text-sm text-muted-foreground">{seoPages[0].keywords}</p>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center">
                      {seoPages[0].ogImage && (
                        <div className="relative mb-4">
                          <h3 className="text-sm font-medium mb-2 text-center">Default OG Image</h3>
                          <div className="relative w-full max-w-[250px] rounded-md overflow-hidden border">
                            <img 
                              src={seoPages[0].ogImage} 
                              alt="Default Open Graph Image"
                              className="w-full h-auto"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 text-center">
                            This image will be used when sharing your site on social media
                          </p>
                        </div>
                      )}
                      
                      <Button 
                        onClick={() => {
                          setSelectedPage(seoPages[0]);
                          setActiveTab("editor");
                        }}
                      >
                        Edit General SEO
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>SEO Performance</CardTitle>
                  <CardDescription>
                    View SEO performance metrics and optimization suggestions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Overall Score */}
                    <Card className="col-span-1 flex flex-col items-center justify-center p-6">
                      <h3 className="text-lg font-medium mb-2">Overall Score</h3>
                      <div className="relative h-32 w-32 flex items-center justify-center">
                        <svg className="h-full w-full" viewBox="0 0 100 100">
                          <circle
                            className="stroke-muted-foreground/20"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            strokeWidth="10"
                          />
                          <circle
                            className="stroke-primary"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            strokeWidth="10"
                            strokeDasharray={`${(seoScore * 2.51)}, 251`}
                            strokeDashoffset="0"
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <span className="absolute text-xl font-bold">{seoScore}/100</span>
                      </div>
                      <div className="mt-4 text-center text-sm text-muted-foreground">
                        Based on key SEO factors
                      </div>
                    </Card>
                    
                    {/* SEO Metrics */}
                    <Card className="col-span-1 md:col-span-2 p-6">
                      <h3 className="text-lg font-medium mb-4">SEO Metrics for {selectedPage.name}</h3>
                      <div className="space-y-6">
                        {seoMetrics.map((metric, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {metric.status === "optimal" ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-amber-500" />
                                )}
                                <span className="font-medium">{metric.name}</span>
                              </div>
                              <span className="text-sm">{metric.score}/100</span>
                            </div>
                            <Progress value={metric.score} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              {metric.recommendation}
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        className="mt-6"
                        onClick={() => {
                          setActiveTab("editor");
                        }}
                      >
                        Improve SEO
                      </Button>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="editor" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Configuration</CardTitle>
                  <CardDescription>Manage SEO settings for your website pages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-6">
                    {/* Sidebar with page list */}
                    <div className="w-64 border-r pr-4">
                      <h3 className="text-sm font-semibold mb-2">Pages</h3>
                      <div className="space-y-1">
                        {seoPages.map((page) => (
                          <Button
                            key={page.id}
                            variant={selectedPage?.id === page.id ? "secondary" : "ghost"}
                            className="w-full justify-start text-left"
                            onClick={() => setSelectedPage(page)}
                          >
                            {page.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Form */}
                    {selectedPage && (
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold mb-4">
                          Editing SEO for: <span className="text-primary">{selectedPage.name}</span>
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="grid gap-2">
                            <Label htmlFor="title">Page Title</Label>
                            <Input 
                              id="title" 
                              value={selectedPage.title}
                              onChange={(e) => handleChange('title', e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Recommended length: 50-60 characters ({selectedPage.title.length} characters)
                            </p>
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="description">Meta Description</Label>
                            <Textarea 
                              id="description"
                              value={selectedPage.description}
                              onChange={(e) => handleChange('description', e.target.value)}
                              className="min-h-[80px]"
                            />
                            <p className="text-xs text-muted-foreground">
                              Recommended length: 150-160 characters ({selectedPage.description.length} characters)
                            </p>
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="keywords">Keywords</Label>
                            <Input 
                              id="keywords"
                              value={selectedPage.keywords}
                              onChange={(e) => handleChange('keywords', e.target.value)}
                              placeholder="Enter keywords separated by commas"
                            />
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="ogTitle">Open Graph Title</Label>
                            <Input 
                              id="ogTitle"
                              value={selectedPage.ogTitle}
                              onChange={(e) => handleChange('ogTitle', e.target.value)}
                            />
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="ogDescription">Open Graph Description</Label>
                            <Textarea 
                              id="ogDescription"
                              value={selectedPage.ogDescription}
                              onChange={(e) => handleChange('ogDescription', e.target.value)}
                              className="min-h-[80px]"
                            />
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="ogImage">Open Graph Image URL</Label>
                            <div className="flex gap-2">
                              <Input 
                                id="ogImage"
                                value={selectedPage.ogImage}
                                onChange={(e) => handleChange('ogImage', e.target.value)}
                                className="flex-1"
                              />
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" className="flex gap-2">
                                    <Image size={16} />
                                    <span>Select Image</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[625px]">
                                  <DialogHeader>
                                    <DialogTitle>Select Cloudinary Image</DialogTitle>
                                    <DialogDescription>
                                      Choose an image from your Cloudinary media library
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="py-4">
                                    <div className="flex items-center space-x-2 mb-4">
                                      <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                          placeholder="Search images..."
                                          className="pl-8"
                                          value={searchTerm}
                                          onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                      </div>
                                      <Button variant="outline">
                                        <ImagePlus className="mr-2 h-4 w-4" />
                                        Upload New
                                      </Button>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-4 mt-4 max-h-[300px] overflow-y-auto p-1">
                                      {filteredImages.map((image) => (
                                        <div 
                                          key={image.id}
                                          className={`
                                            relative cursor-pointer overflow-hidden rounded-md 
                                            border-2 transition-all
                                            ${selectedPage.ogImage === image.url ? 'border-primary' : 'border-muted hover:border-muted-foreground/50'}
                                          `}
                                          onClick={() => handleImageSelect(image.url)}
                                        >
                                          <img 
                                            src={image.thumbnail} 
                                            alt={image.name}
                                            className="h-32 w-full object-cover"
                                          />
                                          <div className="absolute inset-x-0 bottom-0 bg-black/70 p-2">
                                            <p className="truncate text-xs text-white">{image.name}</p>
                                          </div>
                                          {selectedPage.ogImage === image.url && (
                                            <div className="absolute right-2 top-2 rounded-full bg-primary p-1">
                                              <CheckCircle2 className="h-4 w-4 text-white" />
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                    
                                    {selectedPage.ogImage && (
                                      <div className="mt-4 border rounded-md p-4">
                                        <div className="flex items-center gap-4">
                                          <div className="h-16 w-16 overflow-hidden rounded">
                                            <img 
                                              src={selectedPage.ogImage} 
                                              alt="Selected image preview"
                                              className="h-full w-full object-cover"
                                            />
                                          </div>
                                          <div className="flex-1">
                                            <h4 className="text-sm font-medium">Selected Image</h4>
                                            <p className="text-xs text-muted-foreground truncate">{selectedPage.ogImage}</p>
                                          </div>
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => window.open(selectedPage.ogImage, '_blank')}
                                          >
                                            <ExternalLink size={14} className="mr-1" />
                                            Preview
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex justify-end gap-2">
                                    <DialogClose asChild>
                                      <Button type="button" variant="secondary">
                                        Cancel
                                      </Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                      <Button type="button">
                                        Select & Close
                                      </Button>
                                    </DialogClose>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                            
                            {selectedPage.ogImage && (
                              <div className="mt-2 rounded-md border p-2 flex items-center gap-3">
                                <img 
                                  src={selectedPage.ogImage} 
                                  alt="OG Image Preview" 
                                  className="h-16 w-24 object-cover rounded"
                                />
                                <div className="text-xs text-muted-foreground">
                                  <p>Preview of your Open Graph image (shown when sharing on social media)</p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                            <Button onClick={handleSave}>Save SEO Settings</Button>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setActiveTab("overview");
                                setEditMode(false);
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          </div>
      </>
  )
}
