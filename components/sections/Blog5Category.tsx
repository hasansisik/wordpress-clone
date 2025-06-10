"use client"
import Blog5 from "./Blog5"

interface Blog5CategoryProps {
  previewData?: any;
  selectedCategory?: string;
}

export default function Blog5Category({ previewData, selectedCategory }: Blog5CategoryProps) {
  return (
    <Blog5 
      previewData={previewData} 
      selectedCategory={selectedCategory}
    />
  )
} 