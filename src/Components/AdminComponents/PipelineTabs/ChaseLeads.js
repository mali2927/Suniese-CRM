import React, { useEffect, useState } from "react";
import { Table, Pagination, Form, InputGroup, Row, Col } from "react-bootstrap";
import config from "../../../config";

const ChaseLeads = ({
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  leadsPerPage,
}) => {
  const [chaseLeads, setChaseLeads] = useState([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${config.baseURL}/leads`);
      const result = await response.json();

      if (result.success) {
        const chase = result.data.filter(
          (lead) => lead.status && lead.status.id === 3 // Assuming 3 is the ID for Chase status
        );
        setChaseLeads(chase);
      } else {
        console.error("Failed to fetch leads");
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const filteredChaseLeads = chaseLeads.filter(
    (lead) =>
      lead.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentChaseLeads = filteredChaseLeads.slice(
    indexOfFirstLead,
    indexOfLastLead
  );

  return (
    <div>
      <Row className="mb-3">
        <Col md={6} lg={4}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search chase leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            <th>Chase Notes</th>
          </tr>
        </thead>
        <tbody>
          {currentChaseLeads.length > 0 ? (
            currentChaseLeads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.first_name}</td>
                <td>{lead.surname}</td>
                <td>{lead.email}</td>
                <td>{lead.phone_number}</td>
                <td>{lead.quoted_price}</td>
                <td>{lead.chase_notes || "No notes"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No leads found for Chase status.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Pagination>
        {Array.from(
          { length: Math.ceil(filteredChaseLeads.length / leadsPerPage) },
          (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          )
        )}
      </Pagination>
    </div>
  );
};

export default ChaseLeads;
