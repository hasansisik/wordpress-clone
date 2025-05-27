"use client"
import Link from "next/link"
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { getFaq } from "@/redux/actions/faqActions"
import { AppDispatch } from "@/redux/store"

interface Faqs3Props {
	previewData?: any;
}

export default function Faqs3({ previewData }: Faqs3Props = {}) {
	const [data, setData] = useState<any>(null)
	const dispatch = useDispatch<AppDispatch>()
	const { faq, loading } = useSelector((state: RootState) => state.faq)
	
	const [activeItem, setActiveItem] = useState(1);
	const [key, setKey] = useState(0);

	const handleActiveItem = (index: number) => {
		setActiveItem(activeItem === index ? 0 : index);
	};

	// Always fetch FAQ data when component mounts
	useEffect(() => {
		dispatch(getFaq())
	}, [dispatch])

	useEffect(() => {
		setKey(prevKey => prevKey + 1);
	}, [previewData]);

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.faqs3) {
			setData(previewData.faqs3);
		} 
		// Otherwise use Redux data
		else if (faq && faq.faqs3) {
			setData(faq.faqs3);
		}
	}, [previewData, faq, key])

	// If data is still loading or not available, show a loading indicator
	if (!data) {
		return (
			<section className="section-padding">
				<div className="container text-center">
					<div className="spinner-border" role="status">
						<span className="visually-hidden">Loading...</span>
					</div>
				</div>
			</section>
		)
	}

	return (
		<>
			<section className="section-faqs-1 section-padding position-relative" key={key}>
				<div className="container position-relative z-2">
					<div className="mb-5 text-center">
						<div className="d-flex align-items-center justify-content-center bg-primary-soft border border-2 border-white d-inline-flex rounded-pill px-4 py-2" data-aos="zoom-in" data-aos-delay={100}>
							<img src={data?.tagImage || "/assets/imgs/features-1/dots.png"} alt="infinia" />
							<span className="tag-spacing fs-7 fw-bold text-linear-2 ms-2 text-uppercase">{data?.heading?.tag || "FAQs"}</span>
						</div>
						<h3 className="ds-3 mt-3 mb-3" data-aos="fade-zoom-in" data-aos-delay={100} dangerouslySetInnerHTML={{ __html: data?.heading?.title || "Frequently Asked Questions" }}></h3>
					</div>
					<div className="row">
						<div className="col-lg-10 mx-auto">
							<div className="content-one accordion-list-one pe-lg-8 pe-md-0">
								{data?.questions?.map((item: any, index: number) => (
									<div key={index} className={`accordion-item bg-white rounded-4 border-0 mb-4 shadow-1 ${activeItem === index + 1 ? 'active' : ''}`}>
										<h2 className="accordion-header" onClick={() => handleActiveItem(index + 1)}>
											<button className="accordion-button">
												{item?.question || `Question ${index + 1}`}
											</button>
										</h2>
										<div className={`accordion-collapse collapse ${activeItem === index + 1 ? 'show' : ''}`}>
											<div className="accordion-body" dangerouslySetInnerHTML={{ __html: item?.answer || "Answer goes here" }}></div>
										</div>
									</div>
								)) || (
									<div className="accordion-item bg-white rounded-4 border-0 mb-4 shadow-1 active">
										<h2 className="accordion-header" onClick={() => handleActiveItem(1)}>
											<button className="accordion-button">
												Sample Question
											</button>
										</h2>
										<div className={`accordion-collapse collapse ${activeItem === 1 ? 'show' : ''}`}>
											<div className="accordion-body">Sample Answer</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="ellipse-24 position-absolute" />
				<div className="ellipse-27 position-absolute" />
			</section>
		</>
	)
}
