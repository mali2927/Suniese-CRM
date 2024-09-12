// Dashboard.js
import React from "react";
import { motion } from "framer-motion";
import { DollarSign, Users as UsersIcon, FileText } from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./SideBar"; // Import the Sidebar component
import Overview from "./AdminComponents/overView";
import { styles } from "../Styles/dashboardStyles";

const Dashboard = () => {
  return (
    <div style={styles.container}>
      <Sidebar /> {/* Use the Sidebar component here */}
      <main style={styles.mainContent}>
        <Navbar />
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <motion.div whileHover={{ scale: 1.05 }} style={styles.card}>
            <UsersIcon style={styles.cardIcon} />
            <h2>Total Door Knockers</h2>
            <p>24</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} style={styles.card}>
            <FileText style={styles.cardIcon} />
            <h2>Total Leads</h2>
            <p>1,234</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} style={styles.card}>
            <DollarSign style={styles.cardIcon} />
            <h2>Total Revenue</h2>
            <p>$567,890</p>
          </motion.div>
        </div>
        {/* Include the Overview component here */}
        <Overview />
      </main>
    </div>
  );
};

export default Dashboard;
