import React, { useState } from "react";
import { motion } from "framer-motion";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import {
  Users,
  FileText,
  DollarSign,
  Mail,
  Map,
  Download,
  Sun,
} from "lucide-react";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const pieData = {
    labels: ["Cold Leads", "Warm Leads", "Hot Leads", "Won Jobs", "Lost Jobs"],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          "#3498db",
          "#f1c40f",
          "#e74c3c",
          "#2ecc71",
          "#95a5a6",
        ],
      },
    ],
  };

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Total Leads",
        data: [65, 59, 80, 81],
        fill: false,
        borderColor: "#3498db",
      },
      {
        label: "Converted Sales",
        data: [28, 48, 40, 19],
        fill: false,
        borderColor: "#2ecc71",
      },
    ],
  };

  // Inline styles
  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      padding: "2rem",
    },
    navbar: {
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      borderRadius: "0.5rem",
      padding: "1rem",
      marginBottom: "2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    navbarIcon: {
      color: "#f1c40f",
      width: "2rem",
      height: "2rem",
    },
    navbarTitle: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#2d3436",
    },
    navbarButton: {
      backgroundColor: "#3498db",
      color: "#ffffff",
      padding: "0.5rem 1rem",
      borderRadius: "0.25rem",
      transition: "background-color 0.2s",
    },
    navbarButtonHover: {
      backgroundColor: "#2980b9",
    },
    card: {
      backgroundColor: "#ffffff",
      padding: "1.5rem",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      flex: "1",
      marginRight: "1rem",
    },
    cardIcon: {
      width: "2rem",
      height: "2rem",
      marginBottom: "1rem",
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "0.5rem",
    },
    cardValue: {
      fontSize: "2rem",
      fontWeight: "bold",
    },
    tabButton: {
      padding: "0.5rem 1rem",
      borderRadius: "0.25rem",
      cursor: "pointer",
    },
    tabButtonActive: {
      backgroundColor: "#3498db",
      color: "#ffffff",
    },
    tabButtonInactive: {
      backgroundColor: "#e0e0e0",
    },
    chartContainer: {
      backgroundColor: "#ffffff",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "1.5rem",
      marginBottom: "2rem",
    },
    chartTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "1.5rem",
    },
    table: {
      width: "100%",
    },
    tableHeader: {
      backgroundColor: "#f0f0f0",
    },
    tableHeaderCell: {
      padding: "0.5rem",
      textAlign: "left",
    },
    tableBodyCell: {
      padding: "0.5rem",
    },
    tableRowEven: {
      backgroundColor: "#f9f9f9",
    },
    input: {
      width: "100%",
      padding: "0.5rem",
      borderRadius: "0.25rem",
      border: "1px solid #cccccc",
    },
    select: {
      width: "100%",
      padding: "0.5rem",
      borderRadius: "0.25rem",
      border: "1px solid #cccccc",
    },
    button: {
      borderRadius: "0.25rem",
      padding: "0.5rem 1rem",
      color: "#ffffff",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    buttonGreen: {
      backgroundColor: "#2ecc71",
    },
    buttonGreenHover: {
      backgroundColor: "#27ae60",
    },
    buttonBlue: {
      backgroundColor: "#3498db",
    },
    buttonBlueHover: {
      backgroundColor: "#2980b9",
    },
    quickActions: {
      backgroundColor: "#ffffff",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "1.5rem",
    },
    quickActionsTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "1rem",
    },
    quickActionsButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      borderRadius: "0.5rem",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    quickActionsButtonMail: {
      backgroundColor: "#d0e6f8",
      color: "#3498db",
    },
    quickActionsButtonMailHover: {
      backgroundColor: "#c0d9f1",
    },
    quickActionsButtonMap: {
      backgroundColor: "#d0f5d2",
      color: "#2ecc71",
    },
    quickActionsButtonMapHover: {
      backgroundColor: "#b2e2b0",
    },
    quickActionsButtonDownload: {
      backgroundColor: "#fdf1d0",
      color: "#f1c40f",
    },
    quickActionsButtonDownloadHover: {
      backgroundColor: "#f8e6b5",
    },
    quickActionsButtonDollar: {
      backgroundColor: "#e1d0f9",
      color: "#8e44ad",
    },
    quickActionsButtonDollarHover: {
      backgroundColor: "#d0b8f4",
    },
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Sun style={styles.navbarIcon} />
          <h1 style={styles.navbarTitle}>Solar Dashboard</h1>
        </div>
        <button
          style={styles.navbarButton}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor =
              styles.navbarButtonHover.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor =
              styles.navbarButton.backgroundColor)
          }
        >
          Logout
        </button>
      </nav>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <motion.div whileHover={{ scale: 1.05 }} style={styles.card}>
          <Users style={styles.cardIcon} />
          <h2 style={styles.cardTitle}>Total Door Knockers</h2>
          <p style={styles.cardValue}>24</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} style={styles.card}>
          <FileText style={styles.cardIcon} />
          <h2 style={styles.cardTitle}>Total Leads</h2>
          <p style={styles.cardValue}>1,234</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} style={styles.card}>
          <DollarSign style={styles.cardIcon} />
          <h2 style={styles.cardTitle}>Total Revenue</h2>
          <p style={styles.cardValue}>$567,890</p>
        </motion.div>
      </div>

      <div style={styles.chartContainer}>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === "overview"
                ? styles.tabButtonActive
                : styles.tabButtonInactive),
            }}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === "leads"
                ? styles.tabButtonActive
                : styles.tabButtonInactive),
            }}
            onClick={() => setActiveTab("leads")}
          >
            Lead Management
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === "users"
                ? styles.tabButtonActive
                : styles.tabButtonInactive),
            }}
            onClick={() => setActiveTab("users")}
          >
            User Management
          </button>
        </div>

        {activeTab === "overview" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
            }}
          >
            <div>
              <h3 style={styles.chartTitle}>Lead Distribution</h3>
              <Pie data={pieData} />
            </div>
            <div>
              <h3 style={styles.chartTitle}>Performance Trends</h3>
              <Line data={lineData} />
            </div>
          </div>
        )}

        {activeTab === "leads" && (
          <div>
            <h3 style={styles.chartTitle}>Lead Management</h3>
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.tableHeaderCell}>Door Knocker</th>
                  <th style={styles.tableHeaderCell}>Total Leads</th>
                  <th style={styles.tableHeaderCell}>Hot Leads</th>
                  <th style={styles.tableHeaderCell}>Converted Sales</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.tableBodyCell}>John Doe</td>
                  <td style={styles.tableBodyCell}>150</td>
                  <td style={styles.tableBodyCell}>30</td>
                  <td style={styles.tableBodyCell}>15</td>
                </tr>
                <tr style={styles.tableRowEven}>
                  <td style={styles.tableBodyCell}>Jane Smith</td>
                  <td style={styles.tableBodyCell}>120</td>
                  <td style={styles.tableBodyCell}>25</td>
                  <td style={styles.tableBodyCell}>12</td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "users" && (
          <div>
            <h3 style={styles.chartTitle}>User Management</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                }}
              >
                <h4 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                  Generate Login Credentials
                </h4>
                <input
                  type="email"
                  placeholder="Door Knocker Email"
                  style={styles.input}
                />
                <button
                  style={{ ...styles.button, ...styles.buttonGreen }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.buttonGreenHover.backgroundColor)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.buttonGreen.backgroundColor)
                  }
                >
                  Generate & Send
                </button>
              </div>
              <div
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                }}
              >
                <h4 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                  Assign Territory
                </h4>
                <select style={styles.select}>
                  <option>Select Door Knocker</option>
                  <option>John Doe</option>
                  <option>Jane Smith</option>
                </select>
                <input
                  type="text"
                  placeholder="Postal Code"
                  style={styles.input}
                />
                <button
                  style={{ ...styles.button, ...styles.buttonBlue }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.buttonBlueHover.backgroundColor)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.buttonBlue.backgroundColor)
                  }
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={styles.quickActions}>
        <h3 style={styles.quickActionsTitle}>Quick Actions</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: "1rem",
          }}
        >
          <button
            style={{
              ...styles.quickActionsButton,
              ...styles.quickActionsButtonMail,
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.quickActionsButtonMailHover.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.quickActionsButtonMail.backgroundColor)
            }
          >
            <Mail style={{ marginRight: "0.5rem" }} /> Send Bulk Emails
          </button>
          <button
            style={{
              ...styles.quickActionsButton,
              ...styles.quickActionsButtonMap,
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.quickActionsButtonMapHover.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.quickActionsButtonMap.backgroundColor)
            }
          >
            <Map style={{ marginRight: "0.5rem" }} /> View Territories
          </button>
          <button
            style={{
              ...styles.quickActionsButton,
              ...styles.quickActionsButtonDownload,
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.quickActionsButtonDownloadHover.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.quickActionsButtonDownload.backgroundColor)
            }
          >
            <Download style={{ marginRight: "0.5rem" }} /> Export Reports
          </button>
          <button
            style={{
              ...styles.quickActionsButton,
              ...styles.quickActionsButtonDollar,
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.quickActionsButtonDollarHover.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.quickActionsButtonDollar.backgroundColor)
            }
          >
            <DollarSign style={{ marginRight: "0.5rem" }} /> Set Commission
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
