"use client";
import React from "react";
import { useState } from "react";

function LoanForm() {
  const [promotorName, setPromotorName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [cashProfit, setCashProfit] = useState("");
  const [loanRequired, setLoanRequired] = useState("");
  const [repayableInstallment, setRepayableInstallment] = useState("");
  const [previousLoan1, setPreviousLoan1] = useState("");
  const [previousLoan2, setPreviousLoan2] = useState("");
  const [previousLoan3, setPreviousLoan3] = useState("");
  const [currentBusiness, setCurrentBusiness] = useState("");
  const [totalExperience, setTotalExperience] = useState("");
  const [residenceType, setResidenceType] = useState("");

  const [selfOwned, setSelfOwned] = useState("");
  const [parentOwned, setParentOwned] = useState("");
  const [rented, setRented] = useState("");
  const [monthsInResidence, setMonthsInResidence] = useState("");
  
  const [salarySlip, setSalarySlip] = useState(undefined);
  const [appointmentLetter, setAppointmentLetter] = useState(undefined);
  const [bankStatement, setBankStatement] = useState(undefined);
  const [addressProof, setAddressProof] = useState(undefined);
  const [idProof, setIdProof] = useState(undefined);
  const [existingLoanDetails, setExistingLoanDetails] = useState(undefined);
  const [propertyDocuments, setPropertyDocuments] = useState(undefined);
  

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("promotorName", promotorName);
    formData.append("companyName", companyName);
    formData.append("email", email);
    formData.append("mobileNo", mobileNo);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("city", city);
    formData.append("address", address);
    formData.append("cashProfit", cashProfit);
    formData.append("loanRequired", loanRequired);
    formData.append("repayableInstallment", repayableInstallment);
    formData.append("previousLoan1", previousLoan1);
    formData.append("previousLoan2", previousLoan2);
    formData.append("previousLoan3", previousLoan3);
    formData.append("currentBusiness", currentBusiness);
    formData.append("totalExperience", totalExperience);
    formData.append("residenceType", residenceType);
    formData.append("created_at", new Date().toISOString());

    // ✅ Append files (if selected)
    if (selfOwned) formData.append("selfOwned", selfOwned);
    if (parentOwned) formData.append("parentOwned", parentOwned);
    if (rented) formData.append("rented", rented);
    if (monthsInResidence)
      formData.append("monthsInResidence", monthsInResidence);
    if (salarySlip) formData.append("salarySlip", salarySlip);
    if (appointmentLetter)
      formData.append("appointmentLetter", appointmentLetter);
    if (bankStatement) formData.append("bankStatement", bankStatement);
    if (addressProof) formData.append("addressProof", addressProof);
    if (idProof) formData.append("idProof", idProof);
    if (existingLoanDetails)
      formData.append("existingLoanDetails", existingLoanDetails);
    if (propertyDocuments)
      formData.append("propertyDocuments", propertyDocuments);

    try {
      const res = await fetch("/api/funding/finance", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      const data = await res.json();
      if (res.ok) {
        alert("Upload successful!");
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      alert("An error occurred during upload.");
    }
  };
  const handleFileChange = (e, setFile) => {
    const selectedFile = e.target.files[0]; // Get the first selected file
    setFile(selectedFile); // Update the corresponding state
  };

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
          {/* ✅ Personal Information */}
          <h2 className="col-12 mt-3" style={{ color: "#293BB1" }}>
            Personal Information
          </h2>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Promotor Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                value={promotorName}
                onChange={(e) => setPromotorName(e.target.value)}
                className="form-control p-2 border rounded shadow-sm"
                placeholder="Enter Promotor Name"
                style={{ backgroundColor: "#ecf5fe" }}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Company Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="form-control p-2 border rounded shadow-sm"
                placeholder="Enter Company Name"
                style={{ backgroundColor: "#ecf5fe" }}
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
                className="form-control p-2 border rounded shadow-sm"
                placeholder="Enter Email"
                style={{ backgroundColor: "#ecf5fe" }}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Mobile No <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="tel"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                className="form-control p-2 border rounded shadow-sm"
                placeholder="Enter Mobile Number"
                style={{ backgroundColor: "#ecf5fe" }}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Date of Birth <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="form-control p-2 border rounded shadow-sm"
                style={{ backgroundColor: "#ecf5fe" }}
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
                className="form-control p-2 border rounded shadow-sm"
                placeholder="Enter City"
                style={{ backgroundColor: "#ecf5fe" }}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Address <span style={{ color: "red" }}>*</span>
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-control p-2 border rounded shadow-sm"
                rows="3"
                placeholder="Enter Address"
                style={{ backgroundColor: "#ecf5fe" }}
                required
              ></textarea>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Cash Profit <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              value={cashProfit}
              onChange={(e) => setCashProfit(e.target.value)}
              className="form-control p-2"
              placeholder="Enter Cash Profit"
              style={{ backgroundColor: "#ecf5fe" }}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Loan Required <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              value={loanRequired}
              onChange={(e) => setLoanRequired(e.target.value)}
              className="form-control p-2"
              placeholder="Enter Loan Required"
              style={{ backgroundColor: "#ecf5fe" }}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Repayable Installment <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              value={repayableInstallment}
              onChange={(e) => setRepayableInstallment(e.target.value)}
              className="form-control p-2"
              placeholder="Enter Repayable Installment"
              style={{ backgroundColor: "#ecf5fe" }}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Previous Loan 1 <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              value={previousLoan1}
              onChange={(e) => setPreviousLoan1(e.target.value)}
              className="form-control p-2"
              placeholder="Enter loan amount"
              style={{ backgroundColor: "#ecf5fe" }}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Previous Loan 2 <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              value={previousLoan2}
              onChange={(e) => setPreviousLoan2(e.target.value)}
              className="form-control p-2"
              placeholder="Enter loan amount"
              style={{ backgroundColor: "#ecf5fe" }}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Previous Loan 3 <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              value={previousLoan3}
              onChange={(e) => setPreviousLoan3(e.target.value)}
              className="form-control p-2"
              placeholder="Enter loan amount"
              style={{ backgroundColor: "#ecf5fe" }}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Number of Years in Current Business{" "}
              <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              value={currentBusiness}
              onChange={(e) => setCurrentBusiness(e.target.value)}
              className="form-control p-2"
              placeholder="Enter number of years in current business"
              style={{ backgroundColor: "#ecf5fe" }}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Total Experience in This Field{" "}
              <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              value={totalExperience}
              onChange={(e) => setTotalExperience(e.target.value)}
              className="form-control p-2"
              placeholder="Enter total years of experience"
              style={{ backgroundColor: "#ecf5fe" }}
              required
            />
          </div>
        </div>
        <div className="row">
          <h2 className="col-12 mt-3" style={{ color: "#293BB1" }}>
            Select Your Residence
          </h2>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Self Owned <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              className="form-control p-2"
              required
              onChange={(e) => handleFileChange(e, setSelfOwned)}
              style={{ backgroundColor: "#ecf5fe" }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Parent/ Partner Owned <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              className="form-control p-2"
              required
              onChange={(e) => handleFileChange(e, setParentOwned)}
              style={{ backgroundColor: "#ecf5fe" }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Rented <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              className="form-control p-2"
              required
              onChange={(e) => handleFileChange(e, setRented)}
              style={{ backgroundColor: "#ecf5fe" }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Number of Months in Current Residence{" "}
              <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              className="form-control p-2"
              required
              onChange={(e) => handleFileChange(e, setMonthsInResidence)}
              style={{ backgroundColor: "#ecf5fe" }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Repayable Installment <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="number"
              value={repayableInstallment}
              onChange={(e) => setRepayableInstallment(e.target.value)}
              className="form-control p-2"
              placeholder="Enter repayable installment"
              style={{ backgroundColor: "#ecf5fe" }}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Residence Type <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              value={residenceType}
              onChange={(e) => setResidenceType(e.target.value)}
              className="form-control p-2"
              placeholder="Enter residence type"
              style={{ backgroundColor: "#ecf5fe" }}
              required
            />
          </div>
          <div className="row"></div>
          <h2 className="col-12 mt-3" style={{ color: "#293BB1" }}>
            Documents Required
          </h2>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Self Owned <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              name="selfOwned"
              className="form-control p-2"
              required
              onChange={(e) => setSelfOwned(e.target.files[0])}
              style={{ backgroundColor: "#ecf5fe" }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Parent Owned <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              name="parentOwned"
              className="form-control p-2"
              required
              onChange={(e) => setParentOwned(e.target.files[0])}
              style={{ backgroundColor: "#ecf5fe" }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Bachelor with PG Rented <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              name="bachelorPgRented"
              className="form-control p-2"
              required
              onChange={(e) => setBachelorPgRented(e.target.files[0])}
              style={{ backgroundColor: "#ecf5fe" }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Company Provided <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              name="companyProvided"
              className="form-control p-2"
              required
              onChange={(e) => setCompanyProvided(e.target.files[0])}
              style={{ backgroundColor: "#ecf5fe" }}
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
              onChange={(e) => setRented(e.target.files[0])}
              style={{ backgroundColor: "#ecf5fe" }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Number of Months in Current Residence{" "}
              <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="number"
              value={monthsInResidence}
              onChange={(e) => setMonthsInResidence(e.target.value)}
              className="form-control p-2"
              placeholder="Enter number of months"
              style={{ backgroundColor: "#ecf5fe" }}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              IT Full Set INCL Schedules <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              name="itFullSet"
              className="form-control p-2"
              required
              onChange={(e) => setItFullSet(e.target.files[0])}
              style={{ backgroundColor: "#ecf5fe" }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              GST Filed Latest 1 Year <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              name="gstFiled"
              className="form-control p-2"
              required
              onChange={(e) => setGstFiled(e.target.files[0])}
              style={{ backgroundColor: "#ecf5fe" }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Bank Statement <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              name="bankStatement"
              className="form-control p-2"
              required
              onChange={(e) => setBankStatement(e.target.files[0])}
              style={{ backgroundColor: "#ecf5fe" }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Address Proof <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              name="addressProof"
              className="form-control p-2"
              required
              onChange={(e) => setAddressProof(e.target.files[0])}
              style={{ backgroundColor: "#ecf5fe" }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              ID Proof for Companies <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              name="idProof"
              className="form-control p-2"
              required
              onChange={(e) => setIdProof(e.target.files[0])}
              style={{ backgroundColor: "#ecf5fe" }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Existing Loan Details <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              name="existingLoanDetails"
              className="form-control p-2"
              required
              onChange={(e) => setExistingLoanDetails(e.target.files[0])}
              style={{ backgroundColor: "#ecf5fe" }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Complete Property Documents{" "}
              <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="file"
              name="propertyDocuments"
              className="form-control p-2"
              required
              onChange={(e) => setPropertyDocuments(e.target.files[0])}
              style={{ backgroundColor: "#ecf5fe" }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-12 d-flex justify-content-end">
          <button
            type="submit"
            className="btn btn-primary"
            style={{ backgroundColor: "#19417a", width: "100px" }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoanForm;
