import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import Navbar from "../Navbar";
import { styles } from "../../Styles/dashboardStyles";
import config from "../../config";

const Inquiry = () => {
  const [inquiryLink, setInquiryLink] = useState("");
  const [error, setError] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedConsultantId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!selectedConsultantId) {
      setError("User ID not found.");
      return;
    }

    // Fetch the inquiry link from the backend, passing the user_id
    fetch(`${config.baseURL}/inquiry-link?user_id=${selectedConsultantId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Ensure the content type is set
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.inquiry_link) {
          setInquiryLink(data.inquiry_link);
        } else {
          setError("Inquiry link not found.");
        }
      })
      .catch((err) => {
        setError("An error occurred while fetching the inquiry link.");
      });

    // Fetch submitted inquiries for the user
    fetch(
      `${config.baseURL}/submitted-inquiries?user_id=${selectedConsultantId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setInquiries(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("An error occurred while fetching submitted inquiries.");
        setLoading(false);
      });
  }, [selectedConsultantId]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(inquiryLink)
      .then(() => {
        alert("Inquiry link copied to clipboard!");
      })
      .catch((err) => {
        alert("Failed to copy inquiry link.");
      });
  };

  return (
    <div style={styles.container} className="d-flex">
      <Sidebar />
      <main style={styles.mainContent} className="p-4 w-100">
        <Navbar />
        <h1 className="mb-4">Inquiry Details</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        {inquiryLink && (
          <div className="card p-3 shadow-sm w-50 mx-auto">
            <p className="mb-3">
              <strong>Inquiry Link:</strong> {inquiryLink}
            </p>
            <button
              onClick={handleCopy}
              className="btn btn-primary btn-sm d-inline-block"
            >
              Copy Link
            </button>
          </div>
        )}

        <h2 className="mt-5">Submitted Inquiries</h2>
        {loading ? (
          <div>Loading inquiries...</div>
        ) : (
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th scope="col">Full Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone Number</th>
                <th scope="col">Homeowner Status</th>
                <th scope="col">Address</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length > 0 ? (
                inquiries.map((inquiry, index) => (
                  <tr key={index}>
                    <td>{inquiry.full_name}</td>
                    <td>{inquiry.email}</td>
                    <td>{inquiry.phone_number}</td>
                    <td>{inquiry.homeowner_status}</td>
                    <td>{inquiry.full_address}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default Inquiry;
