import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import Users from "./Components/AdminComponents/Users";
import Settings from "./Components/AdminComponents/Settings";
import Info from "./Components/AdminComponents/Info";
import Leads from "./Components/AdminComponents/Leads";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for Login Page */}
          <Route path="/" element={<LoginPage />} />

          {/* Route for Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/info" element={<Info />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/user" element={<Users />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
