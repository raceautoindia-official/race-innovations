import React from "react";
import Image from "next/image";

function Form() {
  return (
    <div className="container mt-3">
      <div className="row align-items-center" style={{ minHeight: "80vh" }}>
        <div className="col-12 col-md-7 h-100 d-flex align-items-center mb-4 mb-md-0">
          <Image
            src="/images/im.png"
            width={700} 
            height={500} 
            className="w-100"
            style={{ height: "100%", objectFit: "cover", borderRadius: "30px" }}
            alt="Automotive"
          />
        </div>
        <div className="col-12 col-md-5 h-100 d-flex align-items-center">
          <div
            className="card p-4 w-100 h-100"
            style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", borderRadius: "40px" }}
          >
            <h4 className="text-center mb-4">
              Please share your details to get a call from our Loan Experts
            </h4>

            <div className="row gy-2">
              <div className="col-12 col-md-6 mt-4">
                <label className="form-label">
                  Name <span style={{ color: "red" }}>*</span>
                </label>
                <input type="text" className="form-control p-2" placeholder="Enter your name" required />
              </div>
              <div className="col-12 col-md-6 mt-4">
                <label className="form-label">
                  City <span style={{ color: "red" }}>*</span>
                </label>
                <input type="text" className="form-control p-2" placeholder="Enter your city" required />
              </div>
              <div className="col-12 col-md-6 mt-4">
                <label className="form-label">
                  Mobile No <span style={{ color: "red" }}>*</span>
                </label>
                <input type="tel" className="form-control p-2" placeholder="Enter your mobile number" required />
              </div>
              <div className="col-12 col-md-6 mt-4">
                <label className="form-label">
                  Email <span style={{ color: "red" }}>*</span>
                </label>
                <input type="email" className="form-control p-2" placeholder="Enter your email" required />
              </div>
              <div className="col-12 d-flex align-items-start mt-5">
                <input type="checkbox" id="declaration" className="me-2 mt-1" required />
                <label htmlFor="declaration" className="form-label small" style={{ fontSize: "9px" }}>
                  I declare that the information I have provided is accurate & complete to the best of my knowledge.
                  I hereby authorize Race Innovationss and its affiliates to call, email, send a text through Short Messaging Service (SMS) and/or WhatsApp in relation to any of their products.
                  The consent herein shall override any registration for DNC/NDNC.
                </label>
              </div>
              <div className="col-12 text-center">
                <button className="btn text-white w-md-25 p-2" style={{ backgroundColor: "#19417a" }}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Form;
