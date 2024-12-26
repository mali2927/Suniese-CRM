import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker"; // Install via `npm install react-datepicker`
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "../Navbar";
import Sidebar from "../SideBar";
import { styles } from "../../Styles/dashboardStyles";
import config from "../../config";

const Summary = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${config.baseURL}/showUsers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          alert("Failed to load users.");
        }
      } catch (error) {
        console.error(error);
        alert("Error fetching users. Please try again.");
      }
    };

    fetchUsers();
  }, []);

  const handleDownloadReport = async () => {
    if (startDate && endDate && selectedUser) {
      const payload = {
        user_id: selectedUser,
        dateRange: {
          start: startDate,
          end: endDate,
        },
      };

      try {
        const response = await fetch(`${config.baseURL}/leads/summary`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to download the report");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "leads-summary.pdf");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        alert("Report downloaded successfully!");
      } catch (error) {
        console.error(error);
        alert("Error downloading the report. Please try again.");
      }
    } else {
      alert(
        "Please select a date range and a user before downloading the report."
      );
    }
  };

  return (
    <div className="d-flex" style={styles.container}>
      <Sidebar />
      <main className="flex-grow-1 p-3" style={styles.mainContent}>
        <Navbar />
        <h2 className="mb-4">Summary</h2>
        <div className="container">
          <h4 className="mb-3">Select Date Range and User</h4>
          <div className="row mb-3">
            <label className="form-label">Date Range:</label>
            <div className="col-md-6 mb-2">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Start Date"
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="End Date"
                className="form-control"
              />
            </div>
          </div>
          <div className="row mb-3">
            <label className="form-label">Select User:</label>
            <div className="col-md-12">
              <select
                className="form-select"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="btn btn-primary mt-3"
            onClick={handleDownloadReport}
          >
            Download Report
          </button>
        </div>
      </main>
    </div>
  );
};

export default Summary;
