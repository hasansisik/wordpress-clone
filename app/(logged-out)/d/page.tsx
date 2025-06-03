"use client";
import Link from "next/link";
import CountUp from "react-countup";
import { useState, useRef, useEffect } from "react";
import { Eye } from 'lucide-react';

// Dinamik metadata oluşturma

export default function PageAbout3() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [sliderPositions, setSliderPositions] = useState([50, 50, 50]);
  const sliderRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const isDragging = useRef<number | null>(null);

  const openPreview = (imageSrc: string) => {
    setPreviewImage(imageSrc);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const handleSliderChange = (index: number, value: number) => {
    setSliderPositions(prev => {
      const newPositions = [...prev];
      newPositions[index] = value;
      return newPositions;
    });
  };

  const startDrag = (index: number) => {
    isDragging.current = index;
  };

  const endDrag = () => {
    isDragging.current = null;
  };

  const onDrag = (e: MouseEvent | TouchEvent) => {
    if (isDragging.current === null || !sliderRefs.current[isDragging.current]) return;
    
    const container = sliderRefs.current[isDragging.current]!.getBoundingClientRect();
    const position = 'touches' in e 
      ? (e.touches[0].clientX - container.left) / container.width * 100
      : (e.clientX - container.left) / container.width * 100;
    
    // Constrain the position between 0 and 100
    const constrainedPosition = Math.max(0, Math.min(100, position));
    handleSliderChange(isDragging.current, constrainedPosition);
  };

  useEffect(() => {
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('touchmove', onDrag);

    return () => {
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchend', endDrag);
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('touchmove', onDrag);
    };
  }, []);

  return (
    <>
      <section className="section-cta-8">
        <div className="container-fluid position-relative section-padding">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-5">
                <h5 className="ds-5 mt-2">
                  Doing the successful thing, at the right time.
                </h5>
                <p>
                  We strive to build long-lasting partnerships with our clients,
                  understanding their unique challenges and opportunities, and
                  providing tailored strategies that lead to measurable success.
                </p>
              </div>
              <div className="col-lg-6 offset-lg-1 text-center mt-lg-0 mt-8">
                <div className="position-relative z-1 d-inline-block mb-lg-0 mb-8">
                  <img
                    className="rounded-4 position-relative z-1"
                    src="/assets/imgs/cta-5/img-1.png"
                    alt="infinia"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Before-After Section */}
      <section className="section-before-after section-padding position-relative">
        <div className="container">
          <div className="row position-relative z-1">
            <div className="text-center mb-5">
              <h3 className="ds-3 my-3" data-aos="fade-zoom-in" data-aos-delay={200}>
                Vorher-Nachher: Ihre Haartransformation
              </h3>
              <p className="fs-5" data-aos="fade-zoom-in" data-aos-delay={300}>
                Erleben Sie beeindruckende Ergebnisse unserer Haartransplantationen. Sehen Sie die Verwandlung unserer Patienten vor und nach der Behandlung. Jedes Bild zeigt die professionelle Arbeit unseres Teams und den natürlichen, dauerhaften Erfolg der Eingriffe.
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 mb-4">
              <div 
                className="before-after-container position-relative rounded-4 overflow-hidden"
                ref={el => { sliderRefs.current[0] = el; }}
                style={{ height: '400px' }}
                onMouseDown={() => startDrag(0)}
                onTouchStart={() => startDrag(0)}
              >
                {/* Before image (full width) */}
                <div className="before-image position-absolute top-0 start-0 w-100 h-100">
                  <img 
                    src="/assets/imgs/features-5/img-1.png" 
                    alt="Before" 
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* After image (partial width controlled by slider) */}
                <div 
                  className="after-image position-absolute top-0 start-0 h-100 overflow-hidden"
                  style={{ width: `${sliderPositions[0]}%` }}
                >
                  <img 
                    src="/assets/imgs/features-5/img-2.png" 
                    alt="After" 
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                
                {/* Divider line */}
                <div 
                  className="divider-line position-absolute top-0 h-100"
                  style={{
                    left: `${sliderPositions[0]}%`,
                    width: '4px',
                    backgroundColor: 'white',
                    boxShadow: '0 0 8px rgba(0,0,0,0.5)',
                    zIndex: 20,
                    transform: 'translateX(-50%)'
                  }}
                ></div>

                {/* Circular handle */}
                <div 
                  className="handle-circle position-absolute rounded-circle bg-white"
                  style={{ 
                    width: '40px', 
                    height: '40px',
                    top: '50%',
                    left: `${sliderPositions[0]}%`, 
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                    border: '2px solid #fff',
                    zIndex: 30,
                    cursor: 'ew-resize'
                  }}
                >
                  <Eye size={20} color="#333" />
                </div>

                {/* Slider input (hidden but used for functionality) */}
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sliderPositions[0]} 
                  onChange={(e) => handleSliderChange(0, Number(e.target.value))}
                  className="position-absolute opacity-0 w-100"
                  style={{ height: '100%', cursor: 'ew-resize', zIndex: 40 }}
                />
              </div>
            </div>

            <div className="col-lg-4 mb-4">
              <div 
                className="before-after-container position-relative rounded-4 overflow-hidden"
                ref={el => { sliderRefs.current[1] = el; }}
                style={{ height: '400px' }}
                onMouseDown={() => startDrag(1)}
                onTouchStart={() => startDrag(1)}
              >
                {/* Before image (full width) */}
                <div className="before-image position-absolute top-0 start-0 w-100 h-100">
                  <img 
                    src="/assets/imgs/team-1/avatar-1.png" 
                    alt="Before" 
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* After image (partial width controlled by slider) */}
                <div 
                  className="after-image position-absolute top-0 start-0 h-100 overflow-hidden"
                  style={{ width: `${sliderPositions[1]}%` }}
                >
                  <img 
                    src="/assets/imgs/team-1/avatar-2.png" 
                    alt="After" 
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                
                {/* Divider line */}
                <div 
                  className="divider-line position-absolute top-0 h-100"
                  style={{
                    left: `${sliderPositions[1]}%`,
                    width: '4px',
                    backgroundColor: 'white',
                    boxShadow: '0 0 8px rgba(0,0,0,0.5)',
                    zIndex: 20,
                    transform: 'translateX(-50%)'
                  }}
                ></div>

                {/* Circular handle */}
                <div 
                  className="handle-circle position-absolute rounded-circle bg-white"
                  style={{ 
                    width: '40px', 
                    height: '40px',
                    top: '50%',
                    left: `${sliderPositions[1]}%`, 
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                    border: '2px solid #fff',
                    zIndex: 30,
                    cursor: 'ew-resize'
                  }}
                >
                  <Eye size={20} color="#333" />
                </div>

                {/* Slider input (hidden but used for functionality) */}
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sliderPositions[1]} 
                  onChange={(e) => handleSliderChange(1, Number(e.target.value))}
                  className="position-absolute opacity-0 w-100"
                  style={{ height: '100%', cursor: 'ew-resize', zIndex: 40 }}
                />
              </div>
            </div>

            <div className="col-lg-4 mb-4">
              <div 
                className="before-after-container position-relative rounded-4 overflow-hidden"
                ref={el => { sliderRefs.current[2] = el; }}
                style={{ height: '400px' }}
                onMouseDown={() => startDrag(2)}
                onTouchStart={() => startDrag(2)}
              >
                {/* Before image (full width) */}
                <div className="before-image position-absolute top-0 start-0 w-100 h-100">
                  <img 
                    src="/assets/imgs/team-1/avatar-3.png" 
                    alt="Before" 
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* After image (partial width controlled by slider) */}
                <div 
                  className="after-image position-absolute top-0 start-0 h-100 overflow-hidden"
                  style={{ width: `${sliderPositions[2]}%` }}
                >
                  <img 
                    src="/assets/imgs/team-1/avatar-4.png" 
                    alt="After" 
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                
                {/* Divider line */}
                <div 
                  className="divider-line position-absolute top-0 h-100"
                  style={{
                    left: `${sliderPositions[2]}%`,
                    width: '4px',
                    backgroundColor: 'white',
                    boxShadow: '0 0 8px rgba(0,0,0,0.5)',
                    zIndex: 20,
                    transform: 'translateX(-50%)'
                  }}
                ></div>

                {/* Circular handle */}
                <div 
                  className="handle-circle position-absolute rounded-circle bg-white"
                  style={{ 
                    width: '40px', 
                    height: '40px',
                    top: '50%',
                    left: `${sliderPositions[2]}%`, 
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                    border: '2px solid #fff',
                    zIndex: 30,
                    cursor: 'ew-resize'
                  }}
                >
                  <Eye size={20} color="#333" />
                </div>

                {/* Slider input (hidden but used for functionality) */}
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sliderPositions[2]} 
                  onChange={(e) => handleSliderChange(2, Number(e.target.value))}
                  className="position-absolute opacity-0 w-100"
                  style={{ height: '100%', cursor: 'ew-resize', zIndex: 40 }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-feature-5">
        <div className="container-fluid position-relative section-padding ">
          <div className="container">
            <div className="row align-items-center text-center">
              <div className="col-lg-5">
                <div className="position-relative rounded-4 mx-auto">
                  <img
                    className="rounded-4 border border-2 border-white position-relative z-1 img-fluid"
                    src="/assets/imgs/features-5/img-1.png"
                    alt="infinia"
                  />
                  <div className="box-gradient-1 position-absolute bottom-0 start-50 translate-middle-x bg-linear-1 rounded-4 z-0" />
                </div>
              </div>
              <div className="col-lg-5 mt-lg-0 mt-5">
                <h4 className="ds-4 fw-regular">
                  <span
                    className="fw-bold"
                    data-aos="fade-zoom-in"
                    data-aos-delay={200}
                  >
                    effective team effort.
                  </span>
                </h4>
                <p className="fs-5">
                  Provide your team with top-tier group mentoring programs and
                  exceptional professional benefits.
                </p>
              </div>
            </div>

            <div className="row align-items-center justify-content-center text-center pb-5 pt-lg-5 pt-0">
              <div className="col-lg-5 order-2 order-lg-1 mt-lg-0 mt-5 pt-lg-0 pt-5">
                <h4 className="ds-4 fw-regular">
                  <span
                    className="fw-bold"
                    data-aos="fade-zoom-in"
                    data-aos-delay={200}
                  >
                    cutting-edge
                  </span>
                </h4>
                <p className="fs-5">
                  Provide your team with top-tier group mentoring programs and
                  exceptional professional benefits.
                </p>
              </div>
              <div className="col-lg-5 order-1 order-lg-2 mt-5">
                <div className="position-relative rounded-4 mx-auto d-inline-block">
                  <img
                    className="rounded-4 border border-2 border-white position-relative z-1 img-fluid"
                    src="/assets/imgs/features-5/img-2.png"
                    alt="infinia"
                  />
                  <div className="position-absolute top-50 start-50 translate-middle z-0">
                    <div className="box-gradient-2 position-relative bg-linear-1 rounded-4 z-0"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-team-1 section-padding position-relative overflow-hidden">
        <div className="container">
          <div className="row position-relative z-1">
            <div className="text-center">
              <h3
                className="ds-3 my-3"
                data-aos="fade-zoom-in"
                data-aos-delay={200}
              >
                Meet Our Team
              </h3>
              <p className="fs-5" data-aos="fade-zoom-in" data-aos-delay={300}>
                Meet the talented and passionate team members who drive our
                company forward every day. <br className="d-none d-lg-block" />{" "}
                company forward every day.
              </p>
            </div>
          </div>
          <div className="row mt-6">
            {/* prettier-ignore */}
            <div className="col-lg-3 col-md-6 mb-lg-4 mb-7 text-center" data-aos="fade-zoom-in" data-aos-delay={100}>
							<div className="position-relative d-inline-block z-1">
								<div 
                  className="zoom-img rounded-3 cursor-pointer" 
                  onClick={() => openPreview("/assets/imgs/team-1/avatar-1.png")}
                >
									<img className="img-fluid w-100" src="/assets/imgs/team-1/avatar-1.png" alt="infinia" />
								</div>
							</div>
						</div>
            <div
              className="col-lg-3 col-md-6 mb-lg-4 mb-7 text-center"
              data-aos="fade-zoom-in"
              data-aos-delay={200}
            >
              <div className="position-relative d-inline-block z-1">
                <div 
                  className="zoom-img rounded-3 cursor-pointer" 
                  onClick={() => openPreview("/assets/imgs/team-1/avatar-2.png")}
                >
                  <img
                    className="img-fluid w-100"
                    src="/assets/imgs/team-1/avatar-2.png"
                    alt="infinia"
                  />
                </div>
              </div>
            </div>
            <div
              className="col-lg-3 col-md-6 mb-lg-4 mb-7 text-center"
              data-aos="fade-zoom-in"
              data-aos-delay={300}
            >
              <div className="position-relative d-inline-block z-1">
                <div 
                  className="zoom-img rounded-3 cursor-pointer" 
                  onClick={() => openPreview("/assets/imgs/team-1/avatar-3.png")}
                >
                  <img
                    className="img-fluid w-100"
                    src="/assets/imgs/team-1/avatar-3.png"
                    alt="infinia"
                  />
                </div>
              </div>
            </div>
            <div
              className="col-lg-3 col-md-6 mb-lg-4 mb-7 text-center"
              data-aos="fade-zoom-in"
              data-aos-delay={400}
            >
              <div className="position-relative d-inline-block z-1">
                <div 
                  className="zoom-img rounded-3 cursor-pointer" 
                  onClick={() => openPreview("/assets/imgs/team-1/avatar-4.png")}
                >
                  <img
                    className="img-fluid w-100"
                    src="/assets/imgs/team-1/avatar-4.png"
                    alt="infinia"
                  />
                </div>
              </div>
            </div>
            <div
              className="col-lg-3 col-md-6 mb-lg-4 mb-7 text-center"
              data-aos="fade-zoom-in"
              data-aos-delay={100}
            >
              <div className="position-relative d-inline-block z-1">
                <div 
                  className="zoom-img rounded-3 cursor-pointer" 
                  onClick={() => openPreview("/assets/imgs/team-1/avatar-5.png")}
                >
                  <img
                    className="img-fluid w-100"
                    src="/assets/imgs/team-1/avatar-5.png"
                    alt="infinia"
                  />
                </div>
              </div>
            </div>
            <div
              className="col-lg-3 col-md-6 mb-lg-4 mb-7 text-center"
              data-aos="fade-zoom-in"
              data-aos-delay={200}
            >
              <div className="position-relative d-inline-block z-1">
                <div 
                  className="zoom-img rounded-3 cursor-pointer" 
                  onClick={() => openPreview("/assets/imgs/team-1/avatar-6.png")}
                >
                  <img
                    className="img-fluid w-100"
                    src="/assets/imgs/team-1/avatar-6.png"
                    alt="infinia"
                  />
                </div>
              </div>
            </div>
            <div
              className="col-lg-3 col-md-6 mb-lg-4 mb-7 text-center"
              data-aos="fade-zoom-in"
              data-aos-delay={300}
            >
              <div className="position-relative d-inline-block z-1">
                <div 
                  className="zoom-img rounded-3 cursor-pointer" 
                  onClick={() => openPreview("/assets/imgs/team-1/avatar-7.png")}
                >
                  <img
                    className="img-fluid w-100"
                    src="/assets/imgs/team-1/avatar-7.png"
                    alt="infinia"
                  />
                </div>
              </div>
            </div>
            <div
              className="col-lg-3 col-md-6 mb-lg-4 mb-7 text-center"
              data-aos="fade-zoom-in"
              data-aos-delay={400}
            >
              <div className="position-relative d-inline-block z-1">
                <div 
                  className="zoom-img rounded-3 cursor-pointer" 
                  onClick={() => openPreview("/assets/imgs/team-1/avatar-8.png")}
                >
                  <img
                    className="img-fluid w-100"
                    src="/assets/imgs/team-1/avatar-8.png"
                    alt="infinia"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-feature-5">
        <div className="container-fluid position-relative section-padding ">
          <div className="container">
            <div className="row align-items-center text-center">
              <div className="col-lg-5">
                <div className="position-relative rounded-4 mx-auto">
                  <img
                    className="rounded-4 border border-2 border-white position-relative z-1 img-fluid"
                    src="/assets/imgs/features-5/img-1.png"
                    alt="infinia"
                  />
                  <div className="box-gradient-1 position-absolute bottom-0 start-50 translate-middle-x bg-linear-1 rounded-4 z-0" />
                </div>
              </div>
              <div className="col-lg-5 mt-lg-0 mt-5">
                <h4 className="ds-4 fw-regular">
                  <span
                    className="fw-bold"
                    data-aos="fade-zoom-in"
                    data-aos-delay={200}
                  >
                    effective team effort.
                  </span>
                </h4>
                <p className="fs-5">
                  Provide your team with top-tier group mentoring programs and
                  exceptional professional benefits.
                </p>
              </div>
            </div>

            <div className="row align-items-center justify-content-center text-center pb-5 pt-lg-5 pt-0">
              <div className="col-lg-5 order-2 order-lg-1 mt-lg-0 mt-5 pt-lg-0 pt-5">
                <h4 className="ds-4 fw-regular">
                  <span
                    className="fw-bold"
                    data-aos="fade-zoom-in"
                    data-aos-delay={200}
                  >
                    cutting-edge
                  </span>
                </h4>
                <p className="fs-5">
                  Provide your team with top-tier group mentoring programs and
                  exceptional professional benefits.
                </p>
              </div>
              <div className="col-lg-5 order-1 order-lg-2 mt-5">
                <div className="position-relative rounded-4 mx-auto d-inline-block">
                  <img
                    className="rounded-4 border border-2 border-white position-relative z-1 img-fluid"
                    src="/assets/imgs/features-5/img-2.png"
                    alt="infinia"
                  />
                  <div className="position-absolute top-50 start-50 translate-middle z-0">
                    <div className="box-gradient-2 position-relative bg-linear-1 rounded-4 z-0"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

  

    

          {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="image-preview-modal position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
          style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999 }}
          onClick={closePreview}
        >
          <div 
            className="position-relative" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              width: '95vw', 
              height: '95vh', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <img 
              src={previewImage} 
              alt="Preview" 
              className="img-fluid" 
              style={{ 
                maxHeight: '100%', 
                maxWidth: '100%', 
                objectFit: 'contain',
                transform: 'scale(1.5)',
                transformOrigin: 'center'
              }} 
            />
            <button 
              className="btn btn-light position-absolute" 
              onClick={closePreview}
              style={{ 
                borderRadius: '50%', 
                width: '50px', 
                height: '50px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                top: '10px',
                right: '10px',
                fontSize: '30px',
                fontWeight: 'bold',
                padding: '0',
                zIndex: 10000
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
