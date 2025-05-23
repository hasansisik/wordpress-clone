'use client'
import { useState, useEffect } from 'react';
import Link from "next/link"
import faqData from "@/data/faq.json"

interface Faqs2Props {
	previewData?: any;
}

export default function Faqs2({ previewData }: Faqs2Props = {}) {
	const [data, setData] = useState<any>(null)
	// Accordion
	const [activeItem, setActiveItem] = useState(1);
	const [key, setKey] = useState(0); // Add a key to force re-render

	const handleActiveItem = (index: number) => {
		setActiveItem(activeItem === index ? 0 : index);
	};

	// Force refresh when data changes
	useEffect(() => {
		// Increment key to force component re-render when data changes
		setKey(prevKey => prevKey + 1);
	}, [previewData]);

	useEffect(() => {
		console.log("Faqs2 previewData:", previewData);
		
		// If preview data is provided, use it, otherwise load from the file
		if (previewData && previewData.faqs2) {
			console.log("Setting from previewData", previewData.faqs2);
			setData(previewData.faqs2);
		} else if (faqData.faqs2) {
			console.log("Setting from local faqData", faqData.faqs2);
			setData(faqData.faqs2);
		} else {
			console.error("No FAQ data available in Faqs2 component");
		}
	}, [previewData, key])

	if (!data) {
		return <section>Loading Faqs2...</section>
	}

	// Calculate how to split the questions between two columns evenly
	const totalQuestions = data.questions.length;
	const firstColumnCount = Math.ceil(totalQuestions / 2);
	const firstColumn = data.questions.slice(0, firstColumnCount);
	const secondColumn = data.questions.slice(firstColumnCount);

	return (
		<>
			<section className="section-faqs-2 section-padding bg-4 position-relative" key={key}>
				<div className="container position-relative z-2">
					<div className="text-center mb-8">
						<div className="d-flex align-items-center position-relative z-2 justify-content-center bg-primary-soft d-inline-flex rounded-pill border border-2 border-white px-3 py-1">
							<img src={data.tagImage} alt="infinia" />
							<span className="tag-spacing fs-7 fw-bold text-linear-2 ms-2 text-uppercase">{data.heading.tag}</span>
						</div>
						<h3 className="ds-3 my-3 fw-bold">{data.heading.title}</h3>
						<p className="fs-5 mb-0">{data.heading.description}</p>
					</div>
					<div className="row align-items-center position-relative z-1">
						<div className="col-lg-6">
							<div className="accordion">
								{firstColumn.map((faq: any, index: number) => (
									<div key={`first-${index}-${key}`} className="mb-3 card p-3 border rounded-3">
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
												<p className="text-black-50 mb-0">
													{faq.answer}
												</p>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
						<div className="col-lg-6 mt-lg-0 mt-2">
							<div className="accordion">
								{secondColumn.map((faq: any, index: number) => (
									<div key={`second-${index}-${key}`} className="mb-3 card p-3 border rounded-3">
										<div className="px-0 card-header border-0">
											<a 
												className={`pointer text-900 fw-bold d-flex align-items-center ${activeItem === index+firstColumnCount+1 ? '' : ''}`} 
												onClick={() => handleActiveItem(index+firstColumnCount+1)}
											>
												<h6 className="m-0" dangerouslySetInnerHTML={{ __html: faq.question }}></h6>
												<span className="ms-auto arrow me-2">
													<svg xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
														<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</span>
											</a>
										</div>
										{activeItem === index+firstColumnCount+1 && (
											<div className="card-body px-0 mt-2">
												<p className="text-black-50 mb-0">
													{faq.answer}
												</p>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					</div>
					<div className="ellipse-center position-absolute top-50 start-50 translate-middle z-0" />
				</div>
			</section>
		</>
	)
}
