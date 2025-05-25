import Contact1 from "@/components/sections/Contact1"
import Link from "next/link"
import { Metadata } from "next"
import { generateMetadata as generateSeoMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSeoMetadata("contact")

export default function PageContact2() {

	return (
		<>

			<Contact1 />
		</>
	)
}