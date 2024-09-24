// src/AdminComponents/ReportModal.js

import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import config from "../../../config";

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const ReportModal = ({ show, onHide, leadData, consultantName, consultants }) => {
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedConsultant1, setSelectedConsultant1] = useState("");
  const [selectedConsultant2, setSelectedConsultant2] = useState("");
  const [leads1, setLeads1] = useState([]);
  const [leads2, setLeads2] = useState([]);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error1, setError1] = useState(null);
  const [error2, setError2] = useState(null);

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

  // Function to fetch leads data for a consultant
  const fetchLeadsForConsultant = async (consultantId, setLeads, setLoading, setError) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.baseURL}/searchLeadByConsultantId?user_id=${consultantId}`);
      const result = await response.json();
      console.log(`Leads API Response for Consultant ${consultantId}:`, result);

      if (result.data && result.data.length > 0) {
        setLeads(result.data);
      } else {
        setLeads([]);
        setError("No leads found for this consultant.");
      }
    } catch (error) {
      console.error(`Error fetching leads for consultant ${consultantId}:`, error);
      setError("An error occurred while fetching leads.");
    } finally {
      setLoading(false);
    }
  };

  // Handle change for comparison mode
  const handleModeChange = (e) => {
    const mode = e.target.value;
    if (mode === "single") {
      setComparisonMode(false);
      setSelectedConsultant1("");
      setSelectedConsultant2("");
      setLeads1([]);
      setLeads2([]);
      setError1(null);
      setError2(null);
    } else if (mode === "comparison") {
      setComparisonMode(true);
      setLeads1([]);
      setLeads2([]);
      setError1(null);
      setError2(null);
    }
  };

  // Effect to fetch leads1 when selectedConsultant1 changes
  useEffect(() => {
    if (comparisonMode && selectedConsultant1) {
      fetchLeadsForConsultant(selectedConsultant1, setLeads1, setLoading1, setError1);
    } else {
      setLeads1([]);
      setError1(null);
    }
  }, [selectedConsultant1, comparisonMode]);

  // Effect to fetch leads2 when selectedConsultant2 changes
  useEffect(() => {
    if (comparisonMode && selectedConsultant2) {
      fetchLeadsForConsultant(selectedConsultant2, setLeads2, setLoading2, setError2);
    } else {
      setLeads2([]);
      setError2(null);
    }
  }, [selectedConsultant2, comparisonMode]);

  // Compute status counts for a given leads array
  const computeStatusCounts = (leads) => {
    return leads.reduce((acc, lead) => {
      const statusLabel = getStatusLabel(lead.status);
      acc[statusLabel] = (acc[statusLabel] || 0) + 1;
      return acc;
    }, {});
  };

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

  // Prepare data for a pie chart
  const prepareChartData = (statusCounts) => {
    return {
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
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Lead Status Report {consultantName ? `- ${consultantName}` : ''}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Mode Selection */}
        <Form.Group controlId="modeSelect" className="mb-3">
          <Form.Label>Select Report Mode</Form.Label>
          <Form.Control as="select" value={comparisonMode ? "comparison" : "single"} onChange={handleModeChange}>
            <option value="single">Single Consultant Report</option>
            <option value="comparison">Compare Two Consultants</option>
          </Form.Control>
        </Form.Group>

        {comparisonMode ? (
          <div>
            {/* Selection of two consultants */}
            <Row>
              <Col md={6}>
                <Form.Group controlId="selectConsultant1" className="mb-3">
                  <Form.Label>Select Consultant 1</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedConsultant1}
                    onChange={(e) => setSelectedConsultant1(e.target.value)}
                  >
                    <option value="">-- Select Consultant 1 --</option>
                    {consultants.map((consultant) => (
                      <option key={consultant.id} value={consultant.id}>
                        {consultant.name} - {consultant.role}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="selectConsultant2" className="mb-3">
                  <Form.Label>Select Consultant 2</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedConsultant2}
                    onChange={(e) => setSelectedConsultant2(e.target.value)}
                  >
                    <option value="">-- Select Consultant 2 --</option>
                    {consultants.map((consultant) => (
                      <option key={consultant.id} value={consultant.id}>
                        {consultant.name} - {consultant.role}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            {/* Display the charts if both consultants are selected */}
            {selectedConsultant1 && selectedConsultant2 && (
              <div>
                {selectedConsultant1 === selectedConsultant2 && (
                  <Alert variant="warning">Please select two different consultants for comparison.</Alert>
                )}
                {selectedConsultant1 !== selectedConsultant2 && (
                  <div>
                    <Row>
                      <Col md={6}>
                        <h5>
                          {consultants.find(c => c.id === Number(selectedConsultant1))?.name || 'Consultant 1'}'s Leads
                        </h5>
                        {loading1 ? (
                          <Spinner animation="border" size="sm" />
                        ) : error1 ? (
                          <Alert variant="danger">{error1}</Alert>
                        ) : leads1.length > 0 ? (
                          <div style={{ position: 'relative', height: '300px', width: '100%' }}>
                            <Pie data={prepareChartData(computeStatusCounts(leads1))} options={options} />
                          </div>
                        ) : (
                          <p>No leads available for this consultant.</p>
                        )}
                      </Col>
                      <Col md={6}>
                        <h5>
                          {consultants.find(c => c.id === Number(selectedConsultant2))?.name || 'Consultant 2'}'s Leads
                        </h5>
                        {loading2 ? (
                          <Spinner animation="border" size="sm" />
                        ) : error2 ? (
                          <Alert variant="danger">{error2}</Alert>
                        ) : leads2.length > 0 ? (
                          <div style={{ position: 'relative', height: '300px', width: '100%' }}>
                            <Pie data={prepareChartData(computeStatusCounts(leads2))} options={options} />
                          </div>
                        ) : (
                          <p>No leads available for this consultant.</p>
                        )}
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Single Consultant Report */}
            {leadData.length > 0 ? (
              <div style={{ position: 'relative', height: '300px', width: '100%' }}>
                <Pie data={prepareChartData(computeStatusCounts(leadData))} options={options} />
              </div>
            ) : (
              <p>No data available to display.</p>
            )}
          </div>
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
