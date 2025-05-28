import Link from "next/link"

export default function Cta3() {
	return (
		<>
			<section className="section-cta-12 bg-3 position-relative section-padding fix">
					<div className="container">
						<div className="row">
							<div className="col-lg-5">
								<div className="d-flex align-items-center justify-content-center bg-primary-soft border border-2 border-white d-inline-flex rounded-pill px-4 py-2" data-aos="zoom-in" data-aos-delay={100}>
									<img src="/assets/imgs/features-1/dots.png" alt="infinia" />
									<span className="tag-spacing fs-7 fw-bold text-linear-2 ms-2 text-uppercase">Our History</span>
								</div>
								<h5 className="ds-5 my-3">A Journey of <br className="d-none d-md-inline" />
									Innovation and Growth</h5>
								<p className="fs-5 text-500 mb-8">Loved By Developers Trusted By Enterprises</p>
								<div className="d-flex align-items-center mt-5">
									<Link href="#" className="btn btn-gradient">
										Get Free Quote
										<svg className="ms-2" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
											<path className="stroke-white" d="M17.25 15.25V6.75H8.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											<path className="stroke-white" d="M17 7L6.75 17.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</Link>
									<Link href="#" className="ms-5 fw-bold">How We Work</Link>
								</div>
							</div>
							<div className="col-lg-6 offset-lg-1 mt-lg-0 mt-8">
								<p className="fs-5 text-900 mb-5"><span className="fw-bold">Infinia</span> was founded with a passion for technology and a desire to make a difference in the digital world. From our humble beginnings, we have grown into a reputable and sought-after web development agency, serving a diverse range of clients across various industries. Over the years, <span className="fw-bold">we have successfully delivered countless projects</span>, each one a testament to our dedication, expertise, and innovative approach. Our journey has been marked by <span className="fw-bold">continuous growth, learning, and adaptation,</span> and we are proud of the milestones we have achieved along the way.</p>
								<p className="fs-5 text-900 mb-5">Thank you for considering <span className="fw-bold">Infinia</span> as your web development partner. We look forward to helping you achieve your <span className="fw-bold">digital goals and creating a lasting impact</span> on your business.</p>
								<div className="d-flex">
									<img className="rounded-circle border border-5 border-primary-light" src="/assets/imgs/cta-12/avatar-1.png" alt="" />
									<div className="ms-2">
										<img className="filter-invert" src="/assets/imgs/cta-12/name.svg" alt="" />
										<h6 className="mt-1 mb-0">Kensei <span className="text-500 fs-6">, CEO</span></h6>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
		</>
	)
}
