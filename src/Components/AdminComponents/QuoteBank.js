import React from "react";
import Navbar from "../Navbar";
import Sidebar from "../SideBar";
import { styles } from "../../Styles/dashboardStyles";
import { Tabs, Tab } from "react-bootstrap";

const QuoteBank = () => {
  return (
    <>
      <div style={styles.container}>
        <Sidebar />
        <main style={styles.mainContent}>
          <Navbar />
          <h2>Quote Bank</h2>
        </main>
      </div>
    </>
  );
};

export default QuoteBank;
