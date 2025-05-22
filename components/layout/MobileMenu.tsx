'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import menuData from "@/data/menu.json"
import headerData from "@/data/header.json"

interface MenuItem {
	_id: string;
	name: string;
	link: string;
	order: number;
}

interface SocialLink {
	_id: string;
	name: string;
	link: string;
	order: number;
}

interface MobileMenuProps {
	isMobileMenu: boolean; 
	handleMobileMenu: () => void;
	menuItems?: MenuItem[];
	socialLinks?: SocialLink[];
}

export default function MobileMenu({ isMobileMenu, handleMobileMenu, menuItems, socialLinks }: MobileMenuProps) {
	const [data, setData] = useState<any>(null)
	const [socialData, setSocialData] = useState<SocialLink[]>([])
	const [isAccordion, setIsAccordion] = useState<number | null>(null)

	useEffect(() => {
		if (menuItems) {
			// If menuItems is provided, use it
			setData(menuItems);
		} else {
			// Otherwise use the default menu data
			setData(menuData.mainMenuItems)
		}

		// Load social links
		if (socialLinks && socialLinks.length > 0) {
			setSocialData(socialLinks);
		} else if (headerData.socialLinks && headerData.socialLinks.length > 0) {
			setSocialData(headerData.socialLinks);
		}
	}, [menuItems, socialLinks])

	const handleAccordion = (key: number) => {
		setIsAccordion(prevState => prevState === key ? null : key)
	}

	// Render simple menu items
	const renderSimpleMenu = () => {
		return (
			<ul className="mobile-menu font-heading ps-0">
				{data && data.map((item: MenuItem, index: number) => (
					<li key={item._id}>
						<Link href={item.link}>{item.name}</Link>
					</li>
				))}
			</ul>
		);
	};

	// Render complex menu items
	const renderComplexMenu = () => {
		return (
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
		);
	};

	// Render social icons
	const renderSocialIcons = () => {
		if (socialData.length === 0) {
			return (
				<>
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
				</>
			);
		}

		return socialData.map((social: SocialLink) => {
			// Determine which icon to use based on name
			let iconPath = "/assets/imgs/template/icons/";
			
			if (social.name.toLowerCase().includes("facebook")) {
				iconPath += "fb.svg";
			} else if (social.name.toLowerCase().includes("twitter")) {
				iconPath += "tw.svg";
			} else if (social.name.toLowerCase().includes("instagram")) {
				iconPath += "in.svg";
			} else if (social.name.toLowerCase().includes("linkedin")) {
				iconPath += "in.svg";
			} else if (social.name.toLowerCase().includes("behance")) {
				iconPath += "be.svg";
			} else {
				// Default icon
				iconPath += "fb.svg";
			}
			
			return (
				<Link key={social._id} className="icon-socials" href={social.link}>
					<img src={iconPath} alt={social.name} />
				</Link>
			);
		});
	};

	return (
		<div className={`mobile-header-active mobile-header-wrapper-style perfect-scrollbar ${isMobileMenu ? "sidebar-visible" : ""}`}>
				<div className="mobile-header-wrapper-inner">
				<div className="mobile-header-content-area">
					<div className="mobile-logo">
						<Link className="d-flex" href="/">
							<img className="logo-size" src={headerData.logo?.src || "/assets/imgs/template/favicon.svg"} alt={headerData.logo?.alt || "infinia"} />
							<span>{headerData.logo?.text || "Infinia"}</span>
						</Link>
						<div className="burger-icon burger-close" onClick={handleMobileMenu}><span className="burger-icon-top"></span><span className="burger-icon-mid"></span><span className="burger-icon-bottom"></span></div>
					</div>
					<div className="perfect-scroll">
						<PerfectScrollbar>
							<div className="mobile-menu-wrap mobile-header-border">
								<nav>
									{menuItems ? renderSimpleMenu() : renderComplexMenu()}
								</nav>
							</div>
						</PerfectScrollbar>
					</div>
					<div className="mobile-social-icon mb-50">
						<h6 className="mb-10">Connect with us</h6>
						{renderSocialIcons()}
					</div>
					<div className="site-copyright">
						Copyright 2023 © Infinia. <br />Designed by AliThemes
					</div>
				</div>
			</div>
		</div>
	)
}
