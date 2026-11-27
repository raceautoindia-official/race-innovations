'use client';

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// "Mr. M Balasubramanian" -> "MB", "Mr. Nagaraj" -> "N".
function getInitials(name) {
  return name
    .replace(/^(Mr|Mrs|Ms|Dr)\.?\s+/i, '')
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

const Testimonial_v2 = () => {
  const testimonials = [
    {
      name: 'Mr. Jan Bor',
      position: 'Chairman, Telma Retarder India (P) Ltd',
      text: "Drive for Excellence is not just a slogan with RACE, it's within their DNA, in their bloodstream, and they are absolutely the right partner to establish yourself in India.",
      img: '/images/janbor.jpg',
    },
    {
      name: 'Mr. Oskar Flach',
      position: 'Managing Director - Schmitz Cargobull',
      text: 'RACE provided us with a holistic perspective on the Indian trailer market through its study of semi-trailers. This valuable information is unique and helps us venture into the Indian Trailer Market with a strong business strategy.',
      img: '/images/oscar.jpg',
    },
    {
      name: 'Mr. Sushil Nowal',
      position: 'Vice President, JSW Steel Ltd',
      text: "RACE's project management team has been quite instrumental in setting up standards and streamlining our outbound logistics at JSW. Their agility and knowledge of the subject help them implement programs quickly.",
      // Photo file /images/Mr.-Sushil-Nowal.jpg does not exist: show initials.
      img: null,
    },
    {
      name: 'Mr. GV Rao',
      position: 'Head Strategic Planning, Volvo Group',
      text: 'RACE has been instrumental in demonstrating their benchmarking skills. Their acumen in international markets helped us plan our strategies for the future.',
      // Photo file /images/gv.jpg does not exist: show initials.
      img: null,
    },
    {
      name: 'Mr. Nithin Shrotri',
      position: 'Head LCV, Product Planning at Mahindra & Mahindra',
      text: 'As LCV market leaders, identifying niche gaps is challenging. RACE’s research helped validate new product needs, guiding our engineering design and decision-making.',
      img: '/images/nithin.jpg',
    },
    {
      name: 'Mr. Rajive Saharia',
      position: 'ED, Ashok Leyland',
      text: 'My experience with RACE was quite astonishing. I have never seen such an enthusiastic team with passion to perform. Their reports on CV product benchmarking were quite exclusive and supportive in aiding strategic decisions.',
      img: '/images/saha.jpg',
    },
    {
      name: 'Mr. Ranga Prasad',
      position: 'R&D, Daimler India Pvt Ltd',
      text: 'RACE is recognized as an application engineering company, and that came through in my interactions with their team. They did a commendable job of executing our project with sheer professionalism from start to finish. Their efforts are really commendable.',
      img: null, // no photo yet: initials are shown
    },
    {
      name: 'Mr. Prashanth Ahir',
      position: 'General Manager, Bajaj Auto',
      text: "RACE's dedication and in-depth research delivered valuable insights for strategic decisions, completing the project ahead of schedule.",
      img: null, // no photo yet: initials are shown
    },
    {
      name: 'Mr. M Balasubramanian',
      position: 'Senior General Manager – Product Planning at Mahindra & Mahindra',
      text: 'RACE identified stakeholder needs and market opportunities, providing insights that helped Mahindra refine product development, positioning, and strategic pricing.',
      img: null, // no photo yet: initials are shown
    },
    {
      name: 'Mr. Nagaraj',
      position: 'Manager, Sterlite Copper Ltd',
      text: "RACE's engineering team, with their knowledge of advanced systems, has been very helpful in overcoming bottlenecks in our transport system.",
      img: null, // no photo yet: initials are shown
    },
    {
      name: 'Mr. A. Sadiq',
      position: 'Director, Parveen Travels (P) Ltd',
      text: "RACE, a leader in transportation marketing, helped develop 'Motorzone,' now a thriving service hub for commercial vehicles. We look forward to more collaborations.",
      img: '/images/sadiq.png',
    },
    {
      name: 'Mr. Ashok Chaudhary',
      position: 'Managing Director, Sonu Cargo Movers (P) Ltd',
      text: 'As a transport company & logistics provider, operating Over Dimensional Cargo (ODC) movement, we are excited about our association with RACE. RACE’s strategic market insights & domain expertise have enabled us to expand our customer base & create better value for our end customers.',
      img: '/images/ashok.jpg',
    },
    {
      name: 'Mr. R. S. Bhatiya',
      position: 'Director, Black Diamond Motors',
      text: "With RACE's engineering support, we've enhanced our tip trailer range and reduced costs through value engineering. We value this partnership and its benefits for our customers.",
      img: '/images/bhatiya.jpg',
    },
    {
      name: 'Mr. Velmurugan',
      position: 'Head of Logistics, Gamesa',
      text: "RACE's market research & analytical tools have helped us select the best-in-class logistics service provider, thereby empowering us to achieve best practices in the logistics vertical and the vendor evaluation report was very informative & useful and largely reduced our logistics operating costs.",
      img: '/images/velmurugan-1.jpg',
    },
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 text-center">
          <h2>
            <span style={{ color: 'black' }}>Our</span>{' '}
            <span style={{ color: '#293BB1' }}>Testimonials</span>
          </h2>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            modules={[Autoplay, Pagination]}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div
                  className="card p-3 text-center d-flex flex-column align-items-center"
                  style={{
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    borderRadius: '10px',
                    backgroundColor: 'white',
                    height: '340px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '20px',
                  }}
                >
                  <p style={{ flexGrow: 1, fontSize: '14px', minHeight: '100px' }}>
                    {testimonial.text}
                  </p>
                  <div className="d-flex flex-column align-items-center">
                    {testimonial.img ? (
                      <Image
                        src={testimonial.img}
                        alt={testimonial.name}
                        width={80}
                        height={80}
                        unoptimized
                        loading="lazy"
                        style={{
                          objectFit: 'cover',
                          borderRadius: '50%',
                          marginBottom: '.5rem',
                        }}
                      />
                    ) : (
                      // No real photo: initials in the same 80px circle
                      // instead of a placeholder picture.
                      <span
                        aria-hidden="true"
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          marginBottom: '.5rem',
                          backgroundColor: '#293BB1',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '1.6rem',
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(testimonial.name)}
                      </span>
                    )}
                    <h3
                      style={{
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        margin: '5px 0',
                      }}
                    >
                      {testimonial.name}
                    </h3>
                    <p
                      style={{
                        fontWeight: 'lighter',
                        fontSize: '0.9rem',
                      }}
                    >
                      {testimonial.position}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Testimonial_v2;
