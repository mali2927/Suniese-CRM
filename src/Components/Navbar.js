// Navbar.js
import React from "react";
import { Sun } from "lucide-react";

const Navbar = () => {
  const styles = {
    navbar: {
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      borderRadius: "0.5rem",
      padding: "1rem",
      marginBottom: "2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },

    navbarIcon: {
      color: "#f1c40f",
      width: "2rem",
      height: "2rem",
    },
    navbarTitle: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#2d3436",
    },
    navbarButton: {
      backgroundColor: "#3498db",
      color: "#ffffff",
      padding: "0.5rem 1rem",
      borderRadius: "0.25rem",
      transition: "background-color 0.2s",
    },
    navbarButtonHover: {
      backgroundColor: "#2980b9",
    },
  };

  return (
    <div style={styles.navbar}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Sun style={styles.navbarIcon} />
        <h1 style={styles.navbarTitle}>Solar Dashboard</h1>
      </div>
      <button
        style={styles.navbarButton}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor =
            styles.navbarButtonHover.backgroundColor)
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor =
            styles.navbarButton.backgroundColor)
        }
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
