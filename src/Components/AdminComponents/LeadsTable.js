import React, { useState, useEffect } from "react";
import config from "../../config";
import {
  Table,
  Button,
  Modal,
  Form,
  DropdownButton,
  Dropdown,
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

  useEffect(() => {
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

    fetchLeads();
  }, []);

  const handleDropdownSelect = (leadId, action) => {
    switch (action) {
      case "setCold":
        handleStatusChange(leadId, "cold");
        break;
      case "setWarm":
        handleStatusChange(leadId, "warm");
        break;
      case "setHot":
        handleStatusChange(leadId, "hot");
        break;
      case "lostLead":
        handleStatusChange(
          leadId,
          leads.find((lead) => lead.id === leadId).status === "cold"
            ? "warm"
            : "hot"
        );
        break;
      case "wonLead":
        setSelectedLeadId(leadId);
        setShowModal(true);
        break;
      default:
        break;
    }
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    const updatedLeads = leads.map((lead) =>
      lead.id === editingLead.id ? { ...editingLead } : lead
    );
    setLeads(updatedLeads);
    setShowEditModal(false);
  };

  const handleModalSave = () => {
    handleStatusChange(selectedLeadId, "won");
    convertToSale(selectedLeadId, paymentAmount);
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
                  <Button
                    variant="outline-info"
                    onClick={() => handleEditLead(lead)}
                  >
                    Edit
                  </Button>
                  <DropdownButton
                    id={`dropdown-action-${lead.id}`}
                    title="Actions"
                    variant="outline-primary"
                  >
                    <Dropdown.Item
                      as="button"
                      onClick={() => handleDropdownSelect(lead.id, "setCold")}
                    >
                      Set to Cold
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      onClick={() => handleDropdownSelect(lead.id, "setWarm")}
                    >
                      Set to Warm
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      onClick={() => handleDropdownSelect(lead.id, "setHot")}
                    >
                      Set to Hot
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      onClick={() => handleDropdownSelect(lead.id, "lostLead")}
                    >
                      Lost Lead
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      onClick={() => handleDropdownSelect(lead.id, "wonLead")}
                    >
                      Won Lead
                    </Dropdown.Item>
                  </DropdownButton>
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
