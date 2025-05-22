import Link from 'next/link'
import { useEffect, useState } from 'react'
import footerData from '@/data/footer.json'

export default function Footer4() {
	const [data, setData] = useState<any>(null)

	useEffect(() => {
		setData(footerData)
	}, [])

	if (!data) {
		return <footer>Loading...</footer>
	}

	return (
		<>
			<footer>
				<div className=" position-relative d-none d-md-flex">
					<div className="col-6 bg-primary py-md-6" />
					<div className="col-6 bg-primary-dark py-md-6" />
					<div className="container position-absolute top-50 start-50 translate-middle">
						<div className="row">
							<div className="col-6 d-lg-flex gap-5">
								<Link href="/#" className="d-flex mb-lg-0 mb-2">
									<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
										<path d="M4.75 6.75L9.25 4.75V17.25L4.75 19.25V6.75Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										<path d="M14.75 6.75L19.25 4.75V17.25L14.75 19.25V6.75Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										<path d="M14.75 6.75L9.25 4.75V17.25L14.75 19.25V6.75Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
									<p className="text-white mb-0 ms-2">{data.contactItems.address}</p>
								</Link>
								<Link href="/#" className="d-flex">
									<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
										<path d="M8.89286 4.75H6.06818C5.34017 4.75 4.75 5.34017 4.75 6.06818C4.75 13.3483 10.6517 19.25 17.9318 19.25C18.6598 19.25 19.25 18.6598 19.25 17.9318V15.1071L16.1429 13.0357L14.5317 14.6468C14.2519 14.9267 13.8337 15.0137 13.4821 14.8321C12.8858 14.524 11.9181 13.9452 10.9643 13.0357C9.98768 12.1045 9.41548 11.1011 9.12829 10.494C8.96734 10.1537 9.06052 9.76091 9.32669 9.49474L10.9643 7.85714L8.89286 4.75Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
									<p className="text-white mb-0 ms-2">{data.contactItems.phone}</p>
								</Link>
							</div>
							<div className="col-6">
								<div className="d-flex ms-md-5">
									<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
										<path d="M13 16H12V12H11M12 8H12.01M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
									</svg>
									<p className="text-white mb-0 ms-2">Our website uses cookies to improve your experience.</p>
									<Link href="/#" className="text-white ms-2 link-hover-primary-light"> Learn more </Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="section-footer">
					<div className="container-fluid bg-6">
						<div className="container position-relative z-2">
							<div className="row py-90">
								<div className="col-lg-4 pe-10">
									<Link href="/"><img src={data.logo.src} alt={data.logo.alt} /></Link>
									<p className="text-white fw-medium mt-3 mb-6 opacity-50">{data.description}</p>
									<div className="d-flex social-icons">
										{data.socialLinks && data.socialLinks.map((social: any, index: number) => (
											<Link key={social._id || index} href={social.link} className="text-white border border-end-0 border-light border-opacity-10 icon-shape icon-md">
												{social.name === "Facebook" && (
													<svg xmlns="http://www.w3.org/2000/svg" width={10} height={17} viewBox="0 0 10 17" fill="none">
														<path d="M8.84863 9.20312H6.5415V16.0938H3.46533V9.20312H0.942871V6.37305H3.46533V4.18896C3.46533 1.72803 4.94189 0.34375 7.1875 0.34375C8.26416 0.34375 9.40234 0.559082 9.40234 0.559082V2.98926H8.14111C6.91064 2.98926 6.5415 3.72754 6.5415 4.52734V6.37305H9.2793L8.84863 9.20312Z" fill="white" />
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
										{data.columns && data.columns.map((column: any, colIndex: number) => (
											<div key={column._id || colIndex} className="col-lg-3 col-md-4 col-6">
												<h3 className="text-white opacity-50 fs-6 fw-black text-uppercase pb-3 pt-5 pt-lg-0">{column.title}</h3>
												<div className="d-flex flex-column align-items-start">
													{column.links && column.links.map((link: any, linkIndex: number) => (
														<Link key={link._id || linkIndex} className="hover-effect text-white mb-2 fw-medium fs-6" href={link.link}>{link.name}</Link>
													))}
												</div>
											</div>
										))}
										{data.showAppLinks && (
											<div className="col-lg-6 pt-5 pt-lg-0">
												<p className="text-white fw-black opacity-50 text-uppercase">App &amp; Payment</p>
												<p className="text-white fw-medium mt-3 mb-4 opacity-50">Download our Apps and get
													extra 15% discount on your first order…!</p>
												<div className="d-flex flex-wrap gap-2">
													{data.appLinks && data.appLinks.slice(0, 2).map((app: any, index: number) => (
														<Link key={index} href={app.link}>
															<img className="mb-2" src={app.image} alt={app.alt} />
														</Link>
													))}
												</div>
												<div className="d-flex flex-wrap gap-2">
													{data.appLinks && data.appLinks.slice(2, 4).map((app: any, index: number) => (
														<Link key={index + 2} href={app.link}>
															<img className="mb-2" src={app.image} alt={app.alt} />
														</Link>
													))}
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
							<div className="row text-center py-4 border-top border-white border-opacity-10">
								<span className="text-white opacity-50">{data.copyright}</span>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</>
	)
}
