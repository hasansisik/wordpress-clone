'use client'
import Link from "next/link"
import { useState, useEffect } from 'react'
import ModalVideo from 'react-modal-video'
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { getFeatures } from "@/redux/actions/featuresActions"
import { AppDispatch } from "@/redux/store"

interface Features1Props {
	previewData?: any;
}

export default function Features1({ previewData }: Features1Props = {}) {
	const [isOpen, setOpen] = useState(false)
	const [data, setData] = useState<any>(null)
	const dispatch = useDispatch<AppDispatch>()
	const { features, loading } = useSelector((state: RootState) => state.features)

	useEffect(() => {
		// Always trigger getFeatures() on component mount
		dispatch(getFeatures())
	}, [dispatch])

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.features1) {
			setData(previewData.features1)
		} 
		// Otherwise use Redux data
		else if (features && features.features1) {
			setData(features.features1)
		}
	}, [previewData, features])

	// If data is still loading, return empty component
	if (!data) {
		return null
	}
	
	// Function to handle video click
	const handleVideoClick = () => {
		setOpen(true)
	}

	return (
		<>
			<section className="features-1 section-padding">
				<div className="container">
					<div className="row">
						<div className="col-lg-4">
							{data.badge?.visible !== false && (
								<div 
									className="d-flex align-items-center border border-2 border-white d-inline-flex rounded-pill px-3 py-1" 
									style={{ 
										backgroundColor: data.badge?.backgroundColor || '#f8f4ff'
									}}
								>
									<img src={data.images?.dots || "/assets/imgs/features-1/dots.png"} alt="infinia" />
									<span 
										className="tag-spacing fs-7 fw-bold ms-2 text-uppercase" 
										style={{ 
											color: data.badge?.labelTextColor || '#6342EC' 
										}}
									>
										{data.badge?.label || "Our Features"}
									</span>
								</div>
							)}
							<h2 className="fw-medium mt-4 lh-sm">
								{data.title?.part1 || "1, we are creating a"}
								<span className="fw-black"> {data.title?.part2 || "Bright Future."}</span>
								<span 
									className="fst-italic" 
									data-aos="fade-zoom-in" 
									data-aos-delay={400} 
									style={{ color: data.title?.part3TextColor || '#6342EC' }}
								>
									{data.title?.part3 || " Join us."}
								</span>
							</h2>
						</div>
						<div className="col-lg-8">
							<div className="d-flex flex-md-row flex-column align-items-center position-relative ps-lg-8 pt-lg-0 pt-10">
								<div className="pe-md-3 pb-3 pb-md-0 position-relative z-1" data-aos="fade-zoom-in" data-aos-delay={100}>
									<img className="rounded-3 border border-3 border-white" src={data.images?.img1 || "/assets/imgs/features-1/img-1.png"} alt="infinia" />
								</div>
								<div className="pe-md-3 pb-3 pb-md-0 position-relative z-1" data-aos="fade-zoom-in" data-aos-delay={200}>
									<img className="rounded-3 border border-3 border-white" src={data.images?.img2 || "/assets/imgs/features-1/img-2.png"} alt="infinia" />
								</div>
								<div className="pe-md-3 pb-3 pb-md-0 position-relative z-1" data-aos="fade-zoom-in" data-aos-delay={300}>
									<img 
										className="rounded-3 border border-3 border-white cursor-pointer"
										src={data.images?.img3 || "/assets/imgs/features-1/img-3.png"} 
										alt="infinia"
										onClick={handleVideoClick}
									/>
									
									<ModalVideo 
										channel='youtube' 
										isOpen={isOpen} 
										videoId={data.videoId || "gXFATcwrO-U"} 
										onClose={() => setOpen(false)} 
									/>
								</div>
								<img className="position-absolute top-50 start-0 translate-middle-y z-0" src={data.images?.bgEllipse || "/assets/imgs/features-1/bg-ellipse.png"} alt="infinia" />
								<img className="position-absolute z-2 star-lg" src={data.images?.starLg || "/assets/imgs/features-1/star-lg.png"} alt="infinia" />
								<img className="position-absolute z-2 star-md" src={data.images?.starMd || "/assets/imgs/features-1/star-md.png"} alt="infinia" />
							</div>
						</div>
					</div>
				</div>
				<div className="container">
					<div className="row mt-10">
						{data.features && data.features.map((feature: any, index: number) => (
							<div key={index} className="col-lg-3 col-md-6" data-aos="fade-zoom-in" data-aos-delay={50 * (index + 1)}>
								<div 
									className="feature-item mb-5 mb-lg-0 p-4 rounded-3" 
									style={{ 
										backgroundColor: feature.backgroundColor || '' 
									}}
								>
									<div 
										className="icon-flip position-relative icon-shape icon-xxl rounded-3 mb-4" 
										style={{ 
											backgroundColor: feature.iconBackgroundColor || '#f8f4ff' 
										}}
									>
										<div className="icon">
											<img src={feature.icon || `/assets/imgs/features-1/icon-${index + 1}.svg`} alt="infinia" />
										</div>
									</div>
									<h6 style={{ color: feature.titleColor || '' }}>{feature.title}</h6>
									<p style={{ color: feature.descriptionColor || '' }}>{feature.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	)
}
