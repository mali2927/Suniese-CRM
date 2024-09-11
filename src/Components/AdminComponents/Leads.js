import React from "react";
import Navbar from "../Navbar";
import Sidebar from "../SideBar";
import { styles } from "../../Styles/dashboardStyles";
const Leads = () => {
  return (
    <>
      <div style={styles.container}>
        <Sidebar /> {/* Use the Sidebar component here */}
        <main style={styles.mainContent}>
          <Navbar />
          <h2>Leads</h2>
        </main>
      </div>
    </>
  );
};

export default Leads;
