"use client"
import Blog5 from "./Blog5"

interface Blog5CategoryProps {
  selectedCategory?: string;
  title?: string;
  subtitle?: string;
}

export default function Blog5Category({ selectedCategory, title, subtitle }: Blog5CategoryProps) {
  return <Blog5 selectedCategory={selectedCategory} title={title} subtitle={subtitle} />;
} 