"use client";
import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";

function LoanForm() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [mobile_no, setMobileNo] = useState("");
  const [date_of_birth, setDateOfBirth] = useState("");
  const [age, setAge] = useState("");
  const [employer_name, setEmployerName] = useState("");
  const [employer_address, setEmployerAddress] = useState("");
  const [take_home_salary, setTakeHomeSalary] = useState("");
  const [work_experience_years, setWorkExperienceYears] = useState("");
  const [loan_required, setLoanRequired] = useState("");
  const [repayable_installment, setRepayableInstallment] = useState("");
  const [previous_loans, setPreviousLoans] = useState("");
  const [residence_type, setResidenceType] = useState("");
  const [months_in_current_residence, setMonthsInCurrentResidence] =
    useState("");
  const [files, setFiles] = useState({
    salary_slip: null,
    appointment_letter: null,
    address_id_proof: null,
    additional_income: null,
  });

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("city", city);
    formData.append("email", email);
    formData.append("mobile_no", mobile_no);
    formData.append("date_of_birth", date_of_birth);
    formData.append("age", age);
    formData.append("employer_name", employer_name);
    formData.append("employer_address", employer_address);
    formData.append("take_home_salary", take_home_salary);
    formData.append("work_experience_years", work_experience_years);
    formData.append("previous_loan1", previous_loans.loan1);
    formData.append("previous_loan2", previous_loans.loan2);
    formData.append("previous_loan3", previous_loans.loan3);
    formData.append("repayable_installment", repayable_installment);
    formData.append("previous_loans", previous_loans);
    formData.append("residence_type", residence_type);
    formData.append("months_in_current_residence", months_in_current_residence);
    formData.append("created_at", new Date().toISOString());

    Object.keys(files).forEach((key) => {
      if (files[key]) {
        formData.append(key, files[key]);
      }
    });

    try {
      const res = await fetch("/api/funding/uploads", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      const data = await res.json();
if (res.ok) {
  toast.success("Upload successful!");
} else {
  toast.error("Upload failed: " + data.error);
}
} catch (error) {
  toast.error("An error occurred during upload.");
  setTimeout(() => {
    window.location.reload();
  }, 3000); 
}
  }

  return (
    <div className="container mt-4">
      <h1 style={{ textAlign: "center", color: "#293BB1" }}>
        Loan Application Form
      </h1>

      <form
        className="mt-4 p-4 border rounded"
        style={{ border: "2px solid #293BB1" }}
        onSubmit={handleUpload}
      >
        <div className="row">
          <h2 className="col-12 mt-3" style={{ color: "#293BB1" }}>
            Personal Information
          </h2>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control p-2"
              placeholder="Enter your name" style={{ backgroundColor: "#ecf5fe" }} 
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Email <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control p-2"
              placeholder="Enter your email" style={{ backgroundColor: "#ecf5fe" }} 
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Mobile No <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="tel"
              value={mobile_no}
              onChange={(e) => setMobileNo(e.target.value)}
              className="form-control p-2"
              placeholder="Enter your mobile number" style={{ backgroundColor: "#ecf5fe" }} 
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Date of Birth <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="date"
              value={date_of_birth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="form-control p-2" style={{ backgroundColor: "#ecf5fe" }} 
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Age <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="form-control p-2"
              placeholder="Enter your age" style={{ backgroundColor: "#ecf5fe" }} 
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">
              City <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="form-control p-2"
              placeholder="Enter your city" style={{ backgroundColor: "#ecf5fe" }} 
              required
            />
          </div>

          {/* ✅ Employment Details */}
          <h2 className="col-12 mt-3" style={{ color: "#293BB1" }}>
            Employment Details
          </h2>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Employer Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              value={employer_name}
              onChange={(e) => setEmployerName(e.target.value)}
              className="form-control p-2"
              placeholder="Enter employer name" style={{ backgroundColor: "#ecf5fe" }} 
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Employer Address <span style={{ color: "red" }}>*</span>
            </label>
            <textarea
              value={employer_address}
              onChange={(e) => setEmployerAddress(e.target.value)}
              className="form-control p-2"
              rows="3"
              placeholder="Enter employer address" style={{ backgroundColor: "#ecf5fe" }} 
              required
            ></textarea>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Take Home Salary <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="tel"
              value={take_home_salary}
              onChange={(e) => setTakeHomeSalary(e.target.value)}
              className="form-control p-2"
              placeholder="Enter take-home salary" style={{ backgroundColor: "#ecf5fe" }} 
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Current Work Experience (Years){" "}
              <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="tel"
              value={work_experience_years}
              onChange={(e) => setWorkExperienceYears(e.target.value)}
              className="form-control p-2"
              placeholder="Enter work experience" style={{ backgroundColor: "#ecf5fe" }} 
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Repayable Installment <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="tel"
              value={repayable_installment}
              onChange={(e) => setRepayableInstallment(e.target.value)}
              className="form-control p-2"
              placeholder="Enter repayable installment" style={{ backgroundColor: "#ecf5fe" }} 
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">
              Residence Type <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="tel"
              value={residence_type}
              onChange={(e) => setResidenceType(e.target.value)}
              className="form-control p-2"
              placeholder="Enter repayable installment" style={{ backgroundColor: "#ecf5fe" }} 
              required
            />
          </div>

          {/* ✅ Previous Loans (Now Separate Inputs) */}
          <div className="col-md-6 mb-3">
            <label className="form-label">
              Previous Loan 1 <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="tel"
              value={previous_loans.loan1}
              onChange={(e) =>
                setPreviousLoans({ ...previous_loans, loan1: e.target.value })
              }
              className="form-control p-2"
              placeholder="Enter loan amount" style={{ backgroundColor: "#ecf5fe" }} 
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Previous Loan 2 <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="tel"
              value={previous_loans.loan2}
              onChange={(e) =>
                setPreviousLoans({ ...previous_loans, loan2: e.target.value })
              }
              className="form-control p-2"
              placeholder="Enter loan amount"
              required style={{ backgroundColor: "#ecf5fe" }} 
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Previous Loan 3 <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="tel"
              value={previous_loans.loan3}
              onChange={(e) =>
                setPreviousLoans({ ...previous_loans, loan3: e.target.value })
              }
              className="form-control p-2"
              placeholder="Enter loan amount" style={{ backgroundColor: "#ecf5fe" }} 
              required
            />
          </div>

          {/* ✅ Select Your Residence (File Uploads) */}
          <h2 className="col-12 mt-3" style={{ color: "#293BB1" }}>
            Select Your Residence
          </h2>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Self Owned <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              name="self_owned"
              className="form-control p-2"
              required
              onChange={handleFileChange} style={{ backgroundColor: "#ecf5fe" }} 
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Parent Owned <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              name="parent_owned"
              className="form-control p-2"
              required
              onChange={handleFileChange} style={{ backgroundColor: "#ecf5fe" }} 
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Bachelor with PG Rented <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              name="bachelor_pg_rented"
              className="form-control p-2"
              required
              onChange={handleFileChange} style={{ backgroundColor: "#ecf5fe" }} 
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Company Provided <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              name="company_provided"
              className="form-control p-2"
              required
              onChange={handleFileChange} style={{ backgroundColor: "#ecf5fe" }} 
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Rented <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              name="rented"
              className="form-control p-2"
              required
              onChange={handleFileChange} style={{ backgroundColor: "#ecf5fe" }} 
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Number of Months in Current Residence{" "}
              <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              name="months_in_residence"
              className="form-control p-2"
              required
              onChange={handleFileChange} style={{ backgroundColor: "#ecf5fe" }} 
            />
          </div>

          {/* ✅ Documents Required */}
          <h2 className="col-12 mt-3" style={{ color: "#293BB1" }}>
            Documents Required
          </h2>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Salary Slip <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              name="salary_slip"
              className="form-control p-2"
              required
              onChange={handleFileChange} style={{ backgroundColor: "#ecf5fe" }} 
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Appointment Letter-Stability{" "}
              <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              name="appointment_letter"
              className="form-control p-2"
              required
              onChange={handleFileChange} style={{ backgroundColor: "#ecf5fe" }} 
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Address & ID Proof <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              name="address_id_proof"
              className="form-control p-2"
              required
              onChange={handleFileChange} style={{ backgroundColor: "#ecf5fe" }} 
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Additional Income - Rent/Others{" "}
              <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              name="additional_income"
              className="form-control p-2"
              required
              onChange={handleFileChange} style={{ backgroundColor: "#ecf5fe" }} 
            />
          </div>

          {/* Submit Button */}
          <div className="col-12 text-center mt-3">
            <button
              type="submit"
              className="btn btn-primary float-end"
              style={{ backgroundColor: "#19417a", width: "100px" }}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoanForm;
