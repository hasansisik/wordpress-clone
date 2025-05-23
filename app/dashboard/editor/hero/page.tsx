"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Check,
  Upload,
  ArrowLeft,
  Monitor,
  Smartphone,
  Tablet,
  Maximize2,
  Minimize2,
  Save,
  Eye,
  Layout,
  Settings,
  Type,
  Image,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { Textarea } from "@/components/ui/textarea";
import Hero1 from "@/components/sections/Hero1";
import Hero3 from "@/components/sections/Hero3";

// CSS styles for editor layout mode
const editorStyles = `
.editor-layout-mode {
  position: relative;
}

.editor-layout-mode h1, 
.editor-layout-mode h2, 
.editor-layout-mode h3,
.editor-layout-mode p,
.editor-layout-mode .btn {
  position: relative;
  outline: 2px dashed #3b82f6 !important;
  outline-offset: 2px;
  transition: outline 0.2s ease;
}

.editor-layout-mode h1:hover, 
.editor-layout-mode h2:hover, 
.editor-layout-mode h3:hover,
.editor-layout-mode p:hover,
.editor-layout-mode .btn:hover {
  outline: 2px solid #3b82f6 !important;
  cursor: pointer;
  background-color: rgba(59, 130, 246, 0.05);
}

.editor-layout-mode h1:hover::before, 
.editor-layout-mode h2:hover::before, 
.editor-layout-mode h3:hover::before,
.editor-layout-mode p:hover::before,
.editor-layout-mode .btn:hover::before {
  content: "Edit Text";
  position: absolute;
  top: -20px;
  left: 0;
  background: #3b82f6;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 2px;
  z-index: 100;
}

.editor-layout-mode img {
  position: relative;
  outline: 2px dashed #f97316 !important;
  outline-offset: 2px;
  transition: outline 0.2s ease;
}

.editor-layout-mode img:hover {
  outline: 2px solid #f97316 !important;
  cursor: pointer;
  filter: brightness(0.95);
}

.editor-layout-mode img:hover::before {
  content: "Replace Image";
  position: absolute;
  top: -20px;
  left: 0;
  background: #f97316;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 2px;
  z-index: 100;
}

/* Make edit mode more visible */
.editor-mode-active .editor-layout-mode::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  border: 3px solid #3b82f6;
  z-index: 1;
}

/* Style for the edit/live toggle buttons */
.mode-toggle-btn {
  font-weight: 600;
  transition: all 0.2s ease;
}

.mode-toggle-btn.active {
  background-color: #3b82f6 !important;
  color: white !important;
  box-shadow: 0 2px 5px rgba(59, 130, 246, 0.3);
}

.mode-toggle-btn.active svg {
  color: white !important;
}
`;

// Hero style options
const heroes = [
  {
    id: 1,
    name: "Hero 1",
    image: "/assets/imgs/heroes/hero1.png",
    component: "hero1",
    description: "Simple and elegant hero section with primary and secondary buttons"
  },
  {
    id: 3,
    name: "Hero 3",
    image: "/assets/imgs/heroes/hero3.png",
    component: "hero3",
    description: "Hero section with avatars and grid image layout"
  }
];

