import React from "react";
import { Nav } from "react-bootstrap";

const LeadActions = ({ setActiveSection }) => {
  return (
    <Nav variant="tabs" defaultActiveKey="totalLeads" className="mb-4">
      <Nav.Item>
        <Nav.Link
          eventKey="totalLeads"
          onClick={() => setActiveSection("totalLeads")}
        >
          Total Won Lead Report
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          eventKey="individualLeads"
          onClick={() => setActiveSection("individualLeads")}
        >
          Individual Sales Consultant Reports
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          eventKey="transferLeads"
          onClick={() => setActiveSection("transferLeads")}
        >
          Transfer Leads
        </Nav.Link>
      </Nav.Item>

   
    </Nav>
  );
};

export default LeadActions;
