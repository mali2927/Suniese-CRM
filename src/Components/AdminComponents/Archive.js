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

  useEffect(() => {
    // Fetch archived leads from the Laravel API
    fetch(`${config.baseURL}/archived-leads`)
      .then((response) => response.json())
      .then((data) => setArchivedLeads(data))
      .catch((error) => console.error("Error fetching archived leads:", error));
  }, []);

  // Function to handle opening the modal with selected lead data
  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLead(null);
  };

  // Function to delete the lead
  const handleDeleteLead = (leadId) => {
    fetch(`${config.baseURL}/delete-lead/${leadId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        // Remove the lead from the state after deletion
        setArchivedLeads(archivedLeads.filter((lead) => lead.id !== leadId));
        console.log("Lead deleted successfully.");
      })
      .catch((error) => console.error("Error deleting lead:", error));
  };

  // Function to restore the lead
  const handleRestoreLead = (leadId) => {
    fetch(`${config.baseURL}/restore-lead/${leadId}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => {
        // Update the list to reflect the restored lead
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
              {archivedLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.id}</td>
                  <td>{lead.title}</td>
                  <td>{lead.first_name}</td>
                  <td>{lead.surname}</td>
                  <td>{lead.email}</td>
                  <td>
                    {/* View Button */}
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleViewLead(lead)}
                    >
                      View
                    </Button>{" "}
                    {/* Restore Button */}
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleRestoreLead(lead.id)}
                    >
                      Restore
                    </Button>{" "}
                    {/* Delete Button */}
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
      </main>

      {/* Modal for Viewing Lead Details */}
      <ViewLeadModal
        show={showModal}
        handleClose={handleCloseModal}
        lead={selectedLead}
      />
    </div>
  );
};

export default Archive;
