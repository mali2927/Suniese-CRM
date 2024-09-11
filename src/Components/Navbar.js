import React from "react";
import { Sun } from "lucide-react";
import "../Styles/Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Sun className="navbar-icon" />
        <h1 className="navbar-title">Solar Dashboard</h1>
      </div>
      <button className="navbar-button">Logout</button>
    </div>
  );
};

export default Navbar;
