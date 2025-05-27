"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "sonner";
import {
  AlertCircle,
  Check,
  Upload,
  Image as ImageIcon,
  Palette,
  CloudCog,
  Globe,
  Save,
  Moon,
  Sun,
  MessageCircle
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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { useThemeConfig } from "@/lib/store/themeConfig";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getGeneral, updateGeneral } from "@/redux/actions/generalActions";
import { AppDispatch } from "@/redux/store";

export default function SiteSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [faviconUploading, setFaviconUploading] = useState(false);
  const { headerStyle, footerStyle, setHeaderStyle, setFooterStyle } = useThemeConfig();
  const dispatch = useDispatch<AppDispatch>();
  const { general, loading, success } = useSelector((state: RootState) => state.general);

  // Site settings state
  const [siteSettings, setSiteSettings] = useState({
    siteName: "Infinia",
    siteDescription: "Multi-purpose Bootstrap 5 Template",
    favicon: "",
    primaryColor: "#0088cc",
    secondaryColor: "#f7f7f7",
    accentColor: "#fd4a36",
    textColor: "#333333",
    darkPrimaryColor: "#1a1a1a",
    darkSecondaryColor: "#2d2d2d",
    darkAccentColor: "#fd4a36",
    darkTextColor: "#f5f5f5",
    cloudinary: {
      cloudName: "",
      apiKey: "",
      apiSecret: ""
    },
    whatsapp: {
      enabled: false,
      phoneNumber: "",
      message: ""
    }
  });

  // Load general settings from API on component mount
  useEffect(() => {
    dispatch(getGeneral());
  }, [dispatch]);

  // Update local state when general settings are loaded
  useEffect(() => {
    if (general) {
      setSiteSettings({
        siteName: general.siteName || siteSettings.siteName,
        siteDescription: general.siteDescription || siteSettings.siteDescription,
        favicon: general.favicon || siteSettings.favicon,
        primaryColor: general.colors?.primaryColor || siteSettings.primaryColor,
        secondaryColor: general.colors?.secondaryColor || siteSettings.secondaryColor,
        accentColor: general.colors?.accentColor || siteSettings.accentColor,
        textColor: general.colors?.textColor || siteSettings.textColor,
        darkPrimaryColor: general.colors?.darkPrimaryColor || siteSettings.darkPrimaryColor,
        darkSecondaryColor: general.colors?.darkSecondaryColor || siteSettings.darkSecondaryColor,
        darkAccentColor: general.colors?.darkAccentColor || siteSettings.darkAccentColor,
        darkTextColor: general.colors?.darkTextColor || siteSettings.darkTextColor,
        cloudinary: {
          cloudName: general.cloudinary?.cloudName || siteSettings.cloudinary.cloudName,
          apiKey: general.cloudinary?.apiKey || siteSettings.cloudinary.apiKey,
          apiSecret: general.cloudinary?.apiSecret || siteSettings.cloudinary.apiSecret
        },
        whatsapp: {
          enabled: general.whatsapp?.enabled !== undefined ? general.whatsapp.enabled : siteSettings.whatsapp.enabled,
          phoneNumber: general.whatsapp?.phoneNumber || siteSettings.whatsapp.phoneNumber,
          message: general.whatsapp?.message || siteSettings.whatsapp.message
        }
      });
    }
  }, [general]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith("cloudinary.")) {
      const cloudinaryField = name.split(".")[1];
      setSiteSettings({
        ...siteSettings,
        cloudinary: {
          ...siteSettings.cloudinary,
          [cloudinaryField]: value
        }
      });
    } else if (name.startsWith("whatsapp.")) {
      const whatsappField = name.split(".")[1];
      setSiteSettings({
        ...siteSettings,
        whatsapp: {
          ...siteSettings.whatsapp,
          [whatsappField]: value
        }
      });
    } else {
      setSiteSettings({
        ...siteSettings,
        [name]: value
      });
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setFaviconUploading(true);
    
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setSiteSettings({
        ...siteSettings,
        favicon: imageUrl
      });
      toast.success("Favicon uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload favicon. Please try again.");
      console.error("Error uploading favicon:", error);
    } finally {
      setFaviconUploading(false);
    }
  };

  const handleWhatsappToggle = (enabled: boolean) => {
    setSiteSettings({
      ...siteSettings,
      whatsapp: {
        ...siteSettings.whatsapp,
        enabled
      }
    });
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      // Convert the site settings to the format expected by the API
      const payload = {
        siteName: siteSettings.siteName,
        siteDescription: siteSettings.siteDescription,
        favicon: siteSettings.favicon,
        cloudinary: {
          cloudName: siteSettings.cloudinary.cloudName,
          apiKey: siteSettings.cloudinary.apiKey,
          apiSecret: siteSettings.cloudinary.apiSecret
        },
        whatsapp: {
          enabled: siteSettings.whatsapp.enabled,
          phoneNumber: siteSettings.whatsapp.phoneNumber,
          message: siteSettings.whatsapp.message
        },
        colors: {
          primaryColor: siteSettings.primaryColor,
          secondaryColor: siteSettings.secondaryColor,
          accentColor: siteSettings.accentColor,
          textColor: siteSettings.textColor,
          darkPrimaryColor: siteSettings.darkPrimaryColor,
          darkSecondaryColor: siteSettings.darkSecondaryColor,
          darkAccentColor: siteSettings.darkAccentColor,
          darkTextColor: siteSettings.darkTextColor
        }
      };

      // Update the settings using Redux
      await dispatch(updateGeneral(payload));
      
      // Apply the theme changes to the site
      document.documentElement.style.setProperty('--primary-color', siteSettings.primaryColor);
      document.documentElement.style.setProperty('--secondary-color', siteSettings.secondaryColor);
      document.documentElement.style.setProperty('--accent-color', siteSettings.accentColor);
      document.documentElement.style.setProperty('--text-color', siteSettings.textColor);
      document.documentElement.style.setProperty('--dark-primary-color', siteSettings.darkPrimaryColor);
      document.documentElement.style.setProperty('--dark-secondary-color', siteSettings.darkSecondaryColor);
      document.documentElement.style.setProperty('--dark-accent-color', siteSettings.darkAccentColor);
      document.documentElement.style.setProperty('--dark-text-color', siteSettings.darkTextColor);
      
      toast.success("Site settings saved successfully!", {
        description: "Your settings have been updated."
      });
    } catch (error) {
      toast.error("Failed to save settings. Please try again.", {
        description: "An error occurred while saving your changes."
      });
      console.error("Error saving settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeStyleChange = (type: 'headerStyle' | 'footerStyle', value: number) => {
    if (type === 'headerStyle') {
      setHeaderStyle(value);
    } else {
      setFooterStyle(value);
    }
    
    toast.success(`${type === 'headerStyle' ? 'Header' : 'Footer'} style updated`, {
      description: `Global style changed to option ${value}`
    });
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
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard/settings">Settings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Site Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2 px-4">
          <Button
            className="bg-black hover:bg-gray-800 text-white"
            size="sm"
            onClick={handleSaveSettings}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-1">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Save className="h-4 w-4" />
                Save Changes
              </span>
            )}
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-6 p-4 md:p-6">
        <Toaster richColors position="top-right" />

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Site Settings</CardTitle>
            <CardDescription>
              Customize your site's appearance and functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid grid-cols-5 mb-8">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">General</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline">Appearance</span>
                </TabsTrigger>
                <TabsTrigger value="media" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Media</span>
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center gap-2">
                  <CloudCog className="h-4 w-4" />
                  <span className="hidden sm:inline">Integrations</span>
                </TabsTrigger>
                <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </TabsTrigger>
              </TabsList>

              {/* General Settings */}
              <TabsContent value="general" className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      name="siteName"
                      placeholder="Enter site name"
                      value={siteSettings.siteName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">Site URL</Label>
                    <Input
                      id="siteUrl"
                      name="siteUrl"
                      placeholder="https://example.com"
                      defaultValue={typeof window !== 'undefined' ? window.location.origin : ''}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">Cannot be changed</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    name="siteDescription"
                    placeholder="Brief description of your site"
                    rows={3}
                    value={siteSettings.siteDescription}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">Used for SEO and meta descriptions</p>
                </div>
              </TabsContent>

              {/* Appearance Settings */}
              <TabsContent value="appearance" className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-medium">Light Mode</h3>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: siteSettings.primaryColor }}
                      />
                      <Input
                        id="primaryColor"
                        name="primaryColor"
                        type="text"
                        value={siteSettings.primaryColor}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex gap-2">
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: siteSettings.secondaryColor }}
                      />
                      <Input
                        id="secondaryColor"
                        name="secondaryColor"
                        type="text"
                        value={siteSettings.secondaryColor}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex gap-2">
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: siteSettings.accentColor }}
                      />
                      <Input
                        id="accentColor"
                        name="accentColor"
                        type="text"
                        value={siteSettings.accentColor}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="textColor">Text Color</Label>
                    <div className="flex gap-2">
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: siteSettings.textColor }}
                      />
                      <Input
                        id="textColor"
                        name="textColor"
                        type="text"
                        value={siteSettings.textColor}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="flex items-center gap-2 mb-6">
                  <Moon className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-lg font-medium">Dark Mode</h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="darkPrimaryColor">Primary Color (Dark)</Label>
                    <div className="flex gap-2">
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: siteSettings.darkPrimaryColor }}
                      />
                      <Input
                        id="darkPrimaryColor"
                        name="darkPrimaryColor"
                        type="text"
                        value={siteSettings.darkPrimaryColor}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="darkSecondaryColor">Secondary Color (Dark)</Label>
                    <div className="flex gap-2">
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: siteSettings.darkSecondaryColor }}
                      />
                      <Input
                        id="darkSecondaryColor"
                        name="darkSecondaryColor"
                        type="text"
                        value={siteSettings.darkSecondaryColor}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="darkAccentColor">Accent Color (Dark)</Label>
                    <div className="flex gap-2">
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: siteSettings.darkAccentColor }}
                      />
                      <Input
                        id="darkAccentColor"
                        name="darkAccentColor"
                        type="text"
                        value={siteSettings.darkAccentColor}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="darkTextColor">Text Color (Dark)</Label>
                    <div className="flex gap-2">
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: siteSettings.darkTextColor }}
                      />
                      <Input
                        id="darkTextColor"
                        name="darkTextColor"
                        type="text"
                        value={siteSettings.darkTextColor}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md bg-muted/40 mt-6">
                  <p className="text-sm mb-2">Preview</p>
                  <div className="grid gap-4 grid-cols-2">
                    <div className="flex flex-col items-center p-3 gap-2 rounded-md" style={{ backgroundColor: siteSettings.primaryColor }}>
                      <div className="h-8 w-24 rounded-md" style={{ backgroundColor: siteSettings.secondaryColor }}></div>
                      <div className="h-4 w-16 rounded-md" style={{ backgroundColor: siteSettings.accentColor }}></div>
                    </div>
                    <div className="flex flex-col items-center p-3 gap-2 rounded-md" style={{ backgroundColor: siteSettings.darkPrimaryColor }}>
                      <div className="h-8 w-24 rounded-md" style={{ backgroundColor: siteSettings.darkSecondaryColor }}></div>
                      <div className="h-4 w-16 rounded-md" style={{ backgroundColor: siteSettings.darkAccentColor }}></div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="headerStyle">Default Header Style</Label>
                    <select 
                      id="headerStyle"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={headerStyle}
                      onChange={(e) => handleThemeStyleChange('headerStyle', parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={`header-${num}`} value={num}>Header Style {num}</option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground">This will be the default header style for all pages.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="footerStyle">Default Footer Style</Label>
                    <select 
                      id="footerStyle"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={footerStyle}
                      onChange={(e) => handleThemeStyleChange('footerStyle', parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4].map(num => (
                        <option key={`footer-${num}`} value={num}>Footer Style {num}</option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground">This will be the default footer style for all pages.</p>
                  </div>
                </div>
              </TabsContent>

              {/* Media Settings */}
              <TabsContent value="media" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Site Favicon</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 border rounded-md flex items-center justify-center overflow-hidden bg-slate-50">
                        {siteSettings.favicon ? (
                          <img
                            src={siteSettings.favicon}
                            alt="Favicon"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Label 
                          htmlFor="favicon-upload" 
                          className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {faviconUploading ? "Uploading..." : "Upload Favicon"}
                        </Label>
                        <Input
                          id="favicon-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFaviconUpload}
                          disabled={faviconUploading}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Recommended size: 32x32px or 64x64px
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Integrations Settings */}
              <TabsContent value="integrations" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Cloudinary Integration</h3>
                  <p className="text-sm mb-4">
                    Configure your Cloudinary account to handle media uploads
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cloudName">Cloud Name</Label>
                      <Input
                        id="cloudName"
                        name="cloudinary.cloudName"
                        placeholder="Enter Cloudinary cloud name"
                        value={siteSettings.cloudinary.cloudName}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="apiKey">API Key</Label>
                        <Input
                          id="apiKey"
                          name="cloudinary.apiKey"
                          placeholder="Enter API key"
                          value={siteSettings.cloudinary.apiKey}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="apiSecret">API Secret</Label>
                        <Input
                          id="apiSecret"
                          name="cloudinary.apiSecret"
                          type="password"
                          placeholder="Enter API secret"
                          value={siteSettings.cloudinary.apiSecret}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 border-muted border p-3 rounded-md">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="h-4 w-4" />
                        <h4 className="font-medium">Security Notice</h4>
                      </div>
                      <p className="text-sm">
                        API credentials are stored securely in our database. Never expose these values in client-side code.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* WhatsApp Settings */}
              <TabsContent value="whatsapp" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">WhatsApp Support Button</h3>
                  <p className="text-sm mb-4">
                    Configure the WhatsApp support button that appears on your website
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="whatsapp-enabled" className="text-base">Enable WhatsApp Support</Label>
                        <p className="text-sm text-muted-foreground">Show a WhatsApp support button on your website</p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="whatsapp-enabled"
                          checked={siteSettings.whatsapp.enabled}
                          onChange={(e) => handleWhatsappToggle(e.target.checked)}
                          className="mr-2 h-4 w-4"
                        />
                        <Label htmlFor="whatsapp-enabled" className="cursor-pointer">
                          {siteSettings.whatsapp.enabled ? "Enabled" : "Disabled"}
                        </Label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="whatsappPhone">WhatsApp Phone Number</Label>
                      <Input
                        id="whatsappPhone"
                        name="whatsapp.phoneNumber"
                        placeholder="Enter phone number with country code (e.g. +1234567890)"
                        value={siteSettings.whatsapp.phoneNumber}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-muted-foreground">Include the country code with + symbol</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="whatsappMessage">Default Message</Label>
                      <Textarea
                        id="whatsappMessage"
                        name="whatsapp.message"
                        placeholder="Hello, I would like to inquire about your services."
                        rows={3}
                        value={siteSettings.whatsapp.message}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-muted-foreground">This message will be pre-filled when users click the WhatsApp button</p>
                    </div>
                    
                    <div className="bg-green-50 border-green-200 border p-4 rounded-md mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageCircle className="h-5 w-5 text-green-600" />
                        <h4 className="font-medium text-green-700">Preview</h4>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                          <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">WhatsApp Support</p>
                          <p className="text-sm text-muted-foreground">{siteSettings.whatsapp.phoneNumber}</p>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded-md mt-3 text-sm border">
                        {siteSettings.whatsapp.message}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 