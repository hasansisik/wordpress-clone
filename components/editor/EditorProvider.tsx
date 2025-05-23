"use client";

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";

export type PreviewMode = "desktop" | "tablet" | "mobile";

// Editor context for the necessary functionality
export interface EditorContextType {
  sectionData: any;
  setSectionData: (data: any) => void;
  selectedSection: number | null;
  setSelectedSection: (id: number | null) => void;
  sectionType: string;
  previewMode: PreviewMode;
  setPreviewMode: (mode: PreviewMode) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  showAlert: boolean;
  setShowAlert: (show: boolean) => void;
  alertType: "success" | "error";
  setAlertType: (type: "success" | "error") => void;
  alertMessage: string;
  setAlertMessage: (message: string) => void;
  showSuccessAlert: (message: string) => void;
  showErrorAlert: (message: string) => void;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  updateIframeContent: () => void;
  saveChangesToAPI: (data: any) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  imageUploading: boolean; 
  setImageUploading: (uploading: boolean) => void;
  handleTextChange: (value: string, path: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, imagePath: string) => Promise<void>;
}

// Create context with default values
const EditorContext = createContext<EditorContextType | null>(null);

// EditorProvider props type
interface EditorProviderProps {
  children: ReactNode;
  apiEndpoint: string;
  sectionType: string;
  defaultSection?: number | null;
  uploadHandler?: (file: File) => Promise<string>;
}

export const EditorProvider = ({ 
  children, 
  apiEndpoint,
  sectionType,
  defaultSection = null,
  uploadHandler
}: EditorProviderProps) => {
  const [sectionData, setSectionData] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState<number | null>(defaultSection);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load data from API
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        console.log(`Fetching initial ${sectionType} data...`);
        // Add a timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await fetch(`${apiEndpoint}?t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          next: { revalidate: 0 }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Initial ${sectionType} data:`, data);
          setSectionData(data);
          
          // Force immediate iframe update
          setTimeout(() => {
            updateIframeContent();
          }, 100);
        } else {
          console.error(`Error fetching initial ${sectionType} data:`, await response.text());
          showErrorAlert(`Failed to load ${sectionType} data. Please try again.`);
        }
      } catch (error) {
        console.error(`Error in initial data fetch:`, error);
        showErrorAlert('Failed to connect to the server. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Update iframe when data changes
  useEffect(() => {
    if (sectionData) {
      updateIframeContent();
    }
  }, [sectionData]);

  // Function to update iframe content
  const updateIframeContent = () => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    
    iframeRef.current.contentWindow.postMessage({
      type: "UPDATE_SECTION_DATA",
      sectionData: sectionData,
      sectionType: sectionType
    }, "*");
  };

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

  // Handle text change with auto-save
  const handleTextChange = (value: string, path: string) => {
    // Update the correct path in the data
    const newData = { ...sectionData };
    
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
    setSectionData(newData);
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imagePath: string) => {
    const file = e.target.files?.[0];
    if (!file || !uploadHandler) return;

    try {
      setImageUploading(true);
      // Upload image using the provided handler
      const uploadedUrl = await uploadHandler(file);

      // Update the correct path in the data
      const newData = { ...sectionData };
      
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
      setSectionData(newData);
      
      // Save changes to API
      await saveChangesToAPI(newData);

      showSuccessAlert("Image uploaded successfully");
    } catch (error: any) {
      showErrorAlert(`Error uploading image: ${error.message}`);
    } finally {
      setImageUploading(false);
    }
  };

  // Save changes to API
  const saveChangesToAPI = async (data: any) => {
    try {
      setIsLoading(true);
      console.log(`Saving ${sectionType} data to API:`, data);

      // Send the data to the API
      const response = await fetch(apiEndpoint, {
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
      
      showSuccessAlert(`${sectionType} changes saved successfully!`);
    } catch (error: any) {
      console.error(`Error saving ${sectionType} changes:`, error);
      showErrorAlert(`Error saving changes: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create context value
  const contextValue: EditorContextType = {
    sectionData,
    setSectionData,
    selectedSection,
    setSelectedSection,
    sectionType,
    previewMode,
    setPreviewMode,
    sidebarCollapsed,
    setSidebarCollapsed,
    showAlert,
    setShowAlert,
    alertType,
    setAlertType,
    alertMessage,
    setAlertMessage,
    showSuccessAlert,
    showErrorAlert,
    iframeRef,
    updateIframeContent,
    saveChangesToAPI,
    isLoading,
    setIsLoading,
    imageUploading,
    setImageUploading,
    handleTextChange,
    handleImageUpload
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};

// Custom hook for using the editor context
export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
}; 