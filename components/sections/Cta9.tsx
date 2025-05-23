'use client'
import Link from "next/link"
import { useState, useEffect } from 'react'
import ModalVideo from 'react-modal-video'
import ctaData from "@/data/cta.json"

interface Cta9Props {
	previewData?: any;
}

export default function Cta9({ previewData }: Cta9Props = {}) {
	const [isOpen, setOpen] = useState(false)
	const [data, setData] = useState<any>(null)

	useEffect(() => {
		console.log("Cta9 previewData:", previewData);
		
		// If preview data is provided, use it, otherwise load from the file
		if (previewData && previewData.cta9) {
			console.log("Setting from previewData", previewData.cta9);
			setData(previewData.cta9);
		} else if (ctaData.cta9) {
			console.log("Setting from local ctaData", ctaData.cta9);
			setData(ctaData.cta9);
		} else {
			console.error("No CTA data available in Cta9 component");
		}
	}, [previewData])

	if (!data) {
		return <section>Loading Cta9...</section>
	}

	return (
		<>
	<section className="section-cta-14 position-relative section-padding">
					<div className="container position-relative z-2">
						<div className="text-center">
							<div className="d-flex align-items-center justify-content-center bg-primary-soft border border-2 border-white d-inline-flex rounded-pill px-4 py-2" data-aos="zoom-in" data-aos-delay={100}>
							<img src={data.tagImage} alt="infinia" />
							<span className="tag-spacing fs-7 fw-bold text-linear-2 ms-2 text-uppercase">{data.heading.tag}</span>
							</div>
						<h5 className="ds-5 my-3 fw-regular" dangerouslySetInnerHTML={{ __html: data.heading.title }}></h5>
						</div>
						<div className="row mt-8">
							<div className="col-10 mx-auto">
								<div className="position-relative">
									<div className="zoom-img rounded-4 border-5 border-white border position-relative z-2">
									<img className="rounded-3" src={data.videoGuide.image} alt="infinia" />
										<div className="position-absolute top-50 start-50 translate-middle z-2">
											<Link href="#" scroll={false} onClick={() => setOpen(true)} className="d-inline-flex align-items-center rounded-4 text-nowrap backdrop-filter px-3 py-2 popup-video hover-up me-3 shadow-1">
												<span className="backdrop-filter me-2 icon-shape icon-md rounded-circle">
													<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
														<path className="stroke-dark" d="M5.0978 3.31244L12.0958 6.80342C13.077 7.29449 13.0767 8.69249 12.0954 9.18316L5.09734 12.6927C4.21074 13.136 3.16687 12.4925 3.16687 11.5027L3.16687 4.50219C3.16687 3.51217 4.2112 2.86872 5.0978 3.31244Z" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</span>
												<span className="fw-bold fs-7 text-900">
												{data.videoGuide.buttonText}
												</span>
											</Link>
										</div>
									</div>
									<div className="position-absolute top-100 start-0 translate-middle z-1">
									<img className="alltuchtopdown" src={data.vectors.vector1} alt="infinia" />
									</div>
									<div className="vector-2 position-absolute z-2">
									<img className="alltuchtopdown" src={data.vectors.vector2} alt="infinia" />
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="position-absolute top-0 start-50 translate-middle-x z-0">
					<img src={data.vectors.bgLine} alt="infinia" />
					</div>
					<div className="rotate-center ellipse-rotate-success position-absolute z-1" />
					<div className="rotate-center-rev ellipse-rotate-primary position-absolute z-1" />
				</section>

			<ModalVideo channel='youtube' isOpen={isOpen} videoId={data.videoGuide.videoId} onClose={() => setOpen(false)} />
		</>
	)
}
