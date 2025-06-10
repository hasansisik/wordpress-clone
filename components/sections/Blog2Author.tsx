"use client"
import Blog2 from "./Blog2"

interface Blog2AuthorProps {
  selectedAuthor?: string;
  title?: string;
  subtitle?: string;
}

export default function Blog2Author({ selectedAuthor, title, subtitle }: Blog2AuthorProps) {
  return <Blog2 selectedAuthor={selectedAuthor} title={title} subtitle={subtitle} />;
} 