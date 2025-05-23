"use client"
import Link from "next/link"
import { useState, useEffect } from "react";
import faqData from "@/data/faq.json"

interface Faqs3Props {
	previewData?: any;
}

export default function Faqs3({ previewData }: Faqs3Props = {}) {
	const [data, setData] = useState<any>(null)
	const [activeItem, setActiveItem] = useState(1);
	const [key, setKey] = useState(0);

	const handleActiveItem = (index: number) => {
		setActiveItem(activeItem === index ? 0 : index);
	};

	useEffect(() => {
		setKey(prevKey => prevKey + 1);
	}, [previewData]);

	useEffect(() => {
		console.log("Faqs3 previewData:", previewData);
		
		if (previewData && previewData.faqs3) {
			console.log("Setting from previewData", previewData.faqs3);
			setData(previewData.faqs3);
		} else if (faqData.faqs3) {
			console.log("Setting from local faqData", faqData.faqs3);
			setData(faqData.faqs3);
		} else {
			console.error("No FAQ data available in Faqs3 component");
		}
	}, [previewData, key])

	if (!data) {
		return <section>Loading Faqs3...</section>
	}

	return (
		<>
			<section className="section-faqs-1 section-padding position-relative" key={key}>
				<div className="container position-relative z-2">
					<div className="row align-items-center">
						<div className="col-lg-6">
							<div className="text-start">
								<div className="d-flex align-items-center position-relative z-2 justify-content-center bg-primary-soft d-inline-flex rounded-pill border border-2 border-white px-3 py-1">
									<img src={data.tagImage} alt="infinia" />
									<span className="tag-spacing fs-7 fw-bold text-linear-2 ms-2 text-uppercase">{data.heading.tag}</span>
								</div>
								<h3 className="ds-3 my-3 fw-bold" dangerouslySetInnerHTML={{ __html: data.heading.title }}></h3>
								<div className="position-relative d-inline-block mt-3 mb-6">
									<img src={data.images.image1} alt="" className=" rounded-pill border border-3 border-white" />
									<img src={data.images.image2} alt="" className="position-absolute z-1 top-0 start-50 mt-3 rounded-pill border border-3 border-white" />
								</div>
								<p className="fs-5 mb-0" dangerouslySetInnerHTML={{ __html: data.heading.description }}></p>
								<div className="d-flex align-items-center mt-5">
									<Link href={data.buttons.primary.link} className="btn btn-gradient">
										{data.buttons.primary.text}
										<svg className="ms-2" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
											<path className="stroke-white" d="M17.25 15.25V6.75H8.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											<path className="stroke-white" d="M17 7L6.75 17.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</Link>
									<Link href={data.buttons.secondary.link} className="ms-5 fw-bold">{data.buttons.secondary.text}</Link>
								</div>
							</div>
						</div>
						<div className="col-lg-6 mt-lg-0 mt-8 ">
							<div className="accordion">
								{data.questions.map((faq: any, index: number) => (
									<div key={`faq-${index}-${key}`} className="mb-3 card p-3 border rounded-2 shadow-2">
										<div className="px-0 card-header border-0">
											<a 
												className={`pointer text-900 fw-bold d-flex align-items-center ${activeItem === index+1 ? '' : ''}`} 
												onClick={() => handleActiveItem(index+1)}
											>
												<h6 className="m-0" dangerouslySetInnerHTML={{ __html: faq.question }}></h6>
												<span className="ms-auto arrow me-2">
													<svg xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
														<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</span>
											</a>
										</div>
										{activeItem === index+1 && (
											<div className="card-body px-0 mt-2">
												<p className="text-black-50 mb-0">{faq.answer}</p>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
