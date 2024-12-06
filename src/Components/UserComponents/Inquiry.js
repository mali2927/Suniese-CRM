import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import Navbar from "../Navbar";
import { styles } from "../../Styles/dashboardStyles";
import config from "../../config";

const Inquiry = () => {
  const [inquiryLink, setInquiryLink] = useState("");
  const [error, setError] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const selectedConsultantId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!selectedConsultantId) {
      setError("User ID not found.");
      return;
    }

    // Fetch the inquiry link from the backend
    fetch(`${config.baseURL}/inquiry-link?user_id=${selectedConsultantId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
      .catch(() => {
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
        setFilteredInquiries(data); // Initialize filtered inquiries
        setLoading(false);
      })
      .catch(() => {
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
      .catch(() => {
        alert("Failed to copy inquiry link.");
      });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = inquiries.filter(
      (inquiry) =>
        inquiry.full_name.toLowerCase().includes(query) ||
        inquiry.email.toLowerCase().includes(query) ||
        inquiry.phone_number.includes(query) ||
        inquiry.homeowner_status.toLowerCase().includes(query) ||
        inquiry.full_address.toLowerCase().includes(query)
    );
    setFilteredInquiries(filtered);
    setCurrentPage(1); // Reset to first page when searching
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInquiries.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search inquiries..."
          value={searchQuery}
          onChange={handleSearch}
        />

        {loading ? (
          <div>Loading inquiries...</div>
        ) : (
          <>
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
                {currentItems.length > 0 ? (
                  currentItems.map((inquiry, index) => (
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
            <div className="d-flex justify-content-center mt-3">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`btn btn-sm mx-1 ${
                    currentPage === i + 1
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Inquiry;
