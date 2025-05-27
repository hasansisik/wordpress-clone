"use client"
import Link from "next/link"
import { Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllServices } from "@/redux/actions/serviceActions"
import { getOther } from "@/redux/actions/otherActions"
import { AppDispatch, RootState } from "@/redux/store"
import { Loader2 } from "lucide-react"

interface Project2Props {
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

export default function Project2({ previewData }: Project2Props) {
	const [data, setData] = useState<any>(null);
	const dispatch = useDispatch<AppDispatch>();
	const { services, loading: servicesLoading, error } = useSelector((state: RootState) => state.service);
	const { other, loading: otherLoading } = useSelector((state: RootState) => state.other);

	useEffect(() => {
		// Fetch services if not provided
		dispatch(getAllServices());
		
		// Also fetch other data if not provided in preview
		if (!previewData) {
			dispatch(getOther());
		}
	}, [dispatch, previewData]);

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.project2) {
			setData(previewData.project2);
		} 
		// Otherwise use Redux data
		else if (other && other.project2) {
			setData(other.project2);
		}
	}, [previewData, other]);
	
	if (servicesLoading || otherLoading || !data) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<p className="text-red-500">Error: {error}</p>
			</div>
		);
	}

	// Use editor data if available, otherwise use the default data
	const title = data.title || "Our featured projects";
	const subtitle = data.subtitle || "Recent work";
	const description = data.description || "⚡Don't miss any contact. Stay connected.";
	const backgroundColor = data.backgroundColor || "#f8f9fa";
	const titleColor = data.titleColor || "#333333";
	const badgeColor = data.badgeColor || "rgba(99, 66, 236, 0.1)";

	// Style objects for dynamic styling
	const sectionStyle = {
		backgroundColor: backgroundColor
	};

	const titleStyle = {
		color: titleColor
	};

	const badgeStyle = {
		backgroundColor: badgeColor
	};

	const swiperOptions = {
		slidesPerView: 3,
		spaceBetween: 20,
		slidesPerGroup: 1,
		centeredSlides: false,
		loop: true,
		autoplay: {
			delay: 4000,
		},
		breakpoints: {
			1200: {
				slidesPerView: 3,
			},
			992: {
				slidesPerView: 3,
			},
			768: {
				slidesPerView: 2,
			},
			576: {
				slidesPerView: 1,
			},
			0: {
				slidesPerView: 1,
			},
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		pagination: {
			el: '.swiper-pagination',
		},
	}

	return (
		<>
			<section className="section-project-2 pt-120 pb-8" style={sectionStyle}>
				<div className="container">
					<div className="row mb-8">
						<div className="col-lg-6">
							<div className="d-flex align-items-center justify-text-center bg-primary-soft border border-2 border-white d-inline-flex rounded-pill px-3 py-1" style={badgeStyle}>
								<img src="/assets/imgs/features-1/dots.png" alt="infinia" />
								<span className="tag-spacing fs-7 fw-bold text-linear-2 ms-2 text-uppercase">{subtitle}</span>
							</div>
							<h3 className="ds-3 mt-3 mb-3" style={titleStyle}>{title}</h3>
							<p className="fs-5 fw-medium">{description}</p>
						</div>
						<div className="col-lg-2 col-md-3 col-6 ms-auto align-self-end mb-lg-7 mt-lg-0 mt-4">
							<div className="position-relative z-0">
								<div className="swiper-button-prev shadow bg-white ms-lg-7">
									<i className="bi bi-arrow-left" />
								</div>
								<div className="swiper-button-next shadow bg-white">
									<i className="bi bi-arrow-right" />
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<Swiper {...swiperOptions}
							className="swiper slider-1 pt-2 pb-8"
							modules={[Keyboard, Autoplay, Pagination, Navigation]}
						>
							<div className="swiper-wrapper">
								{services && services.map((project) => (
									<SwiperSlide key={project._id || project.id} className="swiper-slide">
										<div className="text-center">
											<div className="zoom-img position-relative d-inline-block z-1" style={{ height: '480px', width: '100%' }}>
												<div className="rounded-3 fix" style={{ height: '480px', overflow: 'hidden' }}>
													<img 
														className="img-fluid w-100 h-100" 
														src={project.image} 
														alt="infinia" 
														style={{ objectFit: 'cover', objectPosition: 'center' }}
													/>
												</div>
												<Link href={`/${slugify(project.title)}`} className="card-team text-start rounded-3 position-absolute bottom-0 start-0 end-0 z-1 backdrop-filter w-auto p-4 m-4 hover-up">
													<p className="fs-7 text-primary mb-1">{project.company}</p>
													<h6>{project.subtitle || ''}</h6>
													<p className="text-900">{project.fullDescription || project.description}</p>
												</Link>
												<Link href={`/${slugify(project.title)}`} className="badge text-primary bg-white px-3 py-2 rounded-pill m-4 fs-7 position-absolute top-0 end-0 z-1">{project.tag || 'Hizmetler'}</Link>
											</div>
										</div>
									</SwiperSlide>
								))}
							</div>
						</Swiper>
					</div>
				</div>
			</section>
		</>
	)
}
