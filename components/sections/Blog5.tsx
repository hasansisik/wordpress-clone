"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import otherData from "@/data/other.json"

interface Blog5Props {
	previewData?: any;
}

export default function Blog5({ previewData }: Blog5Props = {}) {
	const [data, setData] = useState<any>(null)

	useEffect(() => {
		console.log("Blog5 previewData:", previewData);
		
		// If preview data is provided, use it, otherwise load from the file
		if (previewData && previewData.blog5) {
			console.log("Setting from previewData", previewData.blog5);
			setData(previewData.blog5);
		} else if (otherData.blog5) {
			console.log("Setting from local otherData", otherData.blog5);
			setData(otherData.blog5);
		} else {
			console.error("No blog data available in Blog5 component");
		}
	}, [previewData])

	if (!data) {
		return <section>Loading Blog5...</section>
	}

	return (
		<>
			<section className="section-blog-6 section-padding border-bottom">
				<div className="container">
					<div className="row align-items-end">
						<div className="col">
							<h5 className="ds-5 mt-3 mb-3">{data.title}</h5>
							<span className="fs-5 fw-medium">{data.subtitle}</span>
						</div>
					</div>
					<div className="row">
						{data.articles.map((article: any, index: number) => (
							<div key={index} className="col-lg-4 col-md-6 text-start">
								<div className="card border-0 rounded-3 mt-4 position-relative d-inline-flex">
									<img className="rounded-top-3" src={article.image} alt="blog post" />
									<div className="card-body bg-white p-0">
										<Link href={article.link} className="bg-primary-soft position-relative z-1 d-inline-flex rounded-pill px-3 py-2 mt-3">
											<span className="tag-spacing fs-7 fw-bold text-linear-2 text-uppercase">{article.category}</span>
										</Link>
										<h6 className="my-3">{article.title}</h6>
										<p>{article.description}</p>
									</div>
									<Link href={article.link} className="position-absolute bottom-0 start-0 end-0 top-0 z-0" />
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="container">
					<div className="row pt-5 text-start">
						<div className="d-flex justify-content-start align-items-center">
							<nav aria-label="Page navigation example">
								<ul className="pagination gap-2">
									<li className="page-item">
										<Link className="icon-xl fs-5 page-link pagination_item border-0 rounded-circle icon-shape fw-bold bg-neutral-100 text-900" href="#" aria-label="Previous">
											<svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 22 22" fill="none">
												<path className="stroke-dark" d="M9.49554 6.5L4.78125 11L9.49554 15.5" stroke="#111827" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
												<path className="stroke-dark" d="M17.2143 11H5" stroke="#111827" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</Link>
									</li>
									<li className="page-item">
										<Link className="icon-xl fs-5 page-link pagination_item border-0 rounded-circle icon-shape fw-bold bg-neutral-100 text-900" href="#">1</Link>
									</li>
									<li className="page-item">
										<Link className="icon-xl fs-5 page-link pagination_item border-0 rounded-circle icon-shape fw-bold bg-neutral-100 text-900" href="#">2</Link>
									</li>
									<li className="page-item">
										<Link className="icon-xl fs-5 page-link pagination_item border-0 rounded-circle icon-shape fw-bold bg-neutral-100 text-900" href="#">3</Link>
									</li>
									<li className="page-item">
										<Link className="icon-xl fs-5 page-link pagination_item border-0 rounded-circle icon-shape fw-bold bg-neutral-100 text-900" href="#">...</Link>
									</li>
									<li className="page-item">
										<Link className="icon-xl fs-5 page-link pagination_item border-0 rounded-circle icon-shape fw-bold bg-neutral-100 text-900" href="#" aria-label="Next">
											<svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 22 22" fill="none">
												<path className="stroke-dark" d="M12.5 6.5L17.2143 11L12.5 15.5" stroke="#111827" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
												<path className="stroke-dark" d="M16.9955 11H4.78125" stroke="#111827" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</Link>
									</li>
								</ul>
							</nav>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
