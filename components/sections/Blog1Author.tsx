"use client"
import Blog1 from "./Blog1"

interface Blog1AuthorProps {
  previewData?: any;
  selectedAuthor?: string;
}

export default function Blog1Author({ previewData, selectedAuthor }: Blog1AuthorProps) {
  return (
    <Blog1 
      previewData={previewData} 
      selectedAuthor={selectedAuthor}
    />
  )
} 