// src/Leads.js

import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Sidebar from "../SideBar";
import { styles } from "../../Styles/dashboardStyles";
import { ListGroup, Button, Form, Spinner, Alert } from "react-bootstrap";
import LeadsTable from "../AdminComponents/LeadsTable";
import LeadActions from "../AdminComponents/LeadAction";
import AddLeadModal from "../AdminComponents/AddLeadModel";
import ReportModal from "../AdminComponents/ReportModal";
import config from "../../config";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [loadingConsultants, setLoadingConsultants] = useState(true);
  const [errorConsultants, setErrorConsultants] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReport, setShowReport] = useState(false);
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
  });

  const [activeSection, setActiveSection] = useState(null);
  const [selectedConsultantId, setSelectedConsultantId] = useState("");

  // New State Variables for Selected Consultant's Leads
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [loadingSelectedLeads, setLoadingSelectedLeads] = useState(false);
  const [errorSelectedLeads, setErrorSelectedLeads] = useState(null);

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
            console.log("Selected Leads:", result.data); // Debugging Log
          } else {
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
    }
  }, [selectedConsultantId]);

  const handleStatusChange = (id, newStatus) => {
    setLeads(
      leads.map((lead) =>
        lead.id === id ? { ...lead, status: newStatus } : lead
      )
    );
  };

  const convertToSale = (id, paymentAmount) => {
    if (
      window.confirm("Are you sure you want to convert this lead to a sale?")
    ) {
      setLeads(leads.filter((lead) => lead.id !== id));
      // Additional logic to handle sale conversion can be added here
    }
  };

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
      } else {
        alert("Failed to add lead");
      }
    } catch (error) {
      console.error("Error adding lead:", error);
      alert("An error occurred while adding the lead.");
    }
  };

  const handleConsultantChange = (e) => {
    setSelectedConsultantId(e.target.value);
  };

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

                    {/* Leads Table */}
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>First Name</th>
                          <th>Surname</th>
                          <th>Email</th>
                          <th>Phone Number</th>
                          <th>Address</th>
                          <th>System Quoted</th>
                          <th>Quoted Price</th>
                          <th>Meeting Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedLeads.map((lead) => (
                          <tr key={lead.id}>
                            <td>{lead.title}</td>
                            <td>{lead.first_name}</td>
                            <td>{lead.surname}</td>
                            <td>{lead.email}</td>
                            <td>{lead.phone_number}</td>
                            <td>
                              {lead.house_number} {lead.street_name},{" "}
                              {lead.town_city}, {lead.postal_code}
                            </td>
                            <td>{lead.system_quoted}</td>
                            <td>{lead.quoted_price}</td>
                            <td>
                              {new Date(lead.meeting_time).toLocaleString()}
                            </td>
                            <td>{lead.status.title || "Pending"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.mainContent}>
        <Navbar />
        <h2 className="mb-4">Leads</h2>
        <Button
          variant="primary"
          className="mb-3"
          onClick={() => setShowModal(true)}
        >
          Add New Lead
        </Button>
        <LeadActions setActiveSection={setActiveSection} />
        <div className="section-content">
          {renderSectionContent(activeSection)}
        </div>
        <AddLeadModal
          showModal={showModal}
          setShowModal={setShowModal}
          newLead={newLead}
          setNewLead={setNewLead}
          addLead={addLead}
        />
        <ReportModal
          show={showReport}
          onHide={() => setShowReport(false)}
          leadData={leads}
        />
      </main>
    </div>
  );
};

export default Leads;
