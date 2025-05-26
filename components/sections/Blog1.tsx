"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import otherData from "@/data/other.json"
import { useDispatch, useSelector } from "react-redux"
import { getAllBlogs } from "@/redux/actions/blogActions"
import { AppDispatch, RootState } from "@/redux/store"
import { Loader2 } from "lucide-react"

interface Blog1Props {
	previewData?: any;
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

export default function Blog1({ previewData }: Blog1Props) {
	const [data, setData] = useState<any>(null)
	const dispatch = useDispatch<AppDispatch>()
	const { blogs, loading, error } = useSelector((state: RootState) => state.blog)

	useEffect(() => {
		dispatch(getAllBlogs())
	}, [dispatch])

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

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-[200px]">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-[200px]">
				<p className="text-red-500">Error: {error}</p>
			</div>
		)
	}

	if (!data || !blogs || blogs.length === 0) {
		return null
	}

	const blogPosts = blogs.slice(0, 3)

	return (
		<>
			<section className="section-blog-1 @@padding py-4">
				<div className="container">
					<div className="row align-items-end">
						<div className="col-12 col-md-6 me-auto">
							<div className="d-flex align-items-center justify-content-center bg-primary-soft border border-2 border-white d-inline-flex rounded-pill px-4 py-2" data-aos="zoom-in" data-aos-delay={100}>
								<img src="/assets/imgs/features-1/dots.png" alt="infinia" />
								<span className="tag-spacing fs-7 fw-bold text-linear-2 ms-2 text-uppercase">{data.badge}</span>
							</div>
							<h3 className="ds-3 mt-3 mb-3" data-aos="fade-zoom-in" data-aos-delay={100}>{data.title}</h3>
							<span className="fs-5 fw-medium" data-aos="fade-zoom-in" data-aos-delay={200}>{data.subtitle}</span>
						</div>
						<div className="col-12 col-md-6 text-end mt-3 mt-md-0">
							<Link href={data.seeAllLink} className="d-flex align-items-center justify-content-end fw-bold text-primary">
								See all articles <svg className="ms-2" xmlns="http://www.w3.org/2000/svg" width={24} height={14} viewBox="0 0 24 14" fill="none">
									<path className="fill-dark" d="M17.4177 0.417969L16.3487 1.48705L21.1059 6.24429H0V7.75621H21.1059L16.3487 12.5134L17.4177 13.5825L24 7.0002L17.4177 0.417969Z" fill="black" />
								</svg>
							</Link>
						</div>
					</div>
					<div className="row">
						{blogPosts.map((post, index) => (
							<div key={index} className="col-lg-4 text-start">
								<div className="card border-0 rounded-3 mt-8 position-relative d-inline-flex" data-aos="fade-zoom-in" data-aos-delay={(index + 1) * 100}>
									<img className="rounded-3" src={post.image} alt="blog post" />
									<div className="card-body p-0 bg-white">
										<Link href={`/${slugify(post.title)}`} className="bg-primary-soft position-relative z-1 d-inline-flex rounded-pill px-3 py-2 mt-3">
											<span className="tag-spacing fs-7 fw-bold text-linear-2 text-uppercase">{post.category[0]}</span>
										</Link>
										<h6 className="my-3">{post.title}</h6>
										<p>{post.description}</p>
									</div>
									<Link href={`/${slugify(post.title)}`} className="position-absolute bottom-0 start-0 end-0 top-0 z-0" />
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	)
}