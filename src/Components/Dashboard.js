import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  PoundSterling,
  Users as UsersIcon,
  FileText,
} from "lucide-react";
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
  });
  console.log(dashboardData);
  useEffect(() => {
    fetch(`${config.baseURL}/dashboard-report`)
      .then((response) => response.json())
      .then((data) => setDashboardData(data))
      .catch((error) => console.error("Error fetching dashboard data:", error));
  }, []);

  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.mainContent}>
        <Navbar />
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <motion.div whileHover={{ scale: 1.05 }} style={styles.card}>
            <UsersIcon style={styles.cardIcon} />
            <h2>Total Sales Consultants</h2>
            <p>{dashboardData.total_consultants}</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} style={styles.card}>
            <FileText style={styles.cardIcon} />
            <h2>Total Leads</h2>
            <p>{dashboardData.total_leads}</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} style={styles.card}>
            <PoundSterling style={styles.cardIcon} />
            <h2>Total Revenue</h2>
            <p>
              £
              {dashboardData.total_revenue.toLocaleString("en-GB", {
                style: "currency",
                currency: "GBP",
              })}
            </p>
          </motion.div>
        </div>
        <Overview />
      </main>
    </div>
  );
};

export default Dashboard;
