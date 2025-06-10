"use client"
import Blog5 from "./Blog5"

interface Blog5AuthorProps {
  previewData?: any;
  selectedAuthor?: string;
}

export default function Blog5Author({ previewData, selectedAuthor }: Blog5AuthorProps) {
  return (
    <Blog5 
      previewData={previewData} 
      selectedAuthor={selectedAuthor}
    />
  )
} 