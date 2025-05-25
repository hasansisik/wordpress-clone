import Layout from "@/components/layout/Layout"
import Hero1 from "@/components/sections/Hero1"
import { Metadata } from "next"
import { generateMetadata as generateSeoMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSeoMetadata("home")

export default function Home() {
	return (
		<>
			<Layout headerStyle={1} footerStyle={1}>
				<Hero1 />
				<Hero1 />
			</Layout>
		</>
	)
}