"use client"
import Link from "next/link";
import { useEffect, useState } from "react"
import otherData from "@/data/other.json"

interface Blog3Props {
	previewData?: any;
}

export default function Blog3({ previewData }: Blog3Props = {}) {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    console.log("Blog3 previewData:", previewData);
    
    // If preview data is provided, use it, otherwise load from the file
    if (previewData && previewData.blog3) {
      console.log("Setting from previewData", previewData.blog3);
      setData(previewData.blog3);
    } else if (otherData.blog3) {
      console.log("Setting from local otherData", otherData.blog3);
      setData(otherData.blog3);
    } else {
      console.error("No blog data available in Blog3 component");
    }
  }, [previewData])

  if (!data) {
    return <section>Loading Blog3...</section>
  }

  return (
    <>
      <section className="section-blog-8 section-padding position-relative fix">
        <div className="container position-relative z-1">
          <div className="row text-center">
            <h5 className="ds-5">{data.title}</h5>
          </div>
          <div className="row">
            {data.articles.map((article: any, index: number) => (
              <div key={index} className="col-lg-4 text-start">
                <div className="card border-0 rounded-3 mt-8 position-relative d-inline-flex">
                  <img
                    className="rounded-top-3"
                    src={article.image}
                    alt="blog post"
                  />
                  <div className="card-body bg-white p-0">
                    <Link
                      href={article.link}
                      className="bg-primary-soft position-relative z-1 d-inline-flex rounded-pill px-3 py-2 mt-3"
                    >
                      <span className="tag-spacing fs-7 fw-bold text-linear-2 text-uppercase">
                        {article.category}
                      </span>
                    </Link>
                    <h6 className="my-3">
                      {article.title}
                    </h6>
                    <p>
                      {article.description}
                    </p>
                  </div>
                  <Link
                    href={article.link}
                    className="position-absolute bottom-0 start-0 end-0 top-0 z-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="position-absolute top-0 start-50 translate-middle-x z-0">
          <img src={data.bgLine} alt="background line" />
        </div>
        <div className="rotate-center ellipse-rotate-success position-absolute z-0" />
        <div className="rotate-center-rev ellipse-rotate-primary position-absolute z-0" />
      </section>
    </>
  );
}
