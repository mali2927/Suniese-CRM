import React, { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import ViewLeadModal from "../Modals/ViewLeadModal";
import config from "../../../config";

const NotQuoted = ({
  leads,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  quotesPerPage,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [quoteUrl, setQuoteUrl] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);

  const filteredLeads = leads.filter((lead) =>
    `${lead.first_name} ${lead.surname} ${lead.email} ${lead.phone_number} ${
      lead.quoted_price
    } ${lead.chase_notes?.[0]?.talk_detail || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLastLead = currentPage * quotesPerPage;
  const indexOfFirstLead = indexOfLastLead - quotesPerPage;
  const currentChaseLeads = filteredLeads.slice(
    indexOfFirstLead,
    indexOfLastLead
  );

  const totalPages = Math.ceil(filteredLeads.length / quotesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleQuoteNowClick = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const handleViewLeadClick = (lead) => {
    setSelectedLead(lead);
    setShowViewModal(true);
  };

  const handleSubmit = () => {
    // Send the quote URL and update the quote status to 1
    fetch(`${config.baseURL}/leads/${selectedLead.id}/update-quote-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Make sure to add the auth token if needed
      },
      body: JSON.stringify({ quote_status: 1 }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert(`Submitted URL: ${quoteUrl} for Lead ID: ${selectedLead.id}`);
          setShowModal(false);
          setQuoteUrl("");
        } else {
          alert("Error updating quote status");
        }
      })
      .catch((error) => {
        alert("An error occurred: " + error.message);
      });
  };

  const handleCancel = () => {
    setShowModal(false);
    setQuoteUrl("");
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search Not Quoted Leads"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control mb-3"
      />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Surname</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Quoted Price</th>
            <th>Latest Chase Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentChaseLeads.length > 0 ? (
            currentChaseLeads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.first_name}</td>
                <td>{lead.surname}</td>
                <td>{lead.email}</td>
                <td>{lead.phone_number}</td>
                <td>{lead.quoted_price || "N/A"}</td>
                <td>
                  {lead.chase_notes?.[0]?.talk_detail || "No Notes Available"}
                </td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleQuoteNowClick(lead)}
                  >
                    Quote Now
                  </Button>{" "}
                  <Button
                    variant="info"
                    onClick={() => handleViewLeadClick(lead)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No leads found for Chase status.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <div className="pagination">
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number}
            className={`btn btn-${
              currentPage === number + 1 ? "primary" : "secondary"
            } mx-1`}
            onClick={() => handlePageChange(number + 1)}
          >
            {number + 1}
          </button>
        ))}
      </div>

      {/* Modal for Quote Now */}
      <Modal show={showModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Quote Now</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Quote URL</Form.Label>
              <Form.Control
                type="url"
                placeholder="Enter Quote URL"
                value={quoteUrl}
                onChange={(e) => setQuoteUrl(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for View Lead */}
      <ViewLeadModal
        show={showViewModal}
        handleClose={() => setShowViewModal(false)}
        lead={selectedLead}
      />
    </div>
  );
};

export default NotQuoted;
