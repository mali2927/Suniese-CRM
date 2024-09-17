import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import Users from "./Components/AdminComponents/Users";
import Settings from "./Components/AdminComponents/Settings";
import Info from "./Components/AdminComponents/Info";
import Leads from "./Components/AdminComponents/Leads";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import ProtectedRoute from '../src/ProtectedRoute'; // Import the ProtectedRoute component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for Login Page */}
          <Route path="/" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={Dashboard} roleRequired="superadmin" />}
          />
          <Route
            path="/leads"
            element={<ProtectedRoute element={Leads} roleRequired="superadmin" />}
          />
          <Route
            path="/info"
            element={<ProtectedRoute element={Info} roleRequired="superadmin" />}
          />
          <Route
            path="/settings"
            element={<ProtectedRoute element={Settings} roleRequired="superadmin" />}
          />
          <Route
            path="/user"
            element={<ProtectedRoute element={Users} roleRequired="superadmin" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
