"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllBlogs } from "@/redux/actions/blogActions"
import { getOther } from "@/redux/actions/otherActions"
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
	const { blogs, loading: blogLoading, error } = useSelector((state: RootState) => state.blog)
	const { other, loading: otherLoading } = useSelector((state: RootState) => state.other)

	useEffect(() => {
		dispatch(getAllBlogs())
		// Also fetch other data if not provided in preview
		if (!previewData) {
			dispatch(getOther())
		}
	}, [dispatch, previewData])

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.blog1) {
			setData(previewData.blog1);
		} 
		// Otherwise use Redux data
		else if (other && other.blog1) {
			setData(other.blog1);
		}
	}, [previewData, other])

	if (blogLoading || otherLoading) {
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
					</div>
					<div className="row">
						{blogPosts.map((post, index) => (
							<div key={index} className="col-lg-4 text-start">
								<div className="card border-0 rounded-3 mt-8 position-relative w-100" data-aos="fade-zoom-in" data-aos-delay={(index + 1) * 100}>
									<div className="blog-image-container" style={{ height: '220px', width: '100%', overflow: 'hidden', position: 'relative' }}>
										<img 
											className="rounded-top-3" 
											src={post.image} 
											alt="blog post" 
											style={{ 
												width: '100%', 
												height: '100%', 
												objectFit: 'cover',
												objectPosition: 'center'
											}} 
										/>
									</div>
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
			<style jsx>{`
				.card {
					display: block;
					width: 100%;
				}
				.blog-image-container {
					width: 100%;
				}
			`}</style>
		</>
	)
}