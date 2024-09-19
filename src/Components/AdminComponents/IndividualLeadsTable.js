import React from "react";
import { Table, Button } from "react-bootstrap";

const IndividualLeadsTable = ({ salesConsultants, onViewReport }) => {
  return (
    <Table striped bordered hover responsive className="mt-3">
      <thead className="thead-dark">
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Designation</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {salesConsultants.map((consultant) => (
          <tr key={consultant.id}>
            <td>{consultant.name}</td>
            <td>{consultant.email}</td>
            <td>{consultant.designation}</td>
            <td>
              <Button
                variant="outline-info"
                onClick={() => onViewReport(consultant.id)}
              >
                View Report
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default IndividualLeadsTable;
