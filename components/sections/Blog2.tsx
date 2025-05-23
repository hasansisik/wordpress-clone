"use client"
import Link from "next/link"
import { Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useEffect, useState } from "react"
import otherData from "@/data/other.json"
import blogData from "@/data/blog.json"

interface Blog2Props {
	previewData?: any;
}

export default function Blog2({ previewData }: Blog2Props = {}) {
	const [data, setData] = useState<any>(null)
	const [posts, setPosts] = useState<any[]>([])

	useEffect(() => {
		console.log("Blog2 previewData:", previewData);
		
		// If preview data is provided, use it, otherwise load from the file
		if (previewData && previewData.blog2) {
			console.log("Setting from previewData", previewData.blog2);
			setData(previewData.blog2);
		} else if (otherData.blog2) {
			console.log("Setting from local otherData", otherData.blog2);
			setData(otherData.blog2);
		} else {
			console.error("No blog data available in Blog2 component");
		}

		// Set posts from blog.json
		setPosts(blogData.slice(2, 5));
	}, [previewData])

	if (!data) {
		return <section>Loading Blog2...</section>
	}

	return (
		<>
			<section className="section-blog-2 position-relative section-padding fix">
				<div className="container position-relative z-1">
					<div className="row">
						<div className="col-lg-4">
							<div className="pe-6">
								<div className="d-flex align-items-center justify-content-center bg-primary-soft border border-2 border-white d-inline-flex rounded-pill px-4 py-2">
									<img src="/assets/imgs/features-1/dots.png" alt="infinia" />
									<span className="tag-spacing fs-7 fw-bold text-linear-2 ms-2 text-uppercase">{data.badge}</span>
								</div>
								<h3 className="ds-3 mt-3 mb-3">{data.title}</h3>
								<span className="fs-5 fw-medium">{data.subtitle}</span>
								<div className="d-flex align-items-center mt-8">
									<Link href={data.seeAllLink} className="fw-bold btn bg-white text-primary hover-up">See all articles
										<svg className="ms-2" xmlns="http://www.w3.org/2000/svg" width={24} height={14} viewBox="0 0 24 14" fill="none">
											<path className="fill-dark" d="M17.4177 0.417969L16.3487 1.48705L21.1059 6.24429H0V7.75621H21.1059L16.3487 12.5134L17.4177 13.5825L24 7.0002L17.4177 0.417969Z" fill="black" />
										</svg>
									</Link>
								</div>
							</div>
						</div>
						<div className="col-lg-8">
							<div className="blog-slider-container mt-lg-0 mt-5">
								<div className="blog-cards-grid">
									{posts.map((post, index) => (
										<div key={index} className="blog-card">
											<div className="card border-0 rounded-3 position-relative d-inline-flex card-hover">
												<img className="rounded-top-3" src={post.image} alt="blog post" />
												<div className="card-body">
													<Link href={post.link} className="bg-primary-soft position-relative z-1 d-inline-flex rounded-pill px-3 py-2 mt-3">
														<span className="tag-spacing fs-7 fw-bold text-linear-2 text-uppercase">{post.category}</span>
													</Link>
													<h6 className="my-3">{post.title}</h6>
													<p>{post.description}</p>
												</div>
												<Link href={post.link} className="position-absolute bottom-0 start-0 end-0 top-0" />
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
				
				{/* Remove animated elements that might cause issues */}
				<div className="position-absolute top-0 start-50 translate-middle-x z-0" style={{ opacity: 0.4 }}>
					<img src={data.bgLine} alt="background line" />
				</div>
			</section>
			
			{/* Add custom CSS to fix the blog grid */}
			<style jsx>{`
				.blog-cards-grid {
					display: grid;
					grid-template-columns: 1fr;
					gap: 20px;
					width: 100%;
				}
				
				@media (min-width: 768px) {
					.blog-cards-grid {
						grid-template-columns: repeat(2, 1fr);
					}
				}
				
				.blog-card {
					width: 100%;
					height: 100%;
				}
				
				.blog-card .card {
					width: 100%;
					height: 100%;
					display: flex;
					flex-direction: column;
				}
				
				.blog-card .card-body {
					flex: 1;
				}
				
				.blog-card img {
					width: 100%;
					height: auto;
					max-height: 200px;
					object-fit: cover;
				}
			`}</style>
		</>
	)
}
