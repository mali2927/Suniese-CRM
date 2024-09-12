import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  FileText,
  Users as UsersIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
} from "lucide-react";
import { styles } from "../Styles/dashboardStyles"; // Assuming the styles are stored here

const Sidebar = () => {
  return (
    <aside style={styles.sidebar}>
      <Link to="/dashboard" style={styles.sidebarItem}>
        <Home style={styles.sidebarIcon} /> Overview
      </Link>
      <Link to="/leads" style={styles.sidebarItem}>
        <FileText style={styles.sidebarIcon} /> Lead Management
      </Link>
      <Link to="/user" style={styles.sidebarItem}>
        <UsersIcon style={styles.sidebarIcon} /> User Management
      </Link>
      <Link to="/settings" style={styles.sidebarItem}>
        <SettingsIcon style={styles.sidebarIcon} /> Settings
      </Link>
      <Link to="/info" style={styles.sidebarItem}>
        <InfoIcon style={styles.sidebarIcon} /> Info
      </Link>
    </aside>
  );
};

export default Sidebar;
