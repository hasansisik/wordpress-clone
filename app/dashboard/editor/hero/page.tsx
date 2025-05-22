"use client";

import { useEffect, useState } from "react";
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

// Hero style options
const heroes = [
  {
    id: 1,
    name: "Standard Hero",
    image: "/assets/imgs/heroes/hero1.png",
    component: "hero1",
    description: "Simple and elegant hero section with primary and secondary buttons"
  },
  {
    id: 3,
    name: "Profile Hero",
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

  useEffect(() => {
    if (selectedHero === null) return;

    // Fetch the hero data
    refreshHeroData();
  }, [selectedHero]);

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

      // Force refresh hero data after successful API call
      setTimeout(async () => {
        await refreshHeroData();
      }, 300);

    } catch (error: any) {
      console.error('Error saving hero changes:', error);
      showErrorAlert(`Error saving changes: ${error.message}`);
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
      saveChangesToAPI(newData);

      showSuccessAlert("Image uploaded successfully");
    } catch (error: any) {
      showErrorAlert(`Error uploading image: ${error.message}`);
    } finally {
      setImageUploading(false);
    }
  };

  // Handle text change
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

  return (
    <div className="w-full px-4 py-6">
      <header className="flex h-14 shrink-0 items-center gap-2 mb-6">
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
                <BreadcrumbPage>Hero Editor</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {showAlert && (
        <Alert
          className={`mb-6 ${
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

      {selectedHero === null ? (
        <Card className="mb-8 border border-gray-100 shadow-sm w-full">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Select Hero Style</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Choose a hero style that fits your website's design.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {heroes.map((hero) => (
                <div
                  key={hero.id}
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                    selectedHero === hero.id
                      ? "border-blue-500 ring-2 ring-blue-100"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedHero(hero.id)}
                >
                  <div className="h-56 bg-gray-50 relative">
                    {hero.image ? (
                      <img 
                        src={hero.image} 
                        alt={`${hero.name} Preview`} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        {hero.component} Preview
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium">{hero.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{hero.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-sm font-normal"
              onClick={() => setSelectedHero(null)}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Hero Selection</span>
            </Button>
            <Button
              className="bg-black hover:bg-gray-800 text-white text-sm"
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </div>
          
          {/* Hero editing tabs and content will go here */}
          {heroData && selectedHeroInfo && (
            <Tabs defaultValue="general" className="mt-4 space-y-6 w-full">
              <TabsList className="w-full flex h-10 rounded-md border bg-gray-50 p-1">
                <TabsTrigger
                  value="general"
                  className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-medium text-sm"
                >
                  General Settings
                </TabsTrigger>
                <TabsTrigger
                  value="content"
                  className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-medium text-sm"
                >
                  Content
                </TabsTrigger>
                <TabsTrigger
                  value="buttons"
                  className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-medium text-sm"
                >
                  Buttons
                </TabsTrigger>
                <TabsTrigger
                  value="images"
                  className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-medium text-sm"
                >
                  Images
                </TabsTrigger>
                {selectedHeroInfo.component === "hero1" && (
                  <TabsTrigger
                    value="card"
                    className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-medium text-sm"
                  >
                    Card
                  </TabsTrigger>
                )}
                {selectedHeroInfo.component === "hero3" && (
                  <TabsTrigger
                    value="avatars"
                    className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-medium text-sm"
                  >
                    Avatars
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="general" className="w-full">
                <Card className="border border-gray-100 shadow-sm w-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">General Settings</CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      Manage general settings for your hero section.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="activeHero" className="text-sm">
                            Active Hero Component
                          </Label>
                          <select
                            id="activeHero"
                            value={heroData.activeHero}
                            onChange={(e) => {
                              setHeroData({
                                ...heroData,
                                activeHero: e.target.value
                              });
                            }}
                            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                          >
                            <option value="hero1">Standard Hero</option>
                            <option value="hero3">Profile Hero</option>
                          </select>
                          <p className="text-xs text-gray-500">Select which hero component to display on your website.</p>
                        </div>

                        {selectedHeroInfo.component === "hero1" && (
                          <div className="space-y-2 pt-4">
                            <Label htmlFor="badgeLabel" className="text-sm">
                              Badge Label
                            </Label>
                            <Input
                              id="badgeLabel"
                              value={heroData.hero1.badge.label}
                              onChange={(e) => handleTextChange(e.target.value, 'hero1.badge.label')}
                              placeholder="e.g. New, Hot"
                              className="h-9 text-sm"
                            />
                            <p className="text-xs text-gray-500">The label text displayed in the badge.</p>
                          </div>
                        )}

                        <div className="space-y-2 pt-4">
                          <Label htmlFor="badgeText" className="text-sm">
                            Badge Text
                          </Label>
                          <Input
                            id="badgeText"
                            value={selectedHeroInfo.component === "hero1" ? heroData.hero1.badge.text : heroData.hero3.badge.text}
                            onChange={(e) => handleTextChange(e.target.value, `${selectedHeroInfo.component}.badge.text`)}
                            placeholder="e.g. Free Lifetime Update"
                            className="h-9 text-sm"
                          />
                          <p className="text-xs text-gray-500">The main text displayed in the badge.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="w-full">
                <Card className="border border-gray-100 shadow-sm w-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">Content</CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      Manage the main content and text of your hero section.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedHeroInfo.component === "hero1" ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm">
                              Title
                            </Label>
                            <Input
                              id="title"
                              value={heroData.hero1.title}
                              onChange={(e) => handleTextChange(e.target.value, 'hero1.title')}
                              placeholder="Enter hero title"
                              className="h-9 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm">
                              Description
                            </Label>
                            <Textarea
                              id="description"
                              value={heroData.hero1.description}
                              onChange={(e) => handleTextChange(e.target.value, 'hero1.description')}
                              placeholder="Enter hero description"
                              className="min-h-[100px] text-sm resize-y"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="titlePart1" className="text-sm">
                              Title (First Line)
                            </Label>
                            <Input
                              id="titlePart1"
                              value={heroData.hero3.title.part1}
                              onChange={(e) => handleTextChange(e.target.value, 'hero3.title.part1')}
                              placeholder="Enter first line of title"
                              className="h-9 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="titlePart2" className="text-sm">
                              Title (Second Line)
                            </Label>
                            <Input
                              id="titlePart2"
                              value={heroData.hero3.title.part2}
                              onChange={(e) => handleTextChange(e.target.value, 'hero3.title.part2')}
                              placeholder="Enter second line of title"
                              className="h-9 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm">
                              Description
                            </Label>
                            <Textarea
                              id="description"
                              value={heroData.hero3.description}
                              onChange={(e) => handleTextChange(e.target.value, 'hero3.description')}
                              placeholder="Enter hero description"
                              className="min-h-[100px] text-sm resize-y"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="buttons" className="w-full">
                <Card className="border border-gray-100 shadow-sm w-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">Buttons</CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      Customize the buttons in your hero section.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedHeroInfo.component === "hero1" ? (
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold">Primary Button</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="primaryButtonText" className="text-sm">
                                Button Text
                              </Label>
                              <Input
                                id="primaryButtonText"
                                value={heroData.hero1.primaryButton.text}
                                onChange={(e) => handleTextChange(e.target.value, 'hero1.primaryButton.text')}
                                placeholder="e.g. Explore Now"
                                className="h-9 text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="primaryButtonLink" className="text-sm">
                                Button Link
                              </Label>
                              <Input
                                id="primaryButtonLink"
                                value={heroData.hero1.primaryButton.link}
                                onChange={(e) => handleTextChange(e.target.value, 'hero1.primaryButton.link')}
                                placeholder="e.g. /services"
                                className="h-9 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold">Secondary Button</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="secondaryButtonText" className="text-sm">
                                Button Text
                              </Label>
                              <Input
                                id="secondaryButtonText"
                                value={heroData.hero1.secondaryButton.text}
                                onChange={(e) => handleTextChange(e.target.value, 'hero1.secondaryButton.text')}
                                placeholder="e.g. Contact Us"
                                className="h-9 text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="secondaryButtonLink" className="text-sm">
                                Button Link
                              </Label>
                              <Input
                                id="secondaryButtonLink"
                                value={heroData.hero1.secondaryButton.link}
                                onChange={(e) => handleTextChange(e.target.value, 'hero1.secondaryButton.link')}
                                placeholder="e.g. /contact"
                                className="h-9 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="buttonText" className="text-sm">
                              Button Text
                            </Label>
                            <Input
                              id="buttonText"
                              value={heroData.hero3.button.text}
                              onChange={(e) => handleTextChange(e.target.value, 'hero3.button.text')}
                              placeholder="e.g. Get Free Quote"
                              className="h-9 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="buttonLink" className="text-sm">
                              Button Link
                            </Label>
                            <Input
                              id="buttonLink"
                              value={heroData.hero3.button.link}
                              onChange={(e) => handleTextChange(e.target.value, 'hero3.button.link')}
                              placeholder="e.g. /quote"
                              className="h-9 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="images" className="w-full">
                <Card className="border border-gray-100 shadow-sm w-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">Images</CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      Manage images in your hero section.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedHeroInfo.component === "hero1" ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="backgroundImage" className="text-sm">
                              Background Image
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="backgroundImage"
                                value={heroData.hero1.images.background}
                                onChange={(e) => handleTextChange(e.target.value, 'hero1.images.background')}
                                placeholder="/assets/imgs/hero-1/background.png"
                                className="flex-1 h-9 text-sm"
                              />
                              <div className="relative">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                                  onChange={(e) => handleImageUpload(e, 'hero1.images.background')}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={imageUploading}
                                  className="relative h-9 text-sm"
                                  size="sm"
                                >
                                  {imageUploading ? (
                                    "Uploading..."
                                  ) : (
                                    <>
                                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                                      Upload
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                            {heroData.hero1.images.background && (
                              <div className="mt-2 border rounded overflow-hidden w-full h-32">
                                <img 
                                  src={heroData.hero1.images.background} 
                                  alt="Background" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="shape1Image" className="text-sm">
                              Shape 1 Image
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="shape1Image"
                                value={heroData.hero1.images.shape1}
                                onChange={(e) => handleTextChange(e.target.value, 'hero1.images.shape1')}
                                placeholder="/assets/imgs/hero-1/shape-1.png"
                                className="flex-1 h-9 text-sm"
                              />
                              <div className="relative">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                                  onChange={(e) => handleImageUpload(e, 'hero1.images.shape1')}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={imageUploading}
                                  className="relative h-9 text-sm"
                                  size="sm"
                                >
                                  {imageUploading ? "Uploading..." : (
                                    <>
                                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                                      Upload
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                            {heroData.hero1.images.shape1 && (
                              <div className="mt-2 border rounded overflow-hidden w-full h-32">
                                <img 
                                  src={heroData.hero1.images.shape1} 
                                  alt="Shape 1" 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="shape2Image" className="text-sm">
                              Shape 2 Image
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="shape2Image"
                                value={heroData.hero1.images.shape2}
                                onChange={(e) => handleTextChange(e.target.value, 'hero1.images.shape2')}
                                placeholder="/assets/imgs/hero-1/shape-2.png"
                                className="flex-1 h-9 text-sm"
                              />
                              <div className="relative">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                                  onChange={(e) => handleImageUpload(e, 'hero1.images.shape2')}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={imageUploading}
                                  className="relative h-9 text-sm"
                                  size="sm"
                                >
                                  {imageUploading ? "Uploading..." : (
                                    <>
                                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                                      Upload
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                            {heroData.hero1.images.shape2 && (
                              <div className="mt-2 border rounded overflow-hidden w-full h-32">
                                <img 
                                  src={heroData.hero1.images.shape2} 
                                  alt="Shape 2" 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="shape3Image" className="text-sm">
                              Shape 3 Image
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="shape3Image"
                                value={heroData.hero1.images.shape3}
                                onChange={(e) => handleTextChange(e.target.value, 'hero1.images.shape3')}
                                placeholder="/assets/imgs/hero-1/shape-3.png"
                                className="flex-1 h-9 text-sm"
                              />
                              <div className="relative">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                                  onChange={(e) => handleImageUpload(e, 'hero1.images.shape3')}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={imageUploading}
                                  className="relative h-9 text-sm"
                                  size="sm"
                                >
                                  {imageUploading ? "Uploading..." : (
                                    <>
                                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                                      Upload
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                            {heroData.hero1.images.shape3 && (
                              <div className="mt-2 border rounded overflow-hidden w-full h-32">
                                <img 
                                  src={heroData.hero1.images.shape3} 
                                  alt="Shape 3" 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="image1" className="text-sm">
                              Image 1
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="image1"
                                value={heroData.hero3.images.image1}
                                onChange={(e) => handleTextChange(e.target.value, 'hero3.images.image1')}
                                placeholder="/assets/imgs/hero-3/img-1.png"
                                className="flex-1 h-9 text-sm"
                              />
                              <div className="relative">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                                  onChange={(e) => handleImageUpload(e, 'hero3.images.image1')}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={imageUploading}
                                  className="relative h-9 text-sm"
                                  size="sm"
                                >
                                  {imageUploading ? "Uploading..." : (
                                    <>
                                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                                      Upload
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                            {heroData.hero3.images.image1 && (
                              <div className="mt-2 border rounded overflow-hidden w-full h-32">
                                <img 
                                  src={heroData.hero3.images.image1} 
                                  alt="Image 1" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="image2" className="text-sm">
                              Image 2
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="image2"
                                value={heroData.hero3.images.image2}
                                onChange={(e) => handleTextChange(e.target.value, 'hero3.images.image2')}
                                placeholder="/assets/imgs/hero-3/img-2.png"
                                className="flex-1 h-9 text-sm"
                              />
                              <div className="relative">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                                  onChange={(e) => handleImageUpload(e, 'hero3.images.image2')}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={imageUploading}
                                  className="relative h-9 text-sm"
                                  size="sm"
                                >
                                  {imageUploading ? "Uploading..." : (
                                    <>
                                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                                      Upload
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                            {heroData.hero3.images.image2 && (
                              <div className="mt-2 border rounded overflow-hidden w-full h-32">
                                <img 
                                  src={heroData.hero3.images.image2} 
                                  alt="Image 2" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="image3" className="text-sm">
                              Image 3
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="image3"
                                value={heroData.hero3.images.image3}
                                onChange={(e) => handleTextChange(e.target.value, 'hero3.images.image3')}
                                placeholder="/assets/imgs/hero-3/img-3.png"
                                className="flex-1 h-9 text-sm"
                              />
                              <div className="relative">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                                  onChange={(e) => handleImageUpload(e, 'hero3.images.image3')}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={imageUploading}
                                  className="relative h-9 text-sm"
                                  size="sm"
                                >
                                  {imageUploading ? "Uploading..." : (
                                    <>
                                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                                      Upload
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                            {heroData.hero3.images.image3 && (
                              <div className="mt-2 border rounded overflow-hidden w-full h-32">
                                <img 
                                  src={heroData.hero3.images.image3} 
                                  alt="Image 3" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="image4" className="text-sm">
                              Image 4
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="image4"
                                value={heroData.hero3.images.image4}
                                onChange={(e) => handleTextChange(e.target.value, 'hero3.images.image4')}
                                placeholder="/assets/imgs/hero-3/img-4.png"
                                className="flex-1 h-9 text-sm"
                              />
                              <div className="relative">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                                  onChange={(e) => handleImageUpload(e, 'hero3.images.image4')}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={imageUploading}
                                  className="relative h-9 text-sm"
                                  size="sm"
                                >
                                  {imageUploading ? "Uploading..." : (
                                    <>
                                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                                      Upload
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                            {heroData.hero3.images.image4 && (
                              <div className="mt-2 border rounded overflow-hidden w-full h-32">
                                <img 
                                  src={heroData.hero3.images.image4} 
                                  alt="Image 4" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="starImage" className="text-sm">
                            Star Image
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="starImage"
                              value={heroData.hero3.images.star}
                              onChange={(e) => handleTextChange(e.target.value, 'hero3.images.star')}
                              placeholder="/assets/imgs/hero-3/star-rotate.png"
                              className="flex-1 h-9 text-sm"
                            />
                            <div className="relative">
                              <Input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                                onChange={(e) => handleImageUpload(e, 'hero3.images.star')}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                disabled={imageUploading}
                                className="relative h-9 text-sm"
                                size="sm"
                              >
                                {imageUploading ? "Uploading..." : (
                                  <>
                                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                                    Upload
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                          {heroData.hero3.images.star && (
                            <div className="mt-2 border rounded overflow-hidden w-full h-32">
                              <img 
                                src={heroData.hero3.images.star} 
                                alt="Star Image" 
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {selectedHeroInfo.component === "hero1" && (
                <TabsContent value="card" className="w-full">
                  <Card className="border border-gray-100 shadow-sm w-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-medium">Card Section</CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        Configure the card component in the hero section.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="cardImage" className="text-sm">
                            Card Image
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="cardImage"
                              value={heroData.hero1.card.image}
                              onChange={(e) => handleTextChange(e.target.value, 'hero1.card.image')}
                              placeholder="/assets/imgs/hero-1/shape-4.png"
                              className="flex-1 h-9 text-sm"
                            />
                            <div className="relative">
                              <Input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                                onChange={(e) => handleImageUpload(e, 'hero1.card.image')}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                disabled={imageUploading}
                                className="relative h-9 text-sm"
                                size="sm"
                              >
                                {imageUploading ? "Uploading..." : (
                                  <>
                                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                                    Upload
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                          {heroData.hero1.card.image && (
                            <div className="mt-2 border rounded overflow-hidden w-full h-32">
                              <img 
                                src={heroData.hero1.card.image} 
                                alt="Card Image" 
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardTitle" className="text-sm">
                            Card Title
                          </Label>
                          <Input
                            id="cardTitle"
                            value={heroData.hero1.card.title}
                            onChange={(e) => handleTextChange(e.target.value, 'hero1.card.title')}
                            placeholder="e.g. Book A Call"
                            className="h-9 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardDescription" className="text-sm">
                            Card Description
                          </Label>
                          <Textarea
                            id="cardDescription"
                            value={heroData.hero1.card.description}
                            onChange={(e) => handleTextChange(e.target.value, 'hero1.card.description')}
                            placeholder="Brief description for the card"
                            className="min-h-[100px] text-sm resize-y"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardButtonLabel" className="text-sm">
                              Button Label
                            </Label>
                            <Input
                              id="cardButtonLabel"
                              value={heroData.hero1.card.button.label}
                              onChange={(e) => handleTextChange(e.target.value, 'hero1.card.button.label')}
                              placeholder="e.g. Get"
                              className="h-9 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardButtonText" className="text-sm">
                              Button Text
                            </Label>
                            <Input
                              id="cardButtonText"
                              value={heroData.hero1.card.button.text}
                              onChange={(e) => handleTextChange(e.target.value, 'hero1.card.button.text')}
                              placeholder="e.g. Free Update"
                              className="h-9 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardButtonLink" className="text-sm">
                              Button Link
                            </Label>
                            <Input
                              id="cardButtonLink"
                              value={heroData.hero1.card.button.link}
                              onChange={(e) => handleTextChange(e.target.value, 'hero1.card.button.link')}
                              placeholder="e.g. #"
                              className="h-9 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {selectedHeroInfo.component === "hero3" && (
                <TabsContent value="avatars" className="w-full">
                  <Card className="border border-gray-100 shadow-sm w-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-medium">Avatars</CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        Configure the avatars shown in the hero section.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {heroData.hero3.avatars.map((avatar: any, index: number) => (
                          <div key={index} className="space-y-2 border rounded-md p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-sm font-semibold">Avatar {index + 1}</h3>
                              {index === 2 && <span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded">Icon Style</span>}
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 border rounded-full overflow-hidden flex items-center justify-center bg-gray-50">
                                {avatar.image && (
                                  <img 
                                    src={avatar.image} 
                                    alt={avatar.alt} 
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`avatar${index}Image`} className="text-sm">
                                      Avatar Image URL
                                    </Label>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        id={`avatar${index}Image`}
                                        value={avatar.image}
                                        onChange={(e) => {
                                          const updatedAvatars = [...heroData.hero3.avatars];
                                          updatedAvatars[index] = {
                                            ...updatedAvatars[index],
                                            image: e.target.value
                                          };
                                          setHeroData({
                                            ...heroData,
                                            hero3: {
                                              ...heroData.hero3,
                                              avatars: updatedAvatars
                                            }
                                          });
                                        }}
                                        placeholder="/assets/imgs/hero-3/avatar-1.png"
                                        className="flex-1 h-9 text-sm"
                                      />
                                      <div className="relative">
                                        <Input
                                          type="file"
                                          accept="image/*"
                                          className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            
                                            // Display uploading state
                                            setImageUploading(true);
                                            
                                            // Upload to Cloudinary
                                            uploadImageToCloudinary(file).then((url) => {
                                              const updatedAvatars = [...heroData.hero3.avatars];
                                              updatedAvatars[index] = {
                                                ...updatedAvatars[index],
                                                image: url
                                              };
                                              
                                              // Update heroData state
                                              setHeroData({
                                                ...heroData,
                                                hero3: {
                                                  ...heroData.hero3,
                                                  avatars: updatedAvatars
                                                }
                                              });
                                              
                                              // Save to API
                                              saveChangesToAPI({
                                                ...heroData,
                                                hero3: {
                                                  ...heroData.hero3,
                                                  avatars: updatedAvatars
                                                }
                                              });
                                              
                                              // Reset uploading state
                                              setImageUploading(false);
                                            }).catch((error) => {
                                              showErrorAlert(`Error uploading image: ${error.message}`);
                                              setImageUploading(false);
                                            });
                                          }}
                                        />
                                        <Button
                                          type="button"
                                          variant="outline"
                                          disabled={imageUploading}
                                          className="relative h-9 text-sm"
                                          size="sm"
                                        >
                                          {imageUploading ? "Uploading..." : (
                                            <>
                                              <Upload className="w-3.5 h-3.5 mr-1.5" />
                                              Upload
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`avatar${index}Alt`} className="text-sm">
                                      Alt Text
                                    </Label>
                                    <Input
                                      id={`avatar${index}Alt`}
                                      value={avatar.alt}
                                      onChange={(e) => {
                                        const updatedAvatars = [...heroData.hero3.avatars];
                                        updatedAvatars[index] = {
                                          ...updatedAvatars[index],
                                          alt: e.target.value
                                        };
                                        setHeroData({
                                          ...heroData,
                                          hero3: {
                                            ...heroData.hero3,
                                            avatars: updatedAvatars
                                          }
                                        });
                                      }}
                                      placeholder="User avatar alt text"
                                      className="h-9 text-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          )}
        </>
      )}
    </div>
  );
}
