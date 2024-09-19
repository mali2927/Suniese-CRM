import React, { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../SideBar";
import { styles } from "../../Styles/dashboardStyles";
import { ListGroup, Button } from "react-bootstrap";
import LeadsTable from "../AdminComponents/LeadsTable";
import LeadActions from "../AdminComponents/LeadAction";
import AddLeadModal from "../AdminComponents/AddLeadModel";
import ReportModal from "../AdminComponents/ReportModal";
import config from "../../config";

// Dummy data for leads
const dummyLeads = [
  {
    id: 1,
    name: "John Doe",
    status: "cold",
    details: "Lead 1 details",
    consultantId: 1,
  },
  {
    id: 2,
    name: "Jane Smith",
    status: "warm",
    details: "Lead 2 details",
    consultantId: 2,
  },
  {
    id: 3,
    name: "Mike Johnson",
    status: "hot",
    details: "Lead 3 details",
    consultantId: 3,
  },
  {
    id: 4,
    name: "Emily Davis",
    status: "hot",
    details: "Lead 4 details",
    consultantId: 1,
  },
];

// Dummy data for sales consultants
const dummyConsultants = [
  {
    id: 1,
    name: "Alice Brown",
    email: "alice.brown@example.com",
    designation: "Senior Consultant",
  },
  {
    id: 2,
    name: "Bob White",
    email: "bob.white@example.com",
    designation: "Junior Consultant",
  },
  {
    id: 3,
    name: "Carol Green",
    email: "carol.green@example.com",
    designation: "Lead Consultant",
  },
];

const Leads = () => {
  const [leads, setLeads] = useState(dummyLeads);
  const [showModal, setShowModal] = useState(false);
  const [showReport, setShowReport] = useState(false); // New state to handle report modal
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
    homeownershipStatus: "Owner", // Default value
    systemQuoted: "10 panels with battery", // Default value
    quotedPrice: "",
    meetingTime: "",
    bestTimeToCall: "",
    consultantId: 1, // Default consultantId
  });

  const [activeSection, setActiveSection] = useState(null);

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
    }
  };

  const addLead = async () => {
    console.log(newLead);
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

      if (result.success) {
        alert("Lead added successfully");
        setShowModal(false); // Close the modal
      } else {
        alert("Failed to add lead");
      }
    } catch (error) {
      console.error("Error adding lead:", error);
      alert("An error occurred while adding the lead.");
    }
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
        return (
          <LeadsTable
            leads={leads}
            handleStatusChange={handleStatusChange}
            convertToSale={convertToSale}
            type="individualLeads"
            onViewReport={() => setShowReport(true)}
            salesConsultants={dummyConsultants} // Pass the dummy consultants data
          />
        );
      case "transferLeads":
        return (
          <LeadsTable
            leads={leads}
            handleStatusChange={handleStatusChange}
            type="transferLeads"
            salesConsultants={dummyConsultants} // Pass the dummy consultants data if needed
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
