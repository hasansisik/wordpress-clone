'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check, Upload, Moon, Sun } from "lucide-react";
import { SortableList } from "@/components/ui/sortable-list";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

// Define types for menu items
interface MenuItem {
  _id: string;
  name: string;
  link: string;
  order: number;
}

interface TopBarItem {
  _id: string;
  name: string;
  content: string;
  order: number;
}

interface HeaderData {
  mainMenu: MenuItem[];
  socialLinks: MenuItem[];
  topBarItems: TopBarItem[];
  logoText: string;
  logoUrl: string;
  showDarkModeToggle: boolean;
  showActionButton: boolean;
  actionButtonText: string;
  actionButtonLink: string;
}

export default function HeaderEditor() {
  const [selectedHeader, setSelectedHeader] = useState<number | null>(null);
  const [headerData, setHeaderData] = useState<HeaderData>({
    mainMenu: [],
    socialLinks: [],
    topBarItems: [],
    logoText: "Infinia",
    logoUrl: "/assets/imgs/template/favicon.svg",
    showDarkModeToggle: true,
    showActionButton: true,
    actionButtonText: "",
    actionButtonLink: ""
  });
  
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [topBarDialogOpen, setTopBarDialogOpen] = useState(false);
  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    link: "",
    content: "",
    type: "mainMenu"
  });

  const headers = [
    { id: 1, name: 'Standard Header', image: '/assets/imgs/headers/header1.png', hasTopBar: false, buttonText: "Join For Free Trial" },
    { id: 2, name: 'Fluid Header', image: '/assets/imgs/headers/header2.png', hasTopBar: false, buttonText: "Join For Free Trial" },
    { id: 3, name: 'Topbar Header', image: '/assets/imgs/headers/header3.png', hasTopBar: true, buttonText: "Join For Free Trial" },
    { id: 4, name: 'Centered Header', image: '/assets/imgs/headers/header4.png', hasTopBar: false, buttonText: "" },
    { id: 5, name: 'Contact Header', image: '/assets/imgs/headers/header5.png', hasTopBar: true, buttonText: "Get a Quote" },
  ];

  // Initialize header data based on selection
  useEffect(() => {
    if (selectedHeader === null) return;
    
    const header = headers.find(h => h.id === selectedHeader);
    if (!header) return;
    
    // Common menu items for all headers
    const commonMenuItems = [
      { _id: "1", name: "Home", link: "/", order: 0 },
      { _id: "2", name: "About", link: "/about", order: 1 },
      { _id: "3", name: "Services", link: "/services", order: 2 },
      { _id: "4", name: "Blog", link: "/blog", order: 3 },
      { _id: "5", name: "Contact", link: "/contact", order: 4 },
    ];
    
    // Social links for headers with social icons
    const socialLinks = [
      { _id: "1", name: "Twitter", link: "https://twitter.com/example", order: 0 },
      { _id: "2", name: "Facebook", link: "https://facebook.com/example", order: 1 },
      { _id: "3", name: "Instagram", link: "https://instagram.com/example", order: 2 },
    ];
    
    // Top bar items for headers with top bars
    const topBarItems = [
      { _id: "1", name: "Phone", content: "+01 (24) 568 900", order: 0 },
      { _id: "2", name: "Email", content: "contact@infinia.com", order: 1 },
      { _id: "3", name: "Address", content: "0811 Erdman Prairie, Joaville CA", order: 2 },
    ];
    
    setHeaderData({
      mainMenu: commonMenuItems,
      socialLinks: selectedHeader === 5 ? socialLinks : [],
      topBarItems: header.hasTopBar ? topBarItems : [],
      logoText: "Infinia",
      logoUrl: "/assets/imgs/template/favicon.svg",
      showDarkModeToggle: true,
      showActionButton: header.buttonText !== "",
      actionButtonText: header.buttonText,
      actionButtonLink: "/contact"
    });
  }, [selectedHeader]);
  
  const showSuccessAlert = (message: string) => {
    setAlertType("success");
    setAlertMessage(message);
    setShowAlert(true);
    
    const timeout = setTimeout(() => {
      setShowAlert(false);
    }, 3000);
    
    return () => clearTimeout(timeout);
  };

  const showErrorAlert = (message: string) => {
    setAlertType("error");
    setAlertMessage(message);
    setShowAlert(true);
    
    const timeout = setTimeout(() => {
      setShowAlert(false);
    }, 3000);
    
    return () => clearTimeout(timeout);
  };
  
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setLogoUploading(true);
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulating cloudinary upload
      const uploadedUrl = URL.createObjectURL(file);
      
      setHeaderData({
        ...headerData,
        logoUrl: uploadedUrl
      });
      
      showSuccessAlert("Logo uploaded successfully");
    } catch (error: any) {
      showErrorAlert(`Error uploading logo: ${error.message}`);
    } finally {
      setLogoUploading(false);
    }
  };
  
  const handleItemAdd = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newItem.type === "mainMenu" || newItem.type === "socialLinks") {
      if (!newItem.name || !newItem.link) {
        showErrorAlert("Please fill in all fields");
        return;
      }
    } else if (newItem.type === "topBarItems") {
      if (!newItem.name || !newItem.content) {
        showErrorAlert("Please fill in all fields");
        return;
      }
    }
    
    const newId = Math.random().toString(36).substr(2, 9);
    
    if (newItem.type === "mainMenu") {
      const newOrder = headerData.mainMenu.length;
      const newMainMenu = [
        ...headerData.mainMenu,
        { _id: newId, name: newItem.name, link: newItem.link, order: newOrder }
      ];
      
      setHeaderData({
        ...headerData,
        mainMenu: newMainMenu
      });
    } else if (newItem.type === "socialLinks") {
      const newOrder = headerData.socialLinks.length;
      const newSocialLinks = [
        ...headerData.socialLinks,
        { _id: newId, name: newItem.name, link: newItem.link, order: newOrder }
      ];
      
      setHeaderData({
        ...headerData,
        socialLinks: newSocialLinks
      });
    } else if (newItem.type === "topBarItems") {
      const newOrder = headerData.topBarItems.length;
      const newTopBarItems = [
        ...headerData.topBarItems,
        { _id: newId, name: newItem.name, content: newItem.content, order: newOrder }
      ];
      
      setHeaderData({
        ...headerData,
        topBarItems: newTopBarItems
      });
    }
    
    setNewItem({
      name: "",
      link: "",
      content: "",
      type: "mainMenu"
    });
    
    // Close dialogs
    setMenuDialogOpen(false);
    setSocialDialogOpen(false);
    setTopBarDialogOpen(false);
    
    showSuccessAlert("Item added successfully");
  };
  
  const handleItemDelete = (itemId: string, type: string) => {
    if (type === 'mainMenu') {
      const updatedMenu = headerData.mainMenu.filter(item => item._id !== itemId);
      setHeaderData({
        ...headerData,
        mainMenu: updatedMenu
      });
    } else if (type === 'socialLinks') {
      const updatedSocialLinks = headerData.socialLinks.filter(item => item._id !== itemId);
      setHeaderData({
        ...headerData,
        socialLinks: updatedSocialLinks
      });
    } else if (type === 'topBarItems') {
      const updatedTopBarItems = headerData.topBarItems.filter(item => item._id !== itemId);
      setHeaderData({
        ...headerData,
        topBarItems: updatedTopBarItems
      });
    }
    
    showSuccessAlert("Item deleted successfully");
  };
  
  const handleItemsReorder = (updatedItems: MenuItem[] | TopBarItem[], type: string) => {
    // Update the order based on new positions
    const itemsWithUpdatedOrder = updatedItems.map((item, index) => ({
      ...item,
      order: index
    }));
    
    if (type === 'mainMenu') {
      setHeaderData({
        ...headerData,
        mainMenu: itemsWithUpdatedOrder as MenuItem[]
      });
    } else if (type === 'socialLinks') {
      setHeaderData({
        ...headerData,
        socialLinks: itemsWithUpdatedOrder as MenuItem[]
      });
    } else if (type === 'topBarItems') {
      setHeaderData({
        ...headerData,
        topBarItems: itemsWithUpdatedOrder as TopBarItem[]
      });
    }
    
    showSuccessAlert("Items reordered successfully");
  };
  
  // Sort items by order field
  const sortedMainMenu = headerData?.mainMenu
    ? [...headerData.mainMenu].sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];
    
  const sortedSocialLinks = headerData?.socialLinks
    ? [...headerData.socialLinks].sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];
    
  const sortedTopBarItems = headerData?.topBarItems
    ? [...headerData.topBarItems].sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];
  
  const selectedHeaderInfo = headers.find(h => h.id === selectedHeader);

  return (
    <div className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Header Editor</h1>
      
      {showAlert && (
        <Alert className={`mb-4 ${alertType === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {alertType === "success" ? (
            <Check className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>{alertType === "success" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Header Style</CardTitle>
          <CardDescription>
            Choose a header design that fits your website style.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {headers.map((header) => (
              <div 
                key={header.id}
                className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                  selectedHeader === header.id ? 'border-blue-500 ring-2 ring-blue-200' : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedHeader(header.id)}
              >
                <div className="h-40 bg-gray-100 relative">
                  {/* Replace with actual header preview images */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Header {header.id} Preview
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium">{header.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {selectedHeader !== null && (
        <>
          <Tabs defaultValue="main-menu" className="mt-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="main-menu">Main Menu</TabsTrigger>
              {selectedHeader === 5 && (
                <TabsTrigger value="social-links">Social Links</TabsTrigger>
              )}
              {selectedHeaderInfo?.hasTopBar && (
                <TabsTrigger value="topbar-items">Top Bar</TabsTrigger>
              )}
              <TabsTrigger value="general-settings">General Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="main-menu">
              <Card>
                <CardHeader>
                  <CardTitle>Main Menu Management</CardTitle>
                  <CardDescription>
                    Manage your site's main menu items here. You can drag items to reorder them.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Dialog open={menuDialogOpen} onOpenChange={setMenuDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>Add New Menu Item</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>New Menu Item</DialogTitle>
                          <DialogDescription>
                            Please enter information for the new menu item.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleItemAdd} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input 
                              id="name" 
                              value={newItem.name}
                              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                              placeholder="Menu item name" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="link">Link</Label>
                            <Input 
                              id="link" 
                              value={newItem.link}
                              onChange={(e) => setNewItem({...newItem, link: e.target.value})}
                              placeholder="/page-link" 
                            />
                          </div>
                          <input type="hidden" value="mainMenu" onChange={() => setNewItem({...newItem, type: "mainMenu"})} />
                          <Button type="submit" className="w-full">Add</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <div className="mt-4">
                    {sortedMainMenu.length > 0 ? (
                      <SortableList
                        items={sortedMainMenu}
                        onChange={(updatedItems: MenuItem[]) => handleItemsReorder(updatedItems, 'mainMenu')}
                        onDelete={(itemId: string) => handleItemDelete(itemId, 'mainMenu')}
                        renderItem={(item: MenuItem) => (
                          <div className="flex justify-between items-center w-full px-2">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-gray-500 text-sm">{item.link}</div>
                          </div>
                        )}
                      />
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        No main menu items yet.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {selectedHeader === 5 && (
              <TabsContent value="social-links">
                <Card>
                  <CardHeader>
                    <CardTitle>Social Links Management</CardTitle>
                    <CardDescription>
                      Manage your site's social media links here. You can drag items to reorder them.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <Dialog open={socialDialogOpen} onOpenChange={setSocialDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>Add New Social Link</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>New Social Link</DialogTitle>
                            <DialogDescription>
                              Please enter information for the new social link.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleItemAdd} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Platform</Label>
                              <Input 
                                id="name" 
                                value={newItem.name}
                                onChange={(e) => setNewItem({...newItem, name: e.target.value, type: "socialLinks"})}
                                placeholder="e.g., Twitter" 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="link">Link</Label>
                              <Input 
                                id="link" 
                                value={newItem.link}
                                onChange={(e) => setNewItem({...newItem, link: e.target.value, type: "socialLinks"})}
                                placeholder="https://twitter.com/username" 
                              />
                            </div>
                            <Button type="submit" className="w-full">Add</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="mt-4">
                      {sortedSocialLinks.length > 0 ? (
                        <SortableList
                          items={sortedSocialLinks}
                          onChange={(updatedItems: MenuItem[]) => handleItemsReorder(updatedItems, 'socialLinks')}
                          onDelete={(itemId: string) => handleItemDelete(itemId, 'socialLinks')}
                          renderItem={(item: MenuItem) => (
                            <div className="flex justify-between items-center w-full px-2">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-gray-500 text-sm">{item.link}</div>
                            </div>
                          )}
                        />
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          No social links yet.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            
            {selectedHeaderInfo?.hasTopBar && (
              <TabsContent value="topbar-items">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Bar Items</CardTitle>
                    <CardDescription>
                      Manage your header's top bar information. You can drag items to reorder them.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <Dialog open={topBarDialogOpen} onOpenChange={setTopBarDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>Add New Top Bar Item</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>New Top Bar Item</DialogTitle>
                            <DialogDescription>
                              Please enter information for the new top bar item.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleItemAdd} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Label</Label>
                              <Input 
                                id="name" 
                                value={newItem.name}
                                onChange={(e) => setNewItem({...newItem, name: e.target.value, type: "topBarItems"})}
                                placeholder="e.g., Phone, Email, Address" 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="content">Content</Label>
                              <Input 
                                id="content" 
                                value={newItem.content}
                                onChange={(e) => setNewItem({...newItem, content: e.target.value, type: "topBarItems"})}
                                placeholder="e.g., +1 (555) 123-4567" 
                              />
                            </div>
                            <Button type="submit" className="w-full">Add</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="mt-4">
                      {sortedTopBarItems.length > 0 ? (
                        <SortableList
                          items={sortedTopBarItems}
                          onChange={(updatedItems: TopBarItem[]) => handleItemsReorder(updatedItems, 'topBarItems')}
                          onDelete={(itemId: string) => handleItemDelete(itemId, 'topBarItems')}
                          renderItem={(item: TopBarItem) => (
                            <div className="flex justify-between items-center w-full px-2">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-gray-500 text-sm">{item.content}</div>
                            </div>
                          )}
                        />
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          No top bar items yet.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            
            <TabsContent value="general-settings">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Manage logo, action button, and theme toggle settings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="logoText" className="block mb-2">Logo Text</Label>
                        <Input 
                          id="logoText" 
                          value={headerData.logoText}
                          onChange={(e) => setHeaderData({...headerData, logoText: e.target.value})}
                          placeholder="Logo text" 
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="logoUrl" className="block mb-2">Logo URL</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="logoUrl" 
                            value={headerData.logoUrl}
                            onChange={(e) => setHeaderData({...headerData, logoUrl: e.target.value})}
                            placeholder="/images/logo.png" 
                            className="flex-1"
                          />
                          <div className="relative">
                            <Input
                              type="file"
                              id="logoFile"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              disabled={logoUploading}
                              className="relative"
                            >
                              {logoUploading ? (
                                "Uploading..."
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Enter a URL or upload a file. When you upload a file, the URL will be updated automatically.
                        </p>
                      </div>
                      
                      {headerData.logoUrl && (
                        <div className="mb-4">
                          <p className="mb-2 text-sm text-gray-500">Preview:</p>
                          <img 
                            src={headerData.logoUrl} 
                            alt={headerData.logoText || "Logo"} 
                            className="h-12 object-contain border rounded p-2" 
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="darkModeToggle">Show Dark Mode Toggle</Label>
                          <Switch 
                            id="darkModeToggle" 
                            checked={headerData.showDarkModeToggle}
                            onCheckedChange={(checked) => setHeaderData({...headerData, showDarkModeToggle: checked})}
                          />
                        </div>
                        <div className="flex justify-end">
                          {headerData.showDarkModeToggle && (
                            <div className="bg-gray-100 p-2 rounded-md flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                                <Sun className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                                <Moon className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="actionButton">Show Action Button</Label>
                          <Switch 
                            id="actionButton" 
                            checked={headerData.showActionButton}
                            onCheckedChange={(checked) => setHeaderData({...headerData, showActionButton: checked})}
                          />
                        </div>
                        
                        {headerData.showActionButton && (
                          <>
                            <div>
                              <Label htmlFor="actionButtonText" className="block mb-2">Button Text</Label>
                              <Input 
                                id="actionButtonText" 
                                value={headerData.actionButtonText}
                                onChange={(e) => setHeaderData({...headerData, actionButtonText: e.target.value})}
                                placeholder="Get Started" 
                              />
                            </div>
                            <div>
                              <Label htmlFor="actionButtonLink" className="block mb-2">Button Link</Label>
                              <Input 
                                id="actionButtonLink" 
                                value={headerData.actionButtonLink}
                                onChange={(e) => setHeaderData({...headerData, actionButtonLink: e.target.value})}
                                placeholder="/contact" 
                              />
                            </div>
                            <div>
                              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                {headerData.actionButtonText || "Action Button"}
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex justify-end">
            <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
              Save & Finish
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
