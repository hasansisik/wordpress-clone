"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllBlogs } from "@/redux/actions/blogActions"
import { getOther } from "@/redux/actions/otherActions"
import { AppDispatch, RootState } from "@/redux/store"
import { Loader2 } from "lucide-react"
import Image from "next/image"

interface Blog5Props {
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

export default function Blog5({ previewData }: Blog5Props) {
	const [data, setData] = useState<any>(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [postsPerPage] = useState(12) // 3 columns × 4 rows = 12 posts per page
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
		if (previewData && previewData.blog5) {
			setData(previewData.blog5);
		} 
		// Otherwise use Redux data
		else if (other && other.blog5) {
			setData(other.blog5);
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

	// Get current posts
	const indexOfLastPost = currentPage * postsPerPage
	const indexOfFirstPost = indexOfLastPost - postsPerPage
	const currentPosts = blogs.slice(indexOfFirstPost, indexOfLastPost)
	
	// Calculate total pages
	const totalPages = Math.ceil(blogs.length / postsPerPage)

	// Create page numbers array
	const pageNumbers = []
	for (let i = 1; i <= totalPages; i++) {
		pageNumbers.push(i)
	}

	// Create styles for customizable elements
	const sectionStyle = {
		backgroundColor: data.backgroundColor || "#ffffff"
	};

	const titleStyle = {
		color: data.titleColor || "#111827"
	};

	const subtitleStyle = {
		color: data.subtitleColor || "#6E6E6E"
	};

	return (
		<>
			<section className="section-blog-6 section-padding border-bottom" style={sectionStyle}>
				<div className="container">
					<div className="row align-items-end">
						<div className="col">
							<h5 className="ds-5 mt-3 mb-3" style={titleStyle}>{data.title}</h5>
							<span className="fs-5 fw-medium" style={subtitleStyle}>{data.subtitle}</span>
						</div>
					</div>
					<div className="row">
						{currentPosts.map((post, index) => (
							<div key={index} className="col-lg-4 col-md-6 text-start">
								<div className="card border-0 rounded-3 mt-4 position-relative w-100">
									<div className="blog-image-container w-100" style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
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
									<div className="card-body bg-white p-0">
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
				{totalPages > 1 && (
					<div className="container">
						<div className="row pt-5 text-start">
							<div className="d-flex justify-content-start align-items-center">
								<nav aria-label="Page navigation example">
									<ul className="pagination gap-2">
										<li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
											<Link 
												className="icon-xl fs-5 page-link pagination_item border-0 rounded-circle icon-shape fw-bold bg-neutral-100 text-900" 
												href="#" 
												aria-label="Previous"
												onClick={(e) => {
													e.preventDefault();
													if (currentPage > 1) setCurrentPage(currentPage - 1);
												}}
											>
												<svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 22 22" fill="none">
													<path className="stroke-dark" d="M9.49554 6.5L4.78125 11L9.49554 15.5" stroke="#111827" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
													<path className="stroke-dark" d="M17.2143 11H5" stroke="#111827" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</Link>
										</li>
										{pageNumbers.map(number => (
											<li key={number} className="page-item">
												<Link 
													className={`icon-xl fs-5 page-link pagination_item border-0 rounded-circle icon-shape fw-bold bg-neutral-100 text-900 ${currentPage === number ? 'active' : ''}`} 
													href="#"
													onClick={(e) => {
														e.preventDefault();
														setCurrentPage(number);
													}}
												>
													{number}
												</Link>
											</li>
										))}
										<li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
											<Link 
												className="icon-xl fs-5 page-link pagination_item border-0 rounded-circle icon-shape fw-bold bg-neutral-100 text-900" 
												href="#" 
												aria-label="Next"
												onClick={(e) => {
													e.preventDefault();
													if (currentPage < totalPages) setCurrentPage(currentPage + 1);
												}}
											>
												<svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 22 22" fill="none">
													<path className="stroke-dark" d="M12.5 6.5L17.2143 11L12.5 15.5" stroke="#111827" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
													<path className="stroke-dark" d="M16.9955 11H4.78125" stroke="#111827" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</Link>
										</li>
									</ul>
								</nav>
							</div>
						</div>
					</div>
				)}
			</section>
			<style jsx>{`
				.card {
					display: block;
					width: 100%;
				}
			`}</style>
		</>
	)
}
