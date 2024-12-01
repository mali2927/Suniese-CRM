import React, { useEffect, useState } from "react";
import Sidebar from "../SideBar";
import Navbar from "../Navbar";
import { styles } from "../../Styles/dashboardStyles";
import config from "../../config";
import { Button } from "react-bootstrap";
import ViewLeadModal from "./Modals/ViewLeadModal";

const Archive = () => {
  const [archivedLeads, setArchivedLeads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch archived leads from the Laravel API
    fetch(`${config.baseURL}/archived-leads`)
      .then((response) => response.json())
      .then((data) => setArchivedLeads(data))
      .catch((error) => console.error("Error fetching archived leads:", error));
  }, []);

  // Filter leads based on search query
  const filteredLeads = archivedLeads.filter(
    (lead) =>
      lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);

  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLead(null);
  };

  const handleDeleteLead = (leadId) => {
    fetch(`${config.baseURL}/delete-lead/${leadId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setArchivedLeads(archivedLeads.filter((lead) => lead.id !== leadId));
        console.log("Lead deleted successfully.");
      })
      .catch((error) => console.error("Error deleting lead:", error));
  };

  const handleRestoreLead = (leadId) => {
    fetch(`${config.baseURL}/restore-lead/${leadId}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => {
        setArchivedLeads(archivedLeads.filter((lead) => lead.id !== leadId));
        console.log("Lead restored successfully.");
      })
      .catch((error) => console.error("Error restoring lead:", error));
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.mainContent}>
        <Navbar />
        <h2>Archived Leads</h2>

        {/* Search Bar */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>First Name</th>
                <th>Surname</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.id}</td>
                  <td>{lead.title}</td>
                  <td>{lead.first_name}</td>
                  <td>{lead.surname}</td>
                  <td>{lead.email}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleViewLead(lead)}
                    >
                      View
                    </Button>{" "}
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleRestoreLead(lead.id)}
                    >
                      Restore
                    </Button>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteLead(lead.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="d-flex justify-content-between align-items-center">
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <div>
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>{" "}
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </main>

      <ViewLeadModal
        show={showModal}
        handleClose={handleCloseModal}
        lead={selectedLead}
      />
    </div>
  );
};

export default Archive;
