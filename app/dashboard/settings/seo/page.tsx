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
import { useState, useEffect, useRef } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Image, ExternalLink, AlertCircle, CheckCircle2, Upload } from "lucide-react"
import { getGeneralSeoData, getAllSeoPages, SeoPageConfig } from "@/lib/seo"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { AppDispatch } from "@/redux/store"
import { getGeneral, updateGeneral, updateSeoPage } from "@/redux/actions/generalActions"
import { Toaster, toast } from "sonner"
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview");
  const [seoScore, setSeoScore] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const { general, loading, success, error } = useSelector((state: RootState) => state.general);
  
  // Get all SEO pages
  const [seoPages, setSeoPages] = useState<SeoPageConfig[]>([]);
  
  // Load general data when component mounts
  useEffect(() => {
    dispatch(getGeneral());
  }, [dispatch]);
  
  // Update state when general data changes
  useEffect(() => {
    if (general?.seo) {
      // Get pages from general data
      const pages = general.seo.pages || [];
      setSeoPages([
    {
      id: "general",
      name: "Genel SEO",
      url: "/",
          title: general.seo.general.title,
          description: general.seo.general.description,
          lastUpdated: new Date().toISOString().split('T')[0],
          keywords: general.seo.general.keywords || "",
          ogTitle: general.seo.general.ogTitle || general.seo.general.title,
          ogDescription: general.seo.general.ogDescription || general.seo.general.description,
          ogImage: general.seo.general.ogImage || "",
    },
        ...pages
      ]);
      
      // Update the SEO score based on pages
      const calculateScore = Math.floor(Math.random() * 20) + 60; // Replace with real calculation
      setSeoScore(calculateScore);
    } else {
      // Reset state if no data is available
      setSeoPages([]);
      setSeoScore(0);
    }
  }, [general]);

  const initializeSeoSettings = () => {
    if (!general) return;
    
    // Initialize robotsTxt if it doesn't exist
    if (!general.seo?.robotsTxt) {
      dispatch(updateGeneral({
        seo: {
          ...general.seo,
          robotsTxt: {
            customRules: "",
            enableDefaultRules: true
          }
        }
      }));
    }
    
    // Initialize sitemap if it doesn't exist
    if (!general.seo?.sitemap) {
      dispatch(updateGeneral({
        seo: {
          ...general.seo,
          sitemap: {
            excludeUrls: [],
            additionalUrls: [],
            changeFrequencies: {
              homepage: "daily",
              pages: "weekly",
              posts: "monthly"
            },
            priorities: {
              homepage: 1.0,
              pages: 0.8,
              posts: 0.7
            }
          }
        }
      }));
    }
    
    // Initialize schema if it doesn't exist
    if (!general.seo?.schema) {
      dispatch(updateGeneral({
        seo: {
          ...general.seo,
          schema: {
            organization: {
              socialLinks: [
                "https://facebook.com/wordpressclone",
                "https://twitter.com/wordpressclone",
                "https://instagram.com/wordpressclone",
                "https://linkedin.com/company/wordpressclone"
              ],
              logo: "/logo.png",
              address: {
                streetAddress: "",
                addressLocality: "",
                addressRegion: "",
                postalCode: "",
                addressCountry: "TR"
              }
            },
            enableWebPageSchema: true,
            enableBlogPostingSchema: true,
            enableItemListSchema: true
          }
        }
      }));
    }
  };

  // Call the initialization function when the component mounts and general data is loaded
  useEffect(() => {
    if (general) {
      initializeSeoSettings();
    }
  }, [general]);

  const [selectedPage, setSelectedPage] = useState<SeoPageConfig | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Select the first page when pages are loaded
  useEffect(() => {
    if (seoPages.length > 0 && !selectedPage) {
      setSelectedPage(seoPages[0]);
    }
  }, [seoPages, selectedPage]);

  const handleChange = (field: keyof SeoPageConfig, value: string) => {
    if (!selectedPage) return;
    
    setSelectedPage({
      ...selectedPage,
      [field]: value,
    });
  };

  // File input reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedPage) return;
    
    const file = files[0];
    setImageUploading(true);
    
    try {
      // Use the imported uploadImageToCloudinary function
      const imageUrl = await uploadImageToCloudinary(file);
      
      if (imageUrl) {
        handleChange('ogImage', imageUrl);
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
    } finally {
      setImageUploading(false);
    }
  };
  
  const handleSave = async () => {
    if (!selectedPage) return;
    
    try {
      if (selectedPage.id === "general") {
        // Update general SEO settings
        await dispatch(updateGeneral({
          seo: {
            general: {
              title: selectedPage.title,
              description: selectedPage.description,
              keywords: selectedPage.keywords,
              ogTitle: selectedPage.ogTitle,
              ogDescription: selectedPage.ogDescription,
              ogImage: selectedPage.ogImage
            }
          }
        }));
      } else {
        // Update specific page SEO settings
        await dispatch(updateSeoPage({
          id: selectedPage.id,
          data: {
            title: selectedPage.title,
            description: selectedPage.description,
            keywords: selectedPage.keywords,
            ogTitle: selectedPage.ogTitle,
            ogDescription: selectedPage.ogDescription,
            ogImage: selectedPage.ogImage,
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        }));
      }
      
      // Show success message with Sonner toast
      toast.success("SEO settings saved successfully!", {
        description: "Your SEO changes have been updated."
      });
    setEditMode(false);
    } catch (err) {
      console.error("Error saving SEO settings:", err);
      toast.error("Error saving SEO settings", {
        description: "Please try again or contact support if the problem persists."
      });
    }
  };
  
  // Calculate SEO metrics for the selected page
  const getSeoMetrics = () => {
    if (!selectedPage) return [];
    
    return [
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
  };
  
  const seoMetrics = selectedPage ? getSeoMetrics() : [];
  
  // Calculate overall SEO score
  const overallScore = selectedPage ? Math.round(
    seoMetrics.reduce((total, metric) => total + metric.score, 0) / seoMetrics.length
  ) : 0;

  // Show loading state
  if (loading && !general) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-3">Yükleniyor...O settings...</span>
      </div>
  );
  }
  
  // Ensure sitemap is initialized before using it
  const handleExcludeUrlsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const urls = e.target.value.split('\n').filter(url => url.trim() !== '');
    
    // If sitemap doesn't exist yet, create it with default values
    if (!general?.seo?.sitemap) {
      dispatch(updateGeneral({
        seo: {
          ...general?.seo,
          sitemap: {
            excludeUrls: urls,
            additionalUrls: [],
            changeFrequencies: {
              homepage: "daily",
              pages: "weekly",
              posts: "monthly"
            },
            priorities: {
              homepage: 1.0,
              pages: 0.8,
              posts: 0.7
            }
          }
        }
      }));
    } else {
      // Update existing sitemap
      dispatch(updateGeneral({
        seo: {
          sitemap: {
            ...general.seo.sitemap,
            excludeUrls: urls
          }
        }
      }));
    }
  };

  // Helper function for robotsTxt customRules
  const handleCustomRulesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const customRules = e.target.value;
    
    // If robotsTxt doesn't exist yet, create it with default values
    if (!general?.seo?.robotsTxt) {
      dispatch(updateGeneral({
        seo: {
          ...general?.seo,
          robotsTxt: {
            customRules: customRules,
            enableDefaultRules: true
          }
        }
      }));
    } else {
      // Update existing robotsTxt
      dispatch(updateGeneral({
        seo: {
          robotsTxt: {
            ...general.seo.robotsTxt,
            customRules: customRules
          }
        }
      }));
    }
  };

  // Helper function for robotsTxt enableDefaultRules
  const handleEnableDefaultRulesChange = (checked: boolean) => {
    // If robotsTxt doesn't exist yet, create it with default values
    if (!general?.seo?.robotsTxt) {
      dispatch(updateGeneral({
        seo: {
          ...general?.seo,
          robotsTxt: {
            customRules: "",
            enableDefaultRules: checked
          }
        }
      }));
    } else {
      // Update existing robotsTxt
      dispatch(updateGeneral({
        seo: {
          robotsTxt: {
            ...general.seo.robotsTxt,
            enableDefaultRules: checked
          }
        }
      }));
    }
  };

  // Helper functions for sitemap priorities
  const handleHomepagePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const priority = parseFloat(e.target.value);
    
    // If sitemap doesn't exist yet, create it with default values
    if (!general?.seo?.sitemap) {
      dispatch(updateGeneral({
        seo: {
          ...general?.seo,
          sitemap: {
            excludeUrls: [],
            additionalUrls: [],
            changeFrequencies: {
              homepage: "daily",
              pages: "weekly",
              posts: "monthly"
            },
            priorities: {
              homepage: priority,
              pages: 0.8,
              posts: 0.7
            }
          }
        }
      }));
    } else {
      // Update existing sitemap
      dispatch(updateGeneral({
        seo: {
          sitemap: {
            ...general.seo.sitemap,
            priorities: {
              ...general.seo.sitemap.priorities,
              homepage: priority
            }
          }
        }
      }));
    }
  };

  const handlePagesPriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const priority = parseFloat(e.target.value);
    
    // If sitemap doesn't exist yet, create it with default values
    if (!general?.seo?.sitemap) {
      dispatch(updateGeneral({
        seo: {
          ...general?.seo,
          sitemap: {
            excludeUrls: [],
            additionalUrls: [],
            changeFrequencies: {
              homepage: "daily",
              pages: "weekly",
              posts: "monthly"
            },
            priorities: {
              homepage: 1.0,
              pages: priority,
              posts: 0.7
            }
          }
        }
      }));
    } else {
      // Update existing sitemap
      dispatch(updateGeneral({
        seo: {
          sitemap: {
            ...general.seo.sitemap,
            priorities: {
              ...general.seo.sitemap.priorities,
              pages: priority
            }
          }
        }
      }));
    }
  };

  const handlePostsPriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const priority = parseFloat(e.target.value);
    
    // If sitemap doesn't exist yet, create it with default values
    if (!general?.seo?.sitemap) {
      dispatch(updateGeneral({
        seo: {
          ...general?.seo,
          sitemap: {
            excludeUrls: [],
            additionalUrls: [],
            changeFrequencies: {
              homepage: "daily",
              pages: "weekly",
              posts: "monthly"
            },
            priorities: {
              homepage: 1.0,
              pages: 0.8,
              posts: priority
            }
          }
        }
      }));
    } else {
      // Update existing sitemap
      dispatch(updateGeneral({
        seo: {
          sitemap: {
            ...general.seo.sitemap,
            priorities: {
              ...general.seo.sitemap.priorities,
              posts: priority
            }
          }
        }
      }));
    }
  };

  // Helper functions for sitemap change frequencies
  const handleHomepageFrequencyChange = (value: string) => {
    // If sitemap doesn't exist yet, create it with default values
    if (!general?.seo?.sitemap) {
      dispatch(updateGeneral({
        seo: {
          ...general?.seo,
          sitemap: {
            excludeUrls: [],
            additionalUrls: [],
            changeFrequencies: {
              homepage: value,
              pages: "weekly",
              posts: "monthly"
            },
            priorities: {
              homepage: 1.0,
              pages: 0.8,
              posts: 0.7
            }
          }
        }
      }));
    } else {
      // Update existing sitemap
      dispatch(updateGeneral({
        seo: {
          sitemap: {
            ...general.seo.sitemap,
            changeFrequencies: {
              ...general.seo.sitemap.changeFrequencies,
              homepage: value
            }
          }
        }
      }));
    }
  };

  const handlePagesFrequencyChange = (value: string) => {
    // If sitemap doesn't exist yet, create it with default values
    if (!general?.seo?.sitemap) {
      dispatch(updateGeneral({
        seo: {
          ...general?.seo,
          sitemap: {
            excludeUrls: [],
            additionalUrls: [],
            changeFrequencies: {
              homepage: "daily",
              pages: value,
              posts: "monthly"
            },
            priorities: {
              homepage: 1.0,
              pages: 0.8,
              posts: 0.7
            }
          }
        }
      }));
    } else {
      // Update existing sitemap
      dispatch(updateGeneral({
        seo: {
          sitemap: {
            ...general.seo.sitemap,
            changeFrequencies: {
              ...general.seo.sitemap.changeFrequencies,
              pages: value
            }
          }
        }
      }));
    }
  };

  const handlePostsFrequencyChange = (value: string) => {
    // If sitemap doesn't exist yet, create it with default values
    if (!general?.seo?.sitemap) {
      dispatch(updateGeneral({
        seo: {
          ...general?.seo,
          sitemap: {
            excludeUrls: [],
            additionalUrls: [],
            changeFrequencies: {
              homepage: "daily",
              pages: "weekly",
              posts: value
            },
            priorities: {
              homepage: 1.0,
              pages: 0.8,
              posts: 0.7
            }
          }
        }
      }));
    } else {
      // Update existing sitemap
      dispatch(updateGeneral({
        seo: {
          sitemap: {
            ...general.seo.sitemap,
            changeFrequencies: {
              ...general.seo.sitemap.changeFrequencies,
              posts: value
            }
          }
        }
      }));
    }
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
          <Toaster richColors position="top-right" />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
              <TabsTrigger value="pages">Sayfalar</TabsTrigger>
              <TabsTrigger value="schema">Schema.org</TabsTrigger>
              <TabsTrigger value="robots">Robots.txt</TabsTrigger>
              <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
              <TabsTrigger value="settings">Ayarlar</TabsTrigger>
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
                      {seoPages.length > 0 ? (
                        seoPages.map((page) => (
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
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            {loading ? "Yükleniyor...O pages..." : "No SEO pages configured yet."}
                          </TableCell>
                        </TableRow>
                      )}
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
                      <p className="text-sm text-muted-foreground mb-4">{seoPages.length > 0 ? seoPages[0].title : "Yükleniyor..."}</p>
                      
                      <h3 className="text-sm font-medium mb-2">Site Description</h3>
                      <p className="text-sm text-muted-foreground mb-4">{seoPages.length > 0 ? seoPages[0].description : "Yükleniyor..."}</p>
                      
                      <h3 className="text-sm font-medium mb-2">Global Keywords</h3>
                      <p className="text-sm text-muted-foreground">{seoPages.length > 0 ? seoPages[0].keywords : "Yükleniyor..."}</p>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center">
                      {seoPages.length > 0 && seoPages[0].ogImage && (
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
                          if (seoPages.length > 0) {
                          setSelectedPage(seoPages[0]);
                          setActiveTab("editor");
                          }
                        }}
                        disabled={seoPages.length === 0}
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
                      <h3 className="text-lg font-medium mb-4">SEO Metrics for {selectedPage?.name}</h3>
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
            
            <TabsContent value="schema" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Schema.org Yapılandırılmış Veri</CardTitle>
                  <CardDescription>
                    Arama motorları için yapılandırılmış veri ayarlarını yönetin. Bu ayarlar, sitenizin arama sonuçlarında nasıl görüneceğini etkiler.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Organization Schema</h3>
                      <p className="text-sm text-muted-foreground">
                        Ana sayfanız için kuruluş bilgilerini ayarlayın. Bu bilgiler Google Knowledge Graph'ta görüntülenebilir.
                      </p>
                      
                      <div className="grid grid-cols-1 gap-4 mt-2">
                        <div className="space-y-2">
                          <Label htmlFor="org-social-facebook">Facebook URL</Label>
                          <Input 
                            id="org-social-facebook" 
                            placeholder="https://facebook.com/yourpage" 
                            defaultValue="https://facebook.com/wordpressclone"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="org-social-twitter">Twitter URL</Label>
                          <Input 
                            id="org-social-twitter" 
                            placeholder="https://twitter.com/yourhandle" 
                            defaultValue="https://twitter.com/wordpressclone"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="org-social-instagram">Instagram URL</Label>
                          <Input 
                            id="org-social-instagram" 
                            placeholder="https://instagram.com/yourhandle" 
                            defaultValue="https://instagram.com/wordpressclone"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="org-social-linkedin">LinkedIn URL</Label>
                          <Input 
                            id="org-social-linkedin" 
                            placeholder="https://linkedin.com/company/yourcompany" 
                            defaultValue="https://linkedin.com/company/wordpressclone"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">WebPage Schema</h3>
                      <p className="text-sm text-muted-foreground">
                        Her sayfanız için otomatik olarak WebPage şeması oluşturulur. Bu, arama motorlarının içeriğinizi daha iyi anlamasına yardımcı olur.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">BlogPosting Schema</h3>
                      <p className="text-sm text-muted-foreground">
                        Blog yazılarınız için otomatik olarak BlogPosting şeması oluşturulur. Bu, arama sonuçlarında zengin snippet'ler görüntülenmesine yardımcı olur.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">İçerik Haritası</h3>
                      <p className="text-sm text-muted-foreground">
                        İçerik haritası, sayfalarınızdaki başlıkları otomatik olarak algılar ve bir içindekiler tablosu oluşturur. Bu, kullanıcı deneyimini iyileştirir ve SEO'ya katkıda bulunur.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="robots" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Robots.txt Ayarları</CardTitle>
                  <CardDescription>
                    Arama motoru robotlarının sitenize nasıl erişeceğini yapılandırın. Robots.txt dosyası, web tarayıcılarına hangi sayfaların taranmasına izin verildiğini ve hangilerinin taranmaması gerektiğini söyler.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="enable-default-rules" 
                        checked={general?.seo?.robotsTxt?.enableDefaultRules !== false}
                        onCheckedChange={handleEnableDefaultRulesChange}
                      />
                      <Label htmlFor="enable-default-rules">Varsayılan kuralları etkinleştir</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="custom-rules">Özel Kurallar</Label>
                      <Textarea 
                        id="custom-rules" 
                        placeholder="User-agent: *&#10;Disallow: /ornek-dizin/&#10;Allow: /ornek-dizin/izinli-sayfa.html" 
                        className="min-h-[200px] font-mono"
                        value={general?.seo?.robotsTxt?.customRules || ""}
                        onChange={handleCustomRulesChange}
                      />
                      <p className="text-sm text-muted-foreground">
                        Özel robots.txt kurallarınızı buraya girin. Her satır yeni bir kural olmalıdır.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Önizleme</h3>
                      <Card className="bg-muted">
                        <CardContent className="p-4">
                          <pre className="text-xs overflow-auto whitespace-pre-wrap">
                            {`# robots.txt for ${process.env.NEXT_PUBLIC_SITE_URL || 'https://wordpress-clone.com'}
${general?.seo?.robotsTxt?.enableDefaultRules !== false ? `User-agent: *
Allow: /

# Sitemap
Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://wordpress-clone.com'}/sitemap.xml

# Disallow admin and dashboard paths
User-agent: *
Disallow: /dashboard/
Disallow: /api/
Disallow: /giris/
Disallow: /kayit/
Disallow: /sifremi-unuttum/
Disallow: /sifre-sifirla/
Disallow: /mail-dogrulama/` : ''}

${general?.seo?.robotsTxt?.customRules ? `# Custom rules
${general.seo.robotsTxt.customRules}` : ''}`}
                          </pre>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => {
                          window.open(`${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/robots.txt`, '_blank');
                        }}
                      >
                        Robots.txt Görüntüle
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sitemap" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sitemap.xml Ayarları</CardTitle>
                  <CardDescription>
                    Site haritanızı yapılandırın. Sitemap.xml dosyası, arama motorlarına sitenizin yapısını ve içeriğini anlamalarına yardımcı olmak için kullanılır.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Değişim Sıklığı</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="homepage-freq">Ana Sayfa</Label>
                          <Select
                            value={general?.seo?.sitemap?.changeFrequencies?.homepage || "daily"}
                            onValueChange={handleHomepageFrequencyChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Değişim sıklığı seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="always">Her zaman</SelectItem>
                              <SelectItem value="hourly">Saatlik</SelectItem>
                              <SelectItem value="daily">Günlük</SelectItem>
                              <SelectItem value="weekly">Haftalık</SelectItem>
                              <SelectItem value="monthly">Aylık</SelectItem>
                              <SelectItem value="yearly">Yıllık</SelectItem>
                              <SelectItem value="never">Asla</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="pages-freq">Sayfalar</Label>
                          <Select
                            value={general?.seo?.sitemap?.changeFrequencies?.pages || "weekly"}
                            onValueChange={handlePagesFrequencyChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Değişim sıklığı seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="always">Her zaman</SelectItem>
                              <SelectItem value="hourly">Saatlik</SelectItem>
                              <SelectItem value="daily">Günlük</SelectItem>
                              <SelectItem value="weekly">Haftalık</SelectItem>
                              <SelectItem value="monthly">Aylık</SelectItem>
                              <SelectItem value="yearly">Yıllık</SelectItem>
                              <SelectItem value="never">Asla</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="posts-freq">Yazılar</Label>
                          <Select
                            value={general?.seo?.sitemap?.changeFrequencies?.posts || "monthly"}
                            onValueChange={handlePostsFrequencyChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Değişim sıklığı seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="always">Her zaman</SelectItem>
                              <SelectItem value="hourly">Saatlik</SelectItem>
                              <SelectItem value="daily">Günlük</SelectItem>
                              <SelectItem value="weekly">Haftalık</SelectItem>
                              <SelectItem value="monthly">Aylık</SelectItem>
                              <SelectItem value="yearly">Yıllık</SelectItem>
                              <SelectItem value="never">Asla</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Öncelikler</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="homepage-priority">Ana Sayfa</Label>
                          <Input
                            id="homepage-priority"
                            type="number"
                            min="0.0"
                            max="1.0"
                            step="0.1"
                            value={general?.seo?.sitemap?.priorities?.homepage || 1.0}
                            onChange={handleHomepagePriorityChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="pages-priority">Sayfalar</Label>
                          <Input
                            id="pages-priority"
                            type="number"
                            min="0.0"
                            max="1.0"
                            step="0.1"
                            value={general?.seo?.sitemap?.priorities?.pages || 0.8}
                            onChange={handlePagesPriorityChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="posts-priority">Yazılar</Label>
                          <Input
                            id="posts-priority"
                            type="number"
                            min="0.0"
                            max="1.0"
                            step="0.1"
                            value={general?.seo?.sitemap?.priorities?.posts || 0.7}
                            onChange={handlePostsPriorityChange}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Hariç Tutulan URL'ler</h3>
                      <p className="text-sm text-muted-foreground">
                        Site haritasına dahil edilmeyecek URL'leri belirtin. Her satıra bir URL girin.
                      </p>
                      <Textarea
                        placeholder="/ornek-url-1&#10;/ornek-url-2"
                        className="min-h-[100px] font-mono"
                        value={(general?.seo?.sitemap?.excludeUrls || []).join('\n')}
                        onChange={handleExcludeUrlsChange}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => {
                          window.open(`${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/sitemap.xml`, '_blank');
                        }}
                      >
                        Sitemap.xml Görüntüle
                      </Button>
                    </div>
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
                        {seoPages.length > 0 ? (
                          seoPages.map((page) => (
                          <Button
                            key={page.id}
                            variant={selectedPage?.id === page.id ? "secondary" : "ghost"}
                            className="w-full justify-start text-left"
                            onClick={() => setSelectedPage(page)}
                          >
                            {page.name}
                          </Button>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground p-2">No pages configured</div>
                        )}
                      </div>
                    </div>
                    
                    {/* Form */}
                    {selectedPage ? (
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
                                value={selectedPage?.ogImage || ''}
                                onChange={(e) => handleChange('ogImage', e.target.value)}
                                className="flex-1"
                                placeholder="Enter image URL or upload an image"
                              />
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                                accept="image/*"
                              />
                              <Button 
                                variant="outline" 
                                className="flex gap-2"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={imageUploading}
                              >
                                {imageUploading ? (
                                  <>
                                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                                    <span>Uploading...</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload size={16} />
                                    <span>Upload</span>
                                  </>
                                )}
                              </Button>
                            </div>
                            
                            {selectedPage?.ogImage && (
                              <div className="mt-2 rounded-md border p-2 flex items-center gap-3">
                                <img 
                                  src={selectedPage.ogImage} 
                                  alt="OG Image Preview" 
                                  className="h-16 w-24 object-cover rounded"
                                />
                                <div className="text-xs text-muted-foreground flex-1">
                                  <p>Preview of your Open Graph image (shown when sharing on social media)</p>
                                  <p className="text-xs truncate mt-1">{selectedPage.ogImage}</p>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => window.open(selectedPage.ogImage, '_blank')}
                                >
                                  <ExternalLink size={14} className="mr-1" />
                                  Preview
                                </Button>
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
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <p className="text-muted-foreground">Select a page to edit SEO settings</p>
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
