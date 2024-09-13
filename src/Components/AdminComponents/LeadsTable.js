// LeadsTable.js
import React from 'react';
import { Table, Button } from 'react-bootstrap';

const LeadsTable = ({ leads, handleStatusChange, convertToSale, type, onViewReport }) => { // Accept onViewReport prop
  return (
    <Table striped bordered hover responsive className="mt-3">
      <thead className="thead-dark">
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Status</th>
          {type === 'individualLeads' ? <th>Details</th> : null}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {leads.map(lead => (
          <tr key={lead.id}>
            <td>{lead.id}</td>
            <td>{lead.name}</td>
            <td>{lead.status}</td>
            {type === 'individualLeads' ? <td>{lead.details}</td> : null}
            <td>
              {type === 'individualLeads' ? (
                <>
                  <Button
                    variant="outline-warning"
                    className="me-2 mb-2"
                    onClick={() =>
                      handleStatusChange(
                        lead.id,
                        lead.status === 'cold' ? 'warm' : 'hot'
                      )
                    }
                  >
                    Change Status
                  </Button>
                  <Button
                    variant="outline-success"
                    className="me-2 mb-2"
                    onClick={() => convertToSale(lead.id)}
                  >
                    Convert to Sale
                  </Button>

                  <Button
                    variant="outline-info"
                    className="me-2 mb-2"
                    onClick={onViewReport} // Trigger onViewReport when button is clicked
                  >
                    View Report
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline-info"
                    className="me-2 mb-2"
                    onClick={() => handleStatusChange(lead.id, 'cold')}
                  >
                    Set to Cold
                  </Button>
                  <Button
                    variant="outline-warning"
                    className="me-2 mb-2"
                    onClick={() => handleStatusChange(lead.id, 'warm')}
                  >
                    Set to Warm
                  </Button>
                  <Button
                    variant="outline-success"
                    className="me-2 mb-2"
                    onClick={() => handleStatusChange(lead.id, 'hot')}
                  >
                    Set to Hot
                  </Button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default LeadsTable;
