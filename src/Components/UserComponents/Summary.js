import React, { useState } from "react";
import DatePicker from "react-datepicker"; // Install via `npm install react-datepicker`
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "../Navbar";
import Sidebar from "./SideBar";
import { styles } from "../../Styles/dashboardStyles";
import config from "../../config";

const Summary = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const handleDownloadReport = async () => {
    if (startDate && endDate) {
      const userId = localStorage.getItem("user_id");

      const payload = {
        user_id: userId,
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
      alert("Please select a date range before downloading the report.");
    }
  };

  return (
    <div className="d-flex" style={styles.container}>
      <Sidebar />
      <main className="flex-grow-1 p-3" style={styles.mainContent}>
        <Navbar />
        <h2 className="mb-4">Summary</h2>
        <div className="container">
          <h4 className="mb-3">Select Date Range</h4>
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
