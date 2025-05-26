import Link from 'next/link'
import { useEffect, useState } from 'react'
import footerData from '@/data/footer.json'

// Define the interface for component props
interface FooterProps {
	logo?: {
		src: string;
		alt: string;
		text: string;
	};
	copyright?: string;
	description?: string;
	socialLinks?: any[];
	columns?: any[];
	contactItems?: {
		address: string;
		phone: string;
		email: string;
		hours: string;
	};
	showPrivacyLinks?: boolean;
	privacyLinks?: any[];
	showAppLinks?: boolean;
	appLinks?: any[];
	showInstagram?: boolean;
	instagramPosts?: any[];
}

export default function Footer2(props: FooterProps = {}) {
	const [data, setData] = useState<any>(null)

	useEffect(() => {
		// If props are provided, use them, otherwise load from the local data file
		if (Object.keys(props).length > 0) {

			setData(props);
		} else {
			setData(footerData);
		}
	}, [props])

	if (!data) {
		return <footer>Loading...</footer>
	}

	// Ensure data has all required properties with fallbacks
	const safeData = {
		logo: data.logo || { src: "/assets/imgs/logo/favicon.svg", alt: "logo", text: "Logo" },
		copyright: data.copyright || "Copyright © 2024. All Rights Reserved",
		description: data.description || "",
		socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
		columns: Array.isArray(data.columns) ? data.columns : [],
		privacyLinks: Array.isArray(data.privacyLinks) ? data.privacyLinks : [],
		instagramPosts: Array.isArray(data.instagramPosts) ? data.instagramPosts : [],
		showPrivacyLinks: data.showPrivacyLinks || false,
		showInstagram: data.showInstagram || false
	};

	return (
		<>
			<footer>
				<div className="section-footer">
					<div className="container-fluid bg-white">
						<div className=" container position-relative z-2">
							<div className="row py-90">
								<div className="col-lg-4 pe-10">
									<Link className="navbar-brand d-flex main-logo align-items-center" href="/">
										<img 
											src={safeData.logo.src} 
											alt={safeData.logo.alt}
											style={{ 
												maxWidth: '40px', 
												maxHeight: '40px', 
												width: 'auto', 
												height: 'auto', 
												objectFit: 'contain' 
											}} 
										/>
										<span>{safeData.logo.text}</span>
									</Link>
									<p className="text-900 fw-medium mt-3 mb-6 opacity-50">{safeData.description}</p>
									<div className="d-flex social-icons">
										{safeData.socialLinks.map((social: any, index: number) => (
											<Link key={social._id || `social-${index}`} href={social.link || "#"} className="text-900 border border-end-0 border-light border-opacity-10 icon-shape icon-md">
												{social.name === "Facebook" && (
													<svg xmlns="http://www.w3.org/2000/svg" width={10} height={17} viewBox="0 0 10 17" fill="none">
														<path d="M8.84863 9.20312H6.5415V16.0938H3.46533V9.20312H0.942871V6.37305H3.46533V4.18896C3.46533 1.72803 4.94189 0.34375 7.1875 0.34375C8.26416 0.34375 9.40234 0.559082 9.40234 0.559082V2.98926H8.14111C6.91064 2.98926 6.5415 3.72754 6.5415 4.52734V6.37305H9.2793L8.84863 9.20312Z" fill="#111827" />
													</svg>
												)}
												{social.name === "Twitter" && <i className="bi bi-twitter-x" />}
												{social.name === "LinkedIn" && <i className="bi bi-linkedin" />}
												{social.name === "Behance" && <i className="bi bi-behance" />}
												{social.name === "Instagram" && <i className="bi bi-instagram" />}
												{social.name === "YouTube" && <i className="bi bi-youtube" />}
												{social.name === "Pinterest" && <i className="bi bi-pinterest" />}
											</Link>
										))}
									</div>
								</div>
								<div className="col-lg-8">
									<div className="row">
										{safeData.columns.length > 0 ? (
											safeData.columns.map((column: any, colIndex: number) => (
												<div key={column._id || `column-${colIndex}`} className="col-lg-4 col-md-4 col-6">
													<h3 className="text-900 opacity-50 fs-6 fw-black text-uppercase pb-3">{column.title}</h3>
													<div className="d-flex flex-column align-items-start">
														{Array.isArray(column.links) && column.links.map((link: any, linkIndex: number) => (
															<Link key={link._id || `link-${colIndex}-${linkIndex}`} className="text-900 mb-2 fw-medium fs-6" href={link.link || "#"}>
																{link.name}
															</Link>
														))}
													</div>
												</div>
											))
										) : (
											<div className="col-12 text-center text-muted">
												No menu columns available
											</div>
										)}
									</div>
								</div>
							</div>

							<div className="position-relative pt-5 pb-8">
								{safeData.showInstagram && (
									<>
										<div className="row">
											<div className="col-lg-8">
												<h6 className="text-900 opacity-50 fw-bold">Instagram</h6>
												<div className="row">
													{safeData.instagramPosts.length > 0 ? (
														safeData.instagramPosts.map((post: string, index: number) => (
															<div key={`insta-${index}`} className="col-lg-3 col-md-4 col-6 mt-4">
																<img className="img-fluid w-100 rounded-3" src={post} alt={"instagram post " + (index + 1)} />
															</div>
														))
													) : (
														<div className="col-12 mt-2 text-muted">
															No Instagram posts available
														</div>
													)}
												</div>
											</div>
										</div>
									</>
								)}
							</div>
						</div>
					</div>
					<div className="container-fluid bg-primary-soft">
						<div className="container">
							<div className="row">
								<div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 py-4 border-top border-white border-opacity-10">
									<p className="text-900 opacity-50 mb-0 fs-7">{safeData.copyright}</p>
									{safeData.showPrivacyLinks && (
										<div className="d-flex">
											{safeData.privacyLinks.length > 0 ? (
												safeData.privacyLinks.map((link: any, index: number) => (
													<Link key={link._id || `privacy-${index}`} href={link.link || "#"} className="text-900 me-3"> {link.name} </Link>
												))
											) : (
												<span className="text-muted">No privacy links available</span>
											)}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</>
	)
}
