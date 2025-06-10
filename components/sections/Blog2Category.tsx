"use client"
import Blog2 from "./Blog2"

interface Blog2CategoryProps {
  previewData?: any;
  selectedCategory?: string;
}

export default function Blog2Category({ previewData, selectedCategory }: Blog2CategoryProps) {
  return (
    <Blog2 
      previewData={previewData} 
      selectedCategory={selectedCategory}
    />
  )
} 