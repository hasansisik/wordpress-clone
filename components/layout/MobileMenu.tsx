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
	const [openSubmenu, setOpenSubmenu] = useState<any>(null)

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

	const toggleSubmenu = (id: string) => {
		if (openSubmenu === id) {
			setOpenSubmenu(null)
		} else {
			setOpenSubmenu(id)
		}
	}

	// Helper function to render social media icons
	const renderSocialIcon = (platform: string) => {
		const icons: { [key: string]: JSX.Element } = {
			'Facebook': (
				<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					<path d="M12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4036 5.59644 25 12.5 25C19.4036 25 25 19.4036 25 12.5C25 5.59644 19.4036 0 12.5 0ZM16.9792 8.22958H14.9896C14.7635 8.22958 14.5104 8.52865 14.5104 8.91719V10.4167H16.9844L16.5625 12.6458H14.5104V19.3229H11.9792V12.6458H9.89583V10.4167H11.9792V9.16667C11.9792 7.33333 13.2135 5.83333 14.9896 5.83333H16.9792V8.22958Z" fill="currentColor" />
				</svg>
			),
			'Twitter': (
				<svg width="25" height="25" viewBox="0 0 25 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					<path d="M12.5 0C5.5975 0 0 5.5975 0 12.5C0 19.4025 5.5975 25 12.5 25C19.4025 25 25 19.4025 25 12.5C25 5.5975 19.4025 0 12.5 0ZM18.6833 9.44417C18.6917 9.575 18.6917 9.70667 18.6917 9.8375C18.6917 14.0958 15.4417 18.9833 9.52417 18.9833C7.73 18.9833 6.06417 18.4625 4.65667 17.5625C4.91 17.5917 5.15333 17.6042 5.41333 17.6042C6.89417 17.6042 8.26333 17.1042 9.36 16.25C7.96917 16.2208 6.80333 15.3042 6.4 14.0208C6.88833 14.0917 7.33 14.0917 7.83584 13.9667C7.12818 13.825 6.48913 13.455 6.02958 12.9167C5.57004 12.3784 5.31809 11.7061 5.31917 11.0125V10.9753C5.73583 11.2108 6.22417 11.3533 6.73833 11.3717C6.30972 11.0904 5.9609 10.7128 5.72129 10.271C5.48168 9.82921 5.36024 9.33692 5.36917 8.8375C5.36917 8.2625 5.51583 7.7375 5.7825 7.28917C6.57028 8.25389 7.54903 9.05246 8.65783 9.63433C9.76664 10.2162 10.985 10.5679 12.2383 10.6683C11.775 8.43 13.4092 6.63583 15.4508 6.63583C16.4142 6.63583 17.2833 7.04583 17.9042 7.70833C18.6742 7.57917 19.4067 7.3225 20.0667 6.96917C19.8308 7.6825 19.3292 8.2625 18.6583 8.62333C19.3083 8.55583 19.9383 8.38583 20.5208 8.14917C20.07 8.74417 19.5175 9.2675 18.8858 9.69667C18.6833 9.44417 18.6917 9.575 18.6917 9.44417Z" fill="currentColor" />
				</svg>
			),
			'LinkedIn': (
				<svg width="25" height="25" viewBox="0 0 25 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					<path d="M12.5 0C5.5975 0 0 5.5975 0 12.5C0 19.4025 5.5975 25 12.5 25C19.4025 25 25 19.4025 25 12.5C25 5.5975 19.4025 0 12.5 0ZM8.86583 18.9175H5.97667V9.74333H8.86583V18.9175ZM7.42083 8.52833C6.56 8.52833 5.86333 7.8225 5.86333 6.96833C5.86333 6.11417 6.56 5.41 7.42083 5.41C8.2725 5.41 8.97667 6.11417 8.97667 6.96833C8.97667 7.8225 8.2725 8.52833 7.42083 8.52833ZM19.47 18.9175H16.5883V14.3567C16.5883 13.0858 16.1125 12.3142 15.0858 12.3142C14.3038 12.3142 13.8533 12.8203 13.6533 13.3075C13.5783 13.4983 13.5608 13.7617 13.5608 14.0342V18.9175H10.6767V13.1608C10.6767 11.9958 10.6417 11.0283 10.605 10.1983H13.0975L13.2267 11.4675H13.2792C13.6533 10.9033 14.5558 10.0808 16.095 10.0808C17.9567 10.0808 19.47 11.2983 19.47 14.0167V18.9175Z" fill="currentColor" />
				</svg>
			),
			'Instagram': (
				<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					<path d="M12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4036 5.59644 25 12.5 25C19.4036 25 25 19.4036 25 12.5C25 5.59644 19.4036 0 12.5 0ZM19.7917 15.625C19.7917 17.9017 17.9017 19.7917 15.625 19.7917H9.375C7.09833 19.7917 5.20833 17.9017 5.20833 15.625V9.375C5.20833 7.09833 7.09833 5.20833 9.375 5.20833H15.625C17.9017 5.20833 19.7917 7.09833 19.7917 9.375V15.625Z" fill="currentColor" />
					<path d="M12.5 6.25C9.05292 6.25 6.25 9.05292 6.25 12.5C6.25 15.9471 9.05292 18.75 12.5 18.75C15.9471 18.75 18.75 15.9471 18.75 12.5C18.75 9.05292 15.9471 6.25 12.5 6.25ZM12.5 16.6667C10.1988 16.6667 8.33333 14.8021 8.33333 12.5C8.33333 10.1979 10.1979 8.33333 12.5 8.33333C14.8021 8.33333 16.6667 10.1979 16.6667 12.5C16.6667 14.8021 14.8021 16.6667 12.5 16.6667Z" fill="currentColor" />
					<path d="M19.2708 6.77084C19.2708 7.42709 18.7354 8.00001 18.0292 8.00001C17.3229 8.00001 16.75 7.46459 16.75 6.77084C16.75 6.07709 17.2854 5.50418 18.0292 5.50418C18.7354 5.50418 19.2708 6.03959 19.2708 6.77084Z" fill="currentColor" />
				</svg>
			),
			'Behance': (
				<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					<path d="M15.3417 11.9416C16.55 11.4333 17.3083 10.3416 17.3083 8.92492C17.3083 6.55825 15.4417 5.33325 13.1583 5.33325H7.5V18.8083H13.4833C15.6167 18.8083 17.7917 17.4999 17.7917 15.0166C17.7917 13.3999 16.8333 12.3249 15.3417 11.9416ZM10.1333 7.69992H12.7417C13.7 7.69992 14.7083 8.03325 14.7083 9.19159C14.7083 10.2666 13.925 10.7499 12.9833 10.7499H10.1333V7.69992ZM13.1667 16.4333H10.1333V12.8333H13.2833C14.475 12.8333 15.2 13.4749 15.2 14.6749C15.2 15.8499 14.3 16.4333 13.1667 16.4333Z" fill="currentColor" />
				</svg>
			)
		};

		// Check if we have an icon for this platform
		return icons[platform] || null;
	};
	
	// Helper function to identify social media types by name
	const identifySocialType = (itemName: string) => {
		if (!itemName) return null;
		
		const lowerName = itemName.toLowerCase();
		
		const socialPlatforms = {
			'facebook': 'Facebook',
			'twitter': 'Twitter',
			'x': 'Twitter', // For Twitter's rebranding as X
			'linkedin': 'LinkedIn',
			'behance': 'Behance',
			'instagram': 'Instagram',
			'fb': 'Facebook',
			'tw': 'Twitter',
			'li': 'LinkedIn',
			'ig': 'Instagram',
			'be': 'Behance'
		};

		for (const [keyword, platform] of Object.entries(socialPlatforms)) {
			if (lowerName.includes(keyword)) {
				return platform;
			}
		}

		return null;
	};

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
			const platformName = social.name;
			const identifiedType = identifySocialType(platformName);
			const icon = platformName ? renderSocialIcon(platformName) : null;
			const fallbackIcon = identifiedType ? renderSocialIcon(identifiedType) : null;
			
			if (icon || fallbackIcon) {
				return (
					<Link key={social._id} className="icon-socials" href={social.link}>
						{icon || fallbackIcon}
					</Link>
				);
			}
			
			// Fallback if no icon is found
			return (
				<Link key={social._id} className="icon-socials" href={social.link}>
					{social.name?.charAt(0) || 'S'}
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
							<img 
								className="logo-size" 
								src={headerData.logo?.src || "/assets/imgs/template/favicon.svg"} 
								alt={headerData.logo?.alt || "infinia"}
								style={{ 
									maxWidth: '40px', 
									maxHeight: '40px', 
									width: 'auto', 
									height: 'auto', 
									objectFit: 'contain' 
								}}
							/>
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
