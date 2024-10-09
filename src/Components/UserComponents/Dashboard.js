// Dashboard.js
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  PoundSterling,
  Users as UsersIcon,
  FileText,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./SideBar"; // Import the Sidebar component
import Overview from ".//Modals/overView";
import { styles } from "../../Styles/dashboardStyles";
import config from "../../config";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    salesConsultantName: "",
    totalSalesConsultants: 0,
    totalLeads: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const email = localStorage.getItem("email");

      if (!email) return;

      try {
        const response = await fetch(
          `${config.baseURL}/dashboard/data?email=${email}`
        );
        const data = await response.json();

        if (response.ok) {
          setDashboardData(data);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div style={styles.container}>
      <Sidebar /> {/* Use the Sidebar component here */}
      <main style={styles.mainContent}>
        <Navbar />
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <motion.div whileHover={{ scale: 1.05 }} style={styles.card}>
            <UsersIcon style={styles.cardIcon} />
            <h2>
              {dashboardData.salesConsultantName || "Total Sales Consultant"}
            </h2>
            <p>{dashboardData.totalSalesConsultants}</p>
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
        {/* Include the Overview component here */}
        <Overview />
      </main>
    </div>
  );
};

export default Dashboard;
