'use client'
import { useEffect, useState } from "react"

interface BackToTopProps {
	target: string // should be a valid CSS selector
}

export default function BackToTop({ target }: BackToTopProps) {
	const [hasScrolled, setHasScrolled] = useState(false)

	useEffect(() => {
		const onScroll = () => {
			setHasScrolled(window.scrollY > 100)
		}

		window.addEventListener("scroll", onScroll)
		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	const handleClick = () => {
		const targetElement = document.querySelector(target) as HTMLElement | null
		if (targetElement) {
			window.scrollTo({
				top: targetElement.offsetTop,
				behavior: 'smooth',
			})
		} else {
			console.error(`Element with target '${target}' not found`)
		}
	}

	return (
		<>
			{hasScrolled && (
				<div className="btn-scroll-top active-progress" onClick={handleClick}>		
				</div>
			)}
		</>
	)
}
