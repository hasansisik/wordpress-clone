import Link from 'next/link'
import MobileMenu from '../MobileMenu'
import Search from '../Search'
import OffCanvas from '../OffCanvas'
import ThemeSwitch from '@/components/elements/ThemeSwitch'
import Menu from '../Menu'
import { useEffect, useState } from 'react'
import headerData from '@/data/header.json'

export default function Header1({ scroll, hideHeader, isMobileMenu, handleMobileMenu, isSearch, handleSearch, isOffCanvas, handleOffCanvas }: any) {
	const [data, setData] = useState<any>(headerData || {})

	useEffect(() => {
		setData(headerData)
	}, [])

	return (
		<>
			<header>
				<nav 
					className={`navbar navbar-expand-lg navbar-light w-100 z-999 ${scroll ? 'navbar-stick' : ''}`} 
					style={{ 
						position: `${scroll ? "fixed" : "relative"}`, 
						top: `${scroll ? (hideHeader ? "-100px" : "0") : "auto"}`,
						transition: "top 0.3s ease-in-out"
					}}
				>
					<div className="container">
						<Link className="navbar-brand d-flex main-logo align-items-center" href="/">
							<img 
								src={data?.logo?.src || "/assets/imgs/logo/logo.svg"} 
								alt={data?.logo?.alt || "Logo"} 
								style={{ 
									maxWidth: '40px', 
									maxHeight: '40px', 
									width: 'auto', 
									height: 'auto', 
									objectFit: 'contain' 
								}} 
							/>
							<span>{data?.logo?.text || ""}</span>
						</Link>
						<Menu menuItems={data?.mainMenu || []} />
						<div className="d-flex align-items-center pe-5 pe-lg-0 me-5 me-lg-0">
							{data?.showDarkModeToggle && <ThemeSwitch />}
							{data?.showActionButton && (
								<Link href={data?.links?.freeTrialLink?.href || "#"} className="btn btn-gradient d-none d-md-block">
									{data?.links?.freeTrialLink?.text || "Get Started"}
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
					menuItems={data?.mainMenu || []}
					socialLinks={data?.socialLinks || []} 
				/>
			</header>
		</>
	)
}
