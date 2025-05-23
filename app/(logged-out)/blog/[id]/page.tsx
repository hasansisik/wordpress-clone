"use client";
import Layout from "@/components/layout/Layout";
import data from "@/data/blog.json";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Blog3 from "@/components/sections/Blog3";
import parse from 'html-react-parser';

interface Section {
  title: string;
  content: string;
}

interface Author {
  name: string;
  avatar: string;
  date: string;
}

interface Content {
  intro: string;
  readTime: string;
  author: Author;
  mainImage: string;
  sections: Section[];
  gallery: string[];
  conclusion: string;
}

interface Post {
  id: number;
  title: string;
  image: string;
  category: string[] | string;
  description: string;
  content: Content;
  link: string;
  author: string;
  date: string;
}

export default function BlogDetails() {
  let Router = useParams();
  const [blogPost, setBlogPost] = useState<Post | null>(null);
  const id = Router?.id;

  useEffect(() => {
    if (id) {
      const post = data.find((item) => item.id.toString() === id);
      if (post) {
        setBlogPost(post);
      }
    }
  }, [id]);

  if (!blogPost) {
    return (
      <Layout>
        <div className="container">
          <div className="row">
            <div className="col-md-8 mx-auto text-center py-5">
              <h2>Loading...</h2>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <section>
          <img
            className="w-100"
            src={blogPost.content.mainImage}
            alt={blogPost.title}
          />
          <div className="container mt-10">
            <div className="row">
              <div className="col-md-8 mx-auto">
                <div className="d-flex gap-2">
                  {Array.isArray(blogPost.category) ? (
                    blogPost.category.map((cat, index) => (
                      <Link
                        key={index}
                        href="#"
                        className="bg-primary-soft rounded-pill px-3 fw-bold py-2 text-primary text-uppercase fs-7"
                      >
                        {cat}
                      </Link>
                    ))
                  ) : (
                    <Link
                      href="#"
                      className="bg-primary-soft rounded-pill px-3 fw-bold py-2 text-primary text-uppercase fs-7"
                    >
                      {blogPost.category}
                    </Link>
                  )}
                </div>
                <h5 className="ds-5 mt-3 mb-4">{blogPost.title}</h5>
                <p className="fs-5 text-900 mb-0">{blogPost.content.intro}</p>
                <div className="d-flex align-items-center justify-content-between mt-7 py-3 border-top border-bottom">
                  <div className="d-flex align-items-center position-relative z-1">
                    <div className="icon-shape rounded-circle border border-2 border-white">
                      <img
                        className="rounded-circle"
                        src={blogPost.content.author.avatar}
                        alt={blogPost.content.author.name}
                      />
                    </div>
                    <div className="ms-3">
                      <h6 className="fs-7 m-0">{blogPost.content.author.name}</h6>
                      <p className="mb-0 fs-8">{blogPost.content.author.date}</p>
                    </div>
                    <Link
                      href="#"
                      className="position-absolute bottom-0 start-0 end-0 top-0 z-0"
                    />
                  </div>
                  <div className="d-flex align-items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12C4.75 16.0041 7.99594 19.25 12 19.25Z"
                        stroke="#111827"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M12 8V12L14 14"
                        stroke="#111827"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <span className="ms-2 fs-7 text-900">{blogPost.content.readTime} to read</span>
                  </div>
                </div>
              </div>
              <div className="col-md-10 mx-auto my-7">
                <img
                  className="rounded-4"
                  src={blogPost.content.mainImage}
                  alt={blogPost.title}
                />
              </div>
              <div className="col-md-8 mx-auto">
                {blogPost.content.sections.map((section, index) => (
                  <div key={index} className={index > 0 ? "mt-5" : ""}>
                    <h5 className="mb-3">{section.title}</h5>
                    <div>{parse(section.content)}</div>
                  </div>
                ))}
              </div>
              {blogPost.content.gallery && blogPost.content.gallery.length > 0 && (
                <div className="col-md-10 mx-auto my-7">
                  <div className="d-flex flex-lg-row flex-column gap-4 mb-4">
                    {blogPost.content.gallery.slice(0, 2).map((img, index) => (
                      <img
                        key={index}
                        className="rounded-4"
                        src={img}
                        alt={`${blogPost.title} gallery ${index + 1}`}
                      />
                    ))}
                  </div>
                  {blogPost.content.gallery.length > 2 && (
                    <div className="d-flex flex-lg-row flex-column gap-4">
                      {blogPost.content.gallery.slice(2, 4).map((img, index) => (
                        <img
                          key={index}
                          className="rounded-4"
                          src={img}
                          alt={`${blogPost.title} gallery ${index + 3}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="col-md-8 mx-auto">
                <h5 className="mt-7 mb-3">Conclusion</h5>
                <div>{parse(blogPost.content.conclusion)}</div>
              </div>
            </div>
          </div>
        </section>
        {/*Blog 8*/}
        <Blog3 />
      </Layout>
    </>
  );
} 