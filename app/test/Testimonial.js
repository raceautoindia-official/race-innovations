import React from "react";

function Testimonial() {
  return (
    <>
      <div>
        <h1 className="text-center mt-5">
          <span style={{ color: "black" }}>Our</span>
          <span style={{ color: "#293BB1" }}> Testimonials</span>
        </h1>
      </div>

      {/* Background Image Container */}
      <div className="container-fluid p-0">
        <div
          // style={{
          //   width: "100%",
          //   height: "70vh",
          //   background: "url('/images/bg.jpg') no-repeat center center",
          //   backgroundSize: "cover",
          //   position: "relative",
          // }}
        >
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              // position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              padding: "1rem",
            }}
          >
            <div className="container">
              <div className="row justify-content-center">
                {[
                  {
                    name: "Mr. Sushil Nowal",
                    position: "Chairman, Telma Retarder India (P) Ltd",
                    text: "RACE project management team had been quite instrumental in setting up standards and stream lining our outbound logistics at JSW. Their agility and knowledge on the subject helps them to implement programs in quicker manner.",
                    img: "/images/su.jpg",
                  },
                  {
                    name: "Mr. Oskar Flach",
                    position: "Managing Director - Schmitz Cargobull",
                    text: "RACE provided us with a holistic perspective on the Indian Trailer market study for semi trailers.",
                    img: "/images/janbor.jpg",
                  },
                  {
                    name: "Mr. Sushil Nowal",
                    position: "Vice President, JSW Steel Ltd",
                    text: "RACE project management team had been quite instrumental in setting up standards at JSW.",
                    img: "/images/Mr.-Sushil-Nowal.jpg",
                  },
                ].map((testimonial, index) => (
                  <div key={index} className="col-md-4 col-12 mb-4">
                    <div
                      className="card p-3 text-center"
                      style={{
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        borderRadius: "10px",
                        backgroundColor: "white",
                        height: "100%",
                      }}
                    >
                      <p>{testimonial.text}</p>
                      <div className="d-flex flex-column align-items-center">
                        <img
                          src={testimonial.img}
                          alt={testimonial.name}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginBottom: ".5rem",
                          }}
                        />
                        <h3 style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                          {testimonial.name}
                        </h3>
                        <p
                          style={{
                            fontWeight: "lighter",
                            fontSize: "0.9rem",
                          }}
                        >
                          {testimonial.position}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Testimonial;
