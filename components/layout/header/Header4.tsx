import Link from 'next/link'
import MobileMenu from '../MobileMenu'
import Search from '../Search'
import OffCanvas from '../OffCanvas'
import ThemeSwitch from '@/components/elements/ThemeSwitch'
import Menu from '../Menu'
import { useEffect, useState } from 'react'
import headerData from '@/data/header.json'

export default function Header4({ scroll, isMobileMenu, handleMobileMenu, isSearch, handleSearch, isOffCanvas, handleOffCanvas }: any) {
	const [data, setData] = useState<any>(null)

	useEffect(() => {
		setData(headerData)
	}, [])

	if (!data) {
		return <header>Loading...</header>
	}

	return (
		<>
			<header>
				<nav className={`navbar navbar-expand-lg navbar-light w-100 z-999 header-4 ${scroll ? 'navbar-stick' : ''}`} style={{ position: `${scroll? "fixed" : "relative"}`, top: `${scroll? "0" : "auto"}`, bottom: `${scroll? "auto" : "0"}` }}>
					<div className="container">
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
						<Menu menuItems={data.mainMenu} />
						<div className="d-flex align-items-center pe-5 pe-lg-0 me-5 me-lg-0">
							<a href="javascript:void(0)" data-bs-toggle="offcanvas" data-bs-target=".offcanvasTop" onClick={handleSearch} className='cursor-pointer'>
								<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
									<path className="stroke-dark" d="M19.25 19.25L15.5 15.5M4.75 11C4.75 7.54822 7.54822 4.75 11 4.75C14.4518 4.75 17.25 7.54822 17.25 11C17.25 14.4518 14.4518 17.25 11 17.25C7.54822 17.25 4.75 14.4518 4.75 11Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</a>
							{data.showDarkModeToggle && <ThemeSwitch />}
							<a className="menu-tigger bg-primary icon-shape icon-md rounded-2 d-none d-md-flex cursor-pointer" onClick={handleOffCanvas}>
								<img src="assets/imgs/logo/icon-menu.svg" alt="infinia" />
							</a>
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
					socialLinks={data.socialLinks} 
				/>
			</header>



		</>
	)
}
