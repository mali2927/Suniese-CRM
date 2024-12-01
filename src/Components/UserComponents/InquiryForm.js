import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import Navbar from "../Navbar";
import { styles } from "../../Styles/dashboardStyles";
import config from "../../config";

const InquiryForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    fullAddress: "",
    email: "",
    phoneNumber: "",
    homeownerStatus: "owner", // Default value as "owner"
  });

  const [inquiries, setInquiries] = useState([]);
  const selectedConsultantId = localStorage.getItem("user_id");

  // Fetch existing inquiries on component mount
  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await fetch(`${config.baseURL}/inquiries`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      } else {
        console.error("Error fetching inquiries");
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...formData,
      user_id: selectedConsultantId,
    };

    try {
      const response = await fetch(`${config.baseURL}/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`, // Include the token if necessary
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Inquiry submitted successfully!");
        fetchInquiries(); // Refresh the list after submission
        setFormData({
          fullName: "",
          fullAddress: "",
          email: "",
          phoneNumber: "",
          homeownerStatus: "owner",
        }); // Clear the form after submission
      } else {
        alert("Error submitting inquiry.");
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      try {
        const response = await fetch(`${config.baseURL}/inquiries/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`, // Include the token if necessary
          },
        });
        if (response.ok) {
          alert("Inquiry deleted successfully!");
          fetchInquiries(); // Refresh the list after deletion
        } else {
          alert("Error deleting inquiry.");
        }
      } catch (error) {
        console.error("Error deleting inquiry:", error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.mainContent}>
        <Navbar />
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

        {/* Display the list of inquiries */}
        <h3 className="mt-4">Inquiries</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Full Address</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Homeowner Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td>{inquiry.full_name}</td>
                <td>{inquiry.full_address}</td>
                <td>{inquiry.email}</td>
                <td>{inquiry.phone_number}</td>
                <td>{inquiry.homeowner_status}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(inquiry.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default InquiryForm;
