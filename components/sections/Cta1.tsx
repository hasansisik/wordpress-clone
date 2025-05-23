'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import ctaData from "@/data/cta.json"

interface Cta1Props {
	previewData?: any;
}

export default function Cta1({ previewData }: Cta1Props = {}) {
	const [data, setData] = useState<any>(null)

	useEffect(() => {
		console.log("Cta1 previewData:", previewData);
		
		// If preview data is provided, use it, otherwise load from the file
		if (previewData && previewData.cta1) {
			console.log("Setting from previewData", previewData.cta1);
			setData(previewData.cta1);
		} else if (ctaData.cta1) {
			console.log("Setting from local ctaData", ctaData.cta1);
			setData(ctaData.cta1);
		} else {
			console.error("No CTA data available in Cta1 component");
		}
	}, [previewData])

	if (!data) {
		return <section>Loading Cta1...</section>
	}

	return (
		<>
			<section className="section-testimonial-13 position-relative pt-120 pb-80 fix">
				<div className="container position-relative z-1">
					<div className="row pb-9">
						<div className="col-lg-10 mx-lg-auto">
							<div className="text-center mb-lg-0 mb-5">
								<div className="d-flex align-items-center position-relative z-2 justify-content-center bg-primary-soft d-inline-flex rounded-pill border border-2 border-white px-3 py-1">
									<img src={data.tagImage || "/assets/imgs/features-1/dots.png"} alt="infinia" />
									<span className="tag-spacing fs-7 fw-bold text-linear-2 ms-2 text-uppercase">{data.badge || "About us"}</span>
								</div>
								<h3 
									className="ds-3 my-3 fw-regular"
									dangerouslySetInnerHTML={{ __html: data.title || "Together, We are Shaping a Promising Future." }}
								></h3>
							</div>
						</div>
					</div>
					<img className="position-absolute z-2 top-0 end-0 pe-10 pe-lg-10" src={data.star1 || "/assets/imgs/cta-15/star-2.svg"} alt="infinia" />
					<img className="position-absolute z-2 bottom-0 start-0 ps-10 ms-10" src={data.star2 || "/assets/imgs/cta-15/star-1.svg"} alt="infinia" />
				</div>
				<div className="container-fluid">
					<div className="d-flex align-items-center justify-content-center position-relative">
						{data.images && data.images.map((image: any, index: number) => (
							<div key={index} className={`pe-3 position-relative z-1 ${index === 0 || index === 4 ? 'd-none d-md-block' : ''}`}>
								<img className="rounded-3 border border-3 border-white" src={image.src} alt={image.alt || "Team image"} />
							</div>
						))}
						{!data.images && (
							<>
								<div className="pe-3 position-relative z-1 d-none d-md-block">
									<img className="rounded-3 border border-3 border-white" src="/assets/imgs/cta-15/img-1.png" alt="infinia" />
								</div>
								<div className="pe-3 position-relative z-1">
									<img className="rounded-3 border border-3 border-white" src="/assets/imgs/cta-15/img-2.png" alt="infinia" />
								</div>
								<div className="pe-3 position-relative z-1">
									<img className="rounded-3 border border-3 border-white" src="/assets/imgs/cta-15/img-3.png" alt="infinia" />
								</div>
								<div className="pe-3 position-relative z-1">
									<img className="rounded-3 border border-3 border-white" src="/assets/imgs/cta-15/img-4.png" alt="infinia" />
								</div>
								<div className="pe-3 position-relative z-1 d-none d-md-block">
									<img className="rounded-3 border border-3 border-white" src="/assets/imgs/cta-15/img-5.png" alt="infinia" />
								</div>
							</>
						)}
						<img className="position-absolute top-50 end-50 translate-middle-y z-0" src={data.bgEllipse || "/assets/imgs/cta-15/bg-ellipse.png"} alt="infinia" />
					</div>
					<div className="text-center mt-5">
						<div className="socials bg-white px-3 shadow-1 py-2 border rounded-pill d-inline-flex d-flex align-items-center justify-content-center">
							<p className="text-900 mb-0">{data.socialLabel || "Follow us:"}</p>
							<ul className="list-unstyled d-flex mb-0">
								{data.socials ? data.socials.map((social: any, index: number) => (
									<li key={index} className="ms-3">
										<Link href={social.link || "#"} target="_blank">
											<span className="icon" dangerouslySetInnerHTML={{ __html: social.icon }}></span>
										</Link>
									</li>
								)) : (
									<>
										<li className="ms-3">
											<Link href="https://www.facebook.com" target="_blank">
												<span className="icon">
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
														<path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
													</svg>
												</span>
											</Link>
										</li>
										<li className="ms-3">
											<Link href="https://www.twitter.com" target="_blank">
												<span className="icon">
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
														<path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
													</svg>
												</span>
											</Link>
										</li>
										<li className="ms-3">
											<Link href="#">
												<span className="icon">
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
														<path d="M232 237.2c31.8-15.2 48.4-38.2 48.4-74 0-70.6-52.6-87.8-113.3-87.8H0v354.4h171.8c64.4 0 124.9-30.9 124.9-102.9 0-44.5-21.1-77.4-64.7-89.7zM77.9 135.9H151c28.1 0 53.4 7.9 53.4 40.5 0 30.1-19.7 42.2-47.5 42.2h-79v-82.7zm83.3 233.7H77.9V272h84.9c34.3 0 56 14.3 56 50.6 0 35.8-25.9 47-57.6 47zm358.5-240.7H376V94h143.7v34.9zM576 305.2c0-75.9-44.4-139.2-124.9-139.2-78.2 0-131.3 58.8-131.3 135.8 0 79.9 50.3 134.7 131.3 134.7 61.3 0 101-27.6 120.1-86.3H509c-6.7 21.9-34.3 33.5-55.7 33.5-41.3 0-63-24.2-63-65.3h185.1c.3-4.2 .6-8.7 .6-13.2zM390.4 274c2.3-33.7 24.7-54.8 58.5-54.8 35.4 0 53.2 20.8 56.2 54.8H390.4z" />
													</svg>
												</span>
											</Link>
										</li>
										<li className="ms-3">
											<Link href="#">
												<span className="icon">
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
														<path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" />
													</svg>
												</span>
											</Link>
										</li>
									</>
								)}
							</ul>
						</div>
					</div>
					<div className="rotate-center ellipse-rotate-success position-absolute z-0" />
					<div className="rotate-center-rev ellipse-rotate-primary position-absolute z-0" />
				</div>
			</section>
		</>
	)
}
