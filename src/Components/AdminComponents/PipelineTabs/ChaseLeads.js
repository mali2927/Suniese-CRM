import React, { useEffect, useState } from "react";
import {
  Table,
  Pagination,
  Form,
  InputGroup,
  Row,
  Col,
  Button,
  Modal,
} from "react-bootstrap";
import config from "../../../config";

const ChaseLeads = ({
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  leadsPerPage,
}) => {
  const [chaseLeads, setChaseLeads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false); // New state for notes modal
  const [selectedLead, setSelectedLead] = useState(null);
  const [chaseMethod, setChaseMethod] = useState(""); // Email or Phone
  const [talkDetail, setTalkDetail] = useState(""); // Talk details
  const [chaseDate, setChaseDate] = useState(""); // Date when chased
  const [chaseNotes, setChaseNotes] = useState([]); // Chase notes for the selected lead
  const [allChaseNotes, setAllChaseNotes] = useState([]); // All chase notes for displaying in modal

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${config.baseURL}/leads`);
      const result = await response.json();

      if (result.success) {
        const filteredLeads = result.data.filter(
          (lead) =>
            !lead.status ||
            lead.status == "" ||
            ![4, 5].includes(lead.status.id)
        );
        setChaseLeads(filteredLeads);
      } else {
        console.error("Failed to fetch leads for the selected consultant");
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchChaseNotes = async (leadId) => {
    try {
      const response = await fetch(`${config.baseURL}/chase_notes/${leadId}`);
      const result = await response.json();

      if (result.success) {
        setChaseNotes(result.data);
      } else {
        console.error("Failed to fetch chase notes");
      }
    } catch (error) {
      console.error("Error fetching chase notes:", error);
    }
  };

  const handleChaseClick = (lead) => {
    setSelectedLead(lead);
    fetchChaseNotes(lead.id); // Fetch chase notes when a lead is selected
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setChaseMethod("");
    setTalkDetail("");
    setChaseDate("");
    setChaseNotes([]); // Clear chase notes when closing the modal
  };

  const handleSaveChaseNote = async () => {
    if (!selectedLead) return;

    const chaseNote = {
      lead_id: selectedLead.id,
      talk_details: talkDetail,
      chased_via: chaseMethod,
      date_contacted: chaseDate,
    };

    try {
      const response = await fetch(`${config.baseURL}/chase_notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chaseNote),
      });
      const result = await response.json();

      if (result.success) {
        alert("Chase note saved successfully!");
        fetchChaseNotes(selectedLead.id); // Refresh chase notes after saving
        handleCloseModal(); // Close the modal after saving
      } else {
        console.error("Failed to save chase note");
      }
    } catch (error) {
      console.error("Error saving chase note:", error);
    }
  };
  const handleNotesClick = async (lead) => {
    setSelectedLead(lead);
    try {
      const response = await fetch(`${config.baseURL}/chase_notes/${lead.id}`);
      const result = await response.json();
      if (result.success) {
        setAllChaseNotes(result.data);
        setShowNotesModal(true); // Show modal when notes are fetched
      } else {
        console.error("Failed to fetch all chase notes");
      }
    } catch (error) {
      console.error("Error fetching all chase notes:", error);
    }
  };
  const handleCloseNotesModal = () => {
    setShowNotesModal(false); // Close the notes modal
    setAllChaseNotes([]); // Clear notes data when closing the modal
  };
  const filteredChaseLeads = chaseLeads.filter(
    (lead) =>
      (lead.first_name &&
        lead.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.surname &&
        lead.surname.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.email &&
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <th>Latest Chase Notes</th>
            <th>Actions</th> {/* New Actions Column */}
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
                <td>
                  <Button variant="link" onClick={() => handleNotesClick(lead)}>
                    {lead.chase_notes[0]?.talk_detail || "View Notes"}
                  </Button>
                </td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleChaseClick(lead)}
                  >
                    Chase
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
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

      {/* Chase Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chase Lead</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="chaseMethod">
              <Form.Label>Chased Via</Form.Label>
              <Form.Control
                as="select"
                value={chaseMethod}
                onChange={(e) => setChaseMethod(e.target.value)}
                required
              >
                <option value="">Select...</option>
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="talkDetail">
              <Form.Label>Talk Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={talkDetail}
                onChange={(e) => setTalkDetail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="chaseDate">
              <Form.Label>Date Contacted</Form.Label>
              <Form.Control
                type="date"
                value={chaseDate}
                onChange={(e) => setChaseDate(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChaseNote}>
            Save Chase Note
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showNotesModal} onHide={handleCloseNotesModal}>
        <Modal.Header closeButton>
          <Modal.Title>All Chase Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Chased Via</th>
                <th>Date Contacted</th>
                <th>Talk Details</th>
              </tr>
            </thead>
            <tbody>
              {allChaseNotes.map((note, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{note.chased_via}</td>
                  <td>{note.last_contacted}</td>
                  <td>{note.talk_detail}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseNotesModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChaseLeads;
