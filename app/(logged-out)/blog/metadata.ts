import { Metadata } from "next"
import { generateMetadata as generateSeoMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSeoMetadata("blog") 