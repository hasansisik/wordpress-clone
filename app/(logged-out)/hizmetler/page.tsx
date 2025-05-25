"use client";

import Link from "next/link";

import dynamic from "next/dynamic";
import Project2 from "@/components/sections/Project2";
const Services5 = dynamic(() => import("@/components/sections/Services5"), {
  ssr: false,
});

export default function SectionProjects() {
  return (
    <>
      {/*Services 5*/}
        <Services5 />
        {/*Project 2*/}
        <Project2 />
    </>
  );
}
