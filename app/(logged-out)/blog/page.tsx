import BlogPost from '@/components/blog/BlogPost'
import Layout from '@/components/layout/Layout'
import Blog1 from '@/components/sections/Blog1'
import Blog5 from '@/components/sections/Blog5'
import { Metadata } from "next"
import { generateMetadata as generateSeoMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSeoMetadata("blog")

export default function Blog() {
    return (
        <>
            <Layout>
                <Blog1 />
                <Blog5 />

            </Layout>
        </>
    )
}
