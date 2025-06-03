'use client'
import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { getAllHizmetler } from '@/redux/actions/hizmetActions';
import { getOther } from '@/redux/actions/otherActions';
import { AppDispatch, RootState } from '@/redux/store';
import { Loader2 } from 'lucide-react';

interface Services5Props {
	previewData?: any;
	hizmetler?: any[];
	categories?: { id: string; name: string }[];
}

// Function to convert title to slug
const slugify = (text: string) => {
	// Turkish character mapping
	const turkishMap: {[key: string]: string} = {
		'ç': 'c', 'Ç': 'C',
		'ğ': 'g', 'Ğ': 'G',
		'ı': 'i', 'İ': 'I',
		'ö': 'o', 'Ö': 'O',
		'ş': 's', 'Ş': 'S',
		'ü': 'u', 'Ü': 'U'
	};
	
	// Replace Turkish characters
	let result = text.toString();
	for (const [turkishChar, latinChar] of Object.entries(turkishMap)) {
		result = result.replace(new RegExp(turkishChar, 'g'), latinChar);
	}
	
	return result
		.toLowerCase()
		.replace(/\s+/g, '-')        // Replace spaces with -
		.replace(/[^\w\-]+/g, '')    // Remove all non-word chars
		.replace(/\-\-+/g, '-')      // Replace multiple - with single -
		.replace(/^-+/, '')          // Trim - from start of text
		.replace(/-+$/, '');         // Trim - from end of text
};

// Function to truncate text
const truncateText = (text: string, maxLength: number = 120) => {
	if (!text) return '';
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength) + '...';
};

