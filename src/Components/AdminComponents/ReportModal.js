// ReportModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';

const ReportModal = ({ show, onHide, leadData }) => {
  const chartData = {
    labels: ['Hot', 'Warm', 'Cold', 'Won', 'Lost'],
    datasets: [
      {
        label: '# of Leads',
        data: [
          leadData.filter(lead => lead.status === 'hot').length,
          leadData.filter(lead => lead.status === 'warm').length,
          leadData.filter(lead => lead.status === 'cold').length,
          leadData.filter(lead => lead.status === 'won').length,
          leadData.filter(lead => lead.status === 'lost').length,
        ],
        backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#FFCE56', '#36A2EB', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Lead Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Pie data={chartData} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportModal;
