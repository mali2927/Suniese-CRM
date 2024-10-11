import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Sidebar from "../SideBar";
import { styles } from "../../Styles/dashboardStyles";
import {
  Tabs,
  Tab,
  Table,
  Pagination,
  Form,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";
import config from "../../config";

const Pipeline = () => {
  const [key, setKey] = useState("won");
  const [wonLeads, setWonLeads] = useState([]);
  const [lostLeads, setLostLeads] = useState([]);
  const [searchTermWon, setSearchTermWon] = useState("");
  const [searchTermLost, setSearchTermLost] = useState("");
  const [currentPageWon, setCurrentPageWon] = useState(1);
  const [currentPageLost, setCurrentPageLost] = useState(1);
  const leadsPerPage = 10; // Number of leads per page

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${config.baseURL}/leads`);
      const result = await response.json();

      if (result.success) {
        const won = result.data.filter(
          (lead) => lead.status && lead.status.id === 5
        );
        const lost = result.data.filter(
          (lead) => lead.status && lead.status.id === 4
        );

        // Assuming the remarks are included in the lost leads
        setWonLeads(won);
        setLostLeads(lost);
      } else {
        console.error("Failed to fetch leads");
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };
  console.log(lostLeads);

  // Filter leads based on search term for each tab
  const filteredWonLeads = wonLeads.filter(
    (lead) =>
      lead.first_name.toLowerCase().includes(searchTermWon.toLowerCase()) ||
      lead.surname.toLowerCase().includes(searchTermWon.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTermWon.toLowerCase())
  );

  const filteredLostLeads = lostLeads.filter(
    (lead) =>
      lead.first_name.toLowerCase().includes(searchTermLost.toLowerCase()) ||
      lead.surname.toLowerCase().includes(searchTermLost.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTermLost.toLowerCase())
  );

  // Pagination logic for each tab
  const indexOfLastLeadWon = currentPageWon * leadsPerPage;
  const indexOfFirstLeadWon = indexOfLastLeadWon - leadsPerPage;
  const currentWonLeads = filteredWonLeads.slice(
    indexOfFirstLeadWon,
    indexOfLastLeadWon
  );

  const indexOfLastLeadLost = currentPageLost * leadsPerPage;
  const indexOfFirstLeadLost = indexOfLastLeadLost - leadsPerPage;
  const currentLostLeads = filteredLostLeads.slice(
    indexOfFirstLeadLost,
    indexOfLastLeadLost
  );

  // Calculate the average selling price for won leads
  const totalPayment = filteredWonLeads.reduce(
    (sum, lead) => sum + parseFloat(lead.total_payment || 0),
    0
  );
  const averageSellingPrice =
    filteredWonLeads.length > 0
      ? (totalPayment / filteredWonLeads.length).toFixed(2)
      : 0;

  return (
    <>
      <div style={styles.container}>
        <Sidebar />
        <main style={styles.mainContent}>
          <Navbar />
          <h2>Pipeline</h2>
          <Tabs
            id="pipeline-tabs"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="won" title="Won">
              <Row className="mb-3">
                <Col md={6} lg={4}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search won leads..."
                      value={searchTermWon}
                      onChange={(e) => setSearchTermWon(e.target.value)}
                      style={{ minWidth: "300px" }}
                    />
                  </InputGroup>
                </Col>
              </Row>

              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Surname</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Quoted Price</th>
                    <th>Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {currentWonLeads.length > 0 ? (
                    currentWonLeads.map((lead) => (
                      <tr key={lead.id}>
                        <td>{lead.first_name}</td>
                        <td>{lead.surname}</td>
                        <td>{lead.email}</td>
                        <td>{lead.phone_number}</td>
                        <td>{lead.quoted_price}</td>
                        <td>{lead.total_payment}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No leads found for Won status.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Display the Average Selling Price below the table */}
              <div className="mt-3">
                <strong>Average Lead Value:</strong> £{averageSellingPrice}
              </div>

              <Pagination>
                {Array.from(
                  { length: Math.ceil(filteredWonLeads.length / leadsPerPage) },
                  (_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPageWon}
                      onClick={() => setCurrentPageWon(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  )
                )}
              </Pagination>
            </Tab>

            <Tab eventKey="lost" title="Lost">
              <Row className="mb-3">
                <Col md={6} lg={4}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search lost leads..."
                      value={searchTermLost}
                      onChange={(e) => setSearchTermLost(e.target.value)}
                      style={{ minWidth: "300px" }}
                    />
                  </InputGroup>
                </Col>
              </Row>

              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Surname</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Quoted Price</th>
                    <th>Remarks</th>
                    <th>Sales Cons.</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLostLeads.length > 0 ? (
                    currentLostLeads.map((lead) => (
                      <tr key={lead.id}>
                        <td>{lead.first_name}</td>
                        <td>{lead.surname}</td>
                        <td>{lead.email}</td>
                        <td>{lead.phone_number}</td>
                        <td>{lead.quoted_price}</td>
                        <td>{lead.lost_remarks[0]?.title || "No remarks"}</td>
                        <td>{lead.user.name || "Unknown"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No leads found for Lost status.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              <Pagination>
                {Array.from(
                  {
                    length: Math.ceil(filteredLostLeads.length / leadsPerPage),
                  },
                  (_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPageLost}
                      onClick={() => setCurrentPageLost(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  )
                )}
              </Pagination>
            </Tab>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default Pipeline;
