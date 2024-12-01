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
} from "react-bootstrap";

import ConvertLeadToSaleModal from "./Modals/ConvertLeadToSaleModal";
import EditLeadModal from "./Modals/EditLeadModal";
import ViewLeadModal from "./Modals/ViewLeadModal"; // Import the new modal
import LostRemarkModal from "./Modals/LostRemarkModal";

const LeadsTable = ({
  type,
  handleStatusChange,
  convertToSale,
  onViewReport,
  salesConsultants,
}) => {
  const [showViewModal, setShowViewModal] = useState(false); // State to control the view modal
  const [selectedLead, setSelectedLead] = useState(null); // State to hold the selected lead data
  const [leads, setLeads] = useState([]);
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
  const [statuses, setStatuses] = useState([]); // State for statuses
  const [loadingStatuses, setLoadingStatuses] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [showLostRemarkModal, setShowLostRemarkModal] = useState(false); // State for lost remark modal

  const handleSaveLostRemark = async (remark) => {
    const userId = parseInt(localStorage.getItem("user_id"), 10);

    try {
      const response = await fetch(
        `${config.baseURL}/leads/${selectedLeadId}/lost-remark`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: remark,
            lead_id: selectedLeadId,
            lost_declared_user: userId,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Lost remark added successfully!");
        fetchLeads(); // Refetch leads to include the new remark
      } else {
        alert("Failed to add lost remark");
      }
    } catch (error) {
      console.error("Error adding lost remark:", error);
      alert("An error occurred while adding the lost remark.");
    }

    setShowLostRemarkModal(false); // Close the modal after saving
  };
  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setShowViewModal(true);
  };

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${config.baseURL}/leads`);
      const result = await response.json();
      if (result.success) {
        setLeads(result.data);
      } else {
        alert("Failed to fetch leads");
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      alert("An error occurred while fetching leads.");
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await fetch(`${config.baseURL}/lead-statuses`);
      const result = await response.json();
      setStatuses(result); // Store statuses in state
      setLoadingStatuses(false); // Set loading to false after fetching
      console.log("Fetched statuses:", result); // Log fetched statuses
    } catch (error) {
      console.error("Error fetching lead statuses:", error);
      alert("An error occurred while fetching lead statuses.");
      setLoadingStatuses(false); // Ensure loading is false on error as well
    }
  };

  console.log("Fetched statuses:", statuses);

  useEffect(() => {
    fetchLeads();
    fetchStatuses(); // Fetch statuses when component mounts
  }, []);

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
        setSelectedLeadId(leadId); // Set the selected lead ID
        setShowLostRemarkModal(true); // Show the lost remark modal
        return; // Exit early for lost lead case
      case "setWon":
        setSelectedLeadId(leadId);
        setShowModal(true);
        return; // Exit early for won lead case
      default:
        return;
    }

    // Check if statusId is valid before proceeding
    if (!statusId) {
      alert("Invalid status selected.");
      console.log("Action:", action, "Available statuses:", statuses);
      return;
    }

    // Proceed with the fetch call using statusId
    try {
      const response = await fetch(`${config.baseURL}/leads/${leadId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statusId }), // Directly send the statusId
      });

      const result = await response.json();
      if (result.success) {
        alert("Lead status updated successfully!");
        fetchLeads(); // Refetch leads after updating status
      } else {
        alert("Failed to update the lead status");
      }
    } catch (error) {
      console.error("Error updating lead status:", error);
      alert("An error occurred while updating the lead status.");
    }
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    try {
      const response = await fetch(
        `${config.baseURL}/update-lead/${editingLead.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingLead), // Send the updated lead data
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Lead updated successfully!");
        setShowEditModal(false);
        fetchLeads(); // Refetch leads after updating
      } else {
        alert("Failed to update the lead");
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      alert("An error occurred while updating the lead.");
    }
    setShowEditModal(false);
  };

  const handleModalSave = async () => {
    try {
      const response = await fetch(
        `${config.baseURL}/leads/${selectedLeadId}/payment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ total_payment: paymentAmount }), // Send total_payment
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Total payment updated successfully!");
        fetchLeads(); // Refetch leads after updating
      } else {
        alert("Failed to update total payment");
      }
    } catch (error) {
      console.error("Error updating total payment:", error);
      alert("An error occurred while updating total payment.");
    }

    setShowModal(false);
  };
  const handleDeleteLead = async (leadId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${config.baseURL}/archiveleads/${leadId}`, {
        method: "POST",
      });

      const result = await response.json();
      if (result.success) {
        alert("Lead deleted successfully!");
        // Optionally, notify parent to refetch leads or update state directly
        handleStatusChange(leadId); // Remove lead from parent state
      } else {
        alert("Failed to delete the lead");
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      alert("An error occurred while deleting the lead.");
    }
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
              margin: "20px 0",
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

          {/* Leads Table */}
          <Table striped bordered hover responsive className="mt-3">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>Sales Consultant</th>
                <th>First Name</th>
                <th>Surname</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Quoted Price</th>
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
                    <td>{lead.quoted_price || "N/A"}</td>
                    <td>{lead.meeting_time || "N/A"}</td>
                    <td>{lead.status?.title || "N/A"}</td>
                    <td>
                      <Row>
                        <Col>
                          <Button
                            variant="outline-info"
                            onClick={() => handleEditLead(lead)}
                          >
                            Edit
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            variant="outline-success"
                            onClick={() => handleViewLead(lead)} // Handle view lead
                          >
                            View
                          </Button>
                        </Col>
                        <Col xs="auto" className="mb-1">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteLead(lead.id)}
                          >
                            Delete
                          </Button>
                        </Col>
                        <Col>
                          <DropdownButton
                            id={`dropdown-action-${lead.id}`}
                            title="Change Status"
                            variant="outline-primary"
                          >
                            {loadingStatuses ? (
                              <Dropdown.Item disabled>Loading...</Dropdown.Item>
                            ) : (
                              statuses.map((status) => (
                                <Dropdown.Item
                                  key={status.id}
                                  onClick={() =>
                                    handleDropdownSelect(
                                      lead.id,
                                      `set${
                                        status.title.charAt(0).toUpperCase() +
                                        status.title.slice(1)
                                      }`
                                    )
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
        </>
      )}

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
        lead={selectedLead} // Pass the selected lead to the modal
      />
      <LostRemarkModal
        show={showLostRemarkModal}
        handleClose={() => setShowLostRemarkModal(false)}
        handleSave={handleSaveLostRemark}
      />
    </>
  );
};

export default LeadsTable;