export default function Services5({ previewData }: Services5Props) {
	const isotope = useRef<any>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [filterKey, setFilterKey] = useState<string>('*');
	const [data, setData] = useState<any>(null);
	const [isotopeReady, setIsotopeReady] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const { hizmetler, loading: hizmetlerLoading, error } = useSelector((state: RootState) => state.hizmet);
	const { other, loading: otherLoading } = useSelector((state: RootState) => state.other);

	// Extract unique categories from hizmetler and standardize their IDs
	const categories = hizmetler ? 
		[...new Set(hizmetler.flatMap(hizmet => hizmet.categories || []))]
			.filter(category => category)
			.map(category => ({ 
				id: typeof category === 'string' ? slugify(category) : '', 
				name: category 
			})) 
		: [];

	useEffect(() => {
		// Fetch hizmetler if not provided
		dispatch(getAllHizmetler());
		
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

	const initializeIsotope = useCallback(async () => {
		// Check if we have hizmetler data and the container is rendered
		if (!hizmetler || hizmetler.length === 0 || !containerRef.current) {
			return;
		}

		try {
			// Clean up existing instance if it exists
			if (isotope.current) {
				isotope.current.destroy();
				isotope.current = null;
			}

			const { default: Isotope } = await import('isotope-layout');
			
			// Make sure container still exists after async import
			if (containerRef.current) {
				// Initialize with fitRows layout instead of masonry for more consistent alignment
				isotope.current = new Isotope(containerRef.current, {
					itemSelector: '.filter-item',
					layoutMode: 'fitRows',
					fitRows: {
						gutter: 0
					}
				});
				setIsotopeReady(true);
				
				// Apply the current filter immediately
				if (filterKey !== '*') {
					isotope.current.arrange({ filter: `.${filterKey}` });
				}
			}
		} catch (error) {
			console.error('Error initializing Isotope:', error);
		}
	}, [hizmetler, filterKey]);

	// Initialize Isotope when hizmetler and container are ready
	useEffect(() => {
		// Only run on client-side
		if (typeof window === 'undefined') return;

		// Initialize with a slight delay to ensure DOM is ready
		const timer = setTimeout(() => {
			initializeIsotope();
		}, 300);

		return () => {
			clearTimeout(timer);
			// Cleanup on unmount
			if (isotope.current) {
				isotope.current.destroy();
			}
		};
	}, [hizmetler, initializeIsotope]);

	// Apply filter when filterKey changes and isotope is ready
	useEffect(() => {
		if (isotope.current && isotopeReady) {
			const filterSelector = filterKey === '*' ? '*' : `.${filterKey}`;
			isotope.current.arrange({ filter: filterSelector });
		}
	}, [filterKey, isotopeReady]);

	// Re-layout isotope when window is resized
	useEffect(() => {
		if (typeof window === 'undefined') return;

		const handleResize = () => {
			if (isotope.current) {
				isotope.current.layout();
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [isotopeReady]);

	const handleFilterKeyChange = useCallback((key: string) => () => {
		setFilterKey(key);
	}, []);

	const activeBtn = (value: string) => {
		if (value === filterKey) {
			return " btn btn-md btn-filter mb-2 me-2";
		}
		return "btn btn-md btn-filter mb-2 me-2";
	};

	if (hizmetlerLoading || otherLoading || !data) {
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

	// Create styles for filter buttons
	const activeFilterButtonStyle = {
		backgroundColor: data.filterButtonColor || "#6342EC",
		color: data.filterButtonTextColor || "#FFFFFF"
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
							<button 
								className={activeBtn("*")} 
								onClick={handleFilterKeyChange("*")}
								style={filterKey === "*" ? activeFilterButtonStyle : undefined}
							>
								{data.filterAllText || "Hepsi"}
							</button>
							{Array.isArray(categories) && categories.length > 0 && categories.map((category) => (
								<button 
									key={category.id} 
									className={activeBtn(category.id)} 
									onClick={handleFilterKeyChange(category.id)}
									style={filterKey === category.id ? activeFilterButtonStyle : undefined}
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
					<div ref={containerRef} className="row">
						{hizmetler && hizmetler.map((hizmet, index) => {
							// Process categories to ensure consistent slugification
							const categoryClasses = Array.isArray(hizmet.categories) 
								? hizmet.categories.map((cat: string) => 
									typeof cat === 'string' ? slugify(cat) : ''
								).filter(Boolean).join(' ') 
								: '';
								
							return (
								<div 
									key={hizmet._id || hizmet.id} 
									className={`filter-item col-12 col-md-4 mb-4 ${categoryClasses}`}
								>
									<div className="card border-0 rounded-3 mt-8 position-relative w-100 bg-gray-50" data-aos="fade-zoom-in" data-aos-delay={(index + 1) * 100}>
										<div className="blog-image-container" style={{ height: '220px', width: '100%', overflow: 'hidden', position: 'relative' }}>
											<img 
												className="rounded-top-3" 
												src={hizmet.image} 
												alt={hizmet.title || "Hizmet image"} 
												style={{ 
													width: '100%', 
													height: '100%', 
													objectFit: 'cover',
													objectPosition: 'center'
												}} 
											/>
											<div className="position-absolute bottom-0 left-0 w-100" style={{
												background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))',
												height: '100px'
											}}></div>
										</div>
										<div className="card-body p-0">
											{hizmet.categories && hizmet.categories.length > 0 && (
												<Link 
													href={`/hizmetler?category=${encodeURIComponent(hizmet.categories[0])}`} 
													className="position-relative z-1 d-inline-flex rounded-pill px-3 py-2 mt-3"
													style={{ backgroundColor: '#f5f5f5', color: '#333333' }}
												>
													<span className="tag-spacing fs-7 fw-bold text-uppercase">{hizmet.categories[0]}</span>
												</Link>
											)}
											<h6 className="my-3 text-gray-800">{hizmet.title}</h6>
											<p className="text-gray-700">{truncateText(hizmet.description)}</p>
										</div>
										<Link href={`/${slugify(hizmet.title)}`} className="position-absolute bottom-0 start-0 end-0 top-0 z-0" aria-label={hizmet.title} />
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
			<style jsx>{`
				.card {
					display: block;
					width: 100%;
				}
				.blog-image-container {
					width: 100%;
				}
			`}</style>
		</>
	)
}
