"use client"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import otherData from "@/data/other.json"

interface BlogData {
	title: string;
	date: string;
	slug: string;
	category: string;
	thumbnail: string;
	excerpt: string;
}

interface Blog1Props {
	previewData?: any;
	blogs?: BlogData[];
}

// Function to convert title to slug
const slugify = (text: string) => {
	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-')        // Replace spaces with -
		.replace(/[^\w\-]+/g, '')    // Remove all non-word chars
		.replace(/\-\-+/g, '-')      // Replace multiple - with single -
		.replace(/^-+/, '')          // Trim - from start of text
		.replace(/-+$/, '');         // Trim - from end of text
};

export default function Blog1({ previewData, blogs = [] }: Blog1Props) {
	const [data, setData] = useState<any>(otherData.blog1 || {})

	useEffect(() => {
		// If preview data is provided, use it, otherwise load from the file
		if (previewData && previewData.blog1) {
			setData(previewData.blog1);
		} else if (otherData.blog1) {
			setData(otherData.blog1);
		} else {
			console.error("No blog data available in Blog1 component");
		}
	}, [previewData])

	return (
		<>
			<section className="section-blog-1 @@padding">
				<div className="container">
					<div className="row align-items-end">
						<div className="col-12 col-md-6 me-auto">
							<div className="d-flex align-items-center justify-content-center bg-primary-soft border border-2 border-white d-inline-flex rounded-pill px-4 py-2" data-aos="zoom-in" data-aos-delay={100}>
								<img src="/assets/imgs/features-1/dots.png" alt="infinia" />
								<span className="tag-spacing fs-7 fw-bold text-linear-2 ms-2 text-uppercase">{data?.badge || "Blog"}</span>
							</div>
							<h3 className="ds-3 mt-3 mb-3" data-aos="fade-zoom-in" data-aos-delay={100}>{data?.title || "Latest Articles"}</h3>
							<span className="fs-5 fw-medium" data-aos="fade-zoom-in" data-aos-delay={200}>{data?.subtitle || "Read our latest blog posts"}</span>
						</div>
						<div className="col-12 col-md-6 mt-3 mt-md-0">
							<Link href={data?.seeAllLink || "/blog"} className="ms-md-5 fw-bold text-primary">See all articles
								<svg className="ms-2" xmlns="http://www.w3.org/2000/svg" width={24} height={14} viewBox="0 0 24 14" fill="none">
									<path className="fill-dark" d="M17.4177 0.417969L16.3487 1.48705L21.1059 6.24429H0V7.75621H21.1059L16.3487 12.5134L17.4177 13.5825L24 7.0002L17.4177 0.417969Z" fill="black" />
								</svg>
							</Link>
						</div>
					</div>
					<div className="row">
						{blogs.map((post, index) => (
							<div key={index} className="col-lg-4 text-start">
								<div className="card border-0 rounded-3 mt-8 position-relative d-inline-flex" data-aos="fade-zoom-in" data-aos-delay={(index + 1) * 100}>
									<i className="position-absolute top-0 end-0 mt-3 me-3 badge bg-white fs-8 fw-medium rounded-pill px-2 py-1 z-2">
										{post.category || "General"}
									</i>
									<Link href={`/blog/${post.slug}`} className="card-img-top position-relative overflow-hidden">
										<Image 
											width={380}
											height={200}
											className="rounded-top-3" 
											src={post.thumbnail || "/assets/imgs/blogs/blog-1.webp"} 
											alt="infinia" 
										/>
									</Link>
									<div className="card-body px-0 pt-4">
										<small className="text-uppercase fw-medium text-700 fs-9">{post.date || "Jan 22, 2023"}</small>
										<h5 className="text-dark fw-bold mt-2 mb-3">
											<Link href={`/blog/${post.slug}`}>{post.title || "Sample Blog Post"}</Link>
										</h5>
										<p className="text-700 mb-3">{post.excerpt || "This is a sample blog post excerpt."}</p>
										<Link href={`/blog/${post.slug}`} className="fw-bold link-read link-dark">
											Continue reading
											<svg className="ms-1" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
												<path d="M15 18L21 12L15 6" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												<path d="M3 12H21" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</Link>
									</div>
								</div>
							</div>
						))}
						{blogs.length === 0 && data?.sampleBlogs && data.sampleBlogs.map((blog: any, index: number) => (
							<div key={index} className="col-lg-4 text-start">
								<div className="card border-0 rounded-3 mt-8 position-relative d-inline-flex" data-aos="fade-zoom-in" data-aos-delay={(index + 1) * 100}>
									<i className="position-absolute top-0 end-0 mt-3 me-3 badge bg-white fs-8 fw-medium rounded-pill px-2 py-1 z-2">
										{blog.category || "General"}
									</i>
									<Link href={blog.link || "#"} className="card-img-top position-relative overflow-hidden">
										<img className="rounded-top-3" src={blog.image} alt="infinia" />
									</Link>
									<div className="card-body px-0 pt-4">
										<small className="text-uppercase fw-medium text-700 fs-9">{blog.date}</small>
										<h5 className="text-dark fw-bold mt-2 mb-3">
											<Link href={blog.link || "#"}>{blog.title}</Link>
										</h5>
										<p className="text-700 mb-3">{blog.description}</p>
										<Link href={blog.link || "#"} className="fw-bold link-read link-dark">
											Continue reading
											<svg className="ms-1" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
												<path d="M15 18L21 12L15 6" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												<path d="M3 12H21" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</Link>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	)
}
