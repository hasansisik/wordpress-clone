"use client"
import Blog5 from "./Blog5"

interface Blog5AuthorProps {
  selectedAuthor?: string;
  title?: string;
  subtitle?: string;
}

export default function Blog5Author({ selectedAuthor, title, subtitle }: Blog5AuthorProps) {
  return <Blog5 selectedAuthor={selectedAuthor} title={title} subtitle={subtitle} />;
} 