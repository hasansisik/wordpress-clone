"use client"
import Blog3 from "./Blog3"

interface Blog3AuthorProps {
  previewData?: any;
  selectedAuthor?: string;
}

export default function Blog3Author({ previewData, selectedAuthor }: Blog3AuthorProps) {
  return (
    <Blog3 
      previewData={previewData} 
      selectedAuthor={selectedAuthor}
    />
  )
} 