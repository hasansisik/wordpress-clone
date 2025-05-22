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
  Trash,
  Edit,
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
    actionButtonLink: "",
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
    },
    {
      id: 2,
      name: "Fluid Header",
      image: "/assets/imgs/headers/header2.png",
      hasTopBar: false,
      buttonText: "Join For Free Trial",
    },
    {
      id: 3,
      name: "Topbar Header",
      image: "/assets/imgs/headers/header3.png",
      hasTopBar: true,
      buttonText: "Join For Free Trial",
    },
    {
      id: 4,
      name: "Centered Header",
      image: "/assets/imgs/headers/header4.png",
      hasTopBar: false,
      buttonText: "",
    },
    {
      id: 5,
      name: "Contact Header",
      image: "/assets/imgs/headers/header5.png",
      hasTopBar: true,
      buttonText: "Get a Quote",
    },
  ];

  // Initialize header data based on selection
  useEffect(() => {
    if (selectedHeader === null) return;

    const header = headers.find((h) => h.id === selectedHeader);
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
      },
    ];

    // Top bar items for headers with top bars
    const topBarItems = [
      { _id: "1", name: "Phone", content: "+01 (24) 568 900", order: 0 },
      { _id: "2", name: "Email", content: "contact@infinia.com", order: 1 },
      {
        _id: "3",
        name: "Address",
        content: "0811 Erdman Prairie, Joaville CA",
        order: 2,
      },
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
      actionButtonLink: "/contact",
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

    if (newItem.type === "mainMenu") {
      const newOrder = headerData.mainMenu.length;
      const newMainMenu = [
        ...headerData.mainMenu,
        { _id: newId, name: newItem.name, link: newItem.link, order: newOrder },
      ];

      setHeaderData({
        ...headerData,
        mainMenu: newMainMenu,
      });
    } else if (newItem.type === "socialLinks") {
      const newOrder = headerData.socialLinks.length;
      const newSocialLinks = [
        ...headerData.socialLinks,
        { _id: newId, name: newItem.name, link: newItem.link, order: newOrder },
      ];

      setHeaderData({
        ...headerData,
        socialLinks: newSocialLinks,
      });
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

      setHeaderData({
        ...headerData,
        topBarItems: newTopBarItems,
      });
    }

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

    showSuccessAlert("Item added successfully");
  };

  const handleItemDelete = (itemId: string, type: string) => {
    if (type === "mainMenu") {
      const updatedMenu = headerData.mainMenu.filter(
        (item) => item._id !== itemId
      );
      setHeaderData({
        ...headerData,
        mainMenu: updatedMenu,
      });
    } else if (type === "socialLinks") {
      const updatedSocialLinks = headerData.socialLinks.filter(
        (item) => item._id !== itemId
      );
      setHeaderData({
        ...headerData,
        socialLinks: updatedSocialLinks,
      });
    } else if (type === "topBarItems") {
      const updatedTopBarItems = headerData.topBarItems.filter(
        (item) => item._id !== itemId
      );
      setHeaderData({
        ...headerData,
        topBarItems: updatedTopBarItems,
      });
    }

    showSuccessAlert("Item deleted successfully");
  };

  const handleItemsReorder = (
    updatedItems: MenuItem[] | TopBarItem[],
    type: string
  ) => {
    // Update the order based on new positions
    const itemsWithUpdatedOrder = updatedItems.map((item, index) => ({
      ...item,
      order: index,
    }));

    if (type === "mainMenu") {
      setHeaderData({
        ...headerData,
        mainMenu: itemsWithUpdatedOrder as MenuItem[],
      });
    } else if (type === "socialLinks") {
      setHeaderData({
        ...headerData,
        socialLinks: itemsWithUpdatedOrder as MenuItem[],
      });
    } else if (type === "topBarItems") {
      setHeaderData({
        ...headerData,
        topBarItems: itemsWithUpdatedOrder as TopBarItem[],
      });
    }

    showSuccessAlert("Items reordered successfully");
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
      const updatedMenu = headerData.mainMenu.map((item) =>
        item._id === editedItem._id
          ? { ...item, name: editedItem.name, link: editedItem.link }
          : item
      );

      setHeaderData({
        ...headerData,
        mainMenu: updatedMenu,
      });
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
    }

    setEditDialogOpen(false);
    showSuccessAlert("Item updated successfully");
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
    <div className="container px-4">
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
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {showAlert && (
        <Alert
          className={`mb-4 ${
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
          <AlertTitle>
            {alertType === "success" ? "Success" : "Error"}
          </AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      {selectedHeader === null ? (
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
                    selectedHeader === header.id
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "hover:border-gray-300"
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
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 border hover:text-gray-900"
              onClick={() => setSelectedHeader(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-left"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              <span>Back to Header Selection</span>
            </Button>
          </div>

          <Tabs defaultValue="main-menu" className="mt-4 space-y-4">
            <TabsList className="w-full flex h-9 gap-1 bg-background p-0.5 border border-gray-200 rounded-md">
              <TabsTrigger
                value="main-menu"
                className="text-xs h-7 rounded data-[state=active]:shadow-none data-[state=active]:bg-white"
              >
                Main Menu
              </TabsTrigger>
              {selectedHeader === 5 && (
                <TabsTrigger
                  value="social-links"
                  className="text-xs h-7 rounded data-[state=active]:shadow-none data-[state=active]:bg-white"
                >
                  Social Links
                </TabsTrigger>
              )}
              {selectedHeaderInfo?.hasTopBar && (
                <TabsTrigger
                  value="topbar-items"
                  className="text-xs h-7 rounded data-[state=active]:shadow-none data-[state=active]:bg-white"
                >
                  Top Bar
                </TabsTrigger>
              )}
              <TabsTrigger
                value="general-settings"
                className="text-xs h-7 rounded data-[state=active]:shadow-none data-[state=active]:bg-white"
              >
                General Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="main-menu">
              <Card className="border border-gray-200 rounded-lg shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium text-gray-800">
                    Main Menu
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    Manage and reorder your site's main navigation items.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="mb-4">
                    <Dialog
                      open={menuDialogOpen}
                      onOpenChange={setMenuDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 text-sm font-normal border-gray-200"
                        >
                          + Add Menu Item
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                          <DialogTitle className="text-base">
                            New Menu Item
                          </DialogTitle>
                          <DialogDescription className="text-xs">
                            Add a new item to your main navigation.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleItemAdd} className="space-y-3">
                          <div className="space-y-1">
                            <Label htmlFor="name" className="text-xs">
                              Name
                            </Label>
                            <Input
                              id="name"
                              value={newItem.name}
                              onChange={(e) =>
                                setNewItem({ ...newItem, name: e.target.value })
                              }
                              placeholder="Menu item name"
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="link" className="text-xs">
                              Link
                            </Label>
                            <Input
                              id="link"
                              value={newItem.link}
                              onChange={(e) =>
                                setNewItem({ ...newItem, link: e.target.value })
                              }
                              placeholder="/page-link"
                              className="h-8 text-sm"
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
                            size="sm"
                            className="w-full mt-2 h-8 text-xs"
                          >
                            Add
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
                <Card className="border border-gray-200 rounded-lg shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium text-gray-800">
                      Social Links
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500">
                      Manage your site's social media links.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="mb-4">
                      <Dialog
                        open={socialDialogOpen}
                        onOpenChange={setSocialDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs font-normal border-gray-200"
                          >
                            + Add Social Link
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[400px]">
                          <DialogHeader>
                            <DialogTitle className="text-base">
                              New Social Link
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                              Add a new social media platform link.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleItemAdd} className="space-y-3">
                            <div className="space-y-1">
                              <Label htmlFor="name" className="text-xs">
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
                                className="h-8 text-sm"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="link" className="text-xs">
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
                                className="h-8 text-sm"
                              />
                            </div>
                            <Button
                              type="submit"
                              size="sm"
                              className="w-full mt-2 h-8 text-xs"
                            >
                              Add
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
                        <div className="text-center py-6 text-gray-500 text-xs">
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
                <Card className="border border-gray-200 rounded-lg shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium text-gray-800">
                      Top Bar
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500">
                      Manage your header's top bar information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="mb-4">
                      <Dialog
                        open={topBarDialogOpen}
                        onOpenChange={setTopBarDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs font-normal"
                          >
                            + Add Top Bar Item
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[400px]">
                          <DialogHeader>
                            <DialogTitle className="text-base">
                              New Top Bar Item
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                              Add contact information to your header's top bar.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleItemAdd} className="space-y-3">
                            <div className="space-y-1">
                              <Label htmlFor="name" className="text-xs">
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
                                className="h-8 text-sm"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="content" className="text-xs">
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
                                className="h-8 text-sm"
                              />
                            </div>
                            <Button
                              type="submit"
                              size="sm"
                              className="w-full mt-2 h-8 text-xs"
                            >
                              Add
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
                        <div className="text-center py-6 text-gray-500 text-xs">
                          No top bar items yet.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            <TabsContent value="general-settings">
              <Card className="border border-gray-200 rounded-lg shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium text-gray-800">
                    General Settings
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    Manage logo, theme options, and action buttons.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <Label
                          htmlFor="logoText"
                          className="block mb-1 text-xs"
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
                          className="h-8 text-sm"
                        />
                      </div>

                      <div>
                        <Label htmlFor="logoUrl" className="block mb-1 text-xs">
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
                            className="flex-1 h-8 text-sm"
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
                              className="relative h-8 text-xs"
                              size="sm"
                            >
                              {logoUploading ? (
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
                        <p className="text-[10px] text-gray-500 mt-1">
                          Enter a URL or upload an image file.
                        </p>
                      </div>

                      {headerData.logoUrl && (
                        <div className="mb-3">
                          <p className="mb-1 text-[10px] text-gray-500">
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

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="darkModeToggle" className="text-xs">
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
                            className="h-4 w-7"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="actionButton" className="text-xs">
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
                            className="h-4 w-7"
                          />
                        </div>

                        {headerData.showActionButton && (
                          <>
                            <div>
                              <Label
                                htmlFor="actionButtonText"
                                className="block mb-1 text-xs"
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
                                className="h-8 text-sm"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="actionButtonLink"
                                className="block mb-1 text-xs"
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
                                className="h-8 text-sm"
                              />
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

          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-base">Edit Item</DialogTitle>
                <DialogDescription className="text-xs">
                  Update the information for this item.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateItem} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="edit-name" className="text-xs">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={editedItem.name}
                    onChange={(e) =>
                      setEditedItem({ ...editedItem, name: e.target.value })
                    }
                    placeholder="Item name"
                    className="h-8 text-sm"
                  />
                </div>

                {(editedItem.type === "mainMenu" ||
                  editedItem.type === "socialLinks") && (
                  <div className="space-y-1">
                    <Label htmlFor="edit-link" className="text-xs">
                      Link
                    </Label>
                    <Input
                      id="edit-link"
                      value={editedItem.link}
                      onChange={(e) =>
                        setEditedItem({ ...editedItem, link: e.target.value })
                      }
                      placeholder="/page-link or https://..."
                      className="h-8 text-sm"
                    />
                  </div>
                )}

                {editedItem.type === "topBarItems" && (
                  <div className="space-y-1">
                    <Label htmlFor="edit-content" className="text-xs">
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
                      className="h-8 text-sm"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  size="sm"
                  className="w-full mt-2 h-8 text-xs"
                >
                  Update
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <div className="mt-6 flex justify-end">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-xs h-8 flex items-center"
            >
              Save Changes
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
