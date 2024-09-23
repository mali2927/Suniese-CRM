import { React, useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import config from "../../../config";

const EditLeadModal = ({
  show,
  handleClose,
  editingLead,
  setEditingLead,
  handleSave,
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (show) {
      fetchUsers();
    }
  }, [show]);

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

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Lead</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            {/* Title */}
            <Col md={6}>
              <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editingLead.title}
                  onChange={(e) =>
                    setEditingLead({ ...editingLead, title: e.target.value })
                  }
                />
              </Form.Group>
            </Col>

            {/* First Name */}
            <Col md={6}>
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editingLead.first_name}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      first_name: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Surname */}
            <Col md={6}>
              <Form.Group controlId="formSurname">
                <Form.Label>Surname</Form.Label>
                <Form.Control
                  type="text"
                  value={editingLead.surname}
                  onChange={(e) =>
                    setEditingLead({ ...editingLead, surname: e.target.value })
                  }
                />
              </Form.Group>
            </Col>

            {/* Email */}
            <Col md={6}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={editingLead.email}
                  onChange={(e) =>
                    setEditingLead({ ...editingLead, email: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Phone Number */}
            <Col md={6}>
              <Form.Group controlId="formPhoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  value={editingLead.phone_number}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      phone_number: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>

            {/* House Number */}
            <Col md={6}>
              <Form.Group controlId="formHouseNumber">
                <Form.Label>House Number</Form.Label>
                <Form.Control
                  type="text"
                  value={editingLead.house_number}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      house_number: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Street Name */}
            <Col md={6}>
              <Form.Group controlId="formStreetName">
                <Form.Label>Street Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editingLead.street_name}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      street_name: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
            {/* Town/City */}
            <Col md={6}>
              <Form.Group controlId="formTownCity">
                <Form.Label>Town/City</Form.Label>
                <Form.Control
                  type="text"
                  value={editingLead.town_city}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      town_city: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Postal Code */}
            <Col md={6}>
              <Form.Group controlId="formPostalCode">
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                  type="text"
                  value={editingLead.postal_code}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      postal_code: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>

            {/* Homeownership Status */}
            <Col md={6}>
              <Form.Group controlId="formHomeownershipStatus">
                <Form.Label>Homeownership Status</Form.Label>
                <Form.Control
                  type="text"
                  value={editingLead.homeownership_status}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      homeownership_status: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* System Quoted */}
            <Col md={6}>
              <Form.Group controlId="formSystemQuoted">
                <Form.Label>System Quoted</Form.Label>
                <Form.Control
                  type="text"
                  value={editingLead.system_quoted}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      system_quoted: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>

            {/* Quoted Price */}
            <Col md={6}>
              <Form.Group controlId="formQuotedPrice">
                <Form.Label>Quoted Price</Form.Label>
                <Form.Control
                  type="text"
                  value={editingLead.quoted_price}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      quoted_price: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Meeting Time */}
            <Col md={6}>
              <Form.Group controlId="formMeetingTime">
                <Form.Label>Meeting Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={editingLead.meeting_time}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      meeting_time: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>

            {/* Best Time to Call */}
            <Col md={6}>
              <Form.Group controlId="formBestTimeToCall">
                <Form.Label>Best Time to Call</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={editingLead.best_time_to_call}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      best_time_to_call: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group controlId="formUser">
                <Form.Label>Re-Assign User</Form.Label>
                <Form.Select
                  value={editingLead.user_id}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      user_id: e.target.value,
                    })
                  }
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.designation} - {user.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditLeadModal;
