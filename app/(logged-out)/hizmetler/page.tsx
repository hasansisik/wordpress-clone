"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllServices, getAllCategories } from "@/redux/actions/serviceActions";
import { AppDispatch, RootState } from "@/redux/store";
import { Loader2 } from "lucide-react";

import dynamic from "next/dynamic";
import Project2 from "@/components/sections/Project2";
const Services5 = dynamic(() => import("@/components/sections/Services5"), {
  ssr: false,
});

export default function SectionProjects() {
  const dispatch = useDispatch<AppDispatch>();
  const { services, categories, loading, error } = useSelector((state: RootState) => state.service);

  useEffect(() => {
    dispatch(getAllServices());
    dispatch(getAllCategories());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      {/*Services 5*/}
      <Services5 services={services} categories={categories} />
      {/*Project 2*/}
      <Project2 projects={services} />
    </>
  );
}
