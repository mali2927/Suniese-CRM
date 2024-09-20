import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditLeadModal = ({
  show,
  handleClose,
  editingLead,
  setEditingLead,
  handleSave,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Lead</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              value={editingLead.first_name}
              onChange={(e) =>
                setEditingLead({ ...editingLead, first_name: e.target.value })
              }
            />
          </Form.Group>
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
          <Form.Group controlId="formMeetingTime">
            <Form.Label>Meeting Time</Form.Label>
            <Form.Control
              type="text"
              value={editingLead.meeting_time}
              onChange={(e) =>
                setEditingLead({
                  ...editingLead,
                  meeting_time: e.target.value,
                })
              }
            />
          </Form.Group>
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
