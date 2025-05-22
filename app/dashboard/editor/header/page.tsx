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
  Moon,
  Sun,
  Trash2,
  Pencil,
  ArrowLeft,
} from "lucide-react";
import { SortableList } from "@/components/ui/sortable-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
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
  headerComponent: string;
}

export default function HeaderEditor() {
  const router = useRouter();
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
    actionButtonLink: "",
    headerComponent: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [topBarDialogOpen, setTopBarDialogOpen] = useState(false);
  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedItem, setEditedItem] = useState({
    _id: "",
    name: "",
    link: "",
    content: "",
    type: "",
  });
  const [newItem, setNewItem] = useState({
    name: "",
    link: "",
    content: "",
    type: "mainMenu",
  });

  const headers = [
    {
      id: 1,
      name: "Standard Header",
      image: "/assets/imgs/headers/header1.png",
      hasTopBar: false,
      buttonText: "Join For Free Trial",
      component: "Header1"
    },
    {
      id: 2,
      name: "Fluid Header",
      image: "/assets/imgs/headers/header2.png",
      hasTopBar: false,
      buttonText: "Join For Free Trial",
      component: "Header2"
    },
    {
      id: 3,
      name: "Topbar Header",
      image: "/assets/imgs/headers/header3.png",
      hasTopBar: true,
      buttonText: "Join For Free Trial",
      component: "Header3" 
    },
    {
      id: 4,
      name: "Centered Header",
      image: "/assets/imgs/headers/header4.png",
      hasTopBar: false,
      buttonText: "",
      component: "Header4"
    },
    {
      id: 5,
      name: "Contact Header",
      image: "/assets/imgs/headers/header5.png",
      hasTopBar: true,
      buttonText: "Get a Quote",
      component: "Header5"
    },
  ];

  // Initialize header data based on selection
  useEffect(() => {
    if (selectedHeader === null) return;

    const header = headers.find((h) => h.id === selectedHeader);
    if (!header) return;

    // Initial default values while waiting for API data
    const initialData = {
      mainMenu: [
        { _id: "1", name: "Home", link: "/", order: 0 },
        { _id: "2", name: "About", link: "/about", order: 1 },
        { _id: "3", name: "Services", link: "/services", order: 2 },
        { _id: "4", name: "Blog", link: "/blog", order: 3 },
        { _id: "5", name: "Contact", link: "/contact", order: 4 },
      ],
      socialLinks: selectedHeader === 5 ? [
        {
          _id: "1",
          name: "Twitter",
          link: "https://twitter.com/example",
          order: 0,
        },
        {
          _id: "2",
          name: "Facebook",
          link: "https://facebook.com/example",
          order: 1,
        },
        {
          _id: "3",
          name: "Instagram",
          link: "https://instagram.com/example",
          order: 2,
        }
      ] : [],
      topBarItems: header.hasTopBar ? [
        { _id: "1", name: "Phone", content: "+01 (24) 568 900", order: 0 },
        { _id: "2", name: "Email", content: "contact@infinia.com", order: 1 },
        {
          _id: "3",
          name: "Address",
          content: "0811 Erdman Prairie, Joaville CA",
          order: 2,
        }
      ] : [],
      logoText: "Infinia",
      logoUrl: "/assets/imgs/template/favicon.svg",
      showDarkModeToggle: true,
      showActionButton: header.buttonText !== "",
      actionButtonText: header.buttonText,
      actionButtonLink: "/contact",
      headerComponent: header.component
    };

    // Set initial data while waiting for API response
    setHeaderData(initialData);
    
    // Then fetch the latest data from API
    refreshHeaderData();
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Simulating cloudinary upload
      const uploadedUrl = URL.createObjectURL(file);

      setHeaderData({
        ...headerData,
        logoUrl: uploadedUrl,
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
    let updatedData = { ...headerData };

    if (newItem.type === "mainMenu") {
      const newOrder = headerData.mainMenu.length;
      const newMainMenu = [
        ...headerData.mainMenu,
        { _id: newId, name: newItem.name, link: newItem.link, order: newOrder },
      ];

      updatedData = {
        ...headerData,
        mainMenu: newMainMenu,
      };
    } else if (newItem.type === "socialLinks") {
      const newOrder = headerData.socialLinks.length;
      const newSocialLinks = [
        ...headerData.socialLinks,
        { _id: newId, name: newItem.name, link: newItem.link, order: newOrder },
      ];

      updatedData = {
        ...headerData,
        socialLinks: newSocialLinks,
      };
    } else if (newItem.type === "topBarItems") {
      const newOrder = headerData.topBarItems.length;
      const newTopBarItems = [
        ...headerData.topBarItems,
        {
          _id: newId,
          name: newItem.name,
          content: newItem.content,
          order: newOrder,
        },
      ];

      updatedData = {
        ...headerData,
        topBarItems: newTopBarItems,
      };
    }

    // Update state with new data
    setHeaderData(updatedData);

    // Save changes to API
    saveChangesToAPI(updatedData);

    setNewItem({
      name: "",
      link: "",
      content: "",
      type: "mainMenu",
    });

    // Close dialogs
    setMenuDialogOpen(false);
    setSocialDialogOpen(false);
    setTopBarDialogOpen(false);

    showSuccessAlert(`New ${newItem.type === "mainMenu" ? "menu item" : newItem.type === "socialLinks" ? "social link" : "top bar item"} added successfully`);
  };

  const handleItemDelete = (itemId: string, type: string) => {
    let updatedData = { ...headerData };

    if (type === "mainMenu") {
      const updatedMenu = headerData.mainMenu.filter(
        (item) => item._id !== itemId
      );
      
      // Re-calculate order values to ensure they remain sequential
      const reorderedMenu = updatedMenu.map((item, index) => ({
        ...item,
        order: index
      }));
      
      updatedData = {
        ...headerData,
        mainMenu: reorderedMenu,
      };

      showSuccessAlert("Menu item deleted successfully");
    } else if (type === "socialLinks") {
      const updatedSocialLinks = headerData.socialLinks.filter(
        (item) => item._id !== itemId
      );
      
      // Re-calculate order values
      const reorderedSocialLinks = updatedSocialLinks.map((item, index) => ({
        ...item,
        order: index
      }));
      
      updatedData = {
        ...headerData,
        socialLinks: reorderedSocialLinks,
      };

      showSuccessAlert("Social link deleted successfully");
    } else if (type === "topBarItems") {
      const updatedTopBarItems = headerData.topBarItems.filter(
        (item) => item._id !== itemId
      );
      
      // Re-calculate order values
      const reorderedTopBarItems = updatedTopBarItems.map((item, index) => ({
        ...item,
        order: index
      }));
      
      updatedData = {
        ...headerData,
        topBarItems: reorderedTopBarItems,
      };

      showSuccessAlert("Top bar item deleted successfully");
    }

    // Update state
    setHeaderData(updatedData);

    // Save changes to API
    saveChangesToAPI(updatedData);
  };

  const handleItemsReorder = (
    updatedItems: MenuItem[] | TopBarItem[],
    type: string
  ) => {
    // Ensure the updatedItems have their order values set correctly
    const itemsWithUpdatedOrder = updatedItems.map((item, index) => ({
      ...item,
      order: index,
    }));

    let updatedData = { ...headerData };

    if (type === "mainMenu") {
      updatedData = {
        ...headerData,
        mainMenu: itemsWithUpdatedOrder as MenuItem[],
      };
      showSuccessAlert("Menu items reordered successfully");
    } else if (type === "socialLinks") {
      updatedData = {
        ...headerData,
        socialLinks: itemsWithUpdatedOrder as MenuItem[],
      };
      showSuccessAlert("Social links reordered successfully");
    } else if (type === "topBarItems") {
      updatedData = {
        ...headerData,
        topBarItems: itemsWithUpdatedOrder as TopBarItem[],
      };
      showSuccessAlert("Top bar items reordered successfully");
    }

    // Update state
    setHeaderData(updatedData);

    // Save changes to API
    saveChangesToAPI(updatedData);
  };

  const handleEditItem = (itemId: string, type: string) => {
    let itemToEdit;

    if (type === "mainMenu") {
      itemToEdit = headerData.mainMenu.find((item) => item._id === itemId);
      if (itemToEdit) {
        setEditedItem({
          _id: itemToEdit._id,
          name: itemToEdit.name,
          link: itemToEdit.link,
          content: "",
          type: "mainMenu",
        });
      }
    } else if (type === "socialLinks") {
      itemToEdit = headerData.socialLinks.find((item) => item._id === itemId);
      if (itemToEdit) {
        setEditedItem({
          _id: itemToEdit._id,
          name: itemToEdit.name,
          link: itemToEdit.link,
          content: "",
          type: "socialLinks",
        });
      }
    } else if (type === "topBarItems") {
      itemToEdit = headerData.topBarItems.find((item) => item._id === itemId);
      if (itemToEdit) {
        setEditedItem({
          _id: itemToEdit._id,
          name: itemToEdit.name,
          link: "",
          content: itemToEdit.content,
          type: "topBarItems",
        });
      }
    }

    setEditDialogOpen(true);
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();

    if (editedItem.type === "mainMenu" || editedItem.type === "socialLinks") {
      if (!editedItem.name || !editedItem.link) {
        showErrorAlert("Please fill in all fields");
        return;
      }
    } else if (editedItem.type === "topBarItems") {
      if (!editedItem.name || !editedItem.content) {
        showErrorAlert("Please fill in all fields");
        return;
      }
    }

    if (editedItem.type === "mainMenu") {
      // Create a completely new array with the updated item
      const updatedMenu = headerData.mainMenu.map((item) =>
        item._id === editedItem._id
          ? { 
              ...item, 
              name: editedItem.name, 
              link: editedItem.link 
            }
          : item
      );

      // Log the changes for debugging
      console.log('Updated menu item:', editedItem);
      console.log('New menu items:', updatedMenu);

      // Update the state with the new array
      setHeaderData({
        ...headerData,
        mainMenu: updatedMenu,
      });
      
      // Save changes to header.json immediately
      saveChangesToAPI({
        ...headerData,
        mainMenu: updatedMenu,
      });
      
      showSuccessAlert("Menu item updated successfully");
    } else if (editedItem.type === "socialLinks") {
      const updatedSocialLinks = headerData.socialLinks.map((item) =>
        item._id === editedItem._id
          ? { ...item, name: editedItem.name, link: editedItem.link }
          : item
      );

      setHeaderData({
        ...headerData,
        socialLinks: updatedSocialLinks,
      });
      
      // Save changes to header.json immediately
      saveChangesToAPI({
        ...headerData,
        socialLinks: updatedSocialLinks,
      });
      
      showSuccessAlert("Social link updated successfully");
    } else if (editedItem.type === "topBarItems") {
      const updatedTopBarItems = headerData.topBarItems.map((item) =>
        item._id === editedItem._id
          ? { ...item, name: editedItem.name, content: editedItem.content }
          : item
      );

      setHeaderData({
        ...headerData,
        topBarItems: updatedTopBarItems,
      });
      
      // Save changes to header.json immediately
      saveChangesToAPI({
        ...headerData,
        topBarItems: updatedTopBarItems,
      });
      
      showSuccessAlert("Top bar item updated successfully");
    }

    // Reset the edited item
    setEditedItem({
      _id: "",
      name: "",
      link: "",
      content: "",
      type: "",
    });
    
    setEditDialogOpen(false);
  };

  // Function to refresh header data from API
  const refreshHeaderData = async () => {
    if (selectedHeader === null) return;

    try {
      console.log('Refreshing header data...');
      const response = await fetch('/api/header', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        next: { revalidate: 0 }
      });
      
      if (response.ok) {
        const freshData = await response.json();
        console.log('Refreshed header data:', freshData);
        
        const header = headers.find((h) => h.id === selectedHeader);
        if (!header) return;

        const updatedHeaderData = {
          mainMenu: Array.isArray(freshData.mainMenu) ? freshData.mainMenu : [],
          socialLinks: selectedHeader === 5 ? (Array.isArray(freshData.socialLinks) ? freshData.socialLinks : []) : [],
          topBarItems: header.hasTopBar ? (Array.isArray(freshData.topBarItems) ? freshData.topBarItems : []) : [],
          logoText: freshData.logo?.text || "Infinia",
          logoUrl: freshData.logo?.src || "/assets/imgs/template/favicon.svg",
          showDarkModeToggle: freshData.showDarkModeToggle !== undefined ? freshData.showDarkModeToggle : true,
          showActionButton: header.buttonText !== "",
          actionButtonText: header.buttonText,
          actionButtonLink: freshData.links?.freeTrialLink?.href || "/contact",
          headerComponent: freshData.headerComponent || header.component
        };

        // Use functional state update to ensure we're working with the latest state
        setHeaderData(prevData => {
          // If the data is the same, don't trigger a re-render
          if (JSON.stringify(prevData) === JSON.stringify(updatedHeaderData)) {
            return prevData;
          }
          return updatedHeaderData;
        });
      } else {
        console.error('Error refreshing header data:', await response.text());
      }
    } catch (error) {
      console.error('Error refreshing header data:', error);
    }
  };

  // Call refreshHeaderData when the selected header changes
  useEffect(() => {
    if (selectedHeader !== null) {
      refreshHeaderData();
    }
  }, [selectedHeader]);

  // After successful API operations, refresh data to ensure consistency
  const saveChangesToAPI = async (data: any) => {
    try {
      // Create the data structure to save
      const dataToSave = {
        logo: {
          src: data.logoUrl || headerData.logoUrl,
          alt: (data.logoText || headerData.logoText).toLowerCase(),
          text: data.logoText || headerData.logoText
        },
        links: {
          freeTrialLink: {
            href: data.actionButtonLink || headerData.actionButtonLink || "#",
            text: data.actionButtonText || headerData.actionButtonText || "Join For Free Trial"
          }
        },
        mainMenu: data.mainMenu || headerData.mainMenu,
        socialLinks: data.socialLinks || headerData.socialLinks,
        topBarItems: data.topBarItems || headerData.topBarItems,
        showDarkModeToggle: typeof data.showDarkModeToggle === 'boolean' ? data.showDarkModeToggle : headerData.showDarkModeToggle,
        showActionButton: typeof data.showActionButton === 'boolean' ? data.showActionButton : headerData.showActionButton,
        headerComponent: data.headerComponent || headerData.headerComponent || "Header1"
      };

      console.log('Saving data to API:', dataToSave);

      // Send the data to the API
      const response = await fetch('/api/header', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
        // Make sure we're not caching
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      // Get the response data
      const result = await response.json();
      console.log('API response:', result);

      // Force refresh header data after successful API call
      setTimeout(async () => {
        await refreshHeaderData();
      }, 300);

      // We don't show a success message here since the calling function will do it
    } catch (error: any) {
      console.error('Error saving menu changes:', error);
      showErrorAlert(`Error saving changes: ${error.message}`);
    }
  };

  // Handler for the "Save Changes" button click
  const handleSaveChanges = async () => {
    try {
      await saveChangesToAPI(headerData);
      showSuccessAlert("Header changes saved successfully!");
      
      // Redirect to dashboard after successful save
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error: any) {
      showErrorAlert(`Error saving changes: ${error.message}`);
    }
  };

  // Sort items by order field
  const sortedMainMenu = headerData?.mainMenu
    ? [...headerData.mainMenu].sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];

  const sortedSocialLinks = headerData?.socialLinks
    ? [...headerData.socialLinks].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      )
    : [];

  const sortedTopBarItems = headerData?.topBarItems
    ? [...headerData.topBarItems].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      )
    : [];

  const selectedHeaderInfo = headers.find((h) => h.id === selectedHeader);

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
                <BreadcrumbPage>Header Editor</BreadcrumbPage>
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

      {selectedHeader === null ? (
        <Card className="mb-8 border border-gray-100 shadow-sm w-full">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Select Header Style</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Choose a header design that fits your website style.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {headers.map((header) => (
                <div
                  key={header.id}
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                    selectedHeader === header.id
                      ? "border-blue-500 ring-2 ring-blue-100"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedHeader(header.id)}
                >
                  <div className="h-40 bg-gray-50 relative">
                    {header.image ? (
                      <img 
                        src={header.image} 
                        alt={`${header.name} Preview`} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        {header.component} Preview
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium">{header.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{header.component}</p>
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
              onClick={() => setSelectedHeader(null)}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Header Selection</span>
            </Button>
            <Button
              className="bg-black hover:bg-gray-800 text-white text-sm"
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </div>

          <Tabs defaultValue="main-menu" className="mt-4 space-y-6 w-full">
            <TabsList className="w-full flex h-10 rounded-md border bg-gray-50 p-1">
              <TabsTrigger
                value="main-menu"
                className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-medium text-sm"
              >
                Main Menu
              </TabsTrigger>
              {selectedHeader === 5 && (
                <TabsTrigger
                  value="social-links"
                  className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-medium text-sm"
                >
                  Social Links
                </TabsTrigger>
              )}
              {selectedHeaderInfo?.hasTopBar && (
                <TabsTrigger
                  value="topbar-items"
                  className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-medium text-sm"
                >
                  Top Bar
                </TabsTrigger>
              )}
              <TabsTrigger
                value="general-settings"
                className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-medium text-sm"
              >
                General Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="main-menu" className="w-full">
              <Card className="border border-gray-100 shadow-sm w-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Main Menu</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Manage and reorder your site's main navigation items.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Dialog
                      open={menuDialogOpen}
                      onOpenChange={setMenuDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 text-sm font-normal"
                        >
                          + Add Menu Item
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                          <DialogTitle className="text-base font-semibold">
                            New Menu Item
                          </DialogTitle>
                          <DialogDescription className="text-sm text-gray-500 mt-1">
                            Add a new item to your main navigation.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleItemAdd} className="space-y-4 mt-3">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm">
                              Name
                            </Label>
                            <Input
                              id="name"
                              value={newItem.name}
                              onChange={(e) =>
                                setNewItem({ ...newItem, name: e.target.value })
                              }
                              placeholder="Menu item name"
                              className="h-9 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="link" className="text-sm">
                              Link
                            </Label>
                            <Input
                              id="link"
                              value={newItem.link}
                              onChange={(e) =>
                                setNewItem({ ...newItem, link: e.target.value })
                              }
                              placeholder="/page-link"
                              className="h-9 text-sm"
                            />
                          </div>
                          <input
                            type="hidden"
                            value="mainMenu"
                            onChange={() =>
                              setNewItem({ ...newItem, type: "mainMenu" })
                            }
                          />
                          <Button
                            type="submit"
                            className="w-full mt-2 text-sm"
                          >
                            Add Menu Item
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="mt-2">
                    {sortedMainMenu.length > 0 ? (
                      <SortableList
                        items={sortedMainMenu}
                        onChange={(updatedItems: MenuItem[]) =>
                          handleItemsReorder(updatedItems, "mainMenu")
                        }
                        onDelete={(itemId: string) =>
                          handleItemDelete(itemId, "mainMenu")
                        }
                        onEdit={(itemId: string) =>
                          handleEditItem(itemId, "mainMenu")
                        }
                        renderItem={(item: MenuItem) => (
                          <div className="flex justify-between items-center w-full px-2">
                            <div className="font-medium text-sm">
                              {item.name}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {item.link}
                            </div>
                          </div>
                        )}
                      />
                    ) : (
                      <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-md">
                        No main menu items yet.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {selectedHeader === 5 && (
              <TabsContent value="social-links" className="w-full">
                <Card className="border border-gray-100 shadow-sm w-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">
                      Social Links
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      Manage your site's social media links.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Dialog
                        open={socialDialogOpen}
                        onOpenChange={setSocialDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 text-sm font-normal"
                          >
                            + Add Social Link
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[400px]">
                          <DialogHeader>
                            <DialogTitle className="text-base font-semibold">
                              New Social Link
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-500 mt-1">
                              Add a new social media platform link.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleItemAdd} className="space-y-4 mt-3">
                            <div className="space-y-2">
                              <Label htmlFor="name" className="text-sm">
                                Platform
                              </Label>
                              <Input
                                id="name"
                                value={newItem.name}
                                onChange={(e) =>
                                  setNewItem({
                                    ...newItem,
                                    name: e.target.value,
                                    type: "socialLinks",
                                  })
                                }
                                placeholder="e.g., Twitter"
                                className="h-9 text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="link" className="text-sm">
                                Link
                              </Label>
                              <Input
                                id="link"
                                value={newItem.link}
                                onChange={(e) =>
                                  setNewItem({
                                    ...newItem,
                                    link: e.target.value,
                                    type: "socialLinks",
                                  })
                                }
                                placeholder="https://twitter.com/username"
                                className="h-9 text-sm"
                              />
                            </div>
                            <Button
                              type="submit"
                              className="w-full mt-2 text-sm"
                            >
                              Add Social Link
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="mt-2">
                      {sortedSocialLinks.length > 0 ? (
                        <SortableList
                          items={sortedSocialLinks}
                          onChange={(updatedItems: MenuItem[]) =>
                            handleItemsReorder(updatedItems, "socialLinks")
                          }
                          onDelete={(itemId: string) =>
                            handleItemDelete(itemId, "socialLinks")
                          }
                          onEdit={(itemId: string) =>
                            handleEditItem(itemId, "socialLinks")
                          }
                          renderItem={(item: MenuItem) => (
                            <div className="flex justify-between items-center w-full px-2">
                              <div className="font-medium text-sm">
                                {item.name}
                              </div>
                              <div className="text-gray-500 text-xs">
                                {item.link}
                              </div>
                            </div>
                          )}
                        />
                      ) : (
                        <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-md">
                          No social links yet.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {selectedHeaderInfo?.hasTopBar && (
              <TabsContent value="topbar-items" className="w-full">
                <Card className="border border-gray-100 shadow-sm w-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">
                      Top Bar
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      Manage your header's top bar information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Dialog
                        open={topBarDialogOpen}
                        onOpenChange={setTopBarDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 text-sm font-normal"
                          >
                            + Add Top Bar Item
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[400px]">
                          <DialogHeader>
                            <DialogTitle className="text-base font-semibold">
                              New Top Bar Item
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-500 mt-1">
                              Add contact information to your header's top bar.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleItemAdd} className="space-y-4 mt-3">
                            <div className="space-y-2">
                              <Label htmlFor="name" className="text-sm">
                                Label
                              </Label>
                              <Input
                                id="name"
                                value={newItem.name}
                                onChange={(e) =>
                                  setNewItem({
                                    ...newItem,
                                    name: e.target.value,
                                    type: "topBarItems",
                                  })
                                }
                                placeholder="e.g., Phone, Email, Address"
                                className="h-9 text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="content" className="text-sm">
                                Content
                              </Label>
                              <Input
                                id="content"
                                value={newItem.content}
                                onChange={(e) =>
                                  setNewItem({
                                    ...newItem,
                                    content: e.target.value,
                                    type: "topBarItems",
                                  })
                                }
                                placeholder="e.g., +1 (555) 123-4567"
                                className="h-9 text-sm"
                              />
                            </div>
                            <Button
                              type="submit"
                              className="w-full mt-2 text-sm"
                            >
                              Add Top Bar Item
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="mt-2">
                      {sortedTopBarItems.length > 0 ? (
                        <SortableList
                          items={sortedTopBarItems}
                          onChange={(updatedItems: TopBarItem[]) =>
                            handleItemsReorder(updatedItems, "topBarItems")
                          }
                          onDelete={(itemId: string) =>
                            handleItemDelete(itemId, "topBarItems")
                          }
                          onEdit={(itemId: string) =>
                            handleEditItem(itemId, "topBarItems")
                          }
                          renderItem={(item: TopBarItem) => (
                            <div className="flex justify-between items-center w-full px-2">
                              <div className="font-medium text-sm">
                                {item.name}
                              </div>
                              <div className="text-gray-500 text-xs">
                                {item.content}
                              </div>
                            </div>
                          )}
                        />
                      ) : (
                        <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-md">
                          No top bar items yet.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            <TabsContent value="general-settings" className="w-full">
              <Card className="border border-gray-100 shadow-sm w-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">
                    General Settings
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Manage logo, theme options, and action buttons.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="logoText"
                          className="text-sm"
                        >
                          Logo Text
                        </Label>
                        <Input
                          id="logoText"
                          value={headerData.logoText}
                          onChange={(e) =>
                            setHeaderData({
                              ...headerData,
                              logoText: e.target.value,
                            })
                          }
                          placeholder="Logo text"
                          className="h-9 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="logoUrl" className="text-sm">
                          Logo URL
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="logoUrl"
                            value={headerData.logoUrl}
                            onChange={(e) =>
                              setHeaderData({
                                ...headerData,
                                logoUrl: e.target.value,
                              })
                            }
                            placeholder="/images/logo.png"
                            className="flex-1 h-9 text-sm"
                          />
                          <div className="relative">
                            <Input
                              type="file"
                              id="logoFile"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              disabled={logoUploading}
                              className="relative h-9 text-sm"
                              size="sm"
                            >
                              {logoUploading ? (
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
                        <p className="text-xs text-gray-500 mt-1">
                          Enter a URL or upload an image file.
                        </p>
                      </div>

                      {headerData.logoUrl && (
                        <div className="mt-4">
                          <p className="mb-2 text-xs text-gray-500">
                            Preview:
                          </p>
                          <img
                            src={headerData.logoUrl}
                            alt={headerData.logoText || "Logo"}
                            className="h-8 object-contain border rounded p-1"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="darkModeToggle" className="text-sm">
                            Dark Mode Toggle
                          </Label>
                          <Switch
                            id="darkModeToggle"
                            checked={headerData.showDarkModeToggle}
                            onCheckedChange={(checked) =>
                              setHeaderData({
                                ...headerData,
                                showDarkModeToggle: checked,
                              })
                            }
                          />
                        </div>
                        <p className="text-xs text-gray-500">Show dark mode toggle in the header.</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="actionButton" className="text-sm">
                            Action Button
                          </Label>
                          <Switch
                            id="actionButton"
                            checked={headerData.showActionButton}
                            onCheckedChange={(checked) =>
                              setHeaderData({
                                ...headerData,
                                showActionButton: checked,
                              })
                            }
                          />
                        </div>
                        <p className="text-xs text-gray-500">Show a call-to-action button in the header.</p>

                        {headerData.showActionButton && (
                          <div className="space-y-4 mt-4 pl-2 border-l-2 border-gray-100">
                            <div className="space-y-2">
                              <Label
                                htmlFor="actionButtonText"
                                className="text-sm"
                              >
                                Button Text
                              </Label>
                              <Input
                                id="actionButtonText"
                                value={headerData.actionButtonText}
                                onChange={(e) =>
                                  setHeaderData({
                                    ...headerData,
                                    actionButtonText: e.target.value,
                                  })
                                }
                                placeholder="Get Started"
                                className="h-9 text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="actionButtonLink"
                                className="text-sm"
                              >
                                Button Link
                              </Label>
                              <Input
                                id="actionButtonLink"
                                value={headerData.actionButtonLink}
                                onChange={(e) =>
                                  setHeaderData({
                                    ...headerData,
                                    actionButtonLink: e.target.value,
                                  })
                                }
                                placeholder="/contact"
                                className="h-9 text-sm"
                              />
                            </div>
                           
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">Edit Item</DialogTitle>
                <DialogDescription className="text-sm text-gray-500 mt-1">
                  Update the information for this item.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateItem} className="space-y-4 mt-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-sm">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={editedItem.name}
                    onChange={(e) =>
                      setEditedItem({ ...editedItem, name: e.target.value })
                    }
                    placeholder="Item name"
                    className="h-9 text-sm"
                  />
                </div>

                {(editedItem.type === "mainMenu" ||
                  editedItem.type === "socialLinks") && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-link" className="text-sm">
                      Link
                    </Label>
                    <Input
                      id="edit-link"
                      value={editedItem.link}
                      onChange={(e) =>
                        setEditedItem({ ...editedItem, link: e.target.value })
                      }
                      placeholder="/page-link or https://..."
                      className="h-9 text-sm"
                    />
                  </div>
                )}

                {editedItem.type === "topBarItems" && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-content" className="text-sm">
                      Content
                    </Label>
                    <Input
                      id="edit-content"
                      value={editedItem.content}
                      onChange={(e) =>
                        setEditedItem({
                          ...editedItem,
                          content: e.target.value,
                        })
                      }
                      placeholder="Content text"
                      className="h-9 text-sm"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full mt-2 text-sm"
                >
                  Update
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
