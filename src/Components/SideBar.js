import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Users as UsersIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Pen as Pen,
  Shell as Shell,
  Archive as Archive,
  BadgePoundSterling as BadgePoundSterling,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <aside className="bg-light p-3 vh-100">
      <div className="list-group">
        <Link
          to="/dashboard"
          className={`list-group-item list-group-item-action d-flex align-items-center mb-3 ${isActive(
            "/dashboard"
          )}`}
        >
          <Home className="me-2" /> Overview
        </Link>
        <Link
          to="/leads"
          className={`list-group-item list-group-item-action d-flex align-items-center mb-3 ${isActive(
            "/leads"
          )}`}
        >
          <FileText className="me-2" /> Lead Management
        </Link>
        <Link
          to="/user"
          className={`list-group-item list-group-item-action d-flex align-items-center mb-3 ${isActive(
            "/user"
          )}`}
        >
          <UsersIcon className="me-2" /> User Management
        </Link>
        {/* <Link
          to="/pipeline"
          className={`list-group-item list-group-item-action d-flex align-items-center mb-3 ${isActive(
            "/pipeline"
          )}`}
        >
          <Shell className="me-2" /> Pipeline
        </Link>
        <Link
          to="/quotebank"
          className={`list-group-item list-group-item-action d-flex align-items-center mb-3 ${isActive(
            "/quotebank"
          )}`}
        >
          <Pen className="me-2" /> Quote Bank
        </Link> */}
        <Link
          to="/sales"
          className={`list-group-item list-group-item-action d-flex align-items-center mb-3 ${isActive(
            "/sales"
          )}`}
        >
          <BadgePoundSterling className="me-2" /> Sales
        </Link>
        <Link
          to="/archive"
          className={`list-group-item list-group-item-action d-flex align-items-center mb-3 ${isActive(
            "/archive"
          )}`}
        >
          <Archive className="me-2" /> Archive
        </Link>
        <Link
          to="/settings"
          className={`list-group-item list-group-item-action d-flex align-items-center mb-3 ${isActive(
            "/settings"
          )}`}
        >
          <SettingsIcon className="me-2" /> Settings
        </Link>
        <Link
          to="/info"
          className={`list-group-item list-group-item-action d-flex align-items-center mb-3 ${isActive(
            "/info"
          )}`}
        >
          <InfoIcon className="me-2" /> Info
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
