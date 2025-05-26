"use client"
import Marquee from "react-fast-marquee";
import Link from "next/link"
import { useEffect, useState } from "react"
import heroData from "@/data/hero.json"

interface Hero3Props {
	previewData?: any;
}

export default function Hero3({ previewData }: Hero3Props = {}) {
	const [data, setData] = useState<any>(heroData.hero3 || {})

	useEffect(() => {
		
		// If preview data is provided, use it, otherwise load from the file
		if (previewData && previewData.hero3) {
			setData(previewData.hero3);
		} else if (heroData.hero3) {
			setData(heroData.hero3);
		} else {
			console.error("No hero data available in Hero3 component");
		}
	}, [previewData])

	return (
		<>
			<section className="section-hero-3 position-relative fix section-padding">
				<div className="container">
					<div className="row align-items-center position-relative">
						<div className="col-lg-7 position-relative z-1 mb-lg-0 pb-10 mb-">
							<div className="text-start mb-lg-0 mb-5">
								<div className="border-linear-1 rounded-pill d-inline-block mb-3">
									<div className="text-primary bg-white px-4 py-2 rounded-pill fw-medium position-relative z-2">
										{data?.badge?.text || ""}
									</div>
								</div>
								<div className="d-flex align-items-center">
									<h1 className="ds-1 my-3 me-4 lh-1">
										{data?.title?.part1 || ""}
									</h1>
									<div className="mt-3 d-none d-md-flex">
										{data?.avatars?.map((avatar: any, index: number) => (
											<div key={index} className={`avt-hero ${index === 2 ? 'icon-shape icon-xxl border border-5 border-white-keep bg-primary-soft rounded-circle' : ''}`}>
												{index !== 2 ? (
													<img className="icon-shape icon-xxl border border-5 border-white-keep bg-primary-soft rounded-circle" src={avatar?.image || ""} alt={avatar?.alt || ""} />
												) : (
													<img src={avatar?.image || ""} alt={avatar?.alt || ""} />
												)}
											</div>
										)) || []}
									</div>
								</div>
								<h1 className="ds-1 lh-1 m-0">
									{data?.title?.part2 || ""}
								</h1>
								<p className="fs-5 text-900 my-6">
									{data?.description || ""}
								</p>
								<div className="d-flex flex-wrap gap-3">
									<Link href={data?.buttons?.primary?.link || "#"} className="btn btn-gradient-1">
										{data?.buttons?.primary?.text || ""}
										<svg className="ms-2" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
											<path d="M17.9199 12.79L14.1199 9L15.5299 7.59L21.9199 14L15.5299 20.41L14.1199 19L17.9199 15.21H2.91992V12.79H17.9199Z" fill="white" />
										</svg>
									</Link>
									<Link href={data?.buttons?.secondary?.link || "#"} className="btn btn-outline-secondary">
										{data?.buttons?.secondary?.text || ""}
									</Link>
								</div>
							</div>
						</div>
						<div className="col-lg-5 position-lg-absolute end-0 pe-0">
							<div className="device-1-wrapper">
								<div className="hero-3-img position-relative">
									<img className="w-100 h-100 object-cover" src={data?.heroImage || ""} alt="device" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
