"use client"
import Link from "next/link";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllBlogs } from "@/redux/actions/blogActions"
import { getOther } from "@/redux/actions/otherActions"
import { getMyProfile } from "@/redux/actions/userActions"
import { AppDispatch, RootState } from "@/redux/store"
import PremiumContentDialog from "@/components/PremiumContentDialog"

interface Blog3Props {
	previewData?: any;
}

// Function to convert title to slug
const slugify = (text: string) => {
	// Turkish character mapping
	const turkishMap: {[key: string]: string} = {
		'ç': 'c', 'Ç': 'C',
		'ğ': 'g', 'Ğ': 'G',
		'ı': 'i', 'İ': 'I',
		'ö': 'o', 'Ö': 'O',
		'ş': 's', 'Ş': 'S',
		'ü': 'u', 'Ü': 'U'
	};
	
	// Replace Turkish characters
	let result = text.toString();
	for (const [turkishChar, latinChar] of Object.entries(turkishMap)) {
		result = result.replace(new RegExp(turkishChar, 'g'), latinChar);
	}
	
	return result
		.toLowerCase()
		.replace(/\s+/g, '-')        // Replace spaces with -
		.replace(/[^\w\-]+/g, '')    // Remove all non-word chars
		.replace(/\-\-+/g, '-')      // Replace multiple - with single -
		.replace(/^-+/, '')          // Trim - from start of text
		.replace(/-+$/, '');         // Trim - from end of text
};

// Function to truncate text
const truncateText = (text: string, maxLength: number = 120) => {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength) + '...';
};

export default function Blog3({ previewData }: Blog3Props = {}) {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading: blogLoading } = useSelector((state: RootState) => state.blog);
  const { other, loading: otherLoading } = useSelector((state: RootState) => state.other);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  
  const [data, setData] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [showPremiumDialog, setShowPremiumDialog] = useState(false)
  const [currentPremiumPost, setCurrentPremiumPost] = useState<any>(null)
  
  // Premium kontrolü - === true ile kesin kontrol
  const isPremiumUser = isAuthenticated && user?.isPremium === true;
  
  // Kullanıcı profil bilgilerini güncelle
  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

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
  
  // Handle blog post click with premium check
  const handlePostClick = (e: React.MouseEvent, post: any) => {
    if (post.premium && !isPremiumUser) {
      e.preventDefault();
      setCurrentPremiumPost(post);
      setShowPremiumDialog(true);
    } else if (post.premium && isPremiumUser) {
      // Premium içerik ve kullanıcı premium, normal link davranışı devam eder
    }
  }

  const handleDialogClose = () => {
    setShowPremiumDialog(false);
    setCurrentPremiumPost(null);
  }

  if (!data) {
    return
  }

  if (blogLoading || otherLoading) {
    return
  }

  // Create styles for customizable elements
  const sectionStyle = {
    backgroundColor: data.backgroundColor || "#ffffff"
  };

  const titleStyle = {
    color: data.titleColor || "#111827"
  };

  return (
    <>
      {/* Premium Dialog */}
      <PremiumContentDialog 
        isOpen={showPremiumDialog} 
        onClose={handleDialogClose}
        title={currentPremiumPost?.title ? `Premium İçerik: ${currentPremiumPost.title}` : 'Premium İçerik'}
      />
      
      <section className="section-blog-8 section-padding position-relative fix" style={sectionStyle}>
        <div className="container position-relative z-1">
          <div className="row text-center">
            <h5 className="ds-5" style={titleStyle}>{data.title}</h5>
          </div>
          <div className="row">
            {posts.map((post, index) => (
              <div key={index} className="col-lg-4 text-start">
                <div className="card border-0 rounded-3 mt-8 position-relative w-100 bg-gray-50">
                  <div className="blog-image-container w-100" style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                    <img 
                      className="rounded-top-3" 
                      src={post.image} 
                      alt={post.title} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        objectPosition: 'center'
                      }} 
                    />
                    {post.premium && (
                      <>
                        <div className="position-absolute top-0 end-0 m-2">
                          <div className="bg-amber-500 text-white px-2 py-1 rounded-pill fs-8 fw-bold">
                            Premium
                          </div>
                        </div>
                        <div className="position-absolute bottom-0 left-0 w-100" style={{
                          background: 'linear-gradient(to top, rgba(245, 158, 11, 1), rgba(245, 158, 11, 0))',
                          height: '100px'
                        }}></div>
                      </>
                    )}
                  </div>
                  <div className="card-body p-0">
                    <Link
                      href={`/${slugify(post.title)}`}
                      className="position-relative z-1 d-inline-flex rounded-pill px-3 py-2 mt-3"
                      style={post.premium ? 
                        { backgroundColor: '#FFEDD5', color: '#C2410C' } : 
                        { backgroundColor: '#f5f5f5', color: '#333333' }
                      }
                    >
                      <span className="tag-spacing fs-7 fw-bold text-uppercase">
                        {Array.isArray(post.category) ? post.category[0] : post.category}
                      </span>
                    </Link>
                    <h6 className={`my-3 ${post.premium ? 'text-orange-700' : 'text-gray-800'}`}>
                      {post.title}
                    </h6>
                    <p className="text-gray-700">
                      {truncateText(post.description)}
                    </p>
                  </div>
                  <Link
                    href={`/${slugify(post.title)}`}
                    className="position-absolute bottom-0 start-0 end-0 top-0 z-0"
                    onClick={(e) => handlePostClick(e, post)}
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
      <style jsx>{`
        .card {
          display: block;
          width: 100%;
        }
      `}</style>
    </>
  );
}
