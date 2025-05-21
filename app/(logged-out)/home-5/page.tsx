import Blog5 from "@/components/sections/Blog5"
import Contact1 from "@/components/sections/Contact1"
import Cta7 from "@/components/sections/Cta7"
import Cta8 from "@/components/sections/Cta8"
import Cta9 from "@/components/sections/Cta9"
import Faqs3 from "@/components/sections/Faqs3"
import Features10 from "@/components/sections/Features10"
import Hero5 from "@/components/sections/Hero5"
import LogoCloud5 from "@/components/sections/LogoCloud5"
import Project1 from "@/components/sections/Project1"
import Team4 from "@/components/sections/Team4"
import Testimonial3 from "@/components/sections/Testimonial3"

import Layout from "@/components/layout/Layout"
import Services6 from "@/components/sections/Services6"
export default function Home5() {

	return (
		<>

			<Layout headerStyle={5} footerStyle={4}>
				<Hero5 />
				<Features10 />
				<Cta7 />
				<Services6 />
				<Team4 />
				<LogoCloud5 />
				<Project1 />
				<Cta8 />
				<Cta9 />
				<Faqs3 />
				<Testimonial3 />
				<Blog5 />
				<Contact1 />

			</Layout>
		</>
	)
}