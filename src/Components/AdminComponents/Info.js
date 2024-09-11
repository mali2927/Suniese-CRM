import React from "react";
import Navbar from "../Navbar";
import Sidebar from "../SideBar";
import { styles } from "../../Styles/dashboardStyles";
const Info = () => {
  return (
    <>
      <div style={styles.container}>
        <Sidebar /> {/* Use the Sidebar component here */}
        <main style={styles.mainContent}>
          <Navbar />
          <h2>Info</h2>
        </main>
      </div>

      {/* Add your Info content here */}
    </>
  );
};

export default Info;
