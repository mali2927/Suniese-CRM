import React from "react";
import { Sun } from "lucide-react";
import "../Styles/Navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add login logic here
    navigate("/"); // Redirect to the dashboard after login
  };
  return (
    <div className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Sun className="navbar-icon" />
        <h1 className="navbar-title">Solar Dashboard</h1>
      </div>
      <button className="navbar-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Navbar;
