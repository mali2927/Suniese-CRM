import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const LostRemarkModal = ({ show, handleClose, handleSave }) => {
  const [remark, setRemark] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    handleSave(remark);
    setRemark(""); // Clear input after submission
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Enter Remark</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group controlId="remark">
            <Form.Label>Remark</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LostRemarkModal;
