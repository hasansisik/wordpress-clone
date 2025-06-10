"use client"
import Blog2 from "./Blog2"

interface Blog2CategoryProps {
  selectedCategory?: string;
  title?: string;
  subtitle?: string;
}

export default function Blog2Category({ selectedCategory, title, subtitle }: Blog2CategoryProps) {
  return <Blog2 selectedCategory={selectedCategory} title={title} subtitle={subtitle} />;
} 