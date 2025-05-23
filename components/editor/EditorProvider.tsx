"use client";

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";

// Editor Modu türleri
export type EditorMode = "live" | "editor";

// Düzenleyici bağlamı için gerekli tip tanımları
export interface EditorContextType {
  sectionData: any;
  setSectionData: (data: any) => void;
  selectedSection: number | null;
  setSelectedSection: (id: number | null) => void;
  sectionType: string;
  editorMode: EditorMode;
  setEditorMode: (mode: EditorMode) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  setPreviewMode: (mode: "desktop" | "tablet" | "mobile") => void;
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
  handleElementClick: (event: React.MouseEvent, fieldPath: string) => void;
  handleImageClick: (event: React.MouseEvent, imagePath: string) => void;
  handleTextChange: (value: string, path: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, imagePath: string) => Promise<void>;
}

// Varsayılan değerlerle context oluşturma
const EditorContext = createContext<EditorContextType | null>(null);

// EditorProvider props türü
interface EditorProviderProps {
  children: ReactNode;
  apiEndpoint: string;
  sectionType: string;
  defaultSection?: number;
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
  const [editorMode, setEditorMode] = useState<EditorMode>("editor");
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // API'dan veri yükleme
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

  // Update iframe when data or mode changes
  useEffect(() => {
    if (sectionData) {
      updateIframeContent();
    }
  }, [sectionData, editorMode]);

  // Function to update iframe content
  const updateIframeContent = () => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    
    iframeRef.current.contentWindow.postMessage({
      type: "UPDATE_SECTION_DATA",
      sectionData: sectionData,
      sectionType: sectionType
    }, "*");
    
    iframeRef.current.contentWindow.postMessage({
      type: "UPDATE_MODE",
      mode: editorMode
    }, "*");
  };

  // Toggle editor visibility when mode changes
  useEffect(() => {
    console.log("Preview mode changed:", editorMode === "live" ? "Live" : "Edit");
    
    // Apply any additional changes needed for edit mode
    if (editorMode === "editor") {
      document.documentElement.classList.add('editor-mode-active');
    } else {
      document.documentElement.classList.remove('editor-mode-active');
    }
  }, [editorMode]);

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

  // Direct element click handler for editor components
  const handleElementClick = (event: React.MouseEvent, fieldPath: string) => {
    if (editorMode === "live") return;
    
    // Stop event propagation
    event.preventDefault();
    event.stopPropagation();
    
    // Get the current field value
    const parts = fieldPath.split('.');
    let current: any = sectionData;
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

  // Direct image click handler for editor components
  const handleImageClick = (event: React.MouseEvent, imagePath: string) => {
    if (editorMode === "live") return;
    
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

  // Context değerini oluştur
  const contextValue: EditorContextType = {
    sectionData,
    setSectionData,
    selectedSection,
    setSelectedSection,
    sectionType,
    editorMode,
    setEditorMode,
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
    handleElementClick,
    handleImageClick,
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