'use client'
import { useEffect, useRef, useState, useCallback } from 'react';
import projectsData from '@/data/projects.json';
import Link from 'next/link';

interface Services5Props {
	previewData?: any;
}

// Function to convert title to slug
const slugify = (text: string) => {
	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-')        // Replace spaces with -
		.replace(/[^\w\-]+/g, '')    // Remove all non-word chars
		.replace(/\-\-+/g, '-')      // Replace multiple - with single -
		.replace(/^-+/, '')          // Trim - from start of text
		.replace(/-+$/, '');         // Trim - from end of text
};

export default function Services5({ previewData }: Services5Props) {
	const isotope = useRef<any>(null);
	const [filterKey, setFilterKey] = useState<string>('*');
	const editorData = previewData?.services5 || {};

	useEffect(() => {
		// Import Isotope dynamically only on the client side
		if (typeof window !== 'undefined') {
			// Dynamic import
			import('isotope-layout').then(({ default: Isotope }) => {
				// Initialize isotope after the component is mounted
				isotope.current = new Isotope('.masonary-active', {
					itemSelector: '.filter-item',
					percentPosition: true,
					masonry: {
						columnWidth: '.filter-item',
					},
				});
			});
		}
	}, []);

	useEffect(() => {
		if (isotope.current) {
			isotope.current.arrange({ filter: filterKey === '*' ? '*' : `.${filterKey}` });
		}
	}, [filterKey]);

	const handleFilterKeyChange = useCallback((key: string) => () => {
		setFilterKey(key)
	}, [])

	const activeBtn = (value: string) => (value === filterKey ? "active btn btn-md btn-filter mb-2 me-2" : "btn btn-md btn-filter mb-2 me-2")

	// Use editor data if available, otherwise use the default data
	const title = editorData.title || "Explore Our Projects";
	const subtitle = editorData.subtitle || "What we offers";
	const description = editorData.description || "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.";
	const buttonText = editorData.buttonText || "Get Free Quote";
	const buttonLink = editorData.buttonLink || "#";
	const linkText = editorData.linkText || "How We Work";
	const linkUrl = editorData.linkUrl || "#";
	const backgroundColor = editorData.backgroundColor || "#ffffff";
	const titleColor = editorData.titleColor || "#333333";
	const buttonColor = editorData.buttonColor || "#6342EC";

	// Style objects for dynamic styling
	const sectionStyle = {
		backgroundColor: backgroundColor
	};

	const titleStyle = {
		color: titleColor
	};

	const buttonStyle = {
		backgroundColor: buttonColor,
		borderColor: buttonColor
	};

	return (
		<>
			{/* Services 5 */}
			<section className="section-team-1 position-relative fix section-padding" style={sectionStyle}>
				<div className="container position-relative z-2">
					<div className="text-center">
						<div className="d-flex align-items-center justify-content-center bg-primary-soft border border-2 border-white d-inline-flex rounded-pill px-4 py-2" data-aos="zoom-in" data-aos-delay={100}>
							<img src="/assets/imgs/features-1/dots.png" alt="infinia" />
							<span className="tag-spacing fs-7 fw-bold text-linear-2 ms-2 text-uppercase">{subtitle}</span>
						</div>
						<h3 className="ds-3 my-3" style={titleStyle}>{title}</h3>
						<p className="fs-5">
							{description}
						</p>
					</div>
					<div className="text-center mt-6">
						<div className="button-group filter-button-group filter-menu-active">
							{projectsData.categories.map((category) => (
								<button key={category.id} className={activeBtn(category.id === "all" ? "*" : category.id)} onClick={handleFilterKeyChange(category.id === "all" ? "*" : category.id)}>
									{category.name}
								</button>
							))}
						</div>
					</div>
				</div>
				<div className="container mt-6">
					<div className="masonary-active justify-content-between row">
						<div className="grid-sizer" />
						{projectsData.projects.map((project) => (
							<div key={project.id} className={`filter-item col-12 col-md-4 ${project.categories.join(' ')}`}>
								<div className="project-item zoom-img rounded-2 fix position-relative">
									<div style={{ height: '300px', overflow: 'hidden' }}>
										<img 
											className="rounded-2 w-100 h-100" 
											src={project.image} 
											alt="infinia" 
											style={{ objectFit: 'cover', objectPosition: 'center' }}
										/>
									</div>
									<Link href={`/${slugify(project.title)}`} className="card-team text-start rounded-3 position-absolute bottom-0 start-0 end-0 z-1 backdrop-filter w-auto p-4 m-3 ">
										<span className="shadow-sm d-flex align-items-center bg-white-keep d-inline-flex rounded-pill px-2 py-1 mb-3">
											<span className="bg-primary fs-9 fw-bold rounded-pill px-2 py-1 text-white">Get</span>
											<span className="fs-7 fw-medium text-primary mx-2">Free Update</span>
											<svg xmlns="http://www.w3.org/2000/svg" width={18} height={19} viewBox="0 0 18 19" fill="none">
												<path d="M10.3125 5.5625L14.4375 9.5L10.3125 13.4375" stroke="#6D4DF2" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
												<path d="M14.25 9.5H3.5625" stroke="#6D4DF2" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</span>
										<h5 className="text-700">{project.title}</h5>
										<p className="fs-7 mb-0">{project.description}</p>
									</Link>
									<Link href={`/${slugify(project.title)}`} className="position-absolute w-100 h-100 top-0 start-0" aria-label={project.title} />
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="container">
					<div className="row mt-6">
						<div className="col-lg-7">
							<div className="d-flex align-items-center justify-content-lg-end justify-content-center">
								<a href={buttonLink} className="btn btn-gradient" style={buttonStyle}>
									{buttonText}
									<svg className="ms-2" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
										<path className="stroke-white" d="M17.25 15.25V6.75H8.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										<path className="stroke-white" d="M17 7L6.75 17.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</a>
								<a href={linkUrl} className="ms-5 text-decoration-underline fw-bold">{linkText}</a>
							</div>
						</div>
					</div>
				</div>
				<div className="position-absolute top-0 start-50 translate-middle-x z-0">
					<img src="/assets/imgs/service-2/bg-line.png" alt="infinia" />
				</div>
				<div className="rotate-center ellipse-rotate-success position-absolute z-1" />
				<div className="rotate-center-rev ellipse-rotate-primary position-absolute z-1" />
			</section>
		</>
	)
}
