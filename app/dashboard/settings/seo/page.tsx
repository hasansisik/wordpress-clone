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
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

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

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview")
  
  const seoPages: SeoPageConfig[] = [
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
      ogImage: "/og-image.jpg",
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
      ogImage: "/blog-og-image.jpg",
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
      ogImage: "/about-og-image.jpg",
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
      ogImage: "/contact-og-image.jpg",
    },
    {
      id: "project",
      name: "Projeler",
      url: "/project",
      title: "Projeler | WordPress Clone",
      description: "Projelerimizi keşfedin ve neler yapabileceğimizi görün.",
      lastUpdated: "2023-06-08",
      keywords: "projeler, çalışmalar, portfolyo, örnekler, işler",
      ogTitle: "Projeler | WordPress Clone",
      ogDescription: "Projelerimizi keşfedin ve neler yapabileceğimizi görün.",
      ogImage: "/projects-og-image.jpg",
    },
  ];

  const [selectedPage, setSelectedPage] = useState<SeoPageConfig>(seoPages[0]);
  const [editMode, setEditMode] = useState(false);

  const handleChange = (field: keyof SeoPageConfig, value: string) => {
    setSelectedPage({
      ...selectedPage,
      [field]: value,
    });
  };

  const handleSave = () => {
    // In a real application, this would save to a database or API
    alert("SEO settings saved! In a real application, this would save to a database or API.");
    setEditMode(false);
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
                  <CardTitle>SEO Performance</CardTitle>
                  <CardDescription>
                    View SEO performance metrics and optimization suggestions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-6 rounded-lg text-center">
                    <p className="text-muted-foreground">
                      SEO performance analytics will be available here in a future update.
                    </p>
                    <Button variant="outline" className="mt-4">
                      View Documentation
                    </Button>
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
                              Recommended length: 50-60 characters
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
                              Recommended length: 150-160 characters
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
                            <Input 
                              id="ogImage"
                              value={selectedPage.ogImage}
                              onChange={(e) => handleChange('ogImage', e.target.value)}
                            />
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
