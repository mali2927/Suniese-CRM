import React, { useEffect, useState } from "react";
import {
  Table,
  Pagination,
  Form,
  InputGroup,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import config from "../../../config";
import ViewLeadModal from "../../AdminComponents/Modals/ViewLeadModal";

const WonLeads = ({
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  leadsPerPage,
}) => {
  const [wonLeads, setWonLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null); // State for selected lead
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility

  useEffect(() => {
    fetchLeads();
  }, []);
  const fetchLeads = async () => {
    try {
      const response = await fetch(`${config.baseURL}/leads`);
      const result = await response.json();

      if (result.success) {
        const won = result.data.filter((lead) => lead.status?.id === 5);
        setWonLeads(won);
      } else {
        console.error("Failed to fetch leads");
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const filteredWonLeads = wonLeads.filter(
    (lead) =>
      lead.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentWonLeads = filteredWonLeads.slice(
    indexOfFirstLead,
    indexOfLastLead
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

  // Function to handle opening the modal
  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLead(null);
  };

  return (
    <div>
      <Row className="mb-3">
        <Col md={6} lg={4}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search won leads..."
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
            <th>Total Value</th>
            <th>Date Won</th>
            <th>Action</th> {/* Add Action column */}
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
                <td>{new Date(lead.updated_at).toISOString().split("T")[0]}</td>
                <td>
                  <Button
                    variant="info"
                    onClick={() => handleViewLead(lead)} // Trigger the modal
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No leads found for Won status.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="mt-3">
        <strong>Average Lead Value:</strong> £{averageSellingPrice}
      </div>

      <Pagination>
        {Array.from(
          { length: Math.ceil(filteredWonLeads.length / leadsPerPage) },
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

      {/* ViewLeadModal */}
      <ViewLeadModal
        show={showModal}
        handleClose={handleCloseModal}
        lead={selectedLead}
      />
    </div>
  );
};

export default WonLeads;
