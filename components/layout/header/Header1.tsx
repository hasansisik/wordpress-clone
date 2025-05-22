import Link from 'next/link'
import MobileMenu from '../MobileMenu'
import Search from '../Search'
import OffCanvas from '../OffCanvas'
import ThemeSwitch from '@/components/elements/ThemeSwitch'
import Menu from '../Menu'
import { useEffect, useState } from 'react'
import headerData from '@/data/header.json'

export default function Header1({ scroll, isMobileMenu, handleMobileMenu, isSearch, handleSearch, isOffCanvas, handleOffCanvas }: any) {
	const [data, setData] = useState<any>(null)

	useEffect(() => {
		setData(headerData)
	}, [])

	if (!data) {
		return <header>Loading...</header>
	}

	// Helper function to identify social media types by name
	const identifySocialType = (itemName: string) => {
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

	return (
		<>
			<header>
				<nav className={`navbar navbar-expand-lg navbar-light w-100 z-999 ${scroll ? 'navbar-stick' : ''}`} style={{ position: `${scroll? "fixed" : "relative"}`, top: `${scroll? "0" : "auto"}` }}>
					<div className="container">
						<Link className="navbar-brand d-flex main-logo align-items-center" href="/">
							<img src={data.logo.src} alt={data.logo.alt} />
							<span>{data.logo.text}</span>
						</Link>
						<Menu menuItems={data.mainMenu} />
						<div className="d-flex align-items-center pe-5 pe-lg-0 me-5 me-lg-0">
							<div data-bs-toggle="offcanvas" data-bs-target=".offcanvasTop" onClick={handleSearch} className='cursor-pointer'>
								<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
									<path className="stroke-dark" d="M19.25 19.25L15.5 15.5M4.75 11C4.75 7.54822 7.54822 4.75 11 4.75C14.4518 4.75 17.25 7.54822 17.25 11C17.25 14.4518 14.4518 17.25 11 17.25C7.54822 17.25 4.75 14.4518 4.75 11Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</div>
							{data.showDarkModeToggle && <ThemeSwitch />}
							{data.showActionButton && (
								<Link href={data.links.freeTrialLink.href} className="btn btn-gradient d-none d-md-block">
									{data.links.freeTrialLink.text}
								</Link>
							)}
							<div className="burger-icon burger-icon-white border rounded-3" onClick={handleMobileMenu}>
								<span className="burger-icon-top" />
								<span className="burger-icon-mid" />
								<span className="burger-icon-bottom" />
							</div>
						</div>
					</div>
				</nav>
				<OffCanvas handleOffCanvas={handleOffCanvas} isOffCanvas={isOffCanvas} />
				<Search isSearch={isSearch} handleSearch={handleSearch} />
				<MobileMenu 
					handleMobileMenu={handleMobileMenu} 
					isMobileMenu={isMobileMenu} 
					menuItems={data.mainMenu}
					socialLinks={data.socialLinks?.map(item => {
						// Add support for identifying social media from alternative names
						if (!item.name) return item;
						
						const identifiedPlatform = identifySocialType(item.name);
						if (identifiedPlatform && identifiedPlatform !== item.name) {
							return {
								...item,
								originalName: item.name, // Keep original name
								name: identifiedPlatform // Replace with standard name for icon rendering
							};
						}
						return item;
					})} 
				/>
			</header>
		</>
	)
}
