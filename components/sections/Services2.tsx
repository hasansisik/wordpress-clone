'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getOther } from "@/redux/actions/otherActions"
import { AppDispatch, RootState } from "@/redux/store"

interface Services2Props {
	previewData?: any;
}

export default function Services2({ previewData }: Services2Props = {}) {
	const [data, setData] = useState<any>(null)
	const dispatch = useDispatch<AppDispatch>()
	const { other, loading } = useSelector((state: RootState) => state.other)

	useEffect(() => {
		// Fetch other data if not provided in preview
		if (!previewData) {
			dispatch(getOther())
		}
	}, [dispatch, previewData])
		
	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.services2) {
			setData(previewData.services2);
		} 
		// Otherwise use Redux data
		else if (other && other.services2) {
			setData(other.services2);
		}
	}, [previewData, other])

	if (!data || loading) {
		return <section>Loading Services2...</section>
	}

	return (
		<>
			<section className="section-team-1 position-relative fix section-padding">
				<div className="container position-relative z-2">
					<div className="text-center">
						<div className="d-flex align-items-center justify-content-center bg-primary-soft border border-2 border-white d-inline-flex rounded-pill px-4 py-2" data-aos="zoom-in" data-aos-delay={100}>
							<img src={data.tagImage} alt="infinia" />
							<span className="tag-spacing fs-7 fw-bold text-linear-2 ms-2 text-uppercase">{data.heading.tag}</span>
						</div>
						<h3 className="ds-3 my-3 fw-regular" dangerouslySetInnerHTML={{ __html: data.heading.title }}></h3>
					</div>
					<div className="row mt-6 position-relative">
						{data.services.map((service: any, index: number) => (
							<div key={index} className="col-lg-4 col-md-6">
								<div className="p-2 rounded-4 shadow-1 bg-white position-relative z-1 hover-up mb-4">
									<div className="card-service bg-white p-6 border rounded-4 text-center">
										<div className="icon-flip position-relative icon-shape icon-xxl rounded-3 me-5">
											<div className="icon">
												<img src={service.icon} alt="infinia" />
											</div>
										</div>
										<h5 className="my-3">{service.title}</h5>
										<p className="mb-6">{service.description}</p>
									</div>
								</div>
							</div>
						))}
						<svg className="position-absolute top-50 start-50 translate-middle z-0" xmlns="http://www.w3.org/2000/svg" width={828} height={699} viewBox="0 0 828 699" fill="none">
							<path className="fill-primary-soft" d="M0 130.481C0 110.236 15.1267 93.1822 35.2276 90.7667L783.228 0.880261C807.04 -1.98124 828 16.611 828 40.5945V533.155C828 552.691 813.888 569.369 794.622 572.603L46.6224 698.173C22.2271 702.269 0 683.462 0 658.725V130.481Z" fill="#F5EEFF" />
						</svg>
					</div>
				</div>
				<div className="position-absolute top-0 start-50 translate-middle-x z-0">
					<img src={data.backgroundImage} alt="infinia" />
				</div>
				<div className="rotate-center ellipse-rotate-success position-absolute z-1" />
				<div className="rotate-center-rev ellipse-rotate-primary position-absolute z-1" />
			</section>
		</>
	)
}
