'use client'
import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { getAllServices } from '@/redux/actions/serviceActions';
import { getOther } from '@/redux/actions/otherActions';
import { AppDispatch, RootState } from '@/redux/store';
import { Loader2 } from 'lucide-react';

interface Services5Props {
	previewData?: any;
	services?: any[];
	categories?: { id: string; name: string }[];
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
	const containerRef = useRef<HTMLDivElement>(null);
	const [filterKey, setFilterKey] = useState<string>('*');
	const [data, setData] = useState<any>(null);
	const [isotopeReady, setIsotopeReady] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const { services, loading: servicesLoading, error } = useSelector((state: RootState) => state.service);
	const { other, loading: otherLoading } = useSelector((state: RootState) => state.other);

	// Extract unique categories from services
	const categories = services ? 
		[...new Set(services.flatMap(service => service.categories || []))]
			.filter(category => category)
			.map(category => ({ 
				id: typeof category === 'string' ? category.replace(/\s+/g, '-').toLowerCase() : category, 
				name: category 
			})) 
		: [];

	useEffect(() => {
		// Fetch services if not provided
		dispatch(getAllServices());
		
		// Also fetch other data if not provided in preview
		if (!previewData) {
			dispatch(getOther());
		}
	}, [dispatch, previewData]);

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.services5) {
			setData(previewData.services5);
		} 
		// Otherwise use Redux data
		else if (other && other.services5) {
			setData(other.services5);
		}
	}, [previewData, other]);

	// Initialize Isotope when services and container are ready
	useEffect(() => {
		// Check if we have services data and the container is rendered
		if (!services || services.length === 0 || !containerRef.current) {
			return;
		}

		// Import Isotope dynamically only on the client side
		if (typeof window !== 'undefined') {
			const initializeIsotope = async () => {
				try {
					// Clean up existing instance if it exists
					if (isotope.current) {
						isotope.current.destroy();
						isotope.current = null;
					}

					const { default: Isotope } = await import('isotope-layout');
					
					// Make sure container still exists after async import
					if (containerRef.current) {
						isotope.current = new Isotope(containerRef.current, {
							itemSelector: '.filter-item',
							percentPosition: true,
							masonry: {
								columnWidth: '.filter-item',
							},
						});
						setIsotopeReady(true);
						
						// Arrange items based on current filter
						if (filterKey !== '*') {
							isotope.current.arrange({ filter: `.${filterKey}` });
						}
					}
				} catch (error) {
					console.error('Error initializing Isotope:', error);
				}
			};

			// Initialize with a slight delay to ensure DOM is ready
			const timer = setTimeout(() => {
				initializeIsotope();
			}, 100);

			return () => {
				clearTimeout(timer);
				// Cleanup on unmount
				if (isotope.current) {
					isotope.current.destroy();
				}
			};
		}
	}, [services]); // Re-run when services change

	// Apply filter when filterKey changes
	useEffect(() => {
		if (isotope.current && isotopeReady) {
			const filterSelector = filterKey === '*' ? '*' : `.${filterKey.replace(/\s+/g, '-').toLowerCase()}`;
			isotope.current.arrange({ filter: filterSelector });
		}
	}, [filterKey, isotopeReady]);

	const handleFilterKeyChange = useCallback((key: string) => () => {
		setFilterKey(key)
	}, [])

	const activeBtn = (value: string) => (value === filterKey ? "active btn btn-md btn-filter mb-2 me-2" : "btn btn-md btn-filter mb-2 me-2")

	if (servicesLoading || otherLoading || !data) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<p className="text-red-500">Error: {error}</p>
			</div>
		);
	}

	// Create styles for customizable elements
	const sectionStyle = {
		backgroundColor: data.backgroundColor || "#ffffff"
	};

	const titleStyle = {
		color: data.titleColor || "#333333"
	};

	const subtitleStyle = {
		backgroundColor: data.subtitleVisible !== false ? (data.subtitleBackgroundColor || "#f1f0fe") : "transparent",
		color: data.subtitleTextColor || "#6342EC"
	};

	const descriptionStyle = {
		color: data.descriptionColor || "#6E6E6E"
	};

	const buttonStyle = {
		backgroundColor: data.buttonColor || "#6342EC",
		color: data.buttonTextColor || "#FFFFFF"
	};

	return (
		<>
			{/* Services 5 */}
			<section className="section-team-1 position-relative fix section-padding" style={sectionStyle}>
				<div className="container position-relative z-2">
					<div className="text-center">
						{data.subtitleVisible !== false && (
							<div className="d-flex align-items-center justify-content-center bg-primary-soft border border-2 border-white d-inline-flex rounded-pill px-4 py-2" data-aos="zoom-in" data-aos-delay={100} style={subtitleStyle}>
								<span className="tag-spacing fs-7 fw-bold ms-2 text-uppercase">{data.subtitle}</span>
							</div>
						)}
						<h3 className="ds-3 my-3" style={titleStyle}>{data.title}</h3>
						<p className="fs-5" style={descriptionStyle}>
							{data.description}
						</p>
					</div>
					<div className="text-center mt-6">
						<div className="button-group filter-button-group filter-menu-active">
							<button className={activeBtn("*")} onClick={handleFilterKeyChange("*")}>
								Hepsi
							</button>
							{Array.isArray(categories) && categories.length > 0 && categories.map((category) => (
								<button 
									key={category.id} 
									className={activeBtn(category.id)} 
									onClick={handleFilterKeyChange(category.id)}
								>
									{category.name}
								</button>
							))}
						</div>
					</div>
					{data.buttonVisible !== false && (
						<div className="text-center mt-4">
							<Link href={data.buttonLink || "#"} className="btn btn-primary" style={buttonStyle}>
								{data.buttonText}
							</Link>
						</div>
					)}
					{data.linkVisible !== false && (
						<div className="text-center mt-2">
							<Link href={data.linkUrl || "#"} className="text-decoration-underline">
								{data.linkText}
							</Link>
						</div>
					)}
				</div>
				<div className="container mt-6">
					<div ref={containerRef} className="masonary-active justify-content-between row">
						<div className="grid-sizer" />
						{services && services.map((service) => {
							// Create a standardized format for category classes
							const categoryClasses = Array.isArray(service.categories) 
								? service.categories.map((cat: string) => 
									typeof cat === 'string' ? cat.replace(/\s+/g, '-').toLowerCase() : ''
								).join(' ') 
								: '';
								
							return (
								<div 
									key={service._id || service.id} 
									className={`filter-item col-12 col-md-4 ${categoryClasses}`}
								>
									<div className="project-item zoom-img rounded-2 fix position-relative">
										<div style={{ height: '300px', overflow: 'hidden' }}>
											<img 
												className="rounded-2 w-100 h-100" 
												src={service.image} 
												alt="infinia" 
												style={{ objectFit: 'cover', objectPosition: 'center' }}
											/>
										</div>
										<Link 
											href={`/${slugify(service.title)}`} 
											className="card-team text-start rounded-3 position-absolute bottom-0 start-0 end-0 z-1 backdrop-filter w-auto p-4 m-3 d-block" 
											style={{ 
												opacity: 1, 
												visibility: 'visible', 
												transform: 'none', 
												transition: 'none' 
											}}
										>
											<h5 className="text-700">{service.title}</h5>
											<p className="fs-7 mb-0">{service.description}</p>
										</Link>
										<Link href={`/${slugify(service.title)}`} className="position-absolute w-100 h-100 top-0 start-0" aria-label={service.title} />
									</div>
								</div>
							);
						})}
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
