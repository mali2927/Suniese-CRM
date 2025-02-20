import React, { useState } from "react";
import { Sun } from "lucide-react";
import "../Styles/Navbar.css";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "./ChangePasswordModel"; // Make sure the path matches where you saved the modal component
const logo = "/3.png"; // Since the image is in the public folder

const Navbar = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    navigate("/"); // Redirect to the login page
  };

  return (
    <div className="navbar">
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>
          <img src={logo} alt="Sunrise Logo" className="sun-logo" />
        </div>
        <h1 className="navbar-title">Sunrise Dashboard</h1>
      </div>
      <div style={{ display: "flex" }}>
        <button className="navbar-button" onClick={() => setShowModal(true)}>
          Change Password
        </button>
        <button className="navbar-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {showModal && <ChangePasswordModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Navbar;
