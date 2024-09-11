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
  Home,
  Settings,
  Info,
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
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
    },
    sidebar: {
      width: "250px",
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "1rem",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid #ddd",
    },
    sidebarItem: {
      padding: "0.5rem 1rem",
      borderRadius: "0.25rem",
      cursor: "pointer",
      marginBottom: "0.5rem",
      display: "flex",
      alignItems: "center",
      color: "#2d3436",
      transition: "background-color 0.2s",
    },
    sidebarItemActive: {
      backgroundColor: "#3498db",
      color: "#ffffff",
    },
    sidebarIcon: {
      marginRight: "0.5rem",
    },
    mainContent: {
      flex: 1,
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
      <aside style={styles.sidebar}>
        <div
          style={{
            ...styles.sidebarItem,
            ...(activeTab === "overview" ? styles.sidebarItemActive : {}),
          }}
          onClick={() => setActiveTab("overview")}
        >
          <Home style={styles.sidebarIcon} /> Overview
        </div>
        <div
          style={{
            ...styles.sidebarItem,
            ...(activeTab === "leads" ? styles.sidebarItemActive : {}),
          }}
          onClick={() => setActiveTab("leads")}
        >
          <FileText style={styles.sidebarIcon} /> Lead Management
        </div>
        <div
          style={{
            ...styles.sidebarItem,
            ...(activeTab === "users" ? styles.sidebarItemActive : {}),
          }}
          onClick={() => setActiveTab("users")}
        >
          <Users style={styles.sidebarIcon} /> User Management
        </div>
        <div
          style={{
            ...styles.sidebarItem,
            ...(activeTab === "settings" ? styles.sidebarItemActive : {}),
          }}
          onClick={() => setActiveTab("settings")}
        >
          <Settings style={styles.sidebarIcon} /> Settings
        </div>
        <div
          style={{
            ...styles.sidebarItem,
            ...(activeTab === "info" ? styles.sidebarItemActive : {}),
          }}
          onClick={() => setActiveTab("info")}
        >
          <Info style={styles.sidebarIcon} /> Info
        </div>
      </aside>

      <main style={styles.mainContent}>
        <div style={styles.navbar}>
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
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <motion.div whileHover={{ scale: 1.05 }} style={styles.card}>
            <Users style={styles.cardIcon} />
            <h2 style={styles.cardTitle}>Sales Consultants</h2>
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

        {activeTab === "overview" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
            }}
          >
            <div style={styles.chartContainer}>
              <h3 style={styles.chartTitle}>Lead Distribution</h3>
              <Pie data={pieData} />
            </div>
            <div style={styles.chartContainer}>
              <h3 style={styles.chartTitle}>Performance Trends</h3>
              <Line data={lineData} />
            </div>
          </div>
        )}

        {activeTab === "leads" && (
          <div>
            <h2>Lead Management</h2>
            {/* Add your Lead Management content here */}
          </div>
        )}

        {activeTab === "users" && (
          <div>
            <h2>User Management</h2>
            {/* Add your User Management content here */}
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h2>Settings</h2>
            {/* Add your Settings content here */}
          </div>
        )}

        {activeTab === "info" && (
          <div>
            <h2>Info</h2>
            {/* Add your Info content here */}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
