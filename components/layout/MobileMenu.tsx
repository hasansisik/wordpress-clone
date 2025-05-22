'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import menuData from "@/data/menu.json"

export default function MobileMenu({ isMobileMenu, handleMobileMenu }: any) {
	const [data, setData] = useState<any>(null)
	const [isAccordion, setIsAccordion] = useState<number | null>(null)

	useEffect(() => {
		setData(menuData.mainMenuItems)
	}, [])

	const handleAccordion = (key: number) => {
		setIsAccordion(prevState => prevState === key ? null : key)
	}

	return (
		<div className={`mobile-header-active mobile-header-wrapper-style perfect-scrollbar ${isMobileMenu ? "sidebar-visible" : ""}`}>
				<div className="mobile-header-wrapper-inner">
				<div className="mobile-header-content-area">
					<div className="mobile-logo">
						<Link className="d-flex" href="/">
							<img className="logo-size" src="/assets/imgs/template/favicon.svg" alt="Infinia" />
							<span>Infinia</span>
						</Link>
						<div className="burger-icon burger-close" onClick={handleMobileMenu}><span className="burger-icon-top"></span><span className="burger-icon-mid"></span><span className="burger-icon-bottom"></span></div>
					</div>
						<div className="perfect-scroll">
						<PerfectScrollbar>
							<div className="mobile-menu-wrap mobile-header-border">
								<nav>
									<ul className="mobile-menu font-heading ps-0">
										{data && data.map((item: any, index: number) => (
											<li key={index} className={`has-children ${isAccordion === index ? "active" : ""}`}>
												{item.dropdown && (
													<span className="menu-expand" onClick={() => handleAccordion(index)}>
												<i className="arrow-small-down"></i>
											</span>
												)}
												<Link href={item.href}>{item.title}</Link>
												
												{item.dropdown && item.dropdownItems && (
													<ul className="sub-menu" style={{ display: `${isAccordion === index ? "block" : "none"}` }}>
														{item.dropdownItems.map((subItem: any, subIndex: number) => (
															<li key={subIndex}>
																<Link href={subItem.href}>{subItem.title}</Link>
										</li>
														))}
											</ul>
												)}
												
												{item.dropdown && item.megaMenuSections && (
													<ul className="sub-menu" style={{ display: `${isAccordion === index ? "block" : "none"}` }}>
														{item.megaMenuSections.map((section: any, sectionIndex: number) => (
															<li key={sectionIndex}>
																<Link href="#">{section.title}</Link>
																<ul>
																	{section.links.map((link: any, linkIndex: number) => (
																		<li key={linkIndex}>
																			<Link href={link.href}>{link.title}</Link>
										</li>
																	))}
											</ul>
										</li>
														))}
											</ul>
												)}
												
												{item.dropdown && item.sections && (
													<ul className="sub-menu" style={{ display: `${isAccordion === index ? "block" : "none"}` }}>
														{item.sections.map((section: any, sIndex: number) => (
															<li key={sIndex}>
																<Link href={section.href}>{section.title}</Link>
										</li>
														))}
											</ul>
												)}
										</li>
										))}
									</ul>
								</nav>
							</div>
						</PerfectScrollbar>
					</div>
					<div className="mobile-social-icon mb-50">
						<h6 className="mb-10">Connect with us</h6>
						<Link className="icon-socials" href="#">
							<img src="/assets/imgs/template/icons/fb.svg" alt="infinia" />
						</Link>
						<Link className="icon-socials" href="#">
							<img src="/assets/imgs/template/icons/tw.svg" alt="infinia" />
						</Link>
						<Link className="icon-socials" href="#">
							<img src="/assets/imgs/template/icons/in.svg" alt="infinia" />
						</Link>
						<Link className="icon-socials" href="#">
							<img src="/assets/imgs/template/icons/be.svg" alt="infinia" />
						</Link>
						</div>
					<div className="site-copyright">
						Copyright 2023 © Infinia. <br />Designed by AliThemes
					</div>
				</div>
			</div>
		</div>
	)
}
