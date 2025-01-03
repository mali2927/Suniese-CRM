import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  PoundSterling,
  Users as UsersIcon,
  FileText,
} from "lucide-react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main styles
import "react-date-range/dist/theme/default.css"; // Theme styles
import Navbar from "./Navbar";
import Sidebar from "./SideBar";
import Overview from "./AdminComponents/overView";
import { styles } from "../Styles/dashboardStyles";
import config from "../config.js";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    total_consultants: 0,
    total_leads: 0,
    total_revenue: 0,
    won_leads: 0,
  });
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date("1970-01-01"),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // Function to fetch data based on the date range
  const fetchDashboardData = (startDate, endDate) => {
    const start = startDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const end = endDate.toISOString().split("T")[0];

    fetch(
      `${config.baseURL}/dashboard-report?start_date=${start}&end_date=${end}`
    )
      .then((response) => response.json())
      .then((data) => setDashboardData(data))
      .catch((error) => console.error("Error fetching dashboard data:", error));
  };

  // Fetch data initially and on date range change
  useEffect(() => {
    const { startDate, endDate } = dateRange[0];
    fetchDashboardData(startDate, endDate);
  }, [dateRange]);

  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.mainContent}>
        <Navbar />
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <motion.div whileHover={{ scale: 1.05 }} style={styles.card}>
            <UsersIcon style={styles.cardIcon} />
            <h2>Total Won Leads</h2>
            <p>{dashboardData.won_leads}</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} style={styles.card}>
            <FileText style={styles.cardIcon} />
            <h2>Total Leads</h2>
            <p>{dashboardData.total_leads}</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} style={styles.card}>
            <PoundSterling style={styles.cardIcon} />
            <h2>Total Sales</h2>
            <p>
              £
              {dashboardData.total_revenue.toLocaleString("en-GB", {
                style: "currency",
                currency: "GBP",
              })}
            </p>
          </motion.div>
        </div>
        <div style={{ marginBottom: "2rem" }}>
          <h3>Select Date Range:</h3>
          <DateRangePicker
            ranges={dateRange}
            onChange={(ranges) => {
              setDateRange([ranges.selection]); // Update date range and trigger the effect
            }}
          />
        </div>
        <Overview
          startDate={dateRange[0].startDate}
          endDate={dateRange[0].endDate}
        />
      </main>
    </div>
  );
};

export default Dashboard;
