import React, { useState } from "react";
import {
  Table,
  Button,
  Dropdown,
  DropdownButton,
  Modal,
  Form,
} from "react-bootstrap";

const LeadsTable = ({
  leads,
  handleStatusChange,
  convertToSale,
  type,
  onViewReport,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");

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
      <Table striped bordered hover responsive className="mt-3">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            {type === "individualLeads" ? <th>Details</th> : null}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.id}</td>
              <td>{lead.name}</td>
              <td>{lead.status}</td>
              {type === "individualLeads" ? <td>{lead.details}</td> : null}
              <td>
                {type === "individualLeads" ? (
                  <Button
                    variant="outline-info"
                    className="me-2 mb-2"
                    onClick={onViewReport}
                  >
                    View Report
                  </Button>
                ) : (
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
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for payment input */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Payment Amount</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="paymentAmount">
              <Form.Label>Total Payment Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter payment amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeadsTable;
