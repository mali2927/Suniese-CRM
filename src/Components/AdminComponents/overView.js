import React, { useEffect, useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { styles } from "../../Styles/dashboardStyles";
import config from "../../config";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const Overview = () => {
  const [leadStatusCounts, setLeadStatusCounts] = useState({
    hot: { count: 0, total_price: 0 },
    cold: { count: 0, total_price: 0 },
    warm: { count: 0, total_price: 0 },
    lost: { count: 0, total_price: 0 },
    won: { count: 0, total_price: 0 },
  });

  const [weeklyData, setWeeklyData] = useState({
    weeks: [],
    total_leads: [],
    converted_sales: [],
  });

  useEffect(() => {
    // Fetch lead status counts for the pie chart and table
    fetch(`${config.baseURL}/lead-status-counts`)
      .then((response) => response.json())
      .then((data) => setLeadStatusCounts(data))
      .catch((error) =>
        console.error("Error fetching lead status counts:", error)
      );

    // Fetch weekly lead data for the line chart
    fetch(`${config.baseURL}/weekly-lead-data`)
      .then((response) => response.json())
      .then((data) => setWeeklyData(data))
      .catch((error) =>
        console.error("Error fetching weekly lead data:", error)
      );
  }, []);

  const pieData = {
    labels: ["Cold Leads", "Warm Leads", "Hot Leads", "Won Jobs", "Lost Jobs"],
    datasets: [
      {
        data: [
          leadStatusCounts.cold.count,
          leadStatusCounts.warm.count,
          leadStatusCounts.hot.count,
          leadStatusCounts.won.count,
          leadStatusCounts.lost.count,
        ],
        backgroundColor: [
          "#3498db", // Cold
          "#f1c40f", // Warm
          "#e74c3c", // Hot
          "#2ecc71", // Won
          "#95a5a6", // Lost
        ],
      },
    ],
  };

  const lineData = {
    labels: weeklyData.weeks,
    datasets: [
      {
        label: "Total Leads",
        data: weeklyData.total_leads,
        borderColor: "#3498db",
        backgroundColor: "rgba(52, 152, 219, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Converted Sales",
        data: weeklyData.converted_sales,
        borderColor: "#2ecc71",
        backgroundColor: "rgba(46, 204, 113, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
        }}
      >
        <div style={styles.chartContainer}>
          <h3>Lead Distribution</h3>
          <Pie data={pieData} />
        </div>
        <div style={styles.chartContainer}>
          <h3>Quoted Prices</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Status</th>
                <th>Total Quoted Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cold Leads</td>
                <td>£{leadStatusCounts.cold.total_price}</td>
              </tr>
              <tr>
                <td>Warm Leads</td>
                <td>£{leadStatusCounts.warm.total_price}</td>
              </tr>
              <tr>
                <td>Hot Leads</td>
                <td>£{leadStatusCounts.hot.total_price}</td>
              </tr>
              {/* <tr>
                <td>Won Jobs</td>
                <td>£{leadStatusCounts.won.total_price}</td>
              </tr> */}
              <tr>
                <td>Lost Jobs</td>
                <td>£{leadStatusCounts.lost.total_price}</td>
              </tr>
            </tbody>
          </table>
          <h3>Sales Prices</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Status</th>
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Won Jobs</td>
                <td>£{leadStatusCounts.won.total_payment}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* <div style={{ ...styles.chartContainer, marginTop: "2rem" }}>
        <h3>Performance Trends</h3>
        <Line data={lineData} />
      </div> */}
    </div>
  );
};

export default Overview;
