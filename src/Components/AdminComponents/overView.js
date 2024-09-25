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
    hot: 0,
    cold: 0,
    warm: 0,
    lost: 0,
    won: 0,
  });

  const [weeklyData, setWeeklyData] = useState({
    weeks: [],
    total_leads: [],
    converted_sales: [],
  });

  useEffect(() => {
    // Fetch lead status counts for the pie chart
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
          leadStatusCounts.cold,
          leadStatusCounts.warm,
          leadStatusCounts.hot,
          leadStatusCounts.won,
          leadStatusCounts.lost,
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
    labels: weeklyData.weeks.map((week) => `Week ${week}`), // Display weeks dynamically
    datasets: [
      {
        label: "Total Leads",
        data: weeklyData.total_leads,
        fill: false,
        borderColor: "#3498db",
        tension: 0.4, // Add tension for a smooth line
      },
      {
        label: "Converted Sales",
        data: weeklyData.converted_sales,
        fill: false,
        borderColor: "#2ecc71",
        tension: 0.4, // Add tension for a smooth line
      },
    ],
  };

  return (
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
        <h3>Performance Trends</h3>
        <Line data={lineData} />
      </div>
    </div>
  );
};

export default Overview;
