import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="sun-icon"
    style={{ width: "100%", height: "100%" }}
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #fef9c3, #fde68a, #fcd34d)",
  },
  formContainer: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "0.5rem",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    width: "100%",
    maxWidth: "400px",
    margin: "2rem",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "1.875rem",
    fontWeight: "bold",
    textAlign: "center",
    color: "#1f2937",
    marginBottom: "1rem",
  },
  subtitle: {
    fontSize: "1.25rem",
    textAlign: "center",
    color: "#4b5563",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "0.25rem",
  },
  input: {
    padding: "0.5rem",
    borderRadius: "0.25rem",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
  },
  button: {
    backgroundColor: "#fbbf24",
    color: "white",
    padding: "0.75rem",
    borderRadius: "0.25rem",
    border: "none",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  forgotPassword: {
    textAlign: "center",
    marginTop: "1rem",
  },
  forgotPasswordLink: {
    color: "#fbbf24",
    textDecoration: "none",
    fontSize: "0.875rem",
  },
  sunIcon: {
    width: "3rem",
    height: "3rem",
    color: "#fbbf24",
  },
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Add login logic here
    navigate("/dashboard"); // Redirect to the dashboard after login
  };
  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={styles.formContainer}
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
          style={styles.iconContainer}
        >
          <div style={styles.sunIcon}>
            <SunIcon />
          </div>
        </motion.div>
        <h1 style={styles.title}>Sunrise Energy Solutions</h1>
        <h2 style={styles.subtitle}>CRM Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="your.email@example.com"
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            style={styles.button}
          >
            Sign In
          </motion.button>
        </form>
        <div style={styles.forgotPassword}>
          <a href="#" style={styles.forgotPasswordLink}>
            Forgot password?
          </a>
        </div>
      </motion.div>
    </div>
  );
}
