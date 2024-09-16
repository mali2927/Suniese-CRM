import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../Styles/LoginPage.css"; // Import the CSS file
import SunIcon from "./assets/SunIcon";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for handling errors
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/login?email=${email}&password=${password}`,
        {
          method: "GET", // Use POST method for login
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        // If login is successful
        localStorage.setItem("token", data.token); // Store token in local storage
        localStorage.setItem("email", email); // Store email in local storage
        navigate("/dashboard"); // Redirect to the dashboard after login
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
          animate={{ scale: 1, rotate: 360 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 260,
            damping: 20,
            rotate: {
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          className="icon-wrapper"
        >
          <div className="sun-icon-wrapper">
            <SunIcon />
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
          {error && <p className="error-message">{error}</p>} {/* Display error message */}
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
