import React, { useState } from "react";
import { Sun } from "lucide-react";
import "../Styles/Navbar.css";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "./ChangePasswordModel"; // Updated import
import config from "../config";

const Navbar = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    navigate("/"); // Redirect to the login page
  };

  const handleChange = (event) => {
    setPasswords({
      ...passwords,
      [event.target.name]: event.target.value
    });
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }
    try {
      const response = await fetch(`${config.baseURL}/chnagePassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          email: localStorage.getItem('email'),
          old_password: passwords.oldPassword,
          new_password: passwords.newPassword
        })
      });
      const data = await response.json();
      if (response.ok) {
        setShowModal(false);
        alert("Password changed successfully!");
      } else {
        alert(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Password change error:", error);
      alert("An error occurred while changing the password.");
    }
  };

  return (
    <div className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Sun className="navbar-icon" />
        <h1 className="navbar-title">Solar Dashboard</h1>
      </div>
      <button className="navbar-button" onClick={() => setShowModal(true)}>
        Change Password
      </button>
      <button className="navbar-button" onClick={handleLogout}>
        Logout
      </button>
      {showModal && (
        <ChangePasswordModal onClose={() => setShowModal(false)}>
          <div className="password-change-form">
            <label>Old Password:
              <input type="password" name="oldPassword" value={passwords.oldPassword} onChange={handleChange} />
            </label>
            <label>New Password:
              <input type="password" name="newPassword" value={passwords.newPassword} onChange={handleChange} />
            </label>
            <label>Confirm New Password:
              <input type="password" name="confirmNewPassword" value={passwords.confirmNewPassword} onChange={handleChange} />
            </label>
            <button onClick={handlePasswordChange}>Submit</button>
          </div>
        </ChangePasswordModal>
      )}
    </div>
  );
};

export default Navbar;
