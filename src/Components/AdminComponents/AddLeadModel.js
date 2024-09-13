// AddLeadModal.js
import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddLeadModal = ({ showModal, setShowModal, newLead, setNewLead, addLead }) => {
  return (
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
              onChange={(e) =>
                setNewLead({ ...newLead, name: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formLeadDetails">
            <Form.Label>Details</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter details"
              value={newLead.details}
              onChange={(e) =>
                setNewLead({ ...newLead, details: e.target.value })
              }
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
  );
};

export default AddLeadModal;
