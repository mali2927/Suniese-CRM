import React, { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../SideBar";
import { styles } from "../../Styles/dashboardStyles";
import { Table, Button, Card, ListGroup } from "react-bootstrap";

const dummyLeads = [
  { id: 1, name: "John Doe", status: "cold", details: "Lead 1 details" },
  { id: 2, name: "Jane Smith", status: "warm", details: "Lead 2 details" },
  { id: 3, name: "Mike Johnson", status: "hot", details: "Lead 3 details" },
];

const Leads = () => {
  const [leads, setLeads] = useState(dummyLeads);

  const handleStatusChange = (id, newStatus) => {
    setLeads(
      leads.map((lead) =>
        lead.id === id ? { ...lead, status: newStatus } : lead
      )
    );
  };

  const convertToSale = (id) => {
    if (
      window.confirm("Are you sure you want to convert this lead to a sale?")
    ) {
      setLeads(leads.filter((lead) => lead.id !== id));
    }
  };

  return (
    <>
      <div style={styles.container}>
        <Sidebar /> {/* Use the Sidebar component here */}
        <main style={styles.mainContent}>
          <Navbar />
          <h2>Leads</h2>

          {/* Total Leads Report */}
          <Card className="mb-4">
            <Card.Header>Total Leads Report</Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>Total Leads: {leads.length}</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          {/* Individual Lead Reports */}
          <Card className="mb-4">
            <Card.Header>Individual Lead Reports</Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
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
                          variant="warning"
                          onClick={() =>
                            handleStatusChange(
                              lead.id,
                              lead.status === "cold" ? "warm" : "hot"
                            )
                          }
                        >
                          Change Status
                        </Button>{" "}
                        <Button
                          variant="success"
                          onClick={() => convertToSale(lead.id)}
                        >
                          Convert to Sale
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Transfer Leads Section */}
          <Card className="mb-4">
            <Card.Header>Transfer Leads</Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
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
                        <Button
                          variant="info"
                          onClick={() => handleStatusChange(lead.id, "cold")}
                        >
                          Set to Cold
                        </Button>{" "}
                        <Button
                          variant="warning"
                          onClick={() => handleStatusChange(lead.id, "warm")}
                        >
                          Set to Warm
                        </Button>{" "}
                        <Button
                          variant="success"
                          onClick={() => handleStatusChange(lead.id, "hot")}
                        >
                          Set to Hot
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </main>
      </div>
    </>
  );
};

export default Leads;
