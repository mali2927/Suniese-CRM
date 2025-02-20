import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../Styles/LoginPage.css"; // Import the CSS file
import SunIcon from "./assets/SunIcon";
import config from "../config"; // Import the config file
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for handling errors
  const navigate = useNavigate();
  const logo = "/3.png"; // Since the image is in the public folder

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      const response = await fetch(`${config.baseURL}/login`, {
        method: "POST", // Use POST method for login
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Send email and password in the request body
      });

      const data = await response.json();

      if (response.ok) {
        // If login is successful
        localStorage.setItem("token", data.token); // Store token in local storage
        localStorage.setItem("email", email); // Store email in local storage
        localStorage.setItem("role", data.role);
        localStorage.setItem("user_id", data.id); // Store role in local storage
        console.log(data.role);
        // Check the user's role
        if (data.role === "SuperAdmin") {
          // If the role is neither admin nor super admin, navigate to user dashboard
          navigate("/dashboard");
        } else {
          // If the role is admin or super admin, navigate to the admin dashboard
          navigate("/userdashboard");
        }
      } else {
        // If login fails, display an error message
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      // Handle network errors
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="login-form-container"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="icon-wrapper"
        >
          <div className="sun-icon-wrapper">
            <img src={logo} alt="Sunrise Logo" className="sun-logo" />
          </div>
        </motion.div>

        <h1 className="page-title">Sunrise Energy Solutions</h1>
        <h2 className="page-subtitle">CRM Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
              placeholder="your.email@example.com"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}{" "}
          {/* Display error message */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="submit-button"
          >
            Sign In
          </motion.button>
        </form>
        <div className="forgot-password-wrapper">
          <a href="#" className="forgot-password-link">
            Forgot password?
          </a>
        </div>
      </motion.div>
    </div>
  );
}
