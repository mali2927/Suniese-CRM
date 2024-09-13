import React, { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../SideBar";
import { styles } from "../../Styles/dashboardStyles";
import { Table, Button, Card, ListGroup, Modal, Form } from "react-bootstrap";

const dummyLeads = [
  { id: 1, name: "John Doe", status: "cold", details: "Lead 1 details" },
  { id: 2, name: "Jane Smith", status: "warm", details: "Lead 2 details" },
  { id: 3, name: "Mike Johnson", status: "hot", details: "Lead 3 details" },
];

const Leads = () => {
  const [leads, setLeads] = useState(dummyLeads);
  const [showModal, setShowModal] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", status: "cold", details: "" });
  const [activeSection, setActiveSection] = useState(null);

  const handleStatusChange = (id, newStatus) => {
    setLeads(
      leads.map((lead) =>
        lead.id === id ? { ...lead, status: newStatus } : lead
      )
    );
  };

  const convertToSale = (id) => {
    if (window.confirm("Are you sure you want to convert this lead to a sale?")) {
      setLeads(leads.filter((lead) => lead.id !== id));
    }
  };

  const addLead = () => {
    setLeads([...leads, { id: leads.length + 1, ...newLead }]);
    setShowModal(false);
  };

  const renderSectionContent = (section) => {
    switch(section) {
      case 'totalLeads':
        return (
          <ListGroup variant="flush">
            <ListGroup.Item>Total Leads: {leads.length}</ListGroup.Item>
          </ListGroup>
        );
      case 'individualLeads':
        return (
          <Table striped bordered hover responsive className="mt-3">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.id}</td>
                  <td>{lead.name}</td>
                  <td>{lead.status}</td>
                  <td>{lead.details}</td>
                  <td>
                    <Button
                      variant="outline-warning"
                      className="me-2 mb-2"
                      onClick={() =>
                        handleStatusChange(
                          lead.id,
                          lead.status === "cold" ? "warm" : "hot"
                        )
                      }
                    >
                      Change Status
                    </Button>
                    <Button
                      variant="outline-success"
                      className="me-2 mb-2"
                      onClick={() => convertToSale(lead.id)}
                    >
                      Convert to Sale
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        );
      case 'transferLeads':
        return (
          <Table striped bordered hover responsive className="mt-3">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.id}</td>
                  <td>{lead.name}</td>
                  <td>{lead.status}</td>
                  <td>
                    <Button variant="outline-info" className="me-2 mb-2" onClick={() => handleStatusChange(lead.id, "cold")}>Set to Cold</Button>
                    <Button variant="outline-warning" className="me-2 mb-2" onClick={() => handleStatusChange(lead.id, "warm")}>Set to Warm</Button>
                    <Button variant="outline-success" className="me-2 mb-2" onClick={() => handleStatusChange(lead.id, "hot")}>Set to Hot</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        );
      default:
        return <div className="mt-4">Select a section to view details</div>;
    }
  };

  return (
    <>
      <div style={styles.container}>
        <Sidebar />
        <main style={styles.mainContent}>
          <Navbar />
          <h2 className="mb-4">Leads</h2>
          <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>Add New Lead</Button>

          <div className="section-selector mb-4">
            <Button variant="primary" className="me-2" onClick={() => setActiveSection('totalLeads')}>Total Leads Report</Button>
            <Button variant="secondary" className="me-2" onClick={() => setActiveSection('individualLeads')}>Individual Lead Reports</Button>
            <Button variant="success" className="me-2" onClick={() => setActiveSection('transferLeads')}>Transfer Leads</Button>
          </div>

          <div className="section-content">
            {renderSectionContent(activeSection)}
          </div>

          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Lead</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formLeadName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={newLead.name}
                    onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formLeadDetails">
                  <Form.Label>Details</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter details"
                    value={newLead.details}
                    onChange={(e) => setNewLead({...newLead, details: e.target.value})}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={addLead}>
                Save Lead
              </Button>
            </Modal.Footer>
          </Modal>
        </main>
      </div>
    </>
  );
};

export default Leads;
