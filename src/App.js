import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import Users from "./Components/AdminComponents/Users";
import Pipeline from "./Components/AdminComponents/Pipeline";
import UserPipeline from "./Components/UserComponents/UserPipeline";
import QuoteBank from "./Components/AdminComponents/QuoteBank";
import Settings from "./Components/AdminComponents/Settings";
import UserQuoteBank from "./Components/UserComponents/UserQuoteBank";
import Archive from "./Components/AdminComponents/Archive";
import Info from "./Components/AdminComponents/Info";
import Leads from "./Components/AdminComponents/Leads";
import "bootstrap/dist/css/bootstrap.min.css";
import UserDashboard from "./Components/UserComponents/Dashboard";
import UserLeads from "./Components/UserComponents/Leads";
import "./App.css";
import ProtectedRoute from "../src/ProtectedRoute"; // Import the ProtectedRoute component

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
            element={
              <ProtectedRoute element={Dashboard} roleRequired="superadmin" />
            }
          />
          <Route
            path="/leads"
            element={
              <ProtectedRoute element={Leads} roleRequired="superadmin" />
            }
          />
          <Route
            path="/info"
            element={
              <ProtectedRoute element={Info} roleRequired="superadmin" />
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute element={Settings} roleRequired="superadmin" />
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute element={Users} roleRequired="superadmin" />
            }
          />
          <Route
            path="/pipeline"
            element={
              <ProtectedRoute element={Pipeline} roleRequired="superadmin" />
            }
          />
          <Route
            path="/quotebank"
            element={
              <ProtectedRoute element={QuoteBank} roleRequired="superadmin" />
            }
          />
          <Route
            path="/archive"
            element={
              <ProtectedRoute element={Archive} roleRequired="superadmin" />
            }
          />
          <Route
            path="/userdashboard"
            element={
              <ProtectedRoute
                element={UserDashboard}
                roleRequired="sales consultant"
              />
            }
          />

          <Route
            path="/userLeads"
            element={
              <ProtectedRoute
                element={UserLeads}
                roleRequired="sales consultant"
              />
            }
          />

          <Route
            path="/userpipeline"
            element={
              <ProtectedRoute
                element={UserPipeline}
                roleRequired="sales consultant"
              />
            }
          />
          <Route
            path="/userquotebank"
            element={
              <ProtectedRoute
                element={UserQuoteBank}
                roleRequired="sales consultant"
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