export default function HeroEditor() {
  const router = useRouter();
  const [selectedHero, setSelectedHero] = useState<number | null>(null);
  const [heroData, setHeroData] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState("desktop"); // desktop, tablet, mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [livePreview, setLivePreview] = useState(false); // başlangıçta editor mode aktif

  // For auto-save debounce
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  // For iframe reference
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Effect to fetch initial hero data on page load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        console.log('Fetching initial hero data...');
        // Add a timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/hero?t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          next: { revalidate: 0 }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Initial hero data:', data);
          
          // Set the selected hero based on the active hero in the data
          const activeComponent = data.activeHero || "hero1";
          if (activeComponent === "hero1") {
            setSelectedHero(1);
          } else if (activeComponent === "hero3") {
            setSelectedHero(3);
          }
          
          // Set the hero data after setting the selected hero
          setHeroData(data);
          
          // Force immediate iframe update
          setTimeout(() => {
            if (iframeRef.current) {
              const queryParams = new URLSearchParams();
              queryParams.append('heroData', JSON.stringify(data));
              queryParams.append('mode', livePreview ? 'live' : 'editor');
              
              const previewUrl = `/preview/hero?${queryParams.toString()}`;
              iframeRef.current.src = previewUrl;
            }
          }, 100);
        } else {
          console.error('Error fetching initial hero data:', await response.text());
          showErrorAlert('Failed to load hero data. Please try again.');
        }
      } catch (error) {
        console.error('Error in initial data fetch:', error);
        showErrorAlert('Failed to connect to the server. Please check your connection.');
      }
    };

    fetchInitialData();

    // Handle messages from iframe
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      console.log("Received message from iframe:", event.data);
      
      // Handle element click from iframe
      if (event.data.type === "ELEMENT_CLICKED") {
        const fieldPath = event.data.fieldPath;
        const currentValue = event.data.currentValue || '';
        console.log("Element clicked in iframe:", fieldPath, "Current value:", currentValue);
        
        // Create a customized prompt with better formatting
        const newValue = window.prompt(`Edit content: ${fieldPath}`, currentValue);
        
        // Update if a new value was provided (including empty string)
        if (newValue !== null) {
          handleTextChange(newValue, fieldPath);
          
          // Also update iframe content
          updateIframeContent();
        }
      }
      
      // Handle image click from iframe
      if (event.data.type === "IMAGE_CLICKED") {
        const imagePath = event.data.imagePath;
        console.log("Image clicked in iframe:", imagePath);
        
        // Create a file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => {
          handleImageUpload(e as any, imagePath);
          // Update iframe content after upload
          setTimeout(() => updateIframeContent(), 1000);
        };
        fileInput.click();
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Update iframe when heroData or mode changes
  useEffect(() => {
    if (heroData) {
      updateIframeContent();
    }
  }, [heroData, livePreview]);

  // Function to update iframe content
  const updateIframeContent = () => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    
    iframeRef.current.contentWindow.postMessage({
      type: "UPDATE_HERO_DATA",
      heroData: heroData
    }, "*");
    
    iframeRef.current.contentWindow.postMessage({
      type: "UPDATE_MODE",
      mode: livePreview ? "live" : "editor"
    }, "*");
  };

  // Toggle editor visibility when mode changes
  useEffect(() => {
    console.log("Preview mode changed:", livePreview ? "Live" : "Edit");
    
    // Apply any additional changes needed for edit mode
    if (!livePreview) {
      document.documentElement.classList.add('editor-mode-active');
    } else {
      document.documentElement.classList.remove('editor-mode-active');
    }
  }, [livePreview]);

  // Show success alert
  const showSuccessAlert = (message: string) => {
    setAlertType("success");
    setAlertMessage(message);
    setShowAlert(true);

    const timeout = setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    return () => clearTimeout(timeout);
  };

  // Show error alert
  const showErrorAlert = (message: string) => {
    setAlertType("error");
    setAlertMessage(message);
    setShowAlert(true);

    const timeout = setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    return () => clearTimeout(timeout);
  };

  // Function to refresh hero data from API
  const refreshHeroData = async () => {
    if (selectedHero === null) return;

    try {
      console.log('Refreshing hero data...');
      const response = await fetch('/api/hero', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        next: { revalidate: 0 }
      });
      
      if (response.ok) {
        const freshData = await response.json();
        console.log('Refreshed hero data:', freshData);
        
        const heroStyle = heroes.find((h) => h.id === selectedHero);
        if (!heroStyle) return;

        const componentKey = heroStyle.component;

        setHeroData({
          ...freshData,
          activeHero: componentKey
        });
      } else {
        console.error('Error refreshing hero data:', await response.text());
      }
    } catch (error) {
      console.error('Error refreshing hero data:', error);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imagePath: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageUploading(true);
      // Upload to Cloudinary
      const uploadedUrl = await uploadImageToCloudinary(file);

      // Update the correct path in the heroData
      const newData = { ...heroData };
      
      // Split the path by dots and use it to navigate and update the object
      const parts = imagePath.split('.');
      let current: any = newData;
      
      // Navigate to the second-to-last part
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      
      // Update the value
      current[parts[parts.length - 1]] = uploadedUrl;
      
      // Update state with new data
      setHeroData(newData);
      
      // Save changes to API
      await saveChangesToAPI(newData);

      showSuccessAlert("Image uploaded successfully");
    } catch (error: any) {
      showErrorAlert(`Error uploading image: ${error.message}`);
    } finally {
      setImageUploading(false);
    }
  };

  // Handle text change with auto-save
  const handleTextChange = (value: string, path: string) => {
    // Update the correct path in the heroData
    const newData = { ...heroData };
    
    // Split the path by dots and use it to navigate and update the object
    const parts = path.split('.');
    let current: any = newData;
    
    // Navigate to the second-to-last part
    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }
    
    // Update the value
    current[parts[parts.length - 1]] = value;
    
    // Update state with new data
    setHeroData(newData);
    
    // Auto-save after a brief delay (debounce)
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    const timeoutId = setTimeout(() => {
      saveChangesToAPI(newData);
    }, 1000); // Wait 1 second after typing stops before saving
    
    setSaveTimeout(timeoutId);
  };

  // Handler for the "Save Changes" button click
  const handleSaveChanges = async () => {
    try {
      await saveChangesToAPI(heroData);
      showSuccessAlert("Hero changes saved successfully!");
      
      // Redirect to dashboard after successful save
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error: any) {
      showErrorAlert(`Error saving changes: ${error.message}`);
    }
  };

  const selectedHeroInfo = heroes.find((h) => h.id === selectedHero);

  // Function to handle direct element editing in layout mode
  const handleElementClick = (event: React.MouseEvent, fieldPath: string) => {
    if (livePreview) return;
    
    // Stop event propagation
    event.preventDefault();
    event.stopPropagation();
    
    // Get the current field value
    const parts = fieldPath.split('.');
    let current: any = heroData;
    for (const part of parts) {
      if (current && typeof current === 'object') {
        current = current[part];
      } else {
        current = '';
        break;
      }
    }
    
    // Create a popup for editing
    const currentValue = current || '';
    const newValue = window.prompt('Edit content:', currentValue);
    
    // Update if a new value was provided
    if (newValue !== null && newValue !== currentValue) {
      handleTextChange(newValue, fieldPath);
    }
  };

  // Function to handle image editing in layout mode
  const handleImageClick = (event: React.MouseEvent, imagePath: string) => {
    if (livePreview) return;
    
    // Stop event propagation
    event.preventDefault();
    event.stopPropagation();
    
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => handleImageUpload(e as any, imagePath);
    fileInput.click();
  };

  // Render the preview div with iframe
  const renderPreviewArea = () => {
    if (!heroData) {
      console.log("No heroData available yet");
      return <div className="w-full h-full flex items-center justify-center">Loading preview...</div>;
    }

    // Create a query string with the hero data
    const queryParams = new URLSearchParams();
    queryParams.append('heroData', JSON.stringify(heroData));
    queryParams.append('mode', livePreview ? 'live' : 'editor');
    
    // URL for the preview iframe
    const previewUrl = `/preview/hero?${queryParams.toString()}`;
    
    console.log("Rendering iframe with preview URL:", previewUrl);
    
    return (
      <iframe 
        ref={iframeRef}
        src={previewUrl}
        className={`
          border-none transition-all duration-300 ease-in-out bg-white h-full
          ${previewMode === "desktop" ? "w-full" : previewMode === "tablet" ? "w-[768px] mx-auto" : "w-[375px] mx-auto"}
        `}
        title="Hero Preview"
      />
    );
  };

  // Handle hero type change - completely separate function
  const handleHeroTypeChange = async (newHeroType: string) => {
    console.log(`Changing hero to: ${newHeroType}`);
    
    try {
      // First update the state to show immediate change in UI
      const newSelectedHero = newHeroType === "hero1" ? 1 : 3;
      setSelectedHero(newSelectedHero);
      
      // Create a deep copy of the current hero data
      const newData = JSON.parse(JSON.stringify(heroData));
      newData.activeHero = newHeroType;
      
      // Update local state
      setHeroData(newData);
      
      // Save to API before rendering the iframe to ensure data consistency
      await saveChangesToAPIPromise(newData);
      
      // Force immediate iframe update AFTER api call completes
      if (iframeRef.current) {
        const queryParams = new URLSearchParams();
        queryParams.append('heroData', JSON.stringify(newData));
        queryParams.append('mode', livePreview ? 'live' : 'editor');
        
        // Direct URL update instead of postMessage for more reliable update
        const previewUrl = `/preview/hero?${queryParams.toString()}`;
        iframeRef.current.src = previewUrl;
        
        console.log(`Iframe updated with ${newHeroType}`);
      }
    } catch (error) {
      console.error("Error changing hero type:", error);
      showErrorAlert("Failed to change hero type. Please try again.");
    }
  };
  
  // Promise-based version of saveChangesToAPI
  const saveChangesToAPIPromise = (data: any): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Saving data to API:', data);
  
        // Send the data to the API
        const response = await fetch('/api/hero', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          cache: 'no-store'
        });
  
        if (!response.ok) {
          throw new Error('Failed to save changes');
        }
  
        // Get the response data
        const result = await response.json();
        console.log('API response:', result);
        
        resolve();
      } catch (error: any) {
        console.error('Error saving hero changes:', error);
        reject(error);
      }
    });
  };

  // Save changes to API
  const saveChangesToAPI = async (data: any) => {
    try {
      console.log('Saving data to API:', data);

      // Send the data to the API
      const response = await fetch('/api/hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      // Get the response data
      const result = await response.json();
      console.log('API response:', result);

    } catch (error: any) {
      console.error('Error saving hero changes:', error);
      showErrorAlert(`Error saving changes: ${error.message}`);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Include editor styles */}
      <style jsx global>{editorStyles}</style>
      
      <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-white px-4">
        <div className="flex items-center gap-2">
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
                <BreadcrumbPage>Hero Editor</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <div className="border rounded-md bg-gray-50 p-1 flex">
            <Button
              variant={previewMode === "desktop" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setPreviewMode("desktop")}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === "tablet" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setPreviewMode("tablet")}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === "mobile" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setPreviewMode("mobile")}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            className="bg-black hover:bg-gray-800 text-white h-8"
            size="sm"
            onClick={handleSaveChanges}
          >
            <Save className="h-4 w-4 mr-1" />
            <span className="text-xs">Save Changes</span>
          </Button>
        </div>
      </header>

      {showAlert && (
        <Alert
          className={`mx-4 mt-4 ${
            alertType === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {alertType === "success" ? (
            <Check className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle className="text-sm font-medium">
            {alertType === "success" ? "Success" : "Error"}
          </AlertTitle>
          <AlertDescription className="text-xs">{alertMessage}</AlertDescription>
        </Alert>
      )}

      {/* Main editor layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Sidebar */}
        <div className={`border-r bg-gray-50 flex flex-col ${sidebarCollapsed ? 'w-16' : 'w-80'} transition-all duration-300 ease-in-out`}>
          <div className="p-3 border-b bg-white flex justify-between items-center">
            <h3 className={`text-sm font-medium ${sidebarCollapsed ? 'hidden' : 'block'}`}>Edit Hero</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
          </div>
          
          {!sidebarCollapsed && (
            <div className="overflow-y-auto flex-1">
              {/* Sidebar Content */}
              <Tabs defaultValue="layout" className="w-full">
                <TabsList className="grid grid-cols-4 m-2">
                  <TabsTrigger value="layout" className="px-2">
                    <Layout className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="content" className="px-2">
                    <Type className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="style" className="px-2">
                    <Settings className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="media" className="px-2">
                    <Image className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
                
                {/* Layout Tab */}
                <TabsContent value="layout" className="m-0 p-3 border-t">
                  <div className="space-y-3">
                    <Label className="text-xs text-gray-500">Hero Component</Label>
                    <select
                      value={heroData?.activeHero}
                      onChange={(e) => handleHeroTypeChange(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="hero1">Hero 1</option>
                      <option value="hero3">Hero 3</option>
                    </select>
                  </div>
                </TabsContent>
                
                {/* Content Tab */}
                <TabsContent value="content" className="m-0 p-3 border-t">
                  <div className="space-y-4">
                    {heroData?.activeHero === "hero1" ? (
                      <>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Badge Label</Label>
                          <Input
                            value={heroData?.hero1?.badge?.label || ""}
                            onChange={(e) => handleTextChange(e.target.value, 'hero1.badge.label')}
                            placeholder="e.g. New, Hot"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Badge Text</Label>
                          <Input
                            value={heroData?.hero1?.badge?.text || ""}
                            onChange={(e) => handleTextChange(e.target.value, 'hero1.badge.text')}
                            placeholder="e.g. Free Lifetime Update"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Badge Link</Label>
                          <Input
                            value={heroData?.hero1?.badge?.link || ""}
                            onChange={(e) => handleTextChange(e.target.value, 'hero1.badge.link')}
                            placeholder="e.g. #"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Title</Label>
                          <Input
                            value={heroData?.hero1?.title || ""}
                            onChange={(e) => handleTextChange(e.target.value, 'hero1.title')}
                            placeholder="Enter hero title"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Description</Label>
                          <Textarea
                            value={heroData?.hero1?.description || ""}
                            onChange={(e) => handleTextChange(e.target.value, 'hero1.description')}
                            placeholder="Enter hero description"
                            className="min-h-[80px] text-xs resize-y"
                          />
                        </div>
                        
                        {/* Primary Button */}
                        <div className="p-3 bg-gray-50 rounded-md space-y-3">
                          <Label className="text-xs font-medium text-gray-700">Primary Button</Label>
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Text</Label>
                            <Input
                              value={heroData?.hero1?.primaryButton?.text || ""}
                              onChange={(e) => handleTextChange(e.target.value, 'hero1.primaryButton.text')}
                              placeholder="e.g. Get Started"
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Link</Label>
                            <Input
                              value={heroData?.hero1?.primaryButton?.link || ""}
                              onChange={(e) => handleTextChange(e.target.value, 'hero1.primaryButton.link')}
                              placeholder="e.g. /register"
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                        
                        {/* Secondary Button */}
                        <div className="p-3 bg-gray-50 rounded-md space-y-3">
                          <Label className="text-xs font-medium text-gray-700">Secondary Button</Label>
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Text</Label>
                            <Input
                              value={heroData?.hero1?.secondaryButton?.text || ""}
                              onChange={(e) => handleTextChange(e.target.value, 'hero1.secondaryButton.text')}
                              placeholder="e.g. Contact Sales"
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Link</Label>
                            <Input
                              value={heroData?.hero1?.secondaryButton?.link || ""}
                              onChange={(e) => handleTextChange(e.target.value, 'hero1.secondaryButton.link')}
                              placeholder="e.g. /contact"
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                        
                        {/* Card Settings */}
                        <div className="p-3 bg-gray-50 rounded-md space-y-3">
                          <Label className="text-xs font-medium text-gray-700">Card Settings</Label>
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Card Title</Label>
                            <Input
                              value={heroData?.hero1?.card?.title || ""}
                              onChange={(e) => handleTextChange(e.target.value, 'hero1.card.title')}
                              placeholder="e.g. Join Our Community"
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Card Description</Label>
                            <Input
                              value={heroData?.hero1?.card?.description || ""}
                              onChange={(e) => handleTextChange(e.target.value, 'hero1.card.description')}
                              placeholder="e.g. Over 2,500+ happy customers"
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Button Label</Label>
                            <Input
                              value={heroData?.hero1?.card?.button?.label || ""}
                              onChange={(e) => handleTextChange(e.target.value, 'hero1.card.button.label')}
                              placeholder="e.g. Get"
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Button Text</Label>
                            <Input
                              value={heroData?.hero1?.card?.button?.text || ""}
                              onChange={(e) => handleTextChange(e.target.value, 'hero1.card.button.text')}
                              placeholder="e.g. Free Update"
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Button Link</Label>
                            <Input
                              value={heroData?.hero1?.card?.button?.link || ""}
                              onChange={(e) => handleTextChange(e.target.value, 'hero1.card.button.link')}
                              placeholder="e.g. #"
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Badge Text</Label>
                          <Input
                            value={heroData?.hero3?.badge?.text || ""}
                            onChange={(e) => handleTextChange(e.target.value, 'hero3.badge.text')}
                            placeholder="e.g. Build Without Limits"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Title (First Line)</Label>
                          <Input
                            value={heroData?.hero3?.title?.part1 || ""}
                            onChange={(e) => handleTextChange(e.target.value, 'hero3.title.part1')}
                            placeholder="Enter first line of title"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Title (Second Line)</Label>
                          <Input
                            value={heroData?.hero3?.title?.part2 || ""}
                            onChange={(e) => handleTextChange(e.target.value, 'hero3.title.part2')}
                            placeholder="Enter second line of title"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Description</Label>
                          <Textarea
                            value={heroData?.hero3?.description || ""}
                            onChange={(e) => handleTextChange(e.target.value, 'hero3.description')}
                            placeholder="Enter hero description"
                            className="min-h-[80px] text-xs resize-y"
                          />
                        </div>
                        
                        {/* Button Settings */}
                        <div className="p-3 bg-gray-50 rounded-md space-y-3">
                          <Label className="text-xs font-medium text-gray-700">Button Settings</Label>
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Button Text</Label>
                            <Input
                              value={heroData?.hero3?.button?.text || ""}
                              onChange={(e) => handleTextChange(e.target.value, 'hero3.button.text')}
                              placeholder="e.g. Try It Free"
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Button Link</Label>
                            <Input
                              value={heroData?.hero3?.button?.link || ""}
                              onChange={(e) => handleTextChange(e.target.value, 'hero3.button.link')}
                              placeholder="e.g. /register"
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>
                
                {/* Style Tab */}
                <TabsContent value="style" className="m-0 p-3 border-t">
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500">Style options will appear here (padding, margins, colors, etc.)</p>
                  </div>
                </TabsContent>
                
                {/* Media Tab */}
                <TabsContent value="media" className="m-0 p-3 border-t">
                  <div className="space-y-4">
                    {heroData?.activeHero === "hero1" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Background Image</Label>
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <Input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                                onChange={(e) => handleImageUpload(e, 'hero1.images.background')}
                              />
                              <Input
                                readOnly
                                value={heroData?.hero1?.images?.background || ""}
                                placeholder="Upload image"
                                className="h-8 text-xs pr-20"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                disabled={imageUploading}
                                className="absolute right-0 top-0 h-8 rounded-l-none text-xs"
                                size="sm"
                              >
                                {imageUploading ? (
                                  "Uploading..."
                                ) : (
                                  <>
                                    <Upload className="w-3 h-3 mr-1" />
                                    Upload
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                          {heroData?.hero1?.images?.background && (
                            <div className="mt-2 border rounded overflow-hidden w-full h-24">
                              <img 
                                src={heroData.hero1.images.background} 
                                alt="Background" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Shape 1 Image</Label>
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <Input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                                onChange={(e) => handleImageUpload(e, 'hero1.images.shape1')}
                              />
                              <Input
                                readOnly
                                value={heroData?.hero1?.images?.shape1 || ""}
                                placeholder="Upload image"
                                className="h-8 text-xs pr-20"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                disabled={imageUploading}
                                className="absolute right-0 top-0 h-8 rounded-l-none text-xs"
                                size="sm"
                              >
                                {imageUploading ? "Uploading..." : (
                                  <>
                                    <Upload className="w-3 h-3 mr-1" />
                                    Upload
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Shape 2 Image</Label>
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <Input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                                onChange={(e) => handleImageUpload(e, 'hero1.images.shape2')}
                              />
                              <Input
                                readOnly
                                value={heroData?.hero1?.images?.shape2 || ""}
                                placeholder="Upload image"
                                className="h-8 text-xs pr-20"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                disabled={imageUploading}
                                className="absolute right-0 top-0 h-8 rounded-l-none text-xs"
                                size="sm"
                              >
                                {imageUploading ? "Uploading..." : (
                                  <>
                                    <Upload className="w-3 h-3 mr-1" />
                                    Upload
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Shape 3 Image</Label>
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <Input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                                onChange={(e) => handleImageUpload(e, 'hero1.images.shape3')}
                              />
                              <Input
                                readOnly
                                value={heroData?.hero1?.images?.shape3 || ""}
                                placeholder="Upload image"
                                className="h-8 text-xs pr-20"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                disabled={imageUploading}
                                className="absolute right-0 top-0 h-8 rounded-l-none text-xs"
                                size="sm"
                              >
                                {imageUploading ? "Uploading..." : (
                                  <>
                                    <Upload className="w-3 h-3 mr-1" />
                                    Upload
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Card Image</Label>
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <Input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                                onChange={(e) => handleImageUpload(e, 'hero1.card.image')}
                              />
                              <Input
                                readOnly
                                value={heroData?.hero1?.card?.image || ""}
                                placeholder="Upload image"
                                className="h-8 text-xs pr-20"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                disabled={imageUploading}
                                className="absolute right-0 top-0 h-8 rounded-l-none text-xs"
                                size="sm"
                              >
                                {imageUploading ? "Uploading..." : (
                                  <>
                                    <Upload className="w-3 h-3 mr-1" />
                                    Upload
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {heroData?.activeHero === "hero3" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Image Grid</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(heroData?.hero3?.images || {})
                              .filter(([key]) => key.startsWith('image'))
                              .map(([key, value], index) => (
                                <div key={key} className="border rounded overflow-hidden">
                                  <img 
                                    src={value as string} 
                                    alt={`Grid Image ${index + 1}`} 
                                    className="w-full h-16 object-cover"
                                  />
                                  <div className="p-1 bg-gray-50 text-xs">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-full text-[10px]"
                                      onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*';
                                        input.onchange = (e) => handleImageUpload(e as any, `hero3.images.${key}`);
                                        input.click();
                                      }}
                                    >
                                      <Upload className="w-3 h-3 mr-1" />
                                      Change
                                    </Button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Star Image</Label>
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <Input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                                onChange={(e) => handleImageUpload(e, 'hero3.images.star')}
                              />
                              <Input
                                readOnly
                                value={heroData?.hero3?.images?.star || ""}
                                placeholder="Upload image"
                                className="h-8 text-xs pr-20"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                disabled={imageUploading}
                                className="absolute right-0 top-0 h-8 rounded-l-none text-xs"
                                size="sm"
                              >
                                {imageUploading ? "Uploading..." : (
                                  <>
                                    <Upload className="w-3 h-3 mr-1" />
                                    Upload
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mt-4">
                          <Label className="text-xs text-gray-500 font-medium">Avatars</Label>
                          <div className="space-y-4">
                            {heroData?.hero3?.avatars?.map((avatar: any, index: number) => (
                              <div key={index} className="p-3 bg-gray-50 rounded-md space-y-3">
                                <Label className="text-xs font-medium text-gray-700">Avatar {index + 1}</Label>
                                <div className="flex gap-2 items-center">
                                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                    <img 
                                      src={avatar.image} 
                                      alt={avatar.alt} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <div className="space-y-1">
                                      <Label className="text-xs text-gray-500">Alt Text</Label>
                                      <Input
                                        value={avatar.alt || ""}
                                        onChange={(e) => handleTextChange(e.target.value, `hero3.avatars.${index}.alt`)}
                                        placeholder="e.g. User avatar"
                                        className="h-8 text-xs"
                                      />
                                    </div>
                                    <div className="flex items-center">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 text-[10px]"
                                        onClick={() => {
                                          const input = document.createElement('input');
                                          input.type = 'file';
                                          input.accept = 'image/*';
                                          input.onchange = (e) => handleImageUpload(e as any, `hero3.avatars.${index}.image`);
                                          input.click();
                                        }}
                                      >
                                        <Upload className="w-3 h-3 mr-1" />
                                        Change Avatar
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {sidebarCollapsed && (
            <div className="flex flex-col items-center pt-4 space-y-6">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Layout className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Type className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Image className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Preview Area */}
        <div className="flex-1 bg-gray-100 flex flex-col overflow-hidden">
          <div className="p-3 border-b bg-white flex justify-between items-center">
            <h3 className="text-sm font-medium">Preview</h3>
            <div className="flex items-center">
              <div className="mr-4 border rounded-md bg-gray-50 flex overflow-hidden">
                <Button
                  variant={livePreview ? "default" : "ghost"}
                  className={`px-4 rounded-none h-8 text-xs mode-toggle-btn ${livePreview ? 'active' : ''}`}
                  onClick={() => setLivePreview(true)}
                >
                  <Eye className="h-3 w-3 mr-1.5" />
                  Live Preview
                </Button>
                <Button 
                  variant={!livePreview ? "default" : "ghost"}
                  className={`px-4 rounded-none h-8 text-xs mode-toggle-btn ${!livePreview ? 'active' : ''}`}
                  onClick={() => setLivePreview(false)}
                >
                  <Layout className="h-3 w-3 mr-1.5" />
                  Editor Mode
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto relative">
            <div className={`
              mx-auto transition-all duration-300 ease-in-out bg-gray-100 h-full overflow-y-auto
              ${previewMode === "desktop" ? "w-full" : previewMode === "tablet" ? "w-[768px]" : "w-[375px]"}
            `}>
              {heroData && (
                <div className="relative h-full">
                  {!livePreview && (
                    <div className="absolute left-4 top-4 z-50 bg-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded shadow-md">
                      <Layout className="h-3 w-3 mr-1.5 inline" /> Editor Mode
                    </div>
                  )}
                  {renderPreviewArea()}
                </div>
              )}
            </div>

            {/* Floating help message when in layout mode */}
            {!livePreview && (
              <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-sm px-6 py-3 rounded-full shadow-lg z-50 flex items-center">
                <Layout className="h-4 w-4 mr-2" />
                <span className="font-medium">Editor Mode:</span> <span className="ml-1">Click on elements in the preview to edit them</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
