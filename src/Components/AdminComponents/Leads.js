// src/Leads.js

import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Sidebar from "../SideBar";
import { styles } from "../../Styles/dashboardStyles";
import {
  ListGroup,
  Button,
  Form,
  Spinner,
  Alert,
  Table,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import LeadsTable from "../AdminComponents/LeadsTable";
import LeadActions from "../AdminComponents/LeadAction";
import ReportModal from "../AdminComponents/Modals/ReportModal"; // Ensure this is updated
import config from "../../config";

const Leads = () => {
  // State for leads and consultants
  const [leads, setLeads] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [loadingConsultants, setLoadingConsultants] = useState(true);
  const [errorConsultants, setErrorConsultants] = useState(null);

  // State for selected consultant's leads
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [loadingSelectedLeads, setLoadingSelectedLeads] = useState(false);
  const [errorSelectedLeads, setErrorSelectedLeads] = useState(null);

  // State for modals
  const [showModal, setShowModal] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // State for active section
  const [activeSection, setActiveSection] = useState(null);

  // State for selected consultant
  const [selectedConsultantId, setSelectedConsultantId] = useState("");

  // State for selected consultant's name (for display in ReportModal)
  const [selectedConsultantName, setSelectedConsultantName] = useState("");

  // State for new lead form
  const [newLead, setNewLead] = useState({
    title: "",
    firstName: "",
    surname: "",
    email: "",
    phoneNumber: "",
    houseNumber: "",
    streetName: "",
    townCity: "",
    postalCode: "",
    homeownershipStatus: "Owner",
    systemQuoted: "10 panels with battery",
    quotedPrice: "",
    meetingTime: "",
    bestTimeToCall: "",
    consultantId: "", // Initially empty
    status: "",
    customerType: "",
    clientName: "-",
    endUser: "-",
    serviceDescription: "-",
  });

  // State for validation errors
  const [errors, setErrors] = useState({});

  // Fetch leads and consultants on component mount
  useEffect(() => {
    // Fetch All Leads
    const fetchLeads = async () => {
      try {
        const response = await fetch(`${config.baseURL}/leads`);
        const result = await response.json();
        console.log("Leads API Response:", result); // Debugging Log

        if (result.success) {
          setLeads(result.data);
          console.log("Leads Data Set:", result.data); // Debugging Log
        } else {
          alert("Failed to fetch leads");
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
        alert("An error occurred while fetching leads.");
      }
    };

    // Fetch Consultants
    const fetchConsultants = async () => {
      try {
        const response = await fetch(
          `${config.baseURL}/showUsersForReportInLeads`
        );
        const result = await response.json();
        console.log("Consultants API Response:", result); // Debugging Log

        if (result.success) {
          setConsultants(result.data);
          console.log("Consultants Data Set:", result.data); // Debugging Log
        } else {
          console.warn("Failed to fetch consultants");
          setErrorConsultants("Failed to fetch consultants");
        }
      } catch (error) {
        console.error("Error fetching consultants:", error);
        setErrorConsultants("An error occurred while fetching consultants.");
      } finally {
        setLoadingConsultants(false);
      }
    };

    fetchLeads();
    fetchConsultants();
  }, []);

  // Fetch Leads for Selected Consultant
  useEffect(() => {
    if (selectedConsultantId) {
      const fetchSelectedLeads = async () => {
        setLoadingSelectedLeads(true);
        setErrorSelectedLeads(null);
        try {
          const response = await fetch(
            `${config.baseURL}/searchLeadByConsultantId?user_id=${selectedConsultantId}`
          );
          const result = await response.json();
          console.log("Selected Consultant Leads API Response:", result); // Debugging Log

          if (result.data && result.data.length > 0) {
            setSelectedLeads(result.data);
            // Set the consultant's name for the report
            const consultant = consultants.find(
              (c) => c.id === Number(selectedConsultantId)
            );
            setSelectedConsultantName(
              consultant ? consultant.name : "Unknown Consultant"
            );
            console.log("Selected Leads:", result.data); // Debugging Log
          } else {
            setSelectedLeads([]); // Reset if no leads found
            setSelectedConsultantName("");
            setErrorSelectedLeads("No leads found for this consultant.");
          }
        } catch (error) {
          console.error("Error fetching selected leads:", error);
          setErrorSelectedLeads("An error occurred while fetching leads.");
        } finally {
          setLoadingSelectedLeads(false);
        }
      };

      fetchSelectedLeads();
    } else {
      setSelectedLeads([]); // Reset if no consultant is selected
      setSelectedConsultantName("");
    }
  }, [selectedConsultantId, consultants]);

  // Handle status change for leads
  const handleStatusChange = (id, newStatus) => {
    setLeads(
      leads.map((lead) =>
        lead.id === id ? { ...lead, status: newStatus } : lead
      )
    );
  };

  // Handle converting a lead to a sale
  const convertToSale = (id, paymentAmount) => {
    if (
      window.confirm("Are you sure you want to convert this lead to a sale?")
    ) {
      setLeads(leads.filter((lead) => lead.id !== id));
      // Additional logic to handle sale conversion can be added here
    }
  };

  // Function to add a new lead
  const addLead = async () => {
    console.log("Adding New Lead:", newLead); // Debugging Log
    try {
      const response = await fetch(`${config.baseURL}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newLead,
          user_id: newLead.consultantId, // Assuming consultantId maps to user_id
        }),
      });

      const result = await response.json();
      console.log("Add Lead API Response:", result); // Debugging Log

      if (result.success) {
        alert("Lead added successfully");
        setLeads([...leads, result.data]); // Update leads with the new lead
        setShowModal(false); // Close the modal
        // Reset the newLead state
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
          homeownershipStatus: "Owner",
          systemQuoted: "10 panels with battery",
          quotedPrice: "",
          meetingTime: "",
          bestTimeToCall: "",
          consultantId: "",
          customerType: "",
          status: "",
        });
        setErrors({}); // Reset errors
      } else {
        alert("Failed to add lead");
      }
    } catch (error) {
      console.error("Error adding lead:", error);
      alert("An error occurred while adding the lead.");
    }
  };

  // Handle consultant selection change
  const handleConsultantChange = (e) => {
    setSelectedConsultantId(e.target.value);
  };

  // Mapping status IDs to status labels
  const getStatusLabel = (statusId) => {
    const statusMap = {
      1: "Hot",
      2: "Cold",
      3: "Warm",
      4: "Lost",
      5: "Won",
    };
    return statusMap[statusId] || "Pending";
  };

  // Function to render section content based on active section
  const renderSectionContent = (section) => {
    console.log("Selected Leads at render:", selectedLeads); // Debugging Log
    switch (section) {
      case "totalLeads":
        return (
          <ListGroup variant="flush">
            <ListGroup.Item>Total Leads: {leads.length}</ListGroup.Item>
          </ListGroup>
        );
      case "individualLeads":
        return (
          <div>
            <Form.Group controlId="consultantSelect" className="mb-3">
              <Form.Label>Select Consultant</Form.Label>
              {loadingConsultants ? (
                <div>
                  <Spinner animation="border" size="sm" /> Loading
                  consultants...
                </div>
              ) : errorConsultants ? (
                <Alert variant="danger">{errorConsultants}</Alert>
              ) : consultants.length > 0 ? (
                <Form.Control
                  as="select"
                  value={selectedConsultantId}
                  onChange={handleConsultantChange}
                >
                  <option value="">-- Select Consultant --</option>
                  {consultants.map((consultant) => (
                    <option key={consultant.id} value={consultant.id}>
                      {consultant.name} - {consultant.role}
                    </option>
                  ))}
                </Form.Control>
              ) : (
                <p>No consultants available.</p>
              )}
            </Form.Group>

            {selectedConsultantId && (
              <div>
                {/* Add the 'View Report' button */}
                <div className="mb-3">
                  <Button variant="info" onClick={() => setShowReport(true)}>
                    View Report
                  </Button>
                </div>

                {loadingSelectedLeads ? (
                  <div>
                    <Spinner animation="border" size="sm" /> Loading leads...
                  </div>
                ) : errorSelectedLeads ? (
                  <Alert variant="danger">{errorSelectedLeads}</Alert>
                ) : selectedLeads.length > 0 ? (
                  <div>
                    <h4 className="mt-4">
                      Leads for:{" "}
                      {
                        consultants.find(
                          (consultant) =>
                            consultant.id === Number(selectedConsultantId)
                        )?.name
                      }{" "}
                      (
                      {
                        consultants.find(
                          (consultant) =>
                            consultant.id === Number(selectedConsultantId)
                        )?.role
                      }
                      )
                    </h4>
                    {/* Responsive Table */}
                    <div className="table-responsive">
                      <Table striped bordered hover size="sm" className="mt-3">
                        <thead className="thead-dark">
                          <tr>
                            <th style={{ width: "5%" }}>#</th>
                            <th style={{ width: "8%" }}>Title</th>
                            <th style={{ width: "12%" }}>First Name</th>
                            <th style={{ width: "12%" }}>Surname</th>
                            <th style={{ width: "15%" }}>Email</th>
                            <th style={{ width: "10%" }}>Phone Number</th>
                            <th style={{ width: "20%" }}>Address</th>
                            <th style={{ width: "10%" }}>System Quoted</th>
                            <th style={{ width: "8%" }}>Quoted Price</th>
                            {/* New Total Payment Column */}
                            <th style={{ width: "10%" }}>Total Payment</th>
                            <th style={{ width: "10%" }}>Meeting Time</th>
                            <th style={{ width: "10%" }}>Homeowner Status</th>
                            <th style={{ width: "10%" }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedLeads.map((lead, index) => (
                            <tr key={lead.id}>
                              <td>{index + 1}</td>
                              <td>{lead.title}</td>
                              <td>{lead.first_name}</td>
                              <td>{lead.surname}</td>
                              <td>
                                <a href={`mailto:${lead.email}`}>
                                  {lead.email}
                                </a>
                              </td>
                              <td>
                                <a href={`tel:${lead.phone_number}`}>
                                  {lead.phone_number}
                                </a>
                              </td>
                              <td>
                                {lead.house_number} {lead.street_name},{" "}
                                {lead.town_city}, {lead.postal_code}
                              </td>
                              <td>{lead.system_quoted}</td>
                              <td>
                                £
                                {parseFloat(lead.quoted_price).toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </td>
                              {/* New Total Payment Cell */}
                              <td>
                                £
                                {parseFloat(lead.total_payment).toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </td>
                              <td>
                                {new Date(lead.meeting_time).toLocaleString()}
                              </td>
                              <td>{lead.homeownership_status}</td>
                              <td>{getStatusLabel(lead.status)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <p>No leads available for this consultant.</p>
                )}
              </div>
            )}
          </div>
        );
      case "transferLeads":
        return (
          <LeadsTable
            leads={leads}
            handleStatusChange={handleStatusChange}
            type="transferLeads"
            salesConsultants={consultants}
          />
        );
      default:
        return <div className="mt-4">Select a section to view details</div>;
    }
  };

  // Validation Function
  const validate = () => {
    const newErrors = {};

    // Title Validation
    if (!newLead.title.trim()) {
      newErrors.title = "Title is required.";
    }

    // First Name Validation
    if (!newLead.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    // Surname Validation
    if (!newLead.surname.trim()) {
      newErrors.surname = "Surname is required.";
    }

    // Email Validation
    if (!newLead.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(newLead.email)) {
      newErrors.email = "Email is invalid.";
    }

    // Phone Number Validation
    if (!newLead.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\+?[0-9]{7,15}$/.test(newLead.phoneNumber)) {
      newErrors.phoneNumber = "Phone number is invalid.";
    }

    // House Number Validation
    if (!newLead.houseNumber.trim()) {
      newErrors.houseNumber = "House number is required.";
    }

    // Street Name Validation
    if (!newLead.streetName.trim()) {
      newErrors.streetName = "Street name is required.";
    }

    // Town/City Validation
    if (!newLead.townCity.trim()) {
      newErrors.townCity = "Town/City is required.";
    }

    // Postal Code Validation
    if (!newLead.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required.";
    } else if (!/^[A-Za-z0-9\s\-]{3,10}$/.test(newLead.postalCode)) {
      newErrors.postalCode = "Postal code is invalid.";
    }

    // Homeownership Status Validation
    if (!["Owner", "Tenant"].includes(newLead.homeownershipStatus)) {
      newErrors.homeownershipStatus = "Invalid homeownership status.";
    }

    // System Quoted Validation
    if (!newLead.systemQuoted.trim()) {
      newErrors.systemQuoted = "System quoted is required.";
    }

    // Quoted Price Validation
    if (!newLead.quotedPrice) {
      newErrors.quotedPrice = "Quoted price is required.";
    } else if (isNaN(newLead.quotedPrice) || Number(newLead.quotedPrice) <= 0) {
      newErrors.quotedPrice = "Quoted price must be a positive number.";
    }

    // Meeting Time Validation
    if (!newLead.meetingTime) {
      newErrors.meetingTime = "Meeting time is required.";
    }

    // Best Time To Call Validation (Optional)
    if (newLead.bestTimeToCall && isNaN(Date.parse(newLead.bestTimeToCall))) {
      newErrors.bestTimeToCall = "Best time to call is invalid.";
    }

    // Consultant ID Validation
    if (!newLead.consultantId) {
      newErrors.consultantId = "Consultant must be selected.";
    }

    // Status Validation
    if (!newLead.status) {
      newErrors.status = "Status is required.";
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      addLead();
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLead((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.mainContent}>
        <Navbar />
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Leads</h2>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add New Lead
          </Button>
        </div>
        <LeadActions setActiveSection={setActiveSection} />
        <div className="section-content">
          {renderSectionContent(activeSection)}
        </div>

        {/* Add Lead Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Add New Leadddd</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              {/* Display General Errors */}
              {Object.keys(errors).length > 0 && (
                <Alert variant="danger">
                  Please fix the following errors before submitting:
                  <ul>
                    {Object.values(errors).map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </Alert>
              )}

              {/* Use Row and Col for two-column layout */}
              <Row>
                {/* Title */}
                <Col md={6}>
                  <Form.Group controlId="formTitle" className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={newLead.title}
                      onChange={handleChange}
                      isInvalid={!!errors.title}
                      placeholder="Enter title"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* First Name */}
                <Col md={6}>
                  <Form.Group controlId="formFirstName" className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={newLead.firstName}
                      onChange={handleChange}
                      isInvalid={!!errors.firstName}
                      placeholder="Enter first name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.firstName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                {/* Surname */}
                <Col md={6}>
                  <Form.Group controlId="formSurname" className="mb-3">
                    <Form.Label>Surname</Form.Label>
                    <Form.Control
                      type="text"
                      name="surname"
                      value={newLead.surname}
                      onChange={handleChange}
                      isInvalid={!!errors.surname}
                      placeholder="Enter surname"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.surname}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Email */}
                <Col md={6}>
                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={newLead.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      placeholder="Enter email"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                {/* Phone Number */}
                <Col md={6}>
                  <Form.Group controlId="formPhoneNumber" className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phoneNumber"
                      value={newLead.phoneNumber}
                      onChange={handleChange}
                      isInvalid={!!errors.phoneNumber}
                      placeholder="Enter phone number"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phoneNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* House Number */}
                <Col md={6}>
                  <Form.Group controlId="formHouseNumber" className="mb-3">
                    {newLead.customerType === "Commercial" ? (
                      <>
                        <Form.Label>Address</Form.Label>
                      </>
                    ) : (
                      <>
                        <Form.Label>House Name</Form.Label>
                      </>
                    )}

                    <Form.Control
                      type="text"
                      name="houseNumber"
                      value={newLead.houseNumber}
                      onChange={handleChange}
                      isInvalid={!!errors.houseNumber}
                      placeholder={
                        newLead.customerType === "Commercial"
                          ? "Enter address"
                          : "Enter house name"
                      }
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.houseNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                {/* Street Name */}
                <Col md={6}>
                  <Form.Group controlId="formStreetName" className="mb-3">
                    <Form.Label>Street Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="streetName"
                      value={newLead.streetName}
                      onChange={handleChange}
                      isInvalid={!!errors.streetName}
                      placeholder="Enter street name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.streetName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Town/City */}
                <Col md={6}>
                  <Form.Group controlId="formTownCity" className="mb-3">
                    <Form.Label>Town/City</Form.Label>
                    <Form.Control
                      type="text"
                      name="townCity"
                      value={newLead.townCity}
                      onChange={handleChange}
                      isInvalid={!!errors.townCity}
                      placeholder="Enter town or city"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.townCity}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                {/* Postal Code */}
                <Col md={6}>
                  <Form.Group controlId="formPostalCode" className="mb-3">
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="postalCode"
                      value={newLead.postalCode}
                      onChange={handleChange}
                      isInvalid={!!errors.postalCode}
                      placeholder="Enter postal code"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.postalCode}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Homeownership Status */}

                <Col md={6}>
                  {newLead.customerType === "Commercial" ? (
                    <></>
                  ) : (
                    <>
                      <Form.Group
                        controlId="formHomeownershipStatus"
                        className="mb-3"
                      >
                        <Form.Label>Homeownership Status</Form.Label>
                        <Form.Control
                          as="select"
                          name="homeownershipStatus"
                          value={newLead.homeownershipStatus}
                          onChange={handleChange}
                          isInvalid={!!errors.homeownershipStatus}
                        >
                          <option value="Owner">Owner</option>
                          <option value="Tenant">Tenant</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.homeownershipStatus}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </>
                  )}
                </Col>
              </Row>

              <Row>
                {/* System Quoted */}
                <Col md={6}>
                  <Form.Group controlId="formSystemQuoted" className="mb-3">
                    <Form.Label>System Quoted</Form.Label>
                    <Form.Control
                      type="text"
                      name="systemQuoted"
                      value={newLead.systemQuoted}
                      onChange={handleChange}
                      isInvalid={!!errors.systemQuoted}
                      placeholder="Enter system quoted"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.systemQuoted}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Quoted Price */}
                <Col md={6}>
                  <Form.Group controlId="formQuotedPrice" className="mb-3">
                    <Form.Label>Quoted Price (£)</Form.Label>
                    <Form.Control
                      type="number"
                      name="quotedPrice"
                      value={newLead.quotedPrice}
                      onChange={handleChange}
                      isInvalid={!!errors.quotedPrice}
                      placeholder="Enter quoted price"
                      min="0"
                      step="0.01"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.quotedPrice}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                {/* Meeting Time */}
                <Col md={6}>
                  <Form.Group controlId="formMeetingTime" className="mb-3">
                    <Form.Label>Meeting Time</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="meetingTime"
                      value={newLead.meetingTime}
                      onChange={handleChange}
                      isInvalid={!!errors.meetingTime}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.meetingTime}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Best Time To Call */}
                <Col md={6}>
                  <Form.Group controlId="formBestTimeToCall" className="mb-3">
                    <Form.Label>Best Time To Call</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="bestTimeToCall"
                      value={newLead.bestTimeToCall}
                      onChange={handleChange}
                      isInvalid={!!errors.bestTimeToCall}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.bestTimeToCall}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                {/* Consultant Selection */}
                <Col md={6}>
                  <Form.Group controlId="formConsultant" className="mb-3">
                    <Form.Label>Consultant</Form.Label>
                    <Form.Control
                      as="select"
                      name="consultantId"
                      value={newLead.consultantId}
                      onChange={handleChange}
                      isInvalid={!!errors.consultantId}
                    >
                      <option value="">-- Select Consultant --</option>
                      {consultants.map((consultant) => (
                        <option key={consultant.id} value={consultant.id}>
                          {consultant.name} - {consultant.role}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.consultantId}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Status Selection */}
                <Col md={6}>
                  <Form.Group controlId="formStatus" className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                      as="select"
                      name="status"
                      value={newLead.status}
                      onChange={handleChange}
                      isInvalid={!!errors.status}
                    >
                      <option value="">-- Select Status --</option>
                      <option value="1">Hot</option>
                      <option value="2">Cold</option>
                      <option value="3">Warm</option>
                      <option value="4">Lost</option>
                      <option value="5">Won</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.status}
                    </Form.Control.Feedback>
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
                      value={newLead.customerType}
                      onChange={handleChange}
                      isInvalid={!!errors.customerType}
                    >
                      <option value="">-- Select Customer Type --</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Residential">Residential</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.customerType}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              {newLead.customerType === "Commercial" && (
                <>
                  <Row>
                    {/* Client Name */}
                    <Col md={6}>
                      <Form.Group controlId="formClientName" className="mb-3">
                        <Form.Label>Client Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="clientName"
                          value={newLead.clientName || ""}
                          onChange={handleChange}
                          placeholder="Enter client name"
                          isInvalid={!!errors.clientName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.clientName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* End User */}
                    <Col md={6}>
                      <Form.Group controlId="formEndUser" className="mb-3">
                        <Form.Label>End User</Form.Label>
                        <Form.Control
                          type="text"
                          name="endUser"
                          value={newLead.endUser || ""}
                          onChange={handleChange}
                          placeholder="Enter end user"
                          isInvalid={!!errors.endUser}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.endUser}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    {/* Service Description */}
                    <Col md={12}>
                      <Form.Group
                        controlId="formServiceDescription"
                        className="mb-3"
                      >
                        <Form.Label>Service Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="serviceDescription"
                          value={newLead.serviceDescription || ""}
                          onChange={handleChange}
                          placeholder="Enter service description"
                          isInvalid={!!errors.serviceDescription}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.serviceDescription}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Lead
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Report Modal */}
        <ReportModal
          show={showReport}
          onHide={() => setShowReport(false)}
          consultants={consultants} // Pass consultants list
          leadData={selectedLeads}
          consultantName={selectedConsultantName}
        />
      </main>
    </div>
  );
};

export default Leads;
