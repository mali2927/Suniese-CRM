// src/AdminComponents/ReportModal.js

import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { Pie, Bar, Doughnut, Radar, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
} from "chart.js";
import config from "../../../config";

// Register chart elements and scales
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale
);

const ReportModal = ({
  show,
  onHide,
  leadData,
  consultantName,
  consultants,
}) => {
  // Replace comparisonMode with mode
  const [mode, setMode] = useState("single"); // Modes: "single", "comparison", "all"

  // State for comparison mode
  const [selectedConsultant1, setSelectedConsultant1] = useState("");
  const [selectedConsultant2, setSelectedConsultant2] = useState("");
  const [leads1, setLeads1] = useState([]);
  const [leads2, setLeads2] = useState([]);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error1, setError1] = useState(null);
  const [error2, setError2] = useState(null);

  // State for "All Consultants" mode
  const [leadsAll, setLeadsAll] = useState({});
  const [loadingAll, setLoadingAll] = useState(false);
  const [errorAll, setErrorAll] = useState(null);
  const [allChartType, setAllChartType] = useState("Bar"); // Options: "Bar", "Pie", "Doughnut", "Radar", "PolarArea"
  const [leadStatusCounts, setLeadStatusCounts] = useState({
    hot: { count: 0, total_price: 0 },
    cold: { count: 0, total_price: 0 },
    warm: { count: 0, total_price: 0 },
    lost: { count: 0, total_price: 0 },
    won: { count: 0, total_price: 0 },
  });

  const [leadStatusCountsAll, setLeadStatusCountsAll] = useState({
    hot: { count: 0, total_price: 0 },
    cold: { count: 0, total_price: 0 },
    warm: { count: 0, total_price: 0 },
    lost: { count: 0, total_price: 0 },
    won: { count: 0, total_price: 0 },
  });
  // Function to map status IDs to labels
  const getStatusLabel = (statusId) => {
    const statusMap = {
      1: "Hot",
      2: "Cold",
      3: "Warm",
      4: "Lost",
      5: "Won",
    };
    return statusMap[statusId] || "..";
  };
  console.log(leadData[0]?.user_id);

  // Function to fetch leads data for a consultant
  const fetchLeadsForConsultant = async (
    consultantId,
    setLeads,
    setLoading,
    setError
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${config.baseURL}/searchLeadByConsultantId?user_id=${consultantId}`
      );
      const result = await response.json();
      console.log(`Leads API Response for Consultant ${consultantId}:`, result);

      if (result.data && result.data.length > 0) {
        setLeads(result.data);
      } else {
        setLeads([]);
        setError("No leads found for this consultant.");
      }
    } catch (error) {
      console.error(
        `Error fetching leads for consultant ${consultantId}:`,
        error
      );
      setError("An error occurred while fetching leads.");
    } finally {
      setLoading(false);
    }
  };

  // Handle change for mode selection
  const handleModeChange = (e) => {
    const selectedMode = e.target.value;
    setMode(selectedMode);

    // Reset other states
    setSelectedConsultant1("");
    setSelectedConsultant2("");
    setLeads1([]);
    setLeads2([]);
    setLeadsAll({});
    setError1(null);
    setError2(null);
    setErrorAll(null);
    setAllChartType("Bar"); // Reset chart type to Bar when mode changes
  };

  // Effect to fetch leads1 when selectedConsultant1 changes
  useEffect(() => {
    if (mode === "comparison" && selectedConsultant1) {
      fetchLeadsForConsultant(
        selectedConsultant1,
        setLeads1,
        setLoading1,
        setError1
      );
    } else {
      setLeads1([]);
      setError1(null);
    }
  }, [selectedConsultant1, mode]);

  useEffect(() => {
    const userId = leadData[0]?.user_id; // Get the user ID from leadData

    if (userId) {
      fetch(`${config.baseURL}/lead-status-counts-by-user-id/${userId}`) // Send user ID in the API request
        .then((response) => response.json())
        .then((data) => setLeadStatusCounts(data))
        .catch((error) =>
          console.error("Error fetching lead status counts:", error)
        );
    }
  }, [leadData]);

  useEffect(() => {
    fetch(`${config.baseURL}/lead-status-counts`) // Send user ID in the API request
      .then((response) => response.json())
      .then((data) => setLeadStatusCountsAll(data))
      .catch((error) =>
        console.error("Error fetching lead status counts:", error)
      );
  }, [leadData]);

  // Effect to fetch leads2 when selectedConsultant2 changes
  useEffect(() => {
    if (mode === "comparison" && selectedConsultant2) {
      fetchLeadsForConsultant(
        selectedConsultant2,
        setLeads2,
        setLoading2,
        setError2
      );
    } else {
      setLeads2([]);
      setError2(null);
    }
  }, [selectedConsultant2, mode]);

  // Effect to fetch leads for all consultants when mode is "all"
  useEffect(() => {
    if (mode === "all") {
      fetchAllLeads();
    } else {
      setLeadsAll({});
      setErrorAll(null);
    }
  }, [mode, consultants]);

  const fetchAllLeads = async () => {
    setLoadingAll(true);
    setErrorAll(null);
    try {
      const fetchPromises = consultants.map((consultant) =>
        fetch(
          `${config.baseURL}/searchLeadByConsultantId?user_id=${consultant.id}`
        )
          .then((response) => response.json())
          .then((result) => ({
            consultantId: consultant.id,
            data: result.data || [],
          }))
      );

      const results = await Promise.all(fetchPromises);
      const allLeads = {};
      results.forEach(({ consultantId, data }) => {
        allLeads[consultantId] = data;
      });
      setLeadsAll(allLeads);
    } catch (error) {
      console.error("Error fetching all leads:", error);
      setErrorAll(
        "An error occurred while fetching leads for all consultants."
      );
    } finally {
      setLoadingAll(false);
    }
  };

  // Compute status counts for a given leads array
  const computeStatusCounts = (leads) => {
    console.log(leads);
    return leads.reduce((acc, lead) => {
      const statusLabel = getStatusLabel(lead.status);
      acc[statusLabel] = (acc[statusLabel] || 0) + 1;
      return acc;
    }, {});
  };

  // Define a color mapping based on status labels
  const colorMap = {
    Hot: {
      background: "rgba(255, 0, 0, 0.6)", // Red
      border: "rgba(255, 0, 0, 1)",
    },
    Cold: {
      background: "rgba(54, 162, 235, 0.6)", // Blue
      border: "rgba(54, 162, 235, 1)",
    },
    Warm: {
      background: "rgba(255, 206, 86, 0.6)", // Yellow
      border: "rgba(255, 206, 86, 1)",
    },
    Lost: {
      background: "rgba(75, 192, 192, 0.6)", // Teal
      border: "rgba(75, 192, 192, 1)",
    },
    Won: {
      background: "rgba(0, 128, 0, 0.6)", // Green
      border: "rgba(0, 128, 0, 1)",
    },
  };

  // Prepare data for a pie chart
  const prepareChartData = (statusCounts) => {
    console.log(statusCounts);
    return {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: "# of Leads",
          data: Object.values(statusCounts),
          backgroundColor: Object.keys(statusCounts).map(
            (label) => colorMap[label]?.background || "rgba(0,0,0,0.1)"
          ),
          borderColor: Object.keys(statusCounts).map(
            (label) => colorMap[label]?.border || "rgba(0,0,0,1)"
          ),
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare data for the Bar chart in "All Consultants" mode
  const prepareBarChartData = () => {
    const labels = consultants.map((consultant) => consultant.name);
    const statuses = ["Hot", "Cold", "Warm", "Lost", "Won"];

    const datasets = statuses.map((status) => {
      return {
        label: status,
        data: consultants.map((consultant) => {
          const leads = leadsAll[consultant.id] || [];
          return leads.filter((lead) => getStatusLabel(lead.status) === status)
            .length;
        }),
        backgroundColor: colorMap[status]?.background || "rgba(0,0,0,0.1)",
        borderColor: colorMap[status]?.border || "rgba(0,0,0,1)",
        borderWidth: 1,
      };
    });

    return {
      labels,
      datasets,
    };
  };

  // Prepare data for Doughnut chart
  const prepareDoughnutChartData = () => {
    const labels = ["Hot", "Cold", "Warm", "Lost", "Won"];
    const datasets = [
      {
        label: "Leads Status",
        data: labels.map((label) => {
          let total = 0;
          consultants.forEach((consultant) => {
            const leads = leadsAll[consultant.id] || [];
            total += leads.filter(
              (lead) => getStatusLabel(lead.status) === label
            ).length;
          });
          return total;
        }),
        backgroundColor: labels.map(
          (label) => colorMap[label]?.background || "rgba(0,0,0,0.1)"
        ),
        borderColor: labels.map(
          (label) => colorMap[label]?.border || "rgba(0,0,0,1)"
        ),
        borderWidth: 1,
      },
    ];

    return {
      labels,
      datasets,
    };
  };

  // Prepare data for Radar chart
  const prepareRadarChartData = () => {
    const labels = ["Hot", "Cold", "Warm", "Lost", "Won"];
    const datasets = consultants.map((consultant) => {
      const leads = leadsAll[consultant.id] || [];
      const data = labels.map(
        (label) =>
          leads.filter((lead) => getStatusLabel(lead.status) === label).length
      );
      const color = getRandomColor(); // Function to assign a unique color to each consultant

      return {
        label: consultant.name,
        data: data,
        backgroundColor: color.background,
        borderColor: color.border,
        borderWidth: 1,
        fill: true,
      };
    });

    return {
      labels,
      datasets,
    };
  };

  // Prepare data for Polar Area chart
  const preparePolarAreaChartData = () => {
    const labels = ["Hot", "Cold", "Warm", "Lost", "Won"];
    const datasets = [
      {
        label: "Leads Status",
        data: labels.map((label) => {
          let total = 0;
          consultants.forEach((consultant) => {
            const leads = leadsAll[consultant.id] || [];
            total += leads.filter(
              (lead) => getStatusLabel(lead.status) === label
            ).length;
          });
          return total;
        }),
        backgroundColor: labels.map(
          (label) => colorMap[label]?.background || "rgba(0,0,0,0.1)"
        ),
        borderColor: labels.map(
          (label) => colorMap[label]?.border || "rgba(0,0,0,1)"
        ),
        borderWidth: 1,
      },
    ];

    return {
      labels,
      datasets,
    };
  };

  // Utility function to generate random colors for Radar chart
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return {
      background: `rgba(${r}, ${g}, ${b}, 0.2)`,
      border: `rgba(${r}, ${g}, ${b}, 1)`,
    };
  };

  // Define chart options to control size and responsiveness
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows custom height and width
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: false,
        text: "Leads Status",
      },
    },
    // Add default scales configuration if needed
  };

  // Prepare data for the Bar chart
  const barChartData = prepareBarChartData();

  // Function to prepare Pie chart data for a single consultant
  const preparePieChartData = (consultantId) => {
    const leads = leadsAll[consultantId] || [];
    const statusCounts = computeStatusCounts(leads);
    return prepareChartData(statusCounts);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Sales Summary Report YTD{" "}
          {mode === "single" && consultantName ? `- ${consultantName}` : ""}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Mode Selection */}
        <Form.Group controlId="modeSelect" className="mb-3">
          <Form.Label>Select Report Mode</Form.Label>
          <Form.Control as="select" value={mode} onChange={handleModeChange}>
            <option value="single">Single Consultant Report</option>
            <option value="comparison">Compare Two Consultants</option>
            <option value="all">All Consultants Report</option>
          </Form.Control>
        </Form.Group>

        {mode === "comparison" ? (
          /* Comparison Mode */
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
                {selectedConsultant1 === selectedConsultant2 ? (
                  <Alert variant="warning">
                    Please select two different consultants for comparison.
                  </Alert>
                ) : (
                  <Row>
                    {/* Consultant 1 Chart */}
                    <Col md={6}>
                      <h5>
                        {consultants.find(
                          (c) => c.id === Number(selectedConsultant1)
                        )?.name || "Consultant 1"}
                        's Leads
                      </h5>
                      {loading1 ? (
                        <Spinner animation="border" size="sm" />
                      ) : error1 ? (
                        <Alert variant="danger">{error1}</Alert>
                      ) : leads1.length > 0 ? (
                        <div
                          style={{
                            position: "relative",
                            height: "300px",
                            width: "100%",
                          }}
                        >
                          <Pie
                            data={prepareChartData(computeStatusCounts(leads1))}
                            options={options}
                          />
                        </div>
                      ) : (
                        <p>No leads available for this consultant.</p>
                      )}
                    </Col>

                    {/* Consultant 2 Chart */}
                    <Col md={6}>
                      <h5>
                        {consultants.find(
                          (c) => c.id === Number(selectedConsultant2)
                        )?.name || "Consultant 2"}
                        's Leads
                      </h5>
                      {loading2 ? (
                        <Spinner animation="border" size="sm" />
                      ) : error2 ? (
                        <Alert variant="danger">{error2}</Alert>
                      ) : leads2.length > 0 ? (
                        <div
                          style={{
                            position: "relative",
                            height: "300px",
                            width: "100%",
                          }}
                        >
                          <Pie
                            data={prepareChartData(computeStatusCounts(leads2))}
                            options={options}
                          />
                        </div>
                      ) : (
                        <p>No leads available for this consultant.</p>
                      )}
                    </Col>
                  </Row>
                )}
              </div>
            )}
          </div>
        ) : mode === "all" ? (
          /* All Consultants Mode */
          <div>
            {/* Dropdown to select chart type */}
            <Form.Group controlId="allChartTypeSelect" className="mb-3">
              <Form.Label>Select Chart Type</Form.Label>
              <Form.Control
                as="select"
                value={allChartType}
                onChange={(e) => setAllChartType(e.target.value)}
              >
                <option value="Bar">Bar Chart</option>
                <option value="Pie">Pie Chart</option>
                <option value="Doughnut">Doughnut Chart</option>
                <option value="Radar">Radar Chart</option>
                <option value="PolarArea">Polar Area Chart</option>
              </Form.Control>
            </Form.Group>

            {loadingAll ? (
              <div className="text-center">
                <Spinner animation="border" /> Loading leads for all
                consultants...
              </div>
            ) : errorAll ? (
              <Alert variant="danger">{errorAll}</Alert>
            ) : leadsAll && consultants.length > 0 ? (
              <>
                <div>
                  <h3>Quoted Prices</h3>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Total Quoted Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Cold Leads</td>
                        <td>£{leadStatusCountsAll.cold.total_price}</td>
                      </tr>
                      {/* <tr>
                        <td>Warm Leads</td>
                        <td>£{leadStatusCountsAll.warm.total_price}</td>
                      </tr> */}
                      <tr>
                        <td>Hot Leads</td>
                        <td>£{leadStatusCountsAll.hot.total_price}</td>
                      </tr>
                      <tr>
                        <td>Won Jobs</td>
                        <td>£{leadStatusCountsAll.won.total_price}</td>
                      </tr>
                      <tr>
                        <td>Lost Jobs</td>
                        <td>£{leadStatusCountsAll.lost.total_price}</td>
                      </tr>
                    </tbody>
                  </table>
                  <h3>Sales Prices</h3>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Total Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Won Jobs</td>
                        <td>£{leadStatusCountsAll.won.total_payment}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {allChartType === "Bar" ? (
                  /* Render Bar Chart */
                  <div
                    style={{
                      position: "relative",
                      height: "500px",
                      width: "100%",
                    }}
                  >
                    <Bar
                      data={barChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false, // Allows custom height and width
                        plugins: {
                          legend: {
                            position: "top",
                          },
                          title: {
                            display: true,
                            text: "Leads Status Across All Consultants",
                          },
                        },
                        scales: {
                          x: {
                            stacked: true,
                          },
                          y: {
                            stacked: true,
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: "Number of Leads",
                            },
                          },
                        },
                      }}
                    />
                  </div>
                ) : allChartType === "Pie" ? (
                  /* Render Pie Chart */
                  <div
                    style={{
                      position: "relative",
                      height: "500px",
                      width: "100%",
                    }}
                  >
                    <Pie
                      data={prepareDoughnutChartData()} // Reusing Doughnut data for Pie
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                          title: {
                            display: true,
                            text: "Leads Status Distribution Across All Consultants",
                          },
                        },
                      }}
                    />
                  </div>
                ) : allChartType === "Doughnut" ? (
                  /* Render Doughnut Chart */
                  <div
                    style={{
                      position: "relative",
                      height: "500px",
                      width: "100%",
                    }}
                  >
                    <Doughnut
                      data={prepareDoughnutChartData()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                          title: {
                            display: true,
                            text: "Leads Status Distribution (Doughnut)",
                          },
                        },
                      }}
                    />
                  </div>
                ) : allChartType === "Radar" ? (
                  /* Render Radar Chart */
                  <div
                    style={{
                      position: "relative",
                      height: "500px",
                      width: "100%",
                    }}
                  >
                    <Radar
                      data={prepareRadarChartData()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "top",
                          },
                          title: {
                            display: true,
                            text: "Leads Status Comparison Across Consultants",
                          },
                        },
                        scales: {
                          r: {
                            angleLines: {
                              display: true,
                            },
                            suggestedMin: 0,
                            suggestedMax:
                              Math.max(
                                ...consultants.map((c) => {
                                  const leads = leadsAll[c.id] || [];
                                  return leads.length;
                                })
                              ) + 5,
                          },
                        },
                      }}
                    />
                  </div>
                ) : allChartType === "PolarArea" ? (
                  /* Render Polar Area Chart */
                  <div
                    style={{
                      position: "relative",
                      height: "500px",
                      width: "100%",
                    }}
                  >
                    <PolarArea
                      data={preparePolarAreaChartData()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "right",
                          },
                          title: {
                            display: true,
                            text: "Leads Status Polar Area Chart Across All Consultants",
                          },
                        },
                      }}
                    />
                  </div>
                ) : null}
              </>
            ) : (
              <p>No leads available for any consultants.</p>
            )}
          </div>
        ) : (
          /* Single Consultant Mode */
          <div>
            {/* Single Consultant Report */}
            {leadData.length > 0 ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    height: "100%", // Adjusted height to fill modal space
                    width: "100%",
                    overflow: "hidden", // Prevents overflow of children
                  }}
                >
                  <div
                    style={{ flex: "2", position: "relative", height: "400px" }}
                  >
                    {" "}
                    {/* Increased height */}
                    <Pie
                      data={prepareChartData(computeStatusCounts(leadData))}
                      options={{
                        ...options,
                        maintainAspectRatio: false, // Allows for responsive height
                      }}
                    />
                  </div>
                  <div
                    style={{
                      flex: "1",
                      paddingLeft: "20px",
                      overflowY: "auto",
                    }}
                  >
                    <h3>Quoted Prices</h3>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Total Quoted Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Cold Leads</td>
                          <td>£{leadStatusCounts.cold.total_price}</td>
                        </tr>
                        {/* <tr>
                          <td>Warm Leads</td>
                          <td>£{leadStatusCounts.warm.total_price}</td>
                        </tr> */}
                        <tr>
                          <td>Hot Leads</td>
                          <td>£{leadStatusCounts.hot.total_price}</td>
                        </tr>
                        {/* <tr>
                          <td>Won Jobs</td>
                          <td>£{leadStatusCounts.won.total_price}</td>
                        </tr> */}
                        <tr>
                          <td>Lost Jobs</td>
                          <td>£{leadStatusCounts.lost.total_price}</td>
                        </tr>
                      </tbody>
                    </table>
                    <h3>Sales Prices</h3>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Total Sales</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Won Jobs</td>
                          <td>£{leadStatusCounts.won.total_payment}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
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
