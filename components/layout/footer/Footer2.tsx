import Link from 'next/link'
import { useEffect, useState } from 'react'
import footerData from '@/data/footer.json'

export default function Footer2() {
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
					<div className="container-fluid bg-white">
						<div className=" container position-relative z-2">
							<div className="row py-90">
								<div className="col-lg-4 pe-10">
									<Link className="navbar-brand d-flex main-logo align-items-center" href="/">
										<img 
											src={data.logo.src} 
											alt={data.logo.alt}
											style={{ 
												maxWidth: '40px', 
												maxHeight: '40px', 
												width: 'auto', 
												height: 'auto', 
												objectFit: 'contain' 
											}} 
										/>
										<span>{data.logo.text}</span>
									</Link>
									<p className="text-900 fw-medium mt-3 mb-6 opacity-50">{data.description}</p>
									<div className="d-flex social-icons">
										{data.socialLinks && data.socialLinks.map((social: any, index: number) => (
											<Link key={social._id || index} href={social.link} className="text-900 border border-end-0 border-opacity-10 icon-shape icon-md">
												{social.name === "Facebook" && (
													<svg xmlns="http://www.w3.org/2000/svg" width={10} height={17} viewBox="0 0 10 17" fill="none">
														<path className="fill-dark" d="M8.84863 9.20312H6.5415V16.0938H3.46533V9.20312H0.942871V6.37305H3.46533V4.18896C3.46533 1.72803 4.94189 0.34375 7.1875 0.34375C8.26416 0.34375 9.40234 0.559082 9.40234 0.559082V2.98926H8.14111C6.91064 2.98926 6.5415 3.72754 6.5415 4.52734V6.37305H9.2793L8.84863 9.20312Z" fill="black" />
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
										{data.columns && data.columns.slice(0, 2).map((column: any, colIndex: number) => (
											<div key={column._id || colIndex} className="col-lg-3 col-md-3 col-6">
												<h3 className="text-900 fs-6 fw-black text-uppercase pb-3 pt-5">{column.title}</h3>
												<div className="d-flex flex-column align-items-start">
													{column.links && column.links.map((link: any, linkIndex: number) => (
														<Link key={link._id || linkIndex} className="hover-effect text-900 mb-2 fw-medium fs-6" href={link.link}>{link.name}</Link>
													))}
												</div>
											</div>
										))}
										{data.showInstagram && (
											<div className="col-lg-6 col-md-3">
												<h3 className="text-900 fs-6 fw-black text-uppercase pb-3 pt-5">instagram posts</h3>
												<div className="d-flex">
													{data.instagramPosts.slice(0, 3).map((post: string, index: number) => (
														<Link href="http://instagram.com/username" key={index} className="me-2 hover-up">
															<img className="rounded-3" src={post} alt={`Instagram post ${index + 1}`} />
														</Link>
													))}
												</div>
												<div className="d-flex mt-2">
													{data.instagramPosts.slice(3, 6).map((post: string, index: number) => (
														<Link href="http://instagram.com/username" key={index + 3} className="me-2 hover-up">
															<img className="rounded-3" src={post} alt={`Instagram post ${index + 4}`} />
														</Link>
													))}
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="container-fluid bg-primary-soft">
						<div className="container">
							<div className="row">
								<div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 py-4 border-top border-white border-opacity-10">
									<p className="text-900 opacity-50 mb-0 fs-7">{data.copyright}</p>
									{data.showPrivacyLinks && (
										<div className="d-flex">
											{data.privacyLinks && data.privacyLinks.map((link: any, index: number) => (
												<Link key={link._id || index} href={link.link} className="text-900 me-3"> {link.name} </Link>
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
