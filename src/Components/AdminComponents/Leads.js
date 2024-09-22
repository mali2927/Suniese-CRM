// src/Leads.js

import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Sidebar from "../SideBar";
import { styles } from "../../Styles/dashboardStyles";
import { ListGroup, Button, Form } from "react-bootstrap";
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

  useEffect(() => {
    // Fetch Leads
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
        const response = await fetch(`${config.baseURL}/showUsersForReportInLeads`);
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
    setSelectedConsultantId(Number(e.target.value));
  };

  const renderSectionContent = (section) => {
    switch (section) {
      case "totalLeads":
        return (
          <ListGroup variant="flush">
            <ListGroup.Item>Total Leads: {leads.length}</ListGroup.Item>
          </ListGroup>
        );
      case "individualLeads":
        // Ensure a consultant is selected
        if (!selectedConsultantId) {
          return (
            <div>
              <Form.Group controlId="consultantSelect" className="mb-3">
                <Form.Label>Select Consultant</Form.Label>
                {loadingConsultants ? (
                  <p>Loading consultants...</p>
                ) : errorConsultants ? (
                  <p className="text-danger">{errorConsultants}</p>
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
              <p>Please select a consultant to view their leads.</p>
            </div>
          );
        }

        const consultantLeads = leads.filter(
          (lead) => lead.consultantId === selectedConsultantId
        );

        const selectedConsultant = consultants.find(
          (consultant) => consultant.id === selectedConsultantId
        );

        return (
          <div>
            <Form.Group controlId="consultantSelect" className="mb-3">
              <Form.Label>Select Consultant</Form.Label>
              {loadingConsultants ? (
                <p>Loading consultants...</p>
              ) : errorConsultants ? (
                <p className="text-danger">{errorConsultants}</p>
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
            {selectedConsultant && (
              <h4>
                Leads for: {selectedConsultant.name} ({selectedConsultant.role})
              </h4>
            )}
            {consultantLeads.length > 0 ? (
              <LeadsTable
                leads={consultantLeads}
                handleStatusChange={handleStatusChange}
                convertToSale={convertToSale}
                type="individualLeads"
                onViewReport={() => setShowReport(true)}
                salesConsultants={consultants}
              />
            ) : (
              <p>No leads available for this consultant.</p>
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
