import Link from 'next/link'
import MobileMenu from '../MobileMenu'
import Search from '../Search'
import OffCanvas from '../OffCanvas'
import ThemeSwitch from '@/components/elements/ThemeSwitch'
import Menu from '../Menu'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { getHeader } from '@/redux/actions/headerActions'

export default function Header2({ scroll, hideHeader, isMobileMenu, handleMobileMenu, isSearch, handleSearch, isOffCanvas, handleOffCanvas }: any) {
	const dispatch = useDispatch();
	const { header, loading } = useSelector((state: RootState) => state.header);

	// Fetch header data only once when component mounts
	useEffect(() => {
		dispatch(getHeader() as any);
	}, []) // Empty dependency array ensures this runs only once

	if (loading || !header) {
		return <header>Loading...</header>
	}

	return (
		<>
			<header>
				<nav 
					className={`navbar navbar-expand-lg navbar-light w-100 z-999 ${scroll ? 'navbar-stick' : ''}`} 
					style={{ 
						position: `${scroll ? "fixed" : "relative"}`, 
						top: `${scroll ? (hideHeader ? "-100px" : "0") : "auto"}`, 
						bottom: `${scroll ? "auto" : "0"}`,
						transition: "top 0.3s ease-in-out"
					}}
				>
					<div className="container-fluid px-md-8 px-2">
						<Link className="navbar-brand d-flex main-logo align-items-center" href="/">
							<img 
								src={header.logo.src} 
								alt={header.logo.alt} 
								style={{ 
									maxWidth: '40px', 
									maxHeight: '40px', 
									width: 'auto', 
									height: 'auto', 
									objectFit: 'contain' 
								}} 
							/>
							<span>{header.logo.text}</span>
						</Link>
						<Menu menuItems={header.mainMenu} />
						<div className="d-flex align-items-center pe-5 pe-lg-0 me-5 me-lg-0">
							{header.showDarkModeToggle && <ThemeSwitch />}
							{header.showActionButton && (
								<Link 
									href={header.links.freeTrialLink.href} 
									className="btn d-none d-md-block"
									style={{
										backgroundColor: header.buttonColor || "#3b71fe",
										color: header.buttonTextColor || "#ffffff"
									}}
								>
									{header.links.freeTrialLink.text}
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
					menuItems={header.mainMenu}
					socialLinks={header.socialLinks} 
				/>
			</header>

		</>
	)
}
