import { React, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import ViewLeadModal from "../Modals/ViewLeadModal";

const QuotedLeads = ({
  leads,
  quotesPerPage,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
}) => {
  // Filter leads based on the search term
  const filteredLeads = leads.filter(
    (lead) =>
      lead?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead?.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead?.phone_number?.includes(searchTerm) ||
      (lead?.quoted_price &&
        lead?.quoted_price?.toString().includes(searchTerm))
  );

  // Pagination logic: Calculate the indices for the current page
  const indexOfLastLead = currentPage * quotesPerPage;
  const indexOfFirstLead = indexOfLastLead - quotesPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  // Calculate total pages
  const totalPages = Math.ceil(filteredLeads.length / quotesPerPage);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const handleViewLeadClick = (lead) => {
    setSelectedLead(lead);
    setShowViewModal(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      {/* Search Bar */}
      <Form.Control
        type="text"
        placeholder="Search Leads..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Surname</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Quoted Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentLeads.length > 0 ? (
            currentLeads.map((lead) => (
              <tr key={lead?.id}>
                <td>{lead?.first_name}</td>
                <td>{lead?.surname}</td>
                <td>{lead?.email}</td>
                <td>{lead?.phone_number}</td>
                <td>{lead?.quoted_price || "N/A"}</td>
                <td>
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
              <td colSpan="6" className="text-center">
                No quoted leads found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between">
        <Button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>

      {/* Modal for View Lead */}
      <ViewLeadModal
        show={showViewModal}
        handleClose={() => setShowViewModal(false)}
        lead={selectedLead}
      />
    </div>
  );
};

export default QuotedLeads;
