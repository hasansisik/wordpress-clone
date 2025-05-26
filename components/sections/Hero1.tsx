"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import heroData from "@/data/hero.json"

interface Hero1Props {
	previewData?: any;
}

export default function Hero1({ previewData }: Hero1Props = {}) {
	const [data, setData] = useState<any>(null)

	useEffect(() => {
		
		// If preview data is provided, use it, otherwise load from the file
		if (previewData && previewData.hero1) {
			setData(previewData.hero1);
		} else if (heroData.hero1) {
			setData(heroData.hero1);
		} else {
			console.error("No hero data available in Hero1 component");
		}
	}, [previewData])

	if (!data) {
		return <section>Loading Hero1...</section>
	}

	return (
		<>
			<section className="position-relative overflow-hidden section-padding">
				<div className="container">
					<div className="row content align-items-center">
						<div className="col-lg-6 col-md-12 mb-lg-0 mb-5">
							<div className="pe-2">
								<Link href={data.badge?.link || "#"} className="d-flex align-items-center bg-linear-1 d-inline-flex rounded-pill px-2 py-1">
									<span className="bg-primary fs-9 fw-bold rounded-pill px-2 py-1 text-white">
										{data.badge.label}
									</span>
									<span className="fs-7 fw-medium text-primary mx-2">
										{data.badge.text}
									</span>
									<svg xmlns="http://www.w3.org/2000/svg" width={18} height={19} viewBox="0 0 18 19" fill="none">
										<path d="M10.3125 5.5625L14.4375 9.5L10.3125 13.4375" stroke="#6342EC" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
										<path d="M14.25 9.5H3.5625" stroke="#6342EC" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</Link>
								<h3 className="ds-3 mt-4 mb-5" data-aos="fade-zoom-in" data-aos-delay={0}>
									{data.title}
								</h3>
								<p className="pe-10 mb-5" data-aos="fade-zoom-in" data-aos-delay={200}>
									{data.description}
								</p>
								<Link href={data.primaryButton.link} className="btn btn-gradient" data-aos="fade-zoom-in" data-aos-delay={300}>
									{data.primaryButton.text}
									<svg className="ms-2" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
										<path className="stroke-white" d="M17.25 15.25V6.75H8.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										<path className="stroke-white" d="M17 7L6.75 17.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</Link>
								<Link href={data.secondaryButton.link} className="ms-md-3 mt-3 mt-md-0 btn btn-outline-secondary hover-up" data-aos="fade-zoom-in" data-aos-delay={500}>
									<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
										<path className="stroke-dark" d="M8.89286 4.75H6.06818C5.34017 4.75 4.75 5.34017 4.75 6.06818C4.75 13.3483 10.6517 19.25 17.9318 19.25C18.6598 19.25 19.25 18.6598 19.25 17.9318V15.1071L16.1429 13.0357L14.5317 14.6468C14.2519 14.9267 13.8337 15.0137 13.4821 14.8321C12.8858 14.524 11.9181 13.9452 10.9643 13.0357C9.98768 12.1045 9.41548 11.1011 9.12829 10.494C8.96734 10.1537 9.06052 9.76091 9.32669 9.49474L10.9643 7.85714L8.89286 4.75Z" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
									{data.secondaryButton.text}
								</Link>
							</div>
						</div>
						<div className="col-lg-6 position-relative justify-content-center">
							<img className="hero-img" src={data.images.background} alt="infinia" />
							<div className="shape-1 position-absolute">
								<img className="rightToLeft" src={data.images.shape1} alt="infinia" data-aos="zoom-in" data-aos-delay={500} />
							</div>
							<div className="shape-2 position-absolute d-none d-md-block">
								<img src={data.images.shape2} alt="infinia" data-aos="zoom-in" data-aos-delay={200} />
							</div>
							<div className="shape-3 position-absolute d-none d-md-block">
								<img src={data.images.shape3} alt="infinia" data-aos="zoom-in" data-aos-delay={300} />
							</div>
							<div className="alltuchtopdown card-hero backdrop-filter rounded-3 text-center d-inline-block p-3 position-absolute">
								<img className="rounded-3" src={data.card.image} alt="infinia" />
								<h6 className="mt-3">
									{data.card.title}
								</h6>
								<p className="fs-7 text-700">
									{data.card.description}
								</p>
								<Link href={data.card.button.link} className="shadow-sm d-flex align-items-center bg-white d-inline-flex rounded-pill px-2 py-1 mb-3">
									<span className="bg-primary fs-9 fw-bold rounded-pill px-2 py-1 text-white">
										{data.card.button.label}
									</span>
									<span className="fs-7 fw-medium text-primary mx-2">
										{data.card.button.text}
									</span>
									<svg xmlns="http://www.w3.org/2000/svg" width={18} height={19} viewBox="0 0 18 19" fill="none">
										<path d="M10.3125 5.5625L14.4375 9.5L10.3125 13.4375" stroke="#6D4DF2" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
										<path d="M14.25 9.5H3.5625" stroke="#6D4DF2" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
