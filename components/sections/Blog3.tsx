"use client"
import Link from "next/link";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllBlogs } from "@/redux/actions/blogActions"
import { getOther } from "@/redux/actions/otherActions"
import { AppDispatch, RootState } from "@/redux/store"

interface Blog3Props {
	previewData?: any;
}

// Function to convert title to slug
const slugify = (text: string) => {
	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-')        // Replace spaces with -
		.replace(/[^\w\-]+/g, '')    // Remove all non-word chars
		.replace(/\-\-+/g, '-')      // Replace multiple - with single -
		.replace(/^-+/, '')          // Trim - from start of text
		.replace(/-+$/, '');         // Trim - from end of text
};

export default function Blog3({ previewData }: Blog3Props = {}) {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading: blogLoading } = useSelector((state: RootState) => state.blog);
  const { other, loading: otherLoading } = useSelector((state: RootState) => state.other);
  
  const [data, setData] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    // If preview data is provided, use it
    if (previewData && previewData.blog3) {
      setData(previewData.blog3);
    } 
    // Otherwise use Redux data
    else if (other && other.blog3) {
      setData(other.blog3);
    }
  }, [previewData, other])

  // Fetch blogs and other data from Redux
  useEffect(() => {
    if (blogs.length === 0) {
      dispatch(getAllBlogs());
    } else {
      // Use slice to get only the posts we need
      setPosts(blogs.slice(0, 3));
    }

    // Also fetch other data if not provided in preview
    if (!previewData) {
      dispatch(getOther());
    }
  }, [blogs, dispatch, previewData]);

  if (!data) {
    return
  }

  if (blogLoading || otherLoading) {
    return
  }

  return (
    <>
      <section className="section-blog-8 section-padding position-relative fix">
        <div className="container position-relative z-1">
          <div className="row text-center">
            <h5 className="ds-5">{data.title}</h5>
          </div>
          <div className="row">
            {posts.map((post, index) => (
              <div key={index} className="col-lg-4 text-start">
                <div className="card border-0 rounded-3 mt-8 position-relative d-inline-flex">
                  <img
                    className="rounded-top-3"
                    src={post.image}
                    alt="blog post"
                  />
                  <div className="card-body bg-white p-0">
                    <Link
                      href={`/${slugify(post.title)}`}
                      className="bg-primary-soft position-relative z-1 d-inline-flex rounded-pill px-3 py-2 mt-3"
                    >
                      <span className="tag-spacing fs-7 fw-bold text-linear-2 text-uppercase">
                        {Array.isArray(post.category) ? post.category[0] : post.category}
                      </span>
                    </Link>
                    <h6 className="my-3">
                      {post.title}
                    </h6>
                    <p>
                      {post.description}
                    </p>
                  </div>
                  <Link
                    href={`/${slugify(post.title)}`}
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
