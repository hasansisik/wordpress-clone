"use client"
import Marquee from "react-fast-marquee";
import Link from "next/link"
import { useEffect, useState } from "react"
import heroData from "@/data/hero.json"

interface Hero3Props {
	previewData?: any;
}

export default function Hero3({ previewData }: Hero3Props = {}) {
	const [data, setData] = useState<any>(null)

	useEffect(() => {
		console.log("Hero3 previewData:", previewData);
		
		// If preview data is provided, use it, otherwise load from the file
		if (previewData && previewData.hero3) {
			console.log("Setting from previewData", previewData.hero3);
			setData(previewData.hero3);
		} else if (heroData.hero3) {
			console.log("Setting from local heroData", heroData.hero3);
			setData(heroData.hero3);
		} else {
			console.error("No hero data available in Hero3 component");
		}
	}, [previewData])

	if (!data) {
		return <section>Loading Hero3...</section>
	}

	return (
		<>
			<section className="section-hero-3 position-relative fix section-padding">
				<div className="container">
					<div className="row align-items-center position-relative">
						<div className="col-lg-7 position-relative z-1 mb-lg-0 pb-10 mb-">
							<div className="text-start mb-lg-0 mb-5">
								<div className="border-linear-1 rounded-pill d-inline-block mb-3">
									<div className="text-primary bg-white px-4 py-2 rounded-pill fw-medium position-relative z-2">
										{data.badge.text}
									</div>
								</div>
								<div className="d-flex align-items-center">
									<h1 className="ds-1 my-3 me-4 lh-1">
										{data.title.part1}
									</h1>
									<div className="mt-3 d-none d-md-flex">
										{data.avatars.map((avatar: any, index: number) => (
											<div key={index} className={`avt-hero ${index === 2 ? 'icon-shape icon-xxl border border-5 border-white-keep bg-primary-soft rounded-circle' : ''}`}>
												{index !== 2 ? (
													<img className="icon-shape icon-xxl border border-5 border-white-keep bg-primary-soft rounded-circle" src={avatar.image} alt={avatar.alt} />
												) : (
													<img src={avatar.image} alt={avatar.alt} />
												)}
											</div>
										))}
									</div>
								</div>
								<h1 className="ds-1 lh-1 m-0">
									{data.title.part2}
								</h1>
								<p className="fs-5 text-900 my-6">
									{data.description}
								</p>
								<Link href={data.button.link} className="btn btn-gradient">
									{data.button.text}
									<svg className="ms-2" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
										<path className="stroke-white" d="M17.25 15.25V6.75H8.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										<path className="stroke-white" d="M17 7L6.75 17.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</Link>
							</div>
						</div>
						<div className="col-lg-7 position-xl-absolute mb-lg-10 top-50 end-0 translate-middle-lg-y z-0">
							<div className="row">
								<div className="col-6 align-self-end">
									<div className="border-5 border-white border rounded-4 mb-4 d-block d-xl-none">
										<img className="rounded-4" src={data.images.image4} alt="infinia" />
									</div>
									<div className="border-5 border-white border rounded-4">
										<img className="rounded-4" src={data.images.image3} alt="infinia" />
									</div>
								</div>
								<div className="col-6 align-self-end">
									<div className="border-5 border-white border rounded-4 mb-4">
										<img className="rounded-4" src={data.images.image1} alt="infinia" />
									</div>
									<div className="border-5 border-white border rounded-4">
										<img className="rounded-4" src={data.images.image2} alt="infinia" />
									</div>
								</div>
							</div>
							<div className="position-absolute top-50 start-50 translate-middle pb-10 pe-10">
								<img className="rotateme" src={data.images.star} alt="infinia" />
							</div>
							<div className="position-absolute top-50 start-50 translate-middle">
								<div className="ellipse-primary" />
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
