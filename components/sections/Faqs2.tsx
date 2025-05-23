'use client'
import { useState } from 'react';
import Link from "next/link"

export default function Faqs2() {

	// Accordion
	const [activeItem, setActiveItem] = useState(1);

	const handleActiveItem = (index: number) => {
		setActiveItem(activeItem === index ? 0 : index);
	};

	return (
		<>
			<section className="section-faqs-2 section-padding bg-4 position-relative">
				<div className="container position-relative z-2">
					<div className="text-center mb-8">
						<div className="d-flex align-items-center position-relative z-2 justify-content-center bg-primary-soft d-inline-flex rounded-pill border border-2 border-white px-3 py-1">
							<img src="/assets/imgs/features-1/dots.png" alt="infinia" />
							<span className="tag-spacing fs-7 fw-bold text-linear-2 ms-2 text-uppercase">Pricing FAQs</span>
						</div>
						<h3 className="ds-3 my-3 fw-bold">Ask us anything</h3>
						<p className="fs-5 mb-0">Have any questions? We're here to assist you.</p>
					</div>
					<div className="row align-items-center position-relative z-1">
						<div className="col-lg-6">
							<div className="accordion">
								<div className="mb-3 card p-3 border rounded-3">
									<div className="px-0 card-header border-0">
										<a 
											className={`pointer text-900 fw-bold d-flex align-items-center ${activeItem === 1 ? '' : ''}`} 
											onClick={() => handleActiveItem(1)}
										>
											<h6 className="m-0">What are the key benefits of using <span className="text-primary">Infinia System</span></h6>
											<span className="ms-auto arrow me-2">
												<svg xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
													<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</span>
										</a>
									</div>
									{activeItem === 1 && (
										<div className="card-body px-0 mt-2">
											<p className="text-black-50 mb-0">
												We start with a comprehensive analysis of your current brand and online presence, followed by a tailored strategy to improve your brand identity, optimize your website for search engines, and create a cohesive branding plan.
											</p>
										</div>
									)}
								</div>
								
								<div className="mb-3 card p-3 border rounded-3">
									<div className="px-0 card-header border-0">
										<a 
											className={`pointer text-900 fw-bold d-flex align-items-center ${activeItem === 2 ? '' : ''}`} 
											onClick={() => handleActiveItem(2)}
										>
											<h6 className="m-0">What features does <span className="text-primary">Infinia</span> offer?</h6>
											<span className="ms-auto arrow me-2">
												<svg xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
													<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</span>
										</a>
									</div>
									{activeItem === 2 && (
										<div className="card-body px-0 mt-2">
											<p className="text-black-50 mb-0">
												We start with a comprehensive analysis of your current brand and online presence, followed by a tailored strategy to improve your brand identity, optimize your website for search engines, and create a cohesive branding plan.
											</p>
										</div>
									)}
								</div>
								
								<div className="mb-3 card p-3 border rounded-3">
									<div className="px-0 card-header border-0">
										<a 
											className={`pointer text-900 fw-bold d-flex align-items-center ${activeItem === 3 ? '' : ''}`} 
											onClick={() => handleActiveItem(3)}
										>
											<h6 className="m-0">How do your services work?</h6>
											<span className="ms-auto arrow me-2">
												<svg xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
													<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</span>
										</a>
									</div>
									{activeItem === 3 && (
										<div className="card-body px-0 mt-2">
											<p className="text-black-50 mb-0">
												We start with a comprehensive analysis of your current brand and online presence, followed by a tailored strategy to improve your brand identity, optimize your website for search engines, and create a cohesive branding plan.
											</p>
										</div>
									)}
								</div>
								
								<div className="mb-3 card p-3 border rounded-3">
									<div className="px-0 card-header border-0">
										<a 
											className={`pointer text-900 fw-bold d-flex align-items-center ${activeItem === 4 ? '' : ''}`} 
											onClick={() => handleActiveItem(4)}
										>
											<h6 className="m-0">What is SEO and why do I need it?</h6>
											<span className="ms-auto arrow me-2">
												<svg xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
													<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</span>
										</a>
									</div>
									{activeItem === 4 && (
										<div className="card-body px-0 mt-2">
											<p className="text-black-50 mb-0">
												We start with a comprehensive analysis of your current brand and online presence, followed by a tailored strategy to improve your brand identity, optimize your website for search engines, and create a cohesive branding plan.
											</p>
										</div>
									)}
								</div>
								
								<div className="mb-3 card p-3 border rounded-3">
									<div className="px-0 card-header border-0">
										<a 
											className={`pointer text-900 fw-bold d-flex align-items-center ${activeItem === 5 ? '' : ''}`} 
											onClick={() => handleActiveItem(5)}
										>
											<h6 className="m-0">What SEO strategies do you use?</h6>
											<span className="ms-auto arrow me-2">
												<svg xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
													<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</span>
										</a>
									</div>
									{activeItem === 5 && (
										<div className="card-body px-0 mt-2">
											<p className="text-black-50 mb-0">
												We start with a comprehensive analysis of your current brand and online presence, followed by a tailored strategy to improve your brand identity, optimize your website for search engines, and create a cohesive branding plan.
											</p>
										</div>
									)}
								</div>
							</div>
						</div>
						<div className="col-lg-6 mt-lg-0 mt-2">
							<div className="accordion">
								<div className="mb-3 card p-3 border rounded-3">
									<div className="px-0 card-header border-0">
										<a 
											className={`pointer text-900 fw-bold d-flex align-items-center ${activeItem === 6 ? '' : ''}`} 
											onClick={() => handleActiveItem(6)}
										>
											<h6 className="m-0">How can you help with identity development?</h6>
											<span className="ms-auto arrow me-2">
												<svg xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
													<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</span>
										</a>
									</div>
									{activeItem === 6 && (
										<div className="card-body px-0 mt-2">
											<p className="text-black-50 mb-0">
												We start with a comprehensive analysis of your current brand and online presence, followed by a tailored strategy to improve your brand identity, optimize your website for search engines, and create a cohesive branding plan.
											</p>
										</div>
									)}
								</div>
								
								<div className="mb-3 card p-3 border rounded-3">
									<div className="px-0 card-header border-0">
										<a 
											className={`pointer text-900 fw-bold d-flex align-items-center ${activeItem === 7 ? '' : ''}`} 
											onClick={() => handleActiveItem(7)}
										>
											<h6 className="m-0">What is your process for starting a project?</h6>
											<span className="ms-auto arrow me-2">
												<svg xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
													<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</span>
										</a>
									</div>
									{activeItem === 7 && (
										<div className="card-body px-0 mt-2">
											<p className="text-black-50 mb-0">
												We start with a comprehensive analysis of your current brand and online presence, followed by a tailored strategy to improve your brand identity, optimize your website for search engines, and create a cohesive branding plan.
											</p>
										</div>
									)}
								</div>
								
								<div className="mb-3 card p-3 border rounded-3">
									<div className="px-0 card-header border-0">
										<a 
											className={`pointer text-900 fw-bold d-flex align-items-center ${activeItem === 8 ? '' : ''}`} 
											onClick={() => handleActiveItem(8)}
										>
											<h6 className="m-0">How much do your services cost?</h6>
											<span className="ms-auto arrow me-2">
												<svg xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
													<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</span>
										</a>
									</div>
									{activeItem === 8 && (
										<div className="card-body px-0 mt-2">
											<p className="text-black-50 mb-0">
												We start with a comprehensive analysis of your current brand and online presence, followed by a tailored strategy to improve your brand identity, optimize your website for search engines, and create a cohesive branding plan.
											</p>
										</div>
									)}
								</div>
								
								<div className="mb-3 card p-3 border rounded-3">
									<div className="px-0 card-header border-0">
										<a 
											className={`pointer text-900 fw-bold d-flex align-items-center ${activeItem === 9 ? '' : ''}`} 
											onClick={() => handleActiveItem(9)}
										>
											<h6 className="m-0">How long does it take to see results?</h6>
											<span className="ms-auto arrow me-2">
												<svg xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
													<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</span>
										</a>
									</div>
									{activeItem === 9 && (
										<div className="card-body px-0 mt-2">
											<p className="text-black-50 mb-0">
												We start with a comprehensive analysis of your current brand and online presence, followed by a tailored strategy to improve your brand identity, optimize your website for search engines, and create a cohesive branding plan.
											</p>
										</div>
									)}
								</div>
								
								<div className="mb-3 card p-3 border rounded-3">
									<div className="px-0 card-header border-0">
										<a 
											className={`pointer text-900 fw-bold d-flex align-items-center ${activeItem === 10 ? '' : ''}`} 
											onClick={() => handleActiveItem(10)}
										>
											<h6 className="m-0">Do you offer ongoing support?</h6>
											<span className="ms-auto arrow me-2">
												<svg xmlns="http://www.w3.org/2000/svg" width={13} height={8} viewBox="0 0 13 8" fill="none">
													<path className="stroke-dark" d="M11.5 1L6.25 6.5L1 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</span>
										</a>
									</div>
									{activeItem === 10 && (
										<div className="card-body px-0 mt-2">
											<p className="text-black-50 mb-0">
												We start with a comprehensive analysis of your current brand and online presence, followed by a tailored strategy to improve your brand identity, optimize your website for search engines, and create a cohesive branding plan.
											</p>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className="ellipse-center position-absolute top-50 start-50 translate-middle z-0" />
				</div>
			</section>
		</>
	)
}
