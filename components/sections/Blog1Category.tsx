"use client"
import Blog1 from "./Blog1"

interface Blog1CategoryProps {
  previewData?: any;
  selectedCategory?: string;
}

export default function Blog1Category({ previewData, selectedCategory }: Blog1CategoryProps) {
  return (
    <Blog1 
      previewData={previewData} 
      selectedCategory={selectedCategory}
    />
  )
} 