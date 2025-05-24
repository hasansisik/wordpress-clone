import Layout from "@/components/layout/Layout"
import Hero1 from "@/components/sections/Hero1"

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