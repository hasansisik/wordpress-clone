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
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { Textarea } from "@/components/ui/textarea";

// Define types for footer items
interface LinkItem {
  _id: string;
  name: string;
  link: string;
  order: number;
}

interface Column {
  _id: string;
  title: string;
  order: number;
  links: LinkItem[];
}

interface AppLink {
  image: string;
  link: string;
  alt: string;
}

interface ContactItems {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

interface FooterData {
  logo: {
    src: string;
    alt: string;
    text: string;
  };
  copyright: string;
  description: string;
  socialLinks: LinkItem[];
  columns: Column[];
  footerComponent: string;
  contactItems: ContactItems;
  instagramPosts: string[];
  appLinks: AppLink[];
  showAppLinks: boolean;
  showInstagram: boolean;
  showPrivacyLinks: boolean;
  privacyLinks: LinkItem[];
}

// Footer component configurations
const footers = [
  {
    id: 1,
    name: "Standard Footer",
    image: "/assets/imgs/footers/footer1.png",
    component: "Footer1",
    hasInstagram: false,
    hasAppLinks: false
  },
  {
    id: 2,
    name: "Light Footer",
    image: "/assets/imgs/footers/footer2.png",
    component: "Footer2",
    hasInstagram: true,
    hasAppLinks: false
  },
  {
    id: 3,
    name: "Compact Footer",
    image: "/assets/imgs/footers/footer3.png",
    component: "Footer3",
    hasInstagram: false,
    hasAppLinks: true
  },
  {
    id: 4,
    name: "App Footer",
    image: "/assets/imgs/footers/footer4.png",
    component: "Footer4",
    hasInstagram: false,
    hasAppLinks: true
  }
];

export default function FooterEditor() {
  const router = useRouter();
  const [selectedFooter, setSelectedFooter] = useState<number | null>(null);
  const [footerData, setFooterData] = useState<FooterData>({
    logo: {
      src: "/assets/imgs/logo/logo-white.svg",
      alt: "infinia",
      text: "Infinia"
    },
    copyright: "Copyright © 2024 Infinia. All Rights Reserved",
    description: "You may also realize cost savings from your energy efficient choices in your custom home. Federal tax credits for some green materials can allow you to deduct as much.",
    socialLinks: [],
    columns: [],
    footerComponent: "Footer1",
    contactItems: {
      address: "0811 Erdman Prairie, Joaville CA",
      phone: "+01 (24) 568 900",
      email: "contact@infinia.com",
      hours: "Mon-Fri: 9am-5pm"
    },
    instagramPosts: [],
    appLinks: [],
    showAppLinks: false,
    showInstagram: false,
    showPrivacyLinks: true,
    privacyLinks: []
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  
  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [columnDialogOpen, setColumnDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [privacyLinkDialogOpen, setPrivacyLinkDialogOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedItem, setEditedItem] = useState<any>({
    _id: "",
    name: "",
    link: "",
    title: "",
    type: "",
    columnId: ""
  });
  
  const [newItem, setNewItem] = useState<any>({
    name: "",
    link: "",
    title: "",
    type: "socialLinks",
    columnId: ""
  });

  // Initialize footer data based on selection
  useEffect(() => {
    if (selectedFooter === null) return;

    const footer = footers.find((f) => f.id === selectedFooter);
    if (!footer) return;

    // Set initial default values while waiting for API data
    const initialData: FooterData = {
      logo: {
        src: "/assets/imgs/logo/logo-white.svg",
        alt: "infinia",
        text: "Infinia"
      },
      copyright: "Copyright © 2024 Infinia. All Rights Reserved",
      description: "You may also realize cost savings from your energy efficient choices in your custom home. Federal tax credits for some green materials can allow you to deduct as much.",
      socialLinks: [
        {
          _id: "1",
          name: "Facebook",
          link: "https://www.facebook.com/",
          order: 0
        },
        {
          _id: "2",
          name: "Twitter",
          link: "https://twitter.com/",
          order: 1
        },
        {
          _id: "3",
          name: "LinkedIn",
          link: "https://www.linkedin.com/",
          order: 2
        },
        {
          _id: "4",
          name: "Behance",
          link: "https://www.behance.net/",
          order: 3
        }
      ],
      columns: [
        {
          _id: "1",
          title: "Company",
          order: 0,
          links: [
            { _id: "1", name: "Mission & Vision", link: "#", order: 0 },
            { _id: "2", name: "Our Team", link: "#", order: 1 },
            { _id: "3", name: "Careers", link: "#", order: 2 },
            { _id: "4", name: "Press & Media", link: "#", order: 3 },
            { _id: "5", name: "Advertising", link: "#", order: 4 },
            { _id: "6", name: "Testimonials", link: "#", order: 5 }
          ]
        },
        {
          _id: "2",
          title: "Resource",
          order: 1,
          links: [
            { _id: "1", name: "Knowledge Base", link: "#", order: 0 },
            { _id: "2", name: "Documents", link: "#", order: 1 },
            { _id: "3", name: "System Status", link: "#", order: 2 },
            { _id: "4", name: "Security", link: "#", order: 3 }
          ]
        }
      ],
      footerComponent: footer.component,
      contactItems: {
        address: "0811 Erdman Prairie, Joaville CA",
        phone: "+01 (24) 568 900",
        email: "contact@infinia.com",
        hours: "Mon-Fri: 9am-5pm"
      },
      instagramPosts: footer.hasInstagram ? [
        "/assets/imgs/footer-3/img-inst-1.png",
        "/assets/imgs/footer-3/img-inst-2.png",
        "/assets/imgs/footer-3/img-inst-3.png",
        "/assets/imgs/footer-3/img-inst-4.png",
        "/assets/imgs/footer-3/img-inst-5.png",
        "/assets/imgs/footer-3/img-inst-6.png"
      ] : [],
      appLinks: footer.hasAppLinks ? [
        {
          image: "/assets/imgs/footer-4/app-payment-1.png",
          link: "#",
          alt: "App Store"
        },
        {
          image: "/assets/imgs/footer-4/app-payment-2.png",
          link: "#",
          alt: "Google Play"
        },
        {
          image: "/assets/imgs/footer-4/app-payment-3.png",
          link: "#",
          alt: "Microsoft"
        },
        {
          image: "/assets/imgs/footer-4/app-payment-4.png",
          link: "#",
          alt: "Amazon"
        }
      ] : [],
      showAppLinks: footer.hasAppLinks,
      showInstagram: footer.hasInstagram,
      showPrivacyLinks: true,
      privacyLinks: [
        { _id: "1", name: "Privacy policy", link: "#", order: 0 },
        { _id: "2", name: "Cookies", link: "#", order: 1 },
        { _id: "3", name: "Terms of service", link: "#", order: 2 }
      ]
    };

    // Set initial data while waiting for API response
    setFooterData(initialData);
    
    // Then fetch the latest data from API
    refreshFooterData();
  }, [selectedFooter]);

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
      // Upload to Cloudinary
      const uploadedUrl = await uploadImageToCloudinary(file);

      setFooterData({
        ...footerData,
        logo: {
          ...footerData.logo,
          src: uploadedUrl
        }
      });

      showSuccessAlert("Logo uploaded successfully");
    } catch (error: any) {
      showErrorAlert(`Error uploading logo: ${error.message}`);
    } finally {
      setLogoUploading(false);
    }
  };

  // Function to refresh footer data from API
  const refreshFooterData = async () => {
    if (selectedFooter === null) return;

    try {
      console.log('Refreshing footer data...');
      const response = await fetch('/api/footer', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        next: { revalidate: 0 }
      });
      
      if (response.ok) {
        const freshData = await response.json();
        console.log('Refreshed footer data:', freshData);
        
        const footer = footers.find((f) => f.id === selectedFooter);
        if (!footer) return;

        // Use functional state update to ensure we're working with the latest state
        setFooterData(prevData => {
          const updatedData = {
            ...prevData,
            logo: freshData.logo || prevData.logo,
            copyright: freshData.copyright || prevData.copyright,
            description: freshData.description || prevData.description,
            socialLinks: freshData.socialLinks || prevData.socialLinks,
            columns: freshData.columns || prevData.columns,
            footerComponent: freshData.footerComponent || footer.component,
            contactItems: freshData.contactItems || prevData.contactItems,
            instagramPosts: footer.hasInstagram ? (freshData.instagramPosts || prevData.instagramPosts) : [],
            appLinks: footer.hasAppLinks ? (freshData.appLinks || prevData.appLinks) : [],
            showAppLinks: footer.hasAppLinks,
            showInstagram: footer.hasInstagram,
            showPrivacyLinks: freshData.showPrivacyLinks !== undefined ? freshData.showPrivacyLinks : prevData.showPrivacyLinks,
            privacyLinks: freshData.privacyLinks || prevData.privacyLinks
          };
          
          // If the data is the same, don't trigger a re-render
          if (JSON.stringify(prevData) === JSON.stringify(updatedData)) {
            return prevData;
          }
          return updatedData;
        });
      } else {
        console.error('Error refreshing footer data:', await response.text());
      }
    } catch (error) {
      console.error('Error refreshing footer data:', error);
    }
  };

  // Call refreshFooterData when the selected footer changes
  useEffect(() => {
    if (selectedFooter !== null) {
      refreshFooterData();
    }
  }, [selectedFooter]);

  // After successful API operations, refresh data to ensure consistency
  const saveChangesToAPI = async (data: any) => {
    try {
      console.log('Saving data to API:', data);

      // Send the data to the API
      const response = await fetch('/api/footer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        // Make sure we're not caching
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      // Get the response data
      const result = await response.json();
      console.log('API response:', result);

      // Force refresh footer data after successful API call
      setTimeout(async () => {
        await refreshFooterData();
      }, 300);

      // We don't show a success message here since the calling function will do it
    } catch (error: any) {
      console.error('Error saving footer changes:', error);
      showErrorAlert(`Error saving changes: ${error.message}`);
    }
  };

  // Handle adding social link
  const handleSocialLinkAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newItem.name || !newItem.link) {
      showErrorAlert("Please fill in all fields");
      return;
    }

    const newId = Math.random().toString(36).substr(2, 9);
    const newOrder = footerData.socialLinks.length;
    
    const updatedSocialLinks = [
      ...footerData.socialLinks,
      { _id: newId, name: newItem.name, link: newItem.link, order: newOrder }
    ];

    const updatedData = {
      ...footerData,
      socialLinks: updatedSocialLinks
    };

    // Update state with new data
    setFooterData(updatedData);

    // Save changes to API
    saveChangesToAPI(updatedData);

    setNewItem({
      ...newItem,
      name: "",
      link: ""
    });

    // Close dialog
    setSocialDialogOpen(false);

    showSuccessAlert("Social link added successfully");
  };

