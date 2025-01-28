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
import Overview from "./Modals/overView";
import { styles } from "../../Styles/dashboardStyles";
import config from "../../config";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalSalesConsultants: 0,
    totalLeads: 0,
    totalRevenue: 0,
    wonLeads: 0,
  });

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date("2024-01-01"),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // Function to fetch dashboard data
  const fetchDashboardData = (startDate, endDate) => {
    const email = localStorage.getItem("email");
    if (!email) return;

    const start = startDate.toISOString().split("T")[0];
    const end = endDate.toISOString().split("T")[0];

    fetch(
      `${config.baseURL}/dashboard/data?email=${email}&start_date=${start}&end_date=${end}`
    )
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || "Failed to fetch dashboard data");
          });
        }
        return response.json();
      })
      .then((data) => {
        setDashboardData(data);
      })
      .catch((error) => console.error("Error fetching dashboard data:", error));
  };

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
            <p>{dashboardData.wonLeads}</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} style={styles.card}>
            <FileText style={styles.cardIcon} />
            <h2>Total Leads</h2>
            <p>{dashboardData.totalLeads}</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} style={styles.card}>
            <PoundSterling style={styles.cardIcon} />
            <h2>Total Sales</h2>
            <p>£{dashboardData.totalRevenue.toLocaleString()}</p>
          </motion.div>
        </div>
        <div style={{ marginBottom: "2rem" }}>
          <h3>Select Date Range:</h3>
          <DateRangePicker
            ranges={dateRange}
            onChange={(ranges) => {
              setDateRange([ranges.selection]); // Update date range and trigger the effect
            }}
            minDate={new Date("2024-01-01")}
            maxDate={new Date("2034-12-31")}
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
