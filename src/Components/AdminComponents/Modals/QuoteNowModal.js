import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";

const QuoteNowModal = ({
  show,
  handleClose,
  handleSubmit,
  quoteUrl,
  setQuoteUrl,
}) => {
  const [error, setError] = useState("");

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleFormSubmit = () => {
    if (!validateUrl(quoteUrl)) {
      setError("Please enter a valid URL.");
    } else {
      setError("");
      handleSubmit();
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Quote Now</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Quote URL</Form.Label>
            <Form.Control
              type="url"
              placeholder="Enter Quote URL"
              value={quoteUrl}
              onChange={(e) => setQuoteUrl(e.target.value)}
            />
            {error && (
              <Alert variant="danger" className="mt-2">
                {error}
              </Alert>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleFormSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QuoteNowModal;
