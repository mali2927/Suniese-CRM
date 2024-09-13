// LeadActions.js
import React from "react";
import { Button } from "react-bootstrap";

const LeadActions = ({ setActiveSection }) => {
  return (
    <div className="section-selector mb-4">
      <Button
        variant="primary"
        className="me-2"
        onClick={() => setActiveSection("totalLeads")}
      >
        Total Leads Report
      </Button>
      <Button
        variant="secondary"
        className="me-2"
        onClick={() => setActiveSection("individualLeads")}
      >
        Individual Lead Reports
      </Button>
      <Button
        variant="success"
        className="me-2"
        onClick={() => setActiveSection("transferLeads")}
      >
        Transfer Leads
      </Button>
    </div>
  );
};

export default LeadActions;
