import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import config from "../../config";

const InquiryForm = () => {
  const { user_id } = useParams(); // Extract user_id from URL parameters
  const [formData, setFormData] = useState({
    fullName: "",
    fullAddress: "",
    email: "",
    phoneNumber: "",
    homeownerStatus: "owner", // Default value as "owner"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { ...formData };

    try {
      const response = await fetch(`${config.baseURL}/inquiries/${user_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`, // Include the token if necessary
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Inquiry submitted successfully!");
        setFormData({
          fullName: "",
          fullAddress: "",
          email: "",
          phoneNumber: "",
          homeownerStatus: "owner",
        }); // Clear the form after submission
      } else {
        alert(result.message || "Error submitting inquiry.");
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <>
      <h2>Inquiry Form</h2>
      <form onSubmit={handleSubmit} className="container mt-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="fullAddress" className="form-label">
              Full Address
            </label>
            <input
              type="text"
              id="fullAddress"
              name="fullAddress"
              value={formData.fullAddress}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="homeownerStatus" className="form-label">
              Homeowner Status
            </label>
            <select
              id="homeownerStatus"
              name="homeownerStatus"
              value={formData.homeownerStatus}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="owner">Owner</option>
              <option value="tenant">Tenant</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
};

export default InquiryForm;
