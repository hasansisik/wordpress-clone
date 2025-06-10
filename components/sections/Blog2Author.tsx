"use client"
import Blog2 from "./Blog2"

interface Blog2AuthorProps {
  previewData?: any;
  selectedAuthor?: string;
}

export default function Blog2Author({ previewData, selectedAuthor }: Blog2AuthorProps) {
  return (
    <Blog2 
      previewData={previewData} 
      selectedAuthor={selectedAuthor}
    />
  )
} 