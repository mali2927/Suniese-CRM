import React, { useState } from "react";
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
    services: [],
    installationTime: "0-6 months", // Default value
    preferredMethod: "cash", // Default value
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevFormData) => {
        const updatedServices = checked
          ? [...prevFormData.services, value]
          : prevFormData.services.filter((service) => service !== value);

        return { ...prevFormData, services: updatedServices };
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { ...formData };

    try {
      const response = await fetch(`${config.baseURL}/inquiries/${user_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
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
          services: [],
          installationTime: "0-6 months",
          preferredMethod: "cash",
        });
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
      <form onSubmit={handleSubmit} className="container mt-4 text-start">
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
        <div className="row">
          <div className="col-md-12 mb-3">
            <label className="form-label">Services</label>
            <div className="form-check">
              <input
                type="checkbox"
                id="maintenance"
                name="services"
                value="maintenance"
                onChange={handleChange}
                className="form-check-input"
              />
              <label htmlFor="maintenance" className="form-check-label">
                Maintenance Check
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                id="monitoring"
                name="services"
                value="monitoring"
                onChange={handleChange}
                className="form-check-input"
              />
              <label htmlFor="monitoring" className="form-check-label">
                Monitoring Check
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                id="installation"
                name="services"
                value="installation"
                onChange={handleChange}
                className="form-check-input"
              />
              <label htmlFor="installation" className="form-check-label">
                Installation Check
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="installationTime" className="form-label">
              Time When You Will Install Solar Panel
            </label>
            <select
              id="installationTime"
              name="installationTime"
              value={formData.installationTime}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="0-6 months">0-6 Months</option>
              <option value="6-12 months">6-12 Months</option>
              <option value="12+ months">12+ Months</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Preferred Method</label>
            <div className="form-check">
              <input
                type="radio"
                id="cash"
                name="preferredMethod"
                value="cash"
                checked={formData.preferredMethod === "cash"}
                onChange={handleChange}
                className="form-check-input"
              />
              <label htmlFor="cash" className="form-check-label">
                Cash
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                id="finance"
                name="preferredMethod"
                value="finance"
                checked={formData.preferredMethod === "finance"}
                onChange={handleChange}
                className="form-check-input"
              />
              <label htmlFor="finance" className="form-check-label">
                Finance
              </label>
            </div>
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