  // Handle adding a new footer column
  const handleColumnAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newItem.title) {
      showErrorAlert("Please enter a column title");
      return;
    }

    const newId = Math.random().toString(36).substr(2, 9);
    const newOrder = footerData.columns.length;
    
    const newColumn: Column = {
      _id: newId,
      title: newItem.title,
      order: newOrder,
      links: []
    };

    const updatedColumns = [...footerData.columns, newColumn];
    const updatedData = {
      ...footerData,
      columns: updatedColumns
    };

    // Update state
    setFooterData(updatedData);

    // Save changes to API
    saveChangesToAPI(updatedData);

    setNewItem({
      ...newItem,
      title: ""
    });

    // Close dialog
    setColumnDialogOpen(false);

    showSuccessAlert("Column added successfully");
  };

  // Handle adding a new link to a column
  const handleLinkAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newItem.name || !newItem.link || !selectedColumn) {
      showErrorAlert("Please fill in all fields");
      return;
    }

    const columnIndex = footerData.columns.findIndex(col => col._id === selectedColumn);
    if (columnIndex === -1) {
      showErrorAlert("Selected column not found");
      return;
    }

    const newId = Math.random().toString(36).substr(2, 9);
    const newOrder = footerData.columns[columnIndex].links.length;
    
    const newLink: LinkItem = {
      _id: newId,
      name: newItem.name,
      link: newItem.link,
      order: newOrder
    };

    // Create a deep copy of columns array
    const updatedColumns = [...footerData.columns];
    updatedColumns[columnIndex] = {
      ...updatedColumns[columnIndex],
      links: [...updatedColumns[columnIndex].links, newLink]
    };

    const updatedData = {
      ...footerData,
      columns: updatedColumns
    };

    // Update state
    setFooterData(updatedData);

    // Save changes to API
    saveChangesToAPI(updatedData);

    setNewItem({
      ...newItem,
      name: "",
      link: ""
    });

    // Close dialog
    setLinkDialogOpen(false);

    showSuccessAlert("Link added successfully");
  };

  // Handle adding a privacy link
  const handlePrivacyLinkAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newItem.name || !newItem.link) {
      showErrorAlert("Please fill in all fields");
      return;
    }

    const newId = Math.random().toString(36).substr(2, 9);
    const newOrder = footerData.privacyLinks.length;
    
    const updatedPrivacyLinks = [
      ...footerData.privacyLinks,
      { _id: newId, name: newItem.name, link: newItem.link, order: newOrder }
    ];

    const updatedData = {
      ...footerData,
      privacyLinks: updatedPrivacyLinks
    };

    // Update state
    setFooterData(updatedData);

    // Save changes to API
    saveChangesToAPI(updatedData);

    setNewItem({
      ...newItem,
      name: "",
      link: ""
    });

    // Close dialog
    setPrivacyLinkDialogOpen(false);

    showSuccessAlert("Privacy link added successfully");
  };

  // Handle item deletion
  const handleItemDelete = (itemId: string, type: string, columnId?: string) => {
    let updatedData = { ...footerData };

    if (type === "socialLinks") {
      const updatedSocialLinks = footerData.socialLinks.filter(item => item._id !== itemId);
      
      // Re-calculate order values
      const reorderedSocialLinks = updatedSocialLinks.map((item, index) => ({
        ...item,
        order: index
      }));
      
      updatedData = {
        ...footerData,
        socialLinks: reorderedSocialLinks
      };

      showSuccessAlert("Social link deleted successfully");
    } else if (type === "column") {
      const updatedColumns = footerData.columns.filter(col => col._id !== itemId);
      
      // Re-calculate order values
      const reorderedColumns = updatedColumns.map((col, index) => ({
        ...col,
        order: index
      }));
      
      updatedData = {
        ...footerData,
        columns: reorderedColumns
      };

      showSuccessAlert("Column deleted successfully");
    } else if (type === "link" && columnId) {
      const columnIndex = footerData.columns.findIndex(col => col._id === columnId);
      if (columnIndex !== -1) {
        const updatedLinks = footerData.columns[columnIndex].links.filter(link => link._id !== itemId);
        
        // Re-calculate order values
        const reorderedLinks = updatedLinks.map((link, index) => ({
          ...link,
          order: index
        }));
        
        const updatedColumns = [...footerData.columns];
        updatedColumns[columnIndex] = {
          ...updatedColumns[columnIndex],
          links: reorderedLinks
        };
        
        updatedData = {
          ...footerData,
          columns: updatedColumns
        };

        showSuccessAlert("Link deleted successfully");
      }
    } else if (type === "privacyLinks") {
      const updatedPrivacyLinks = footerData.privacyLinks.filter(item => item._id !== itemId);
      
      // Re-calculate order values
      const reorderedPrivacyLinks = updatedPrivacyLinks.map((item, index) => ({
        ...item,
        order: index
      }));
      
      updatedData = {
        ...footerData,
        privacyLinks: reorderedPrivacyLinks
      };

      showSuccessAlert("Privacy link deleted successfully");
    }

    // Update state
    setFooterData(updatedData);

    // Save changes to API
    saveChangesToAPI(updatedData);
  };

  // Handle item editing
  const handleEditItem = (itemId: string, type: string, columnId?: string) => {
    let itemToEdit;

    if (type === "socialLinks") {
      itemToEdit = footerData.socialLinks.find((item) => item._id === itemId);
      if (itemToEdit) {
        setEditedItem({
          _id: itemToEdit._id,
          name: itemToEdit.name,
          link: itemToEdit.link,
          type: "socialLinks"
        });
      }
    } else if (type === "column") {
      itemToEdit = footerData.columns.find((col) => col._id === itemId);
      if (itemToEdit) {
        setEditedItem({
          _id: itemToEdit._id,
          title: itemToEdit.title,
          type: "column"
        });
      }
    } else if (type === "link" && columnId) {
      const column = footerData.columns.find((col) => col._id === columnId);
      if (column) {
        itemToEdit = column.links.find((link) => link._id === itemId);
        if (itemToEdit) {
          setEditedItem({
            _id: itemToEdit._id,
            name: itemToEdit.name,
            link: itemToEdit.link,
            type: "link",
            columnId: columnId
          });
        }
      }
    } else if (type === "privacyLinks") {
      itemToEdit = footerData.privacyLinks.find((item) => item._id === itemId);
      if (itemToEdit) {
        setEditedItem({
          _id: itemToEdit._id,
          name: itemToEdit.name,
          link: itemToEdit.link,
          type: "privacyLinks"
        });
      }
    }

    setEditDialogOpen(true);
  };

  // Handle updating an item
  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();

    if (editedItem.type === "socialLinks" || editedItem.type === "link" || editedItem.type === "privacyLinks") {
      if (!editedItem.name || !editedItem.link) {
        showErrorAlert("Please fill in all fields");
        return;
      }
    } else if (editedItem.type === "column") {
      if (!editedItem.title) {
        showErrorAlert("Please enter a column title");
        return;
      }
    }

    let updatedData = { ...footerData };

    if (editedItem.type === "socialLinks") {
      const updatedSocialLinks = footerData.socialLinks.map((item) =>
        item._id === editedItem._id
          ? { ...item, name: editedItem.name, link: editedItem.link }
          : item
      );

      updatedData = {
        ...footerData,
        socialLinks: updatedSocialLinks
      };
      
      showSuccessAlert("Social link updated successfully");
    } else if (editedItem.type === "column") {
      const updatedColumns = footerData.columns.map((col) =>
        col._id === editedItem._id
          ? { ...col, title: editedItem.title }
          : col
      );

      updatedData = {
        ...footerData,
        columns: updatedColumns
      };
      
      showSuccessAlert("Column updated successfully");
    } else if (editedItem.type === "link") {
      const columnIndex = footerData.columns.findIndex(col => col._id === editedItem.columnId);
      if (columnIndex !== -1) {
        const updatedColumns = [...footerData.columns];
        const updatedLinks = updatedColumns[columnIndex].links.map((link) =>
          link._id === editedItem._id
            ? { ...link, name: editedItem.name, link: editedItem.link }
            : link
        );
        
        updatedColumns[columnIndex] = {
          ...updatedColumns[columnIndex],
          links: updatedLinks
        };
        
        updatedData = {
          ...footerData,
          columns: updatedColumns
        };
        
        showSuccessAlert("Link updated successfully");
      }
    } else if (editedItem.type === "privacyLinks") {
      const updatedPrivacyLinks = footerData.privacyLinks.map((item) =>
        item._id === editedItem._id
          ? { ...item, name: editedItem.name, link: editedItem.link }
          : item
      );

      updatedData = {
        ...footerData,
        privacyLinks: updatedPrivacyLinks
      };
      
      showSuccessAlert("Privacy link updated successfully");
    }

    // Update state
    setFooterData(updatedData);

    // Save changes to API
    saveChangesToAPI(updatedData);

    // Reset the edited item
    setEditedItem({
      _id: "",
      name: "",
      link: "",
      title: "",
      type: "",
      columnId: ""
    });
    
    setEditDialogOpen(false);
  };

  // Handle reordering of items
  const handleItemsReorder = (updatedItems: any[], type: string, columnId?: string) => {
    // Ensure the updatedItems have their order values set correctly
    const itemsWithUpdatedOrder = updatedItems.map((item, index) => ({
      ...item,
      order: index,
    }));

    let updatedData = { ...footerData };

    if (type === "socialLinks") {
      updatedData = {
        ...footerData,
        socialLinks: itemsWithUpdatedOrder as LinkItem[],
      };
      showSuccessAlert("Social links reordered successfully");
    } else if (type === "columns") {
      updatedData = {
        ...footerData,
        columns: itemsWithUpdatedOrder as Column[],
      };
      showSuccessAlert("Columns reordered successfully");
    } else if (type === "links" && columnId) {
      const columnIndex = footerData.columns.findIndex(col => col._id === columnId);
      if (columnIndex !== -1) {
        const updatedColumns = [...footerData.columns];
        updatedColumns[columnIndex] = {
          ...updatedColumns[columnIndex],
          links: itemsWithUpdatedOrder as LinkItem[]
        };
        
        updatedData = {
          ...footerData,
          columns: updatedColumns
        };
        
        showSuccessAlert("Links reordered successfully");
      }
    } else if (type === "privacyLinks") {
      updatedData = {
        ...footerData,
        privacyLinks: itemsWithUpdatedOrder as LinkItem[],
      };
      showSuccessAlert("Privacy links reordered successfully");
    }

    // Update state
    setFooterData(updatedData);

    // Save changes to API
    saveChangesToAPI(updatedData);
  };

  // Handler for the "Save Changes" button click
  const handleSaveChanges = async () => {
    try {
      await saveChangesToAPI(footerData);
      showSuccessAlert("Footer changes saved successfully!");
      
      // Redirect to dashboard after successful save
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error: any) {
      showErrorAlert(`Error saving changes: ${error.message}`);
    }
  };
  
  // Sort columns and links by order field
  const sortedColumns = footerData?.columns
    ? [...footerData.columns].sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];

  const sortedSocialLinks = footerData?.socialLinks
    ? [...footerData.socialLinks].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      )
    : [];

  const sortedPrivacyLinks = footerData?.privacyLinks
    ? [...footerData.privacyLinks].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      )
    : [];

  const selectedFooterInfo = footers.find((f) => f.id === selectedFooter);

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
                <BreadcrumbPage>Footer Editor</BreadcrumbPage>
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

      {selectedFooter === null ? (
        <Card className="mb-8 border border-gray-100 shadow-sm w-full">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Select Footer Style</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Choose a footer design that fits your website style.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {footers.map((footer) => (
                <div
                  key={footer.id}
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                    selectedFooter === footer.id
                      ? "border-blue-500 ring-2 ring-blue-100"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedFooter(footer.id)}
                >
                  <div className="h-40 bg-gray-50 relative">
                    {footer.image ? (
                      <img 
                        src={footer.image} 
                        alt={`${footer.name} Preview`} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        {footer.component} Preview
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium">{footer.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{footer.component}</p>
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
              onClick={() => setSelectedFooter(null)}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Footer Selection</span>
            </Button>
            <Button
              className="bg-black hover:bg-gray-800 text-white text-sm"
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </div>
          
          <Tabs defaultValue="general-settings" className="mt-4 space-y-6 w-full">
            <TabsList className="w-full flex h-10 rounded-md border bg-gray-50 p-1">
              <TabsTrigger
                value="general-settings"
                className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-medium text-sm"
              >
                General Settings
              </TabsTrigger>
              <TabsTrigger
                value="social-links"
                className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-medium text-sm"
              >
                Social Links
              </TabsTrigger>
              <TabsTrigger
                value="columns"
                className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-medium text-sm"
              >
                Columns & Links
              </TabsTrigger>
              <TabsTrigger
                value="contact-info"
                className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-medium text-sm"
              >
                Contact Info
              </TabsTrigger>
              {selectedFooterInfo?.hasInstagram && (
                <TabsTrigger
                  value="instagram"
                  className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-medium text-sm"
                >
                  Instagram
                </TabsTrigger>
              )}
              {selectedFooterInfo?.hasAppLinks && (
                <TabsTrigger
                  value="app-links"
                  className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-medium text-sm"
                >
                  App Links
                </TabsTrigger>
              )}
              <TabsTrigger
                value="privacy-links"
                className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-medium text-sm"
              >
                Privacy Links
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general-settings" className="w-full">
              <Card className="border border-gray-100 shadow-sm w-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">General Settings</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Manage logo, copyright, and description for your footer.
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
                          value={footerData.logo.text}
                          onChange={(e) =>
                            setFooterData({
                              ...footerData,
                              logo: {
                                ...footerData.logo,
                                text: e.target.value,
                                alt: e.target.value.toLowerCase()
                              }
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
                            value={footerData.logo.src}
                            onChange={(e) =>
                              setFooterData({
                                ...footerData,
                                logo: {
                                  ...footerData.logo,
                                  src: e.target.value
                                }
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

                      {footerData.logo.src && (
                        <div className="mt-4">
                          <p className="mb-2 text-xs text-gray-500">
                            Preview:
                          </p>
                          <img
                            src={footerData.logo.src}
                            alt={footerData.logo.text || "Logo"}
                            className="h-8 object-contain border rounded p-1 bg-gray-800"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="copyright" className="text-sm">
                          Copyright Text
                        </Label>
                        <Input
                          id="copyright"
                          value={footerData.copyright}
                          onChange={(e) =>
                            setFooterData({
                              ...footerData,
                              copyright: e.target.value
                            })
                          }
                          placeholder="Copyright © 2024 Your Company. All Rights Reserved"
                          className="h-9 text-sm"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm">
                          Footer Description
                        </Label>
                        <Textarea
                          id="description"
                          value={footerData.description}
                          onChange={(e) =>
                            setFooterData({
                              ...footerData,
                              description: e.target.value
                            })
                          }
                          placeholder="Brief description for your footer"
                          className="min-h-[100px] text-sm resize-y"
                        />
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="privacyLinks" className="text-sm">
                            Privacy Links
                          </Label>
                          <Switch
                            id="privacyLinks"
                            checked={footerData.showPrivacyLinks}
                            onCheckedChange={(checked) =>
                              setFooterData({
                                ...footerData,
                                showPrivacyLinks: checked
                              })
                            }
                          />
                        </div>
                        <p className="text-xs text-gray-500">Show privacy policy and cookie links in the footer.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social-links" className="w-full">
              <Card className="border border-gray-100 shadow-sm w-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Social Media Links</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Manage social media links that appear in your footer.
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
                            Add a new social media link to your footer.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSocialLinkAdd} className="space-y-4 mt-3">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm">
                              Platform
                            </Label>
                            <select
                              id="name"
                              value={newItem.name}
                              onChange={(e) =>
                                setNewItem({
                                  ...newItem,
                                  name: e.target.value,
                                  type: "socialLinks",
                                })
                              }
                              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-muted-foreground focus:outline-none"
                            >
                              <option value="">Select a platform</option>
                              <option value="Facebook">Facebook</option>
                              <option value="Twitter">Twitter</option>
                              <option value="LinkedIn">LinkedIn</option>
                              <option value="Instagram">Instagram</option>
                              <option value="YouTube">YouTube</option>
                              <option value="Pinterest">Pinterest</option>
                              <option value="Behance">Behance</option>
                              <option value="Dribbble">Dribbble</option>
                              <option value="TikTok">TikTok</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="link" className="text-sm">
                              Link URL
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
                              placeholder="https://facebook.com/yourusername"
                              className="h-9 text-sm"
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full mt-2 text-sm"
                            disabled={!newItem.name || !newItem.link}
                          >
                            Add Social Link
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="mt-2">
                    {sortedSocialLinks.length > 0 ? (
                      <div className="border rounded-md overflow-hidden">
                        <SortableList
                          items={sortedSocialLinks}
                          onChange={(updatedItems: any[]) =>
                            handleItemsReorder(updatedItems, "socialLinks")
                          }
                          onDelete={(itemId: string) =>
                            handleItemDelete(itemId, "socialLinks")
                          }
                          onEdit={(itemId: string) =>
                            handleEditItem(itemId, "socialLinks")
                          }
                          renderItem={(item: any) => (
                            <div className="flex justify-between items-center w-full px-2">
                              <div className="flex items-center">
                                {item.name === "Facebook" && (
                                  <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white mr-3">
                                    <i className="bi bi-facebook"></i>
                                  </div>
                                )}
                                {item.name === "Twitter" && (
                                  <div className="w-8 h-8 bg-blue-400 rounded-md flex items-center justify-center text-white mr-3">
                                    <i className="bi bi-twitter-x"></i>
                                  </div>
                                )}
                                {item.name === "LinkedIn" && (
                                  <div className="w-8 h-8 bg-blue-700 rounded-md flex items-center justify-center text-white mr-3">
                                    <i className="bi bi-linkedin"></i>
                                  </div>
                                )}
                                {item.name === "Instagram" && (
                                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-md flex items-center justify-center text-white mr-3">
                                    <i className="bi bi-instagram"></i>
                                  </div>
                                )}
                                {item.name === "YouTube" && (
                                  <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center text-white mr-3">
                                    <i className="bi bi-youtube"></i>
                                  </div>
                                )}
                                {item.name === "Behance" && (
                                  <div className="w-8 h-8 bg-blue-900 rounded-md flex items-center justify-center text-white mr-3">
                                    <i className="bi bi-behance"></i>
                                  </div>
                                )}
                                {item.name === "Pinterest" && (
                                  <div className="w-8 h-8 bg-red-700 rounded-md flex items-center justify-center text-white mr-3">
                                    <i className="bi bi-pinterest"></i>
                                  </div>
                                )}
                                {item.name === "Dribbble" && (
                                  <div className="w-8 h-8 bg-pink-600 rounded-md flex items-center justify-center text-white mr-3">
                                    <i className="bi bi-dribbble"></i>
                                  </div>
                                )}
                                {item.name === "TikTok" && (
                                  <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center text-white mr-3">
                                    <i className="bi bi-tiktok"></i>
                                  </div>
                                )}
                                <div className="font-medium text-sm">
                                  {item.name}
                                </div>
                              </div>
                              <div className="text-gray-500 text-xs max-w-[200px] truncate">
                                {item.link}
                              </div>
                            </div>
                          )}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-md">
                        No social links yet. Add some using the button above.
                      </div>
                    )}
                  </div>

                  <div className="mt-6 p-4 border rounded-md bg-gray-50">
                    <h3 className="text-sm font-medium mb-2">Social Links Preview</h3>
                    <div className="flex flex-wrap gap-2">
                      {sortedSocialLinks.map((social) => (
                        <div 
                          key={social._id} 
                          className="w-10 h-10 rounded-md flex items-center justify-center text-white"
                          style={{
                            backgroundColor: 
                              social.name === "Facebook" ? "#1877F2" :
                              social.name === "Twitter" ? "#1DA1F2" :
                              social.name === "LinkedIn" ? "#0A66C2" :
                              social.name === "Instagram" ? "#E4405F" :
                              social.name === "YouTube" ? "#FF0000" :
                              social.name === "Pinterest" ? "#BD081C" :
                              social.name === "Behance" ? "#1769FF" :
                              social.name === "Dribbble" ? "#EA4C89" :
                              social.name === "TikTok" ? "#000000" : "#333333"
                          }}
                        >
                          <i className={`bi bi-${social.name.toLowerCase()}`}></i>
                        </div>
                      ))}
                      {sortedSocialLinks.length === 0 && (
                        <p className="text-xs text-gray-500">No social links to preview</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="columns" className="w-full">
              <Card className="border border-gray-100 shadow-sm w-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Footer Columns & Links</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Manage the link columns that appear in your footer. Each column can contain multiple links.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Dialog
                      open={columnDialogOpen}
                      onOpenChange={setColumnDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 text-sm font-normal"
                        >
                          + Add Column
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                          <DialogTitle className="text-base font-semibold">
                            New Footer Column
                          </DialogTitle>
                          <DialogDescription className="text-sm text-gray-500 mt-1">
                            Add a new column category to your footer.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleColumnAdd} className="space-y-4 mt-3">
                          <div className="space-y-2">
                            <Label htmlFor="columnTitle" className="text-sm">
                              Column Title
                            </Label>
                            <Input
                              id="columnTitle"
                              value={newItem.title}
                              onChange={(e) =>
                                setNewItem({
                                  ...newItem,
                                  title: e.target.value
                                })
                              }
                              placeholder="e.g. Company, Resources, Services"
                              className="h-9 text-sm"
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full mt-2 text-sm"
                            disabled={!newItem.title}
                          >
                            Add Column
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {sortedColumns.length > 0 ? (
                      sortedColumns.map((column) => (
                        <div key={column._id} className="border rounded-md overflow-hidden">
                          <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                            <h3 className="font-medium text-sm">{column.title}</h3>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-gray-500 hover:text-gray-700"
                                onClick={() => handleEditItem(column._id, "column")}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-gray-500 hover:text-red-600"
                                onClick={() => handleItemDelete(column._id, "column")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="p-3">
                            {column.links && column.links.length > 0 ? (
                              <div className="space-y-2">
                                {column.links.map((link) => (
                                  <div key={link._id} className="flex justify-between items-center bg-gray-50 p-2 rounded-md text-sm">
                                    <div className="font-medium">{link.name}</div>
                                    <div className="flex gap-1">
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7 text-gray-500 hover:text-gray-700"
                                        onClick={() => handleEditItem(link._id, "link", column._id)}
                                      >
                                        <Pencil className="h-3 w-3" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7 text-gray-500 hover:text-red-600"
                                        onClick={() => handleItemDelete(link._id, "link", column._id)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-gray-400 text-xs">
                                No links in this column
                              </div>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-3 h-8 text-xs"
                              onClick={() => {
                                setSelectedColumn(column._id);
                                setLinkDialogOpen(true);
                              }}
                            >
                              + Add Link
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-md col-span-4">
                        No columns yet. Add some using the button above.
                      </div>
                    )}
                  </div>

                  <Dialog
                    open={linkDialogOpen}
                    onOpenChange={setLinkDialogOpen}
                  >
                    <DialogContent className="sm:max-w-[400px]">
                      <DialogHeader>
                        <DialogTitle className="text-base font-semibold">
                          New Link
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-500 mt-1">
                          Add a new link to the selected column.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleLinkAdd} className="space-y-4 mt-3">
                        {selectedColumn && (
                          <div className="p-3 bg-gray-50 rounded-md text-sm mb-2">
                            Adding to column: <span className="font-medium">
                              {footerData.columns.find(col => col._id === selectedColumn)?.title || 'Selected Column'}
                            </span>
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="linkName" className="text-sm">
                            Link Name
                          </Label>
                          <Input
                            id="linkName"
                            value={newItem.name}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                name: e.target.value
                              })
                            }
                            placeholder="e.g. About Us, Contact"
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="linkUrl" className="text-sm">
                            Link URL
                          </Label>
                          <Input
                            id="linkUrl"
                            value={newItem.link}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                link: e.target.value
                              })
                            }
                            placeholder="e.g. /about, https://example.com"
                            className="h-9 text-sm"
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full mt-2 text-sm"
                          disabled={!newItem.name || !newItem.link || !selectedColumn}
                        >
                          Add Link
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <div className="mt-6 p-4 border rounded-md bg-gray-50">
                    <h3 className="text-sm font-medium mb-4">Column Layout Preview</h3>
                    <div className="flex flex-wrap gap-6 bg-gray-800 p-4 rounded-md">
                      {sortedColumns.map((column) => (
                        <div key={column._id} className="min-w-[200px]">
                          <h3 className="text-white text-xs uppercase font-bold mb-3">{column.title}</h3>
                          <ul className="space-y-2">
                            {column.links.map((link) => (
                              <li key={link._id} className="text-gray-300 text-xs hover:text-white transition-colors cursor-pointer">
                                {link.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {sortedColumns.length === 0 && (
                        <p className="text-gray-400 text-sm w-full text-center py-4">Add columns to see a preview</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact-info" className="w-full">
              <Card className="border border-gray-100 shadow-sm w-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Contact Information</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Manage contact details that will appear in your footer.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm">
                          Address
                        </Label>
                        <Input
                          id="address"
                          value={footerData.contactItems.address}
                          onChange={(e) =>
                            setFooterData({
                              ...footerData,
                              contactItems: {
                                ...footerData.contactItems,
                                address: e.target.value
                              }
                            })
                          }
                          placeholder="123 Business St, City"
                          className="h-9 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={footerData.contactItems.phone}
                          onChange={(e) =>
                            setFooterData({
                              ...footerData,
                              contactItems: {
                                ...footerData.contactItems,
                                phone: e.target.value
                              }
                            })
                          }
                          placeholder="+1 (234) 567-8900"
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          value={footerData.contactItems.email}
                          onChange={(e) =>
                            setFooterData({
                              ...footerData,
                              contactItems: {
                                ...footerData.contactItems,
                                email: e.target.value
                              }
                            })
                          }
                          placeholder="contact@example.com"
                          className="h-9 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hours" className="text-sm">
                          Business Hours
                        </Label>
                        <Input
                          id="hours"
                          value={footerData.contactItems.hours}
                          onChange={(e) =>
                            setFooterData({
                              ...footerData,
                              contactItems: {
                                ...footerData.contactItems,
                                hours: e.target.value
                              }
                            })
                          }
                          placeholder="Mon-Fri: 9am-5pm"
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 border rounded-md bg-gray-50">
                    <h3 className="text-sm font-medium mb-4">Contact Information Preview</h3>
                    <div className="bg-gray-800 p-4 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-white gap-3">
                          <div className="bg-gray-700 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                          </div>
                          <p className="text-sm opacity-80">{footerData.contactItems.address || "No address provided"}</p>
                        </div>
                        <div className="flex items-center text-white gap-3">
                          <div className="bg-gray-700 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                          </div>
                          <p className="text-sm opacity-80">{footerData.contactItems.phone || "No phone number provided"}</p>
                        </div>
                        <div className="flex items-center text-white gap-3">
                          <div className="bg-gray-700 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                              <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                          </div>
                          <p className="text-sm opacity-80">{footerData.contactItems.email || "No email provided"}</p>
                        </div>
                        <div className="flex items-center text-white gap-3">
                          <div className="bg-gray-700 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                          </div>
                          <p className="text-sm opacity-80">{footerData.contactItems.hours || "No hours provided"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instagram" className="w-full">
              <Card className="border border-gray-100 shadow-sm w-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Instagram Posts</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Manage Instagram post images that appear in your footer.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {footerData.instagramPosts.map((post, index) => (
                        <div key={index} className="relative border rounded-md overflow-hidden group">
                          <div className="aspect-square bg-gray-100">
                            <img 
                              src={post} 
                              alt={`Instagram post ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const updatedPosts = [...footerData.instagramPosts];
                              updatedPosts.splice(index, 1);
                              setFooterData({
                                ...footerData,
                                instagramPosts: updatedPosts
                              });
                              saveChangesToAPI({
                                ...footerData,
                                instagramPosts: updatedPosts
                              });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <div className="relative border border-dashed rounded-md overflow-hidden bg-gray-50 flex items-center justify-center aspect-square">
                        <div className="flex flex-col items-center text-gray-500 p-4">
                          <Upload className="h-6 w-6 mb-2" />
                          <span className="text-xs text-center">Upload Instagram Post</span>
                          <Input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              
                              try {
                                // Upload to Cloudinary
                                const uploadedUrl = await uploadImageToCloudinary(file);
                                
                                const updatedPosts = [...footerData.instagramPosts, uploadedUrl];
                                setFooterData({
                                  ...footerData,
                                  instagramPosts: updatedPosts
                                });
                                
                                saveChangesToAPI({
                                  ...footerData,
                                  instagramPosts: updatedPosts
                                });
                                
                                showSuccessAlert("Instagram post added successfully");
                              } catch (error: any) {
                                showErrorAlert(`Error uploading image: ${error.message}`);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="text-sm font-medium mb-3">Instagram Posts Preview</h3>
                      <div className="flex flex-wrap gap-2 bg-gray-800 p-4 rounded-md">
                        {footerData.instagramPosts.slice(0, 6).map((post, index) => (
                          <div key={index} className="w-16 h-16 rounded-md overflow-hidden">
                            <img 
                              src={post} 
                              alt={`Instagram post ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {footerData.instagramPosts.length === 0 && (
                          <p className="text-white opacity-50 text-xs w-full text-center py-3">
                            No Instagram posts added yet
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="app-links" className="w-full">
              <Card className="border border-gray-100 shadow-sm w-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">App & Store Links</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Manage app store and payment links that appear in your footer.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {footerData.appLinks.map((appLink, index) => (
                        <div key={index} className="flex border rounded-md p-3 items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 border rounded flex items-center justify-center overflow-hidden bg-gray-100">
                              <img 
                                src={appLink.image} 
                                alt={appLink.alt}
                                className="w-full h-full object-contain" 
                              />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">{appLink.alt}</h4>
                              <p className="text-xs text-gray-500 truncate max-w-[160px]">{appLink.link}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                // Set up edit dialog for app link
                                setEditedItem({
                                  _id: index.toString(),
                                  name: appLink.alt,
                                  link: appLink.link,
                                  image: appLink.image,
                                  type: "appLink"
                                });
                                setEditDialogOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600"
                              onClick={() => {
                                const updatedAppLinks = [...footerData.appLinks];
                                updatedAppLinks.splice(index, 1);
                                setFooterData({
                                  ...footerData,
                                  appLinks: updatedAppLinks
                                });
                                saveChangesToAPI({
                                  ...footerData,
                                  appLinks: updatedAppLinks
                                });
                                showSuccessAlert("App link removed successfully");
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="border border-dashed rounded-md p-3 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col items-center py-3">
                              <Upload className="h-6 w-6 mb-2 text-gray-400" />
                              <span className="text-sm text-gray-500">Add New App Link</span>
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Add App Link</DialogTitle>
                            <DialogDescription className="text-sm text-gray-500">
                              Add a new app or payment link to your footer.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-2">
                            <div className="space-y-2">
                              <Label htmlFor="appName" className="text-sm">Store/App Name</Label>
                              <Input
                                id="appName"
                                className="h-9 text-sm"
                                placeholder="App Store, Google Play"
                                value={newItem.name}
                                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="appLink" className="text-sm">Link URL</Label>
                              <Input
                                id="appLink"
                                className="h-9 text-sm"
                                placeholder="https://..."
                                value={newItem.link}
                                onChange={(e) => setNewItem({...newItem, link: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="appImageUpload" className="text-sm">Image</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  id="appImageUrl"
                                  className="h-9 text-sm flex-1"
                                  placeholder="/assets/imgs/app-store.png"
                                  value={newItem.image || ""}
                                  onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                                />
                                <div className="relative">
                                  <Input
                                    id="appImageUpload"
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      
                                      try {
                                        const uploadedUrl = await uploadImageToCloudinary(file);
                                        setNewItem({...newItem, image: uploadedUrl});
                                      } catch (error: any) {
                                        showErrorAlert(`Error uploading image: ${error.message}`);
                                      }
                                    }}
                                  />
                                  <Button variant="outline" className="h-9 text-sm">
                                    <Upload className="h-4 w-4 mr-1" />
                                    Upload
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end mt-2">
                            <Button 
                              onClick={() => {
                                if (!newItem.name || !newItem.link || !newItem.image) {
                                  showErrorAlert("Please fill in all fields");
                                  return;
                                }
                                
                                const newAppLink = {
                                  alt: newItem.name,
                                  link: newItem.link,
                                  image: newItem.image
                                };
                                
                                const updatedAppLinks = [...footerData.appLinks, newAppLink];
                                setFooterData({
                                  ...footerData,
                                  appLinks: updatedAppLinks
                                });
                                
                                saveChangesToAPI({
                                  ...footerData,
                                  appLinks: updatedAppLinks
                                });
                                
                                setNewItem({...newItem, name: "", link: "", image: ""});
                                showSuccessAlert("App link added successfully");
                              }}
                              disabled={!newItem.name || !newItem.link || !newItem.image}
                            >
                              Add App Link
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="text-sm font-medium mb-3">App Links Preview</h3>
                      <div className="bg-gray-800 p-4 rounded-md">
                        <div className="grid grid-cols-2 gap-2">
                          {footerData.appLinks.map((app, index) => (
                            <div key={index} className="bg-black rounded-md overflow-hidden h-12">
                              <img 
                                src={app.image} 
                                alt={app.alt}
                                className="w-full h-full object-contain" 
                              />
                            </div>
                          ))}
                          {footerData.appLinks.length === 0 && (
                            <p className="text-white opacity-50 text-xs col-span-2 text-center py-3">
                              No app links added yet
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy-links" className="w-full">
              <Card className="border border-gray-100 shadow-sm w-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Privacy & Legal Links</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Manage privacy policy, terms of service, and other legal links in your footer.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showPrivacyLinks" className="text-sm font-medium">
                        Enable Privacy Links
                      </Label>
                      <Switch
                        id="showPrivacyLinks"
                        checked={footerData.showPrivacyLinks}
                        onCheckedChange={(checked) =>
                          setFooterData({
                            ...footerData,
                            showPrivacyLinks: checked
                          })
                        }
                      />
                    </div>
                    
                    {footerData.showPrivacyLinks && (
                      <>
                        <div className="mt-4">
                          <Dialog
                            open={privacyLinkDialogOpen}
                            onOpenChange={setPrivacyLinkDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 text-sm font-normal"
                              >
                                + Add Privacy Link
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[400px]">
                              <DialogHeader>
                                <DialogTitle className="text-base font-semibold">
                                  New Privacy Link
                                </DialogTitle>
                                <DialogDescription className="text-sm text-gray-500 mt-1">
                                  Add a new privacy or legal link to your footer.
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handlePrivacyLinkAdd} className="space-y-4 mt-3">
                                <div className="space-y-2">
                                  <Label htmlFor="privacyLinkName" className="text-sm">
                                    Link Name
                                  </Label>
                                  <Input
                                    id="privacyLinkName"
                                    value={newItem.name}
                                    onChange={(e) =>
                                      setNewItem({
                                        ...newItem,
                                        name: e.target.value,
                                        type: "privacyLinks",
                                      })
                                    }
                                    placeholder="e.g. Privacy Policy, Terms of Service"
                                    className="h-9 text-sm"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="privacyLinkUrl" className="text-sm">
                                    Link URL
                                  </Label>
                                  <Input
                                    id="privacyLinkUrl"
                                    value={newItem.link}
                                    onChange={(e) =>
                                      setNewItem({
                                        ...newItem,
                                        link: e.target.value,
                                        type: "privacyLinks",
                                      })
                                    }
                                    placeholder="e.g. /privacy, /terms"
                                    className="h-9 text-sm"
                                  />
                                </div>
                                <Button
                                  type="submit"
                                  className="w-full mt-2 text-sm"
                                  disabled={!newItem.name || !newItem.link}
                                >
                                  Add Privacy Link
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <div className="mt-4">
                          {sortedPrivacyLinks.length > 0 ? (
                            <div className="border rounded-md overflow-hidden">
                              <div className="divide-y">
                                {sortedPrivacyLinks.map((link) => (
                                  <div
                                    key={link._id}
                                    className="flex justify-between items-center p-3 hover:bg-gray-50"
                                  >
                                    <div>
                                      <h4 className="font-medium text-sm">{link.name}</h4>
                                      <p className="text-gray-500 text-xs">{link.link}</p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleEditItem(link._id, "privacyLinks")}
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-600"
                                        onClick={() => handleItemDelete(link._id, "privacyLinks")}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-md">
                              No privacy links yet. Add some using the button above.
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Edit dialog for items */}
            <Dialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
            >
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle className="text-base font-semibold">
                    Edit {editedItem.type === "socialLinks" ? "Social Link" : 
                          editedItem.type === "column" ? "Column" :
                          editedItem.type === "link" ? "Link" : 
                          editedItem.type === "privacyLinks" ? "Privacy Link" :
                          editedItem.type === "appLink" ? "App Link" : "Item"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateItem} className="space-y-4 mt-3">
                  {editedItem.type === "column" && (
                    <div className="space-y-2">
                      <Label htmlFor="editColumnTitle" className="text-sm">
                        Column Title
                      </Label>
                      <Input
                        id="editColumnTitle"
                        value={editedItem.title}
                        onChange={(e) =>
                          setEditedItem({
                            ...editedItem,
                            title: e.target.value
                          })
                        }
                        className="h-9 text-sm"
                      />
                    </div>
                  )}
                  
                  {(editedItem.type === "socialLinks" || editedItem.type === "link" || editedItem.type === "privacyLinks") && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="editItemName" className="text-sm">
                          {editedItem.type === "socialLinks" ? "Platform" : "Name"}
                        </Label>
                        {editedItem.type === "socialLinks" ? (
                          <select
                            id="editItemName"
                            value={editedItem.name}
                            onChange={(e) =>
                              setEditedItem({
                                ...editedItem,
                                name: e.target.value
                              })
                            }
                            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-muted-foreground focus:outline-none"
                          >
                            <option value="">Select a platform</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Twitter">Twitter</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Instagram">Instagram</option>
                            <option value="YouTube">YouTube</option>
                            <option value="Pinterest">Pinterest</option>
                            <option value="Behance">Behance</option>
                            <option value="Dribbble">Dribbble</option>
                            <option value="TikTok">TikTok</option>
                          </select>
                        ) : (
                          <Input
                            id="editItemName"
                            value={editedItem.name}
                            onChange={(e) =>
                              setEditedItem({
                                ...editedItem,
                                name: e.target.value
                              })
                            }
                            className="h-9 text-sm"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editItemLink" className="text-sm">
                          Link URL
                        </Label>
                        <Input
                          id="editItemLink"
                          value={editedItem.link}
                          onChange={(e) =>
                            setEditedItem({
                              ...editedItem,
                              link: e.target.value
                            })
                          }
                          className="h-9 text-sm"
                        />
                      </div>
                    </>
                  )}
                  
                  {editedItem.type === "appLink" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="editAppName" className="text-sm">Store/App Name</Label>
                        <Input
                          id="editAppName"
                          value={editedItem.name}
                          onChange={(e) =>
                            setEditedItem({
                              ...editedItem,
                              name: e.target.value
                            })
                          }
                          className="h-9 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editAppLink" className="text-sm">Link URL</Label>
                        <Input
                          id="editAppLink"
                          value={editedItem.link}
                          onChange={(e) =>
                            setEditedItem({
                              ...editedItem,
                              link: e.target.value
                            })
                          }
                          className="h-9 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editAppImage" className="text-sm">Image URL</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="editAppImage"
                            value={editedItem.image}
                            onChange={(e) =>
                              setEditedItem({
                                ...editedItem,
                                image: e.target.value
                              })
                            }
                            className="h-9 text-sm flex-1"
                          />
                          <div className="relative">
                            <Input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                
                                try {
                                  const uploadedUrl = await uploadImageToCloudinary(file);
                                  setEditedItem({
                                    ...editedItem,
                                    image: uploadedUrl
                                  });
                                } catch (error: any) {
                                  showErrorAlert(`Error uploading image: ${error.message}`);
                                }
                              }}
                            />
                            <Button variant="outline" className="h-9 text-sm">
                              <Upload className="h-4 w-4 mr-1" />
                              Upload
                            </Button>
                          </div>
                        </div>
                      </div>
                      {editedItem.image && (
                        <div className="h-12 border rounded-md overflow-hidden">
                          <img 
                            src={editedItem.image} 
                            alt={editedItem.name}
                            className="w-full h-full object-contain" 
                          />
                        </div>
                      )}
                    </>
                  )}
                  
                  <Button
                    type="submit"
                    className="w-full mt-2 text-sm"
                    disabled={
                      (editedItem.type === "column" && !editedItem.title) ||
                      ((editedItem.type === "socialLinks" || editedItem.type === "link" || editedItem.type === "privacyLinks") && 
                       (!editedItem.name || !editedItem.link)) ||
                      (editedItem.type === "appLink" && (!editedItem.name || !editedItem.link || !editedItem.image))
                    }
                  >
                    Update
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </Tabs>
        </>
      )}
    </div>
  );
}
