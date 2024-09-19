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
  }, []); // Empty dependency array means this runs once on mount

  console.log(leads);

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

  const handleModalClose = () => {
    setShowModal(false);
    setPaymentAmount("");
    setSelectedLeadId(null);
  };

  const handleModalSave = () => {
    handleStatusChange(selectedLeadId, "won");
    convertToSale(selectedLeadId, paymentAmount);
    handleModalClose();
  };

  return (
    <>
      {type === "individualLeads" && (
        <Table striped bordered hover responsive className="mt-3">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Designation</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {salesConsultants.map((consultant) => (
              <tr key={consultant.id}>
                <td>{consultant.name}</td>
                <td>{consultant.email}</td>
                <td>{consultant.designation}</td>
                <td>
                  <Button
                    variant="outline-info"
                    onClick={() => onViewReport(consultant.id)}
                  >
                    View Report
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

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
                <td>{lead.user.name}</td>
                <td>{lead.first_name}</td>
                <td>{lead.surname}</td>
                <td>{lead.email}</td>
                <td>{lead.phone_number}</td>
                <td>{lead.quoted_price}</td>
                <td>{lead.meeting_time}</td>
                <td>{lead.status}</td>
                <td>
                  <DropdownButton
                    id={`dropdown-action-${lead.id}`}
                    title="Actions"
                    variant="outline-primary"
                  >
                    <Dropdown.Item
                      as="button"
                      onClick={() => handleDropdownSelect(lead.id, "setCold")}
                    >
                      <Button
                        variant="outline-primary"
                        className="w-100 text-left"
                      >
                        Set to Cold
                      </Button>
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      onClick={() => handleDropdownSelect(lead.id, "setWarm")}
                    >
                      <Button
                        variant="outline-warning"
                        className="w-100 text-left"
                      >
                        Set to Warm
                      </Button>
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      onClick={() => handleDropdownSelect(lead.id, "setHot")}
                    >
                      <Button
                        variant="outline-success"
                        className="w-100 text-left"
                      >
                        Set to Hot
                      </Button>
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      onClick={() => handleDropdownSelect(lead.id, "lostLead")}
                    >
                      <Button
                        variant="outline-danger"
                        className="w-100 text-left"
                      >
                        Lost Lead
                      </Button>
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      onClick={() => handleDropdownSelect(lead.id, "wonLead")}
                    >
                      <Button
                        variant="outline-success"
                        className="w-100 text-left"
                      >
                        Won Lead
                      </Button>
                    </Dropdown.Item>
                  </DropdownButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal for payment amount */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Convert Lead to Sale</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPaymentAmount">
              <Form.Label>Payment Amount</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeadsTable;
