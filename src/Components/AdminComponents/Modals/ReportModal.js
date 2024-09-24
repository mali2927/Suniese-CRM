// src/AdminComponents/ReportModal.js

import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const ReportModal = ({ show, onHide, leadData, consultantName }) => {
  // Function to map status IDs to labels
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

  // Compute the counts for each status
  const statusCounts = leadData.reduce((acc, lead) => {
    const statusLabel = getStatusLabel(lead.status);
    acc[statusLabel] = (acc[statusLabel] || 0) + 1;
    return acc;
  }, {});

  // Define a color mapping based on status labels
  const colorMap = {
    Hot: {
      background: 'rgba(255, 0, 0, 0.6)',    // Red
      border: 'rgba(255, 0, 0, 1)',
    },
    Cold: {
      background: 'rgba(54, 162, 235, 0.6)', // Blue
      border: 'rgba(54, 162, 235, 1)',
    },
    Warm: {
      background: 'rgba(255, 206, 86, 0.6)', // Yellow
      border: 'rgba(255, 206, 86, 1)',
    },
    Lost: {
      background: 'rgba(75, 192, 192, 0.6)', // Teal
      border: 'rgba(75, 192, 192, 1)',
    },
    Won: {
      background: 'rgba(0, 128, 0, 0.6)',     // Green
      border: 'rgba(0, 128, 0, 1)',
    },
    Pending: {
      background: 'rgba(201, 203, 207, 0.6)', // Grey
      border: 'rgba(201, 203, 207, 1)',
    },
  };

  // Prepare data for the pie chart using the color mapping
  const data = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: '# of Leads',
        data: Object.values(statusCounts),
        backgroundColor: Object.keys(statusCounts).map(
          (label) => colorMap[label]?.background || 'rgba(0,0,0,0.1)'
        ),
        borderColor: Object.keys(statusCounts).map(
          (label) => colorMap[label]?.border || 'rgba(0,0,0,1)'
        ),
        borderWidth: 1,
      },
    ],
  };

  // Define chart options to control size and responsiveness
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows custom height and width
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Lead Status Report {consultantName ? `- ${consultantName}` : ''}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {leadData.length > 0 ? (
          <div style={{ position: 'relative', height: '300px', width: '300px', margin: '0 auto' }}>
            <Pie data={data} options={options} />
          </div>
        ) : (
          <p>No data available to display.</p>
        )}
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
