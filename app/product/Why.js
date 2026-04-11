'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

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
    <>
      <div className="container enquiry-form-wrap" style={{ marginBottom: '100px' }}>
        <motion.div
          className="d-flex justify-content-between align-items-center bg-dark p-3 rounded enquiry-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h4 className="text-light mb-0 enquiry-cta-title">
            Connect with us For Tailored Business Solutions
          </h4>
          <button className="btn btn-light enquiry-cta-btn" onClick={handleOpenModal}>
            For More Enquiries
          </button>
        </motion.div>

        <AnimatePresence>
          {showModal && (
            <motion.div
              className="modal d-block enquiry-modal-overlay"
              tabIndex="-1"
              role="dialog"
              onClick={handleCloseModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              <motion.div
                className="modal-dialog modal-lg enquiry-modal-dialog"
                role="document"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, transition: { duration: 0.3 } }}
                exit={{ scale: 0.96, opacity: 0 }}
              >
                <div className="modal-content enquiry-modal-content">
                  <div className="modal-header enquiry-modal-header">
                    <h5 className="modal-title enquiry-modal-title">
                      Connect with Us for{' '}
                      <span className="text-primary">Tailored Business Solutions</span>
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleCloseModal}
                    ></button>
                  </div>

                  <div className="modal-body enquiry-modal-body">
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

                      <div className="modal-footer mt-4 enquiry-modal-footer">
                        <button className="btn btn-primary w-100 w-md-auto" type="submit">
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

      <style jsx>{`
        .enquiry-modal-overlay {
          padding: 12px;
          overflow: hidden;
          z-index: 1055;
        }

        .enquiry-modal-dialog {
          margin: 0 auto;
          max-width: 900px;
          height: calc(100dvh - 24px);
          display: flex;
          align-items: center;
        }

        .enquiry-modal-content {
          width: 100%;
          max-height: calc(100dvh - 24px);
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .enquiry-modal-header {
          flex-shrink: 0;
          padding: 16px 18px;
        }

        .enquiry-modal-title {
          font-size: 1.1rem;
          line-height: 1.35;
          padding-right: 12px;
        }

        .enquiry-modal-body {
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: 18px;
        }

        .enquiry-modal-footer {
          padding-bottom: 0;
          margin-bottom: 0;
        }

        @media (max-width: 767.98px) {
          .enquiry-form-wrap {
            padding-left: 12px;
            padding-right: 12px;
          }

          .enquiry-cta {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 12px;
          }

          .enquiry-cta-title {
            font-size: 1rem;
            line-height: 1.45;
          }

          .enquiry-cta-btn {
            width: 100%;
          }

          .enquiry-modal-overlay {
            padding: 8px;
          }

          .enquiry-modal-dialog {
            max-width: 100%;
            height: calc(100dvh - 16px);
          }

          .enquiry-modal-content {
            max-height: calc(100dvh - 16px);
            border-radius: 14px;
          }

          .enquiry-modal-header {
            padding: 12px 14px;
          }

          .enquiry-modal-title {
            font-size: 0.96rem;
            line-height: 1.35;
            max-width: calc(100% - 36px);
          }

          .enquiry-modal-body {
            padding: 12px 14px 14px;
          }

          .enquiry-modal-body .row {
            --bs-gutter-x: 0.75rem;
            --bs-gutter-y: 0.75rem;
          }

          .enquiry-modal-body .form-control,
          .enquiry-modal-body .form-select {
            font-size: 14px;
            padding: 10px 12px;
          }

          .enquiry-modal-body textarea.form-control {
            min-height: 92px;
          }

          .enquiry-modal-footer {
            margin-top: 14px !important;
          }
        }
      `}</style>
    </>
  );
}