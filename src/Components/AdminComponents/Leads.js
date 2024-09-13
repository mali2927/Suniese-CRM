// Leads.js
import React, { useState } from 'react';
import Navbar from '../Navbar';
import Sidebar from '../SideBar';
import { styles } from '../../Styles/dashboardStyles';
import { ListGroup, Button } from 'react-bootstrap';
import LeadsTable from '../AdminComponents/LeadsTable';
import LeadActions from '../AdminComponents/LeadAction';
import AddLeadModal from '../AdminComponents/AddLeadModel';
import ReportModal from '../AdminComponents/ReportModal'; // Import the new ReportModal component

const dummyLeads = [
  { id: 1, name: 'John Doe', status: 'cold', details: 'Lead 1 details' },
  { id: 1, name: 'John Doe', status: 'hot', details: 'Lead 1 details' },
  { id: 2, name: 'Jane Smith', status: 'warm', details: 'Lead 2 details' },
  { id: 3, name: 'Mike Johnson', status: 'hot', details: 'Lead 3 details' },
];

const Leads = () => {
  const [leads, setLeads] = useState(dummyLeads);
  const [showModal, setShowModal] = useState(false);
  const [showReport, setShowReport] = useState(false); // New state to handle report modal
  const [newLead, setNewLead] = useState({ name: '', status: 'cold', details: '' });
  const [activeSection, setActiveSection] = useState(null);

  const handleStatusChange = (id, newStatus) => {
    setLeads(
      leads.map(lead =>
        lead.id === id ? { ...lead, status: newStatus } : lead
      )
    );
  };

  const convertToSale = id => {
    if (window.confirm('Are you sure you want to convert this lead to a sale?')) {
      setLeads(leads.filter(lead => lead.id !== id));
    }
  };

  const addLead = () => {
    setLeads([...leads, { id: leads.length + 1, ...newLead }]);
    setShowModal(false);
  };

  const renderSectionContent = section => {
    switch (section) {
      case 'totalLeads':
        return (
          <ListGroup variant="flush">
            <ListGroup.Item>Total Leads: {leads.length}</ListGroup.Item>
          </ListGroup>
        );
      case 'individualLeads':
        return (
          <LeadsTable
            leads={leads}
            handleStatusChange={handleStatusChange}
            convertToSale={convertToSale}
            type="individualLeads"
            onViewReport={() => setShowReport(true)} // Pass function to show the report modal
          />
        );
      case 'transferLeads':
        return (
          <LeadsTable
            leads={leads}
            handleStatusChange={handleStatusChange}
            type="transferLeads"
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
        <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
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

        <ReportModal show={showReport} onHide={() => setShowReport(false)} leadData={leads} /> {/* Include the report modal */}
      </main>
    </div>
  );
};

export default Leads;
