import Link from 'next/link'
import { useEffect, useState } from 'react'
import footerData from '@/data/footer.json'

export default function Footer3() {
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
				<div className="section-footer">
					<div className="container-fluid bgft-1">
						<div className=" container position-relative z-2">
							<div className="d-flex py-4 border-bottom border-white border-opacity-10 justify-content-between align-items-center">
								<div>
									<Link href="/"><img src={data.logo.src} alt={data.logo.alt} /></Link>
								</div>
								<div>
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
							</div>
							<div className="row py-90">
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
									</div>
								</div>
								<div className="col-lg-3 pt-5 pt-lg-0">
									{data.showAppLinks && (
										<>
											<p className="text-white fw-black opacity-50 text-uppercase">App &amp; Payment</p>
											<p className="text-white fw-medium mt-3 mb-4 opacity-50">Download our Apps and get
												extra 15% discount on your first order…!</p>
											<div className="d-flex gap-2 flex-wrap">
												{data.appLinks && data.appLinks.map((app: any, index: number) => (
													<Link key={index} href={app.link}>
														<img className="mb-2" src={app.image} alt={app.alt} />
													</Link>
												))}
											</div>
										</>
									)}
								</div>
							</div>
							<div className="row">
								<div className="d-flex flex-md-row flex-column align-items-center justify-content-between bg-transparent py-4 border-top border-opacity-10">
									<span className="text-white opacity-50 mb-3 mb-md-0">{data.copyright}</span>
									{data.showPrivacyLinks && (
										<div className="d-flex">
											{data.privacyLinks && data.privacyLinks.map((link: any, index: number) => (
												<Link key={link._id || index} href={link.link} className="link-hover-primary-light text-white me-3">
													{link.name}
												</Link>
											))}
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
