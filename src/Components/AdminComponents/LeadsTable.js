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

const LeadsTable = ({
  type,
  handleStatusChange,
  convertToSale,
  onViewReport,
  salesConsultants,
}) => {
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
        statusId = statuses.find((status) => status.title === "Lost")?.id;
        break;
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

  return (
    <>
      {type === "transferLeads" && (
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
            {leads.map((lead) => (
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
            ))}
          </tbody>
        </Table>
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
    </>
  );
};

export default LeadsTable;
