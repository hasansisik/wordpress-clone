"use client"
import Blog3 from "./Blog3"

interface Blog3CategoryProps {
  previewData?: any;
  selectedCategory?: string;
}

export default function Blog3Category({ previewData, selectedCategory }: Blog3CategoryProps) {
  return (
    <Blog3 
      previewData={previewData} 
      selectedCategory={selectedCategory}
    />
  )
} 