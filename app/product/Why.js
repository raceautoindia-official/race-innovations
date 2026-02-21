'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

export default function EnquiryForm() {
  const [formData, setFormData] = useState({
    name: '',
    company_name: '',
    email: '',
    designation: '',
    phone: '',
    location: '',
    area_of_interest: '',
    preferred_contact: '',
    message: '',
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/api/enquiry', formData);

      if (res.data.success) {
        toast.success('Enquiry submitted successfully!');
        setFormData({
          name: '',
          company_name: '',
          email: '',
          designation: '',
          phone: '',
          location: '',
          area_of_interest: '',
          preferred_contact: '',
          message: '',
        });
        handleCloseModal();
      } else {
        toast.error(res.data.message || 'Submission failed.');
      }
    } catch (err) {
      toast.error('Error submitting enquiry');
    }
  };

  return (
    <div className="container" style={{ marginBottom: '100px' }}>
      {/* Button Section */}
      <motion.div
        className="d-flex justify-content-between align-items-center bg-dark p-3 rounded"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h4 className="text-light mb-0">
          Connect with us For Tailored Business Solutions
        </h4>
        <button className="btn btn-light" onClick={handleOpenModal}>
          For More Enquiries
        </button>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal d-block"
            tabIndex="-1"
            role="dialog"
            onClick={handleCloseModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <motion.div
              className="modal-dialog modal-lg"
              role="document"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { duration: 0.3 } }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Connect with Us for{' '}
                    <span className="text-primary">Tailored Business Solutions</span>
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>

                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      {[
                        { label: 'Name', name: 'name', required: true },
                        { label: 'Company Name', name: 'company_name', required: true },
                        { label: 'Email', name: 'email', type: 'email', required: true },
                        { label: 'Designation', name: 'designation' },
                        { label: 'Phone Number', name: 'phone', required: true },
                        { label: 'Location', name: 'location' },
                      ].map((field, index) => (
                        <div className="col-md-6" key={index}>
                          <label className="form-label">
                            {field.label}
                            {field.required && <span className="text-danger"> *</span>}
                          </label>
                          <input
                            type={field.type || 'text'}
                            className="form-control"
                            name={field.name}
                            placeholder={`Enter your ${field.label}`}
                            value={formData[field.name]}
                            onChange={handleChange}
                            required={field.required}
                          />
                        </div>
                      ))}

                      <div className="col-md-6">
                        <label className="form-label">
                          Area of Interest <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="area_of_interest"
                          value={formData.area_of_interest}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Your Area of Interest</option>
                          <option>Technic</option>
                          <option>Intellect</option>
                          <option>Connect</option>
                          <option>LBI Route Survey</option>
                          <option>Accounting & Legal</option>
                          <option>Market Report</option>
                          <option>Product Report</option>
                          <option>Strategic Report</option>
                          <option>Flash Report</option>
                          <option>Investors</option>
                          <option>Funding</option>
                          <option>IT Services</option>
                          <option>ODC Logistics</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Preferred Mode of Contact <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="preferred_contact"
                          value={formData.preferred_contact}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Contact Method</option>
                          <option>Email</option>
                          <option>Phone</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label">
                          Message <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className="form-control"
                          name="message"
                          placeholder="Enter your Message"
                          rows="4"
                          value={formData.message}
                          onChange={handleChange}
                          required
                        ></textarea>
                      </div>
                    </div>

                    <div className="modal-footer mt-4">
                      <button className="btn btn-primary" type="submit">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
