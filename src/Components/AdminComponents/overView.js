// Overview.js
import React from "react";
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
  const pieData = {
    labels: ["Cold Leads", "Warm Leads", "Hot Leads", "Won Jobs", "Lost Jobs"],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          "#3498db",
          "#f1c40f",
          "#e74c3c",
          "#2ecc71",
          "#95a5a6",
        ],
      },
    ],
  };

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Total Leads",
        data: [65, 59, 80, 81],
        fill: false,
        borderColor: "#3498db",
      },
      {
        label: "Converted Sales",
        data: [28, 48, 40, 19],
        fill: false,
        borderColor: "#2ecc71",
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
