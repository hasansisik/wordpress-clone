"use client"
import Link from "next/link"
import { Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllBlogs } from "@/redux/actions/blogActions"
import { getOther } from "@/redux/actions/otherActions"
import { getMyProfile } from "@/redux/actions/userActions"
import { AppDispatch, RootState } from "@/redux/store"
import PremiumContentDialog from "@/components/PremiumContentDialog"

interface Blog2Props {
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

export default function Blog2({ previewData }: Blog2Props = {}) {
	const dispatch = useDispatch<AppDispatch>();
	const { blogs, loading: blogLoading } = useSelector((state: RootState) => state.blog);
	const { other, loading: otherLoading } = useSelector((state: RootState) => state.other);
	const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
	
	const [data, setData] = useState<any>(null)
	const [posts, setPosts] = useState<any[]>([])
	const [showPremiumDialog, setShowPremiumDialog] = useState(false)
	const [currentPremiumPost, setCurrentPremiumPost] = useState<any>(null)
	
	// Premium kontrolü - === true ile kesin kontrol
	const isPremiumUser = isAuthenticated && user?.isPremium === true;

	// Kullanıcı profil bilgilerini güncelle
	useEffect(() => {
		dispatch(getMyProfile());
	}, [dispatch]);

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.blog2) {
			setData(previewData.blog2);
		} 
		// Otherwise use Redux data
		else if (other && other.blog2) {
			setData(other.blog2);
		}
	}, [previewData, other])

	// Fetch blogs and other data from Redux
	useEffect(() => {
		if (blogs.length === 0) {
			dispatch(getAllBlogs());
		} else {
			// Use slice to get only the posts we need
			setPosts(blogs.slice(2, 5));
		}

		// Also fetch other data if not provided in preview
		if (!previewData) {
			dispatch(getOther());
		}
	}, [blogs, dispatch, previewData]);
	
	// Handle blog post click with premium check
	const handlePostClick = (e: React.MouseEvent, post: any) => {
		if (post.premium && !isPremiumUser) {
			e.preventDefault();
			setCurrentPremiumPost(post);
			setShowPremiumDialog(true);
		} else if (post.premium && isPremiumUser) {
			// Premium içerik ve kullanıcı premium, normal link davranışı devam eder
		}
	}

	const handleDialogClose = () => {
		setShowPremiumDialog(false);
		setCurrentPremiumPost(null);
	}

	if (!data) {
		return 
	}

	if (blogLoading || otherLoading) {
		return 
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

	const badgeStyle = {
		backgroundColor: `${data.badgeBackgroundColor || "#f1f0fe"} !important`,
		color: data.badgeTextColor || "#6342EC"
	};

	const buttonStyle = {
		color: data.seeAllButtonColor || "#111827"
	};

	return (
		<>
			{/* Premium Dialog */}
			<PremiumContentDialog 
				isOpen={showPremiumDialog} 
				onClose={handleDialogClose}
				title={currentPremiumPost?.title ? `Premium İçerik: ${currentPremiumPost.title}` : 'Premium İçerik'}
			/>
			
			<section className="section-blog-2 position-relative section-padding fix" style={sectionStyle}>
				<div className="container position-relative z-1">
					<div className="row">
						<div className="col-lg-4">
							<div className="pe-6">
								{data.badgeVisible !== false && (
									<div className="d-flex align-items-center justify-content-center border border-2 border-white d-inline-flex rounded-pill px-4 py-2" style={{
										backgroundColor: data.badgeBackgroundColor || "#f1f0fe",
										color: data.badgeTextColor || "#6342EC"
									}}>
										<span className="tag-spacing fs-7 fw-bold ms-2 text-uppercase">{data.badge}</span>
									</div>
								)}
								<h3 className="ds-3 mt-3 mb-3" style={titleStyle}>{data.title}</h3>
								<span className="fs-5 fw-medium" style={subtitleStyle}>{data.subtitle}</span>
								{data.seeAllButtonVisible !== false && (
									<div className="d-flex align-items-center mt-8">
										<Link href={data.seeAllLink} className="fw-bold btn bg-white text-primary hover-up" style={buttonStyle}>
											{data.seeAllLinkText || "See all articles"}
											<svg className="ms-2" xmlns="http://www.w3.org/2000/svg" width={24} height={14} viewBox="0 0 24 14" fill="none">
												<path className="fill-dark" d="M17.4177 0.417969L16.3487 1.48705L21.1059 6.24429H0V7.75621H21.1059L16.3487 12.5134L17.4177 13.5825L24 7.0002L17.4177 0.417969Z" fill="black" />
											</svg>
										</Link>
									</div>
								)}
							</div>
						</div>
						<div className="col-lg-8">
							<div className="blog-slider-container mt-lg-0 mt-5">
								<div className="blog-cards-grid">
									{posts.map((post, index) => (
										<div key={index} className="blog-card">
											<div className="card border-0 rounded-3 position-relative d-block w-100 h-100 card-hover bg-gray-50">
												<div className="blog-image-container w-100" style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
													<img 
														className="rounded-top-3" 
														src={post.image} 
														alt={post.title} 
														style={{ 
															width: '100%', 
															height: '100%', 
															objectFit: 'cover',
															objectPosition: 'center'
														}} 
													/>
													{post.premium && (
														<>
															<div className="position-absolute top-0 end-0 m-2">
																<div className="bg-amber-500 text-white px-2 py-1 rounded-pill fs-8 fw-bold">
																	Premium
																</div>
															</div>
															<div className="position-absolute bottom-0 left-0 w-100" style={{
																background: 'linear-gradient(to top, rgba(245, 158, 11, 1), rgba(245, 158, 11, 0))',
																height: '100px'
															}}></div>
														</>
													)}
												</div>
												<div className="card-body">
													<Link 
														href={`/${slugify(post.title)}`} 
														className="position-relative z-1 d-inline-flex rounded-pill px-3 py-2 mt-3"
														style={post.premium ? 
															{ backgroundColor: '#FFEDD5', color: '#C2410C' } : 
															{ backgroundColor: '#f5f5f5', color: '#333333' }
														}
													>
														<span className="tag-spacing fs-7 fw-bold text-uppercase">{Array.isArray(post.category) ? post.category[0] : post.category}</span>
													</Link>
													<h6 className={`my-3 ${post.premium ? 'text-orange-700' : 'text-gray-800'}`}>{post.title}</h6>
													<p className="text-gray-700">{post.description}</p>
												</div>
												<Link 
													href={`/${slugify(post.title)}`} 
													className="position-absolute bottom-0 start-0 end-0 top-0"
													onClick={(e) => handlePostClick(e, post)}
												/>
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
			`}</style>
		</>
	)
}
