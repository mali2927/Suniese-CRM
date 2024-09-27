// src/AdminComponents/LeadsTable.js

import React, { useState, useEffect } from "react";
import config from "../../config";
import {
  Table,
  Button,
  Modal,
  Form,
  DropdownButton,
  Dropdown,
  Row,
  Col,
  Alert,
} from "react-bootstrap";

import ConvertLeadToSaleModal from "../AdminComponents/Modals/ConvertLeadToSaleModal";
import EditLeadModal from "../AdminComponents/Modals/EditLeadModal";
import ViewLeadModal from "../AdminComponents/Modals/ViewLeadModal";

const LeadsTable = ({
  type,
  leads, // Accept leads as a prop
  handleStatusChange,
  convertToSale,
  onViewReport,
  salesConsultants,
}) => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLead, setEditingLead] = useState({
    first_name: "",
    surname: "",
    email: "",
    phone_number: "",
    quoted_price: "",
    meeting_time: "",
    status: "",
  });
  const [statuses, setStatuses] = useState([]);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [statusError, setStatusError] = useState(null); // To handle status fetching errors
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // Function to handle viewing a lead
  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setShowViewModal(true);
  };

  // Fetch statuses from the API
  const fetchStatuses = async () => {
    try {
      const response = await fetch(`${config.baseURL}/lead-statuses`);
      const result = await response.json();
      setStatuses(result); // Store statuses in state
      setLoadingStatuses(false); // Set loading to false after fetching
      console.log("Fetched statuses:", result); // Log fetched statuses
    } catch (error) {
      console.error("Error fetching lead statuses:", error);
      setStatusError("Failed to load statuses.");
      setLoadingStatuses(false); // Ensure loading is false on error as well
    }
  };

  // Fetch statuses on component mount
  useEffect(() => {
    fetchStatuses();
  }, []);

  // Handle dropdown selection for changing status
  const handleDropdownSelect = async (leadId, action) => {
    let statusId;

    // Directly set the status ID based on the action
    switch (action) {
      case "setCold":
        statusId = statuses.find((status) => status.title === "Cold")?.id;
        break;
      case "setWarm":
        statusId = statuses.find((status) => status.title === "Warm")?.id;
        break;
      case "setHot":
        statusId = statuses.find((status) => status.title === "Hot")?.id;
        break;
      case "setLost":
        statusId = statuses.find((status) => status.title === "Lost")?.id;
        break;
      case "setWon":
        setSelectedLeadId(leadId);
        setShowModal(true);
        return; // Exit early for 'Won' status
      default:
        return;
    }

    // Validate statusId
    if (!statusId) {
      alert("Invalid status selected.");
      console.log("Action:", action, "Available statuses:", statuses);
      return;
    }

    // Update the lead's status
    try {
      const response = await fetch(`${config.baseURL}/leads/${leadId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statusId }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Lead status updated successfully!");
        handleStatusChange(leadId, statusId); // Update status in parent state
      } else {
        alert("Failed to update the lead status");
      }
    } catch (error) {
      console.error("Error updating lead status:", error);
      alert("An error occurred while updating the lead status.");
    }
  };

  // Handle editing a lead
  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setShowEditModal(true);
  };

  // Save edited lead
  const handleEditSave = async () => {
    try {
      const response = await fetch(`${config.baseURL}/update-lead/${editingLead.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingLead),
      });

      const result = await response.json();
      if (result.success) {
        alert("Lead updated successfully!");
        setShowEditModal(false);
        // Optionally, notify parent to refetch leads or update state
      } else {
        alert("Failed to update the lead");
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      alert("An error occurred while updating the lead.");
    }
  };

  // Save payment amount for converting to sale
  const handleModalSave = async () => {
    try {
      const response = await fetch(`${config.baseURL}/leads/${selectedLeadId}/payment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ total_payment: paymentAmount }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Total payment updated successfully!");
        setShowModal(false);
        // Optionally, notify parent to refetch leads or update state
      } else {
        alert("Failed to update total payment");
      }
    } catch (error) {
      console.error("Error updating total payment:", error);
      alert("An error occurred while updating total payment.");
    }

    setShowModal(false);
  };

  // Enhanced Filter: Include all relevant fields
  const filteredLeads = leads.filter((lead) => {
    const query = searchQuery.toLowerCase();

    // Helper function to safely get string representations
    const getString = (value) => {
      if (value === null || value === undefined) return "";
      if (typeof value === "object") return JSON.stringify(value).toLowerCase();
      return value.toString().toLowerCase();
    };

    return (
      getString(lead.id).includes(query) ||
      getString(lead.user?.name).includes(query) ||
      getString(lead.first_name).includes(query) ||
      getString(lead.surname).includes(query) ||
      getString(lead.email).includes(query) ||
      getString(lead.phone_number).includes(query) ||
      getString(lead.quoted_price).includes(query) ||
      getString(lead.meeting_time).includes(query) ||
      getString(lead.status?.title).includes(query)
    );
  });

  return (
    <>
      {type === "transferLeads" && (
        <>
          {/* Search Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              margin: "20px 0",
              padding: "0 10px",
            }}
          >
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "10px 15px",
                width: "100%",
                maxWidth: "600px", // Increased maxWidth to accommodate more content
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "16px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "border-color 0.3s",
              }}
            />
          </div>

          {leads.length === 0 ? (
            <Alert variant="info">No leads available for transfer.</Alert>
          ) : (
            <Table striped bordered hover responsive className="mt-3">
              <thead className="thead-dark">
                <tr>
                  <th>ID</th>
                  <th>Sales Consultant</th>
                  <th>First Name</th>
                  <th>Surname</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Quoted Price (£)</th>
                  <th>Meeting Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td>{lead.id}</td>
                      <td>{lead.user?.name || "N/A"}</td>
                      <td>{lead.first_name || "N/A"}</td>
                      <td>{lead.surname || "N/A"}</td>
                      <td>{lead.email || "N/A"}</td>
                      <td>{lead.phone_number || "N/A"}</td>
                      <td>
                        £
                        {parseFloat(lead.quoted_price || 0).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>
                        {lead.meeting_time
                          ? new Date(lead.meeting_time).toLocaleString()
                          : "N/A"}
                      </td>
                      <td>{lead.status?.title || "N/A"}</td>
                      <td>
                        <Row>
                          <Col xs="auto" className="mb-1">
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => handleEditLead(lead)}
                            >
                              Edit
                            </Button>
                          </Col>
                          <Col xs="auto" className="mb-1">
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleViewLead(lead)}
                            >
                              View
                            </Button>
                          </Col>
                          <Col xs="auto" className="mb-1">
                            <DropdownButton
                              id={`dropdown-action-${lead.id}`}
                              title="Change Status"
                              variant="outline-primary"
                              size="sm"
                            >
                              {loadingStatuses ? (
                                <Dropdown.Item disabled>Loading...</Dropdown.Item>
                              ) : statusError ? (
                                <Dropdown.Item disabled>{statusError}</Dropdown.Item>
                              ) : (
                                statuses.map((status) => (
                                  <Dropdown.Item
                                    key={status.id}
                                    onClick={() =>
                                      handleDropdownSelect(lead.id, `set${status.title}`)
                                    }
                                  >
                                    {status.title}
                                  </Dropdown.Item>
                                ))
                              )}
                            </DropdownButton>
                          </Col>
                        </Row>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center" }}>
                      No leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </>
      )}

      {/* Other types can be handled here if needed */}

      {/* Modals */}
      <ConvertLeadToSaleModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        paymentAmount={paymentAmount}
        setPaymentAmount={setPaymentAmount}
        handleSave={handleModalSave}
      />

      <EditLeadModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        editingLead={editingLead}
        setEditingLead={setEditingLead}
        handleSave={handleEditSave}
      />

      <ViewLeadModal
        show={showViewModal}
        handleClose={() => setShowViewModal(false)}
        lead={selectedLead}
      />
    </>
  );
};

export default LeadsTable;
