"use client";

import Layout from "@/components/layout/Layout";
import Link from "next/link";

import dynamic from "next/dynamic";
import Project2 from "@/components/sections/Project2";
const Services5 = dynamic(() => import("@/components/sections/Services5"), {
  ssr: false,
});

export default function SectionProjects() {
  const swiperOptions = {
    slidesPerView: 3,
    spaceBetween: 20,
    slidesPerGroup: 1,
    centeredSlides: false,
    loop: true,
    autoplay: {
      delay: 4000,
    },
    breakpoints: {
      1200: {
        slidesPerView: 3,
      },
      992: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 2,
      },
      576: {
        slidesPerView: 1,
      },
      0: {
        slidesPerView: 1,
      },
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
    },
  };

  return (
    <>
      <Layout headerStyle={1} footerStyle={1}>
        {/*Services 5*/}
        <Services5 />
        {/*Project 2*/}
        <Project2 />
      </Layout>
    </>
  );
}
