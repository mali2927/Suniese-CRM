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

const LostLeads = ({
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  leadsPerPage,
}) => {
  const [lostLeads, setLostLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null); // State to store the selected lead
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const selectedConsultantId = localStorage.getItem("user_id");

    try {
      const response = await fetch(
        `${config.baseURL}/leads/lost/consultant/${selectedConsultantId}`
      );
      const result = await response.json();

      if (result.success) {
        setLostLeads(result.data);
      } else {
        console.error("Failed to fetch lost leads");
      }
    } catch (error) {
      console.error("Error fetching lost leads:", error);
    }
  };

  const filteredLostLeads = lostLeads.filter(
    (lead) =>
      (lead?.first_name &&
        lead?.first_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead?.surname &&
        lead?.surname?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead?.email &&
        lead?.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLostLeads = filteredLostLeads.slice(
    indexOfFirstLead,
    indexOfLastLead
  );

  const handleShowModal = (lead) => {
    setSelectedLead(lead);
    setShowModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLead(null); // Reset the selected lead
  };

  return (
    <div>
      <Row className="mb-3">
        <Col md={6} lg={4}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search lost leads..."
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
            <th>Remarks</th>
            <th>Sales Cons.</th>
            <th>Action</th> {/* Added Action column */}
          </tr>
        </thead>
        <tbody>
          {currentLostLeads.length > 0 ? (
            currentLostLeads.map((lead) => (
              <tr key={lead?.id}>
                <td>{lead?.first_name}</td>
                <td>{lead?.surname}</td>
                <td>{lead?.email}</td>
                <td>{lead?.phone_number}</td>
                <td>{lead?.quoted_price}</td>
                <td>{lead?.lost_remarks[0]?.title || "No remarks"}</td>
                <td>{lead?.user.name || "Unknown"}</td>
                <td>
                  <Button
                    variant="info"
                    onClick={() => handleShowModal(lead)} // On click, show the modal
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No leads found for Lost status.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Pagination>
        {Array.from(
          { length: Math.ceil(filteredLostLeads.length / leadsPerPage) },
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

      {/* View Lead Modal */}
      <ViewLeadModal
        show={showModal}
        handleClose={handleCloseModal}
        lead={selectedLead}
      />
    </div>
  );
};

export default LostLeads;
