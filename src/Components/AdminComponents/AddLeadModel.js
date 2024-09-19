import { React, useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import config from "../../config";

const AddLeadModal = ({
  showModal,
  setShowModal,
  newLead,
  setNewLead,
  addLead,
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users when modal opens
  useEffect(() => {
    if (showModal) {
      fetchUsers();
    }
  }, [showModal]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${config.baseURL}/showAllUsers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      if (result.success) {
        const mappedUsers = result.data.map((user) => ({
          ...user,
          designation: user.role, // Map role to designation
          active: user.status !== null ? user.status : true, // Set to active if status is null
        }));
        setUsers(mappedUsers);
      } else {
        alert("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("An error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewLead({
      title: "",
      firstName: "",
      surname: "",
      email: "",
      phoneNumber: "",
      houseNumber: "",
      streetName: "",
      townCity: "",
      postalCode: "",
      homeownershipStatus: "",
      systemQuoted: "",
      quotedPrice: "",
      meetingTime: "",
      bestTimeToCall: "",
      consultantId: "",
    });
  };

  const handleSaveLead = async () => {
    await addLead();
    resetForm();
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Lead</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formTitle">
                <Form.Label>Title (Mr./Ms./Mrs.)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  value={newLead.title}
                  onChange={(e) =>
                    setNewLead({ ...newLead, title: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  value={newLead.firstName}
                  onChange={(e) =>
                    setNewLead({ ...newLead, firstName: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formSurname">
                <Form.Label>Surname</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter surname"
                  value={newLead.surname}
                  onChange={(e) =>
                    setNewLead({ ...newLead, surname: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={newLead.email}
                  onChange={(e) =>
                    setNewLead({ ...newLead, email: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formPhoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter phone number"
                  value={newLead.phoneNumber}
                  onChange={(e) =>
                    setNewLead({ ...newLead, phoneNumber: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formHouseNumber">
                <Form.Label>House Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter house number"
                  value={newLead.houseNumber}
                  onChange={(e) =>
                    setNewLead({ ...newLead, houseNumber: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formStreetName">
                <Form.Label>Street Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter street name"
                  value={newLead.streetName}
                  onChange={(e) =>
                    setNewLead({ ...newLead, streetName: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formTownCity">
                <Form.Label>Town/City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter town/city"
                  value={newLead.townCity}
                  onChange={(e) =>
                    setNewLead({ ...newLead, townCity: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formPostalCode">
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter postal code"
                  value={newLead.postalCode}
                  onChange={(e) =>
                    setNewLead({ ...newLead, postalCode: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formHomeownershipStatus">
                <Form.Label>Homeownership Status</Form.Label>
                <div>
                  <Form.Check
                    type="radio"
                    label="Owner"
                    name="homeownershipStatus"
                    value="Owner"
                    checked={newLead.homeownershipStatus === "Owner"}
                    onChange={(e) =>
                      setNewLead({
                        ...newLead,
                        homeownershipStatus: e.target.value,
                      })
                    }
                  />
                  <Form.Check
                    type="radio"
                    label="Tenant"
                    name="homeownershipStatus"
                    value="Tenant"
                    checked={newLead.homeownershipStatus === "Tenant"}
                    onChange={(e) =>
                      setNewLead({
                        ...newLead,
                        homeownershipStatus: e.target.value,
                      })
                    }
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formSystemQuoted">
                <Form.Label>Type of System Quoted</Form.Label>
                <Form.Control
                  as="select"
                  value={newLead.systemQuoted}
                  onChange={(e) =>
                    setNewLead({ ...newLead, systemQuoted: e.target.value })
                  }
                >
                  <option>10 panels with battery</option>
                  <option>8 panels no battery</option>
                  <option>5 panels with inverter</option>
                  <option>Custom system</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formQuotedPrice">
                <Form.Label>Quoted Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter quoted price"
                  value={newLead.quotedPrice}
                  onChange={(e) =>
                    setNewLead({ ...newLead, quotedPrice: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formMeetingTime">
                <Form.Label>Convenient Date and Time for a Meeting</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={newLead.meetingTime}
                  onChange={(e) =>
                    setNewLead({ ...newLead, meetingTime: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formBestTimeToCall">
                <Form.Label>Best Time to Call</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter best time to call"
                  value={newLead.bestTimeToCall}
                  onChange={(e) =>
                    setNewLead({ ...newLead, bestTimeToCall: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          {/* Consultant Selection */}
          <Form.Group className="mb-3" controlId="formConsultant">
            <Form.Label>Select Consultant</Form.Label>
            <Form.Control
              as="select"
              value={newLead.consultantId}
              onChange={(e) =>
                setNewLead({ ...newLead, consultantId: e.target.value })
              }
              disabled={loading}
            >
              <option value="">Select Consultant</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.designation}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveLead}>
          Save Lead
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddLeadModal;
