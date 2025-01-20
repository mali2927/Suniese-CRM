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
  const [errors, setErrors] = useState({});

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
            <Col md={6}>
              <Form.Group
                controlId="formTotalContractValueNet"
                className="mb-3"
              >
                <Form.Label>Total Contract Value Net (£)</Form.Label>
                <Form.Control
                  type="number"
                  name="totalContractValueNet"
                  value={editingLead.total_contract_value_net}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      total_contract_value_net: e.target.value,
                    })
                  }
                  placeholder="Enter Contract Value Net"
                  min="0"
                  step="0.01"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.totalContractValueNet}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group
                controlId="formTotalContractValueGross"
                className="mb-3"
              >
                <Form.Label>Total Contract Value Gross (£)</Form.Label>
                <Form.Control
                  type="number"
                  name="totalContractValueGross"
                  value={editingLead.total_contract_value_gross}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      total_contract_value_gross: e.target.value,
                    })
                  }
                  isInvalid={!!errors.total_contract_value_gross}
                  placeholder="Enter Contract Value Gross"
                  min="0"
                  step="0.01"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.totalContractValueGross}
                </Form.Control.Feedback>
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
          <Row>
            {/* Customer Type */}
            <Col md={6}>
              <Form.Group controlId="formCustomerType" className="mb-3">
                <Form.Label>Customer Type</Form.Label>
                <Form.Control
                  as="select"
                  name="customerType"
                  value={editingLead.customer_type}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      customer_type: e.target.value,
                    })
                  }
                >
                  <option value="">-- Select Customer Type --</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Residential">Residential</option>
                  <option value="Educational">Educational</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formMaintenanceCheck" className="mb-3">
                <Form.Label>Checks</Form.Label>
                <div className="d-flex flex-column">
                  <Form.Check
                    type="checkbox"
                    label="Maintenance Check"
                    name="maintenanceCheck"
                    value="1"
                    onChange={(e) =>
                      setEditingLead({
                        ...editingLead,
                        maintenance_check: e.target.value,
                      })
                    }
                    checked={editingLead.maintenance_check === "1"}
                    className="mb-2"
                    id="maintenanceCheck"
                  />
                  <Form.Check
                    type="checkbox"
                    label="Installation of Solar Panel"
                    name="installationCheck"
                    value="1"
                    onChange={(e) =>
                      setEditingLead({
                        ...editingLead,
                        installation_check: e.target.value,
                      })
                    }
                    checked={editingLead.installation_check === "1"}
                    className="mb-2"
                    id="installationCheck"
                  />
                  <Form.Check
                    type="checkbox"
                    label="Monitoring of Solar Panel"
                    name="monitoringCheck"
                    value="1"
                    onChange={(e) =>
                      setEditingLead({
                        ...editingLead,
                        monitoring_check: e.target.value,
                      })
                    }
                    checked={editingLead.monitoring_check === "1"}
                    className="mb-2"
                    id="monitoringCheck"
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            {/* Contract Length */}
            <Col md={6}>
              <Form.Group controlId="formContractLength" className="mb-3">
                <Form.Label>Contract Length (Months)</Form.Label>
                <Form.Control
                  as="select"
                  name="contractLength"
                  value={editingLead.contract_length}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      contract_length: e.target.value,
                    })
                  }
                  isInvalid={!!errors.contract_length}
                >
                  <option value="">-- Select Contract Length --</option>
                  <option value="12">12 Months</option>
                  <option value="24">24 Months</option>
                  <option value="36">36 Months</option>
                  <option value="3">3 Months</option>
                  <option value="custom">Custom</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.contractLength}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Payment Method */}
            <Col md={6}>
              <Form.Group controlId="formPaymentMethod" className="mb-3">
                <Form.Label>Payment Method</Form.Label>
                <Form.Control
                  as="select"
                  name="paymentMethod"
                  value={editingLead.payment_method}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      payment_method: e.target.value,
                    })
                  }
                  isInvalid={!!errors.payment_method}
                >
                  <option value="">-- Select Payment Method --</option>
                  <option value="cash">Cash</option>
                  <option value="debit">Debit</option>
                  <option value="credit">Credit</option>
                  <option value="finance">Finance</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.paymentMethod}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              {editingLead.contract_length === "custom" && (
                <Row>
                  <Col md={6}>
                    <Form.Group
                      controlId="formCustomContractLength"
                      className="mb-3"
                    >
                      <Form.Label>Custom Contract Length (Months)</Form.Label>
                      <Form.Control
                        type="number"
                        name="customContractLength"
                        value={editingLead.contract_length}
                        onChange={(e) =>
                          setEditingLead({
                            ...editingLead,
                            custom_contract_length: e.target.value,
                          })
                        }
                        isInvalid={!!errors.contractLength}
                        placeholder="Enter Contract Length"
                        min="0"
                        step="1"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.contractLength}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
          <Row>
            {/* Payment Frequency */}
            <Col md={6}>
              <Form.Group controlId="formpayment_frequency" className="mb-3">
                <Form.Label>Payment Frequency</Form.Label>
                <Form.Control
                  as="select"
                  name="payment_frequency"
                  value={editingLead.payment_frequency}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      payment_frequency: e.target.value,
                    })
                  }
                  isInvalid={!!errors.payment_frequency}
                >
                  <option value="">-- Select Payment Frequency --</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="half-yearly">Half-Yearly</option>
                  <option value="annually">Annually</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.payment_frequency}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formcommission_status" className="mb-3">
                <Form.Label>Status for Comission</Form.Label>
                <Form.Control
                  as="select"
                  name="commission_status"
                  value={editingLead.commission_status}
                  onChange={(e) =>
                    setEditingLead({
                      ...editingLead,
                      commission_status: e.target.value,
                    })
                  }
                  isInvalid={!!errors.commission_status}
                >
                  <option value="">-- Select Status for Comission --</option>
                  <option value="internal">Internal</option>
                  <option value="external">External</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.commission_status}
                </Form.Control.Feedback>
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
