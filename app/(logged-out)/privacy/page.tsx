"use client"
import privacyData from "@/data/privacy.json"

export default function PagePrivacyPolicy() {
	const { hero, content } = privacyData;

	return (
		<>
			<section className="section-privacy-policy section-padding">
					<div className="container">
						<div className="text-center">
							<div className="d-flex align-items-center justify-content-center bg-primary-soft border border-2 border-white d-inline-flex rounded-pill px-4 py-2" data-aos="zoom-in" data-aos-delay={100}>
								<img src="/assets/imgs/features-1/dots.png" alt="infinia" />
								<span className="tag-spacing fs-7 fw-bold text-linear-2 ms-2 text-uppercase">{hero.title}</span>
							</div>
							<h3 className="ds-3 my-3">{hero.title}</h3>
							<p className="fs-5">
								{hero.description}
							</p>
						</div>
						<div className="row pt-110">
							<div className="col-lg-8 col-md-10 mx-md-auto">
								<div dangerouslySetInnerHTML={{ __html: content }} />
							</div>
						</div>
					</div>
				</section>
		</>
	)
}