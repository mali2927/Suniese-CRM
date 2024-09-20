import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ConvertLeadToSaleModal = ({
  show,
  handleClose,
  paymentAmount,
  setPaymentAmount,
  handleSave,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Convert Lead to Sale</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formPaymentAmount">
            <Form.Label>Payment Amount</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConvertLeadToSaleModal;
