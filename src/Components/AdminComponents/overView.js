import React, { useEffect, useState } from "react";
import { Pie, Bar, Line, Doughnut, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  RadialLinearScale,
} from "chart.js";
import { styles } from "../../Styles/dashboardStyles";
import config from "../../config";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  RadialLinearScale
);

const Overview = ({ startDate, endDate }) => {
  const [leadStatusCounts, setLeadStatusCounts] = useState({
    hot: { count: 0, total_price: 0, average_price: 0 },
    cold: { count: 0, total_price: 0, average_price: 0 },
    warm: { count: 0, total_price: 0, average_price: 0 },
    lost: { count: 0, total_price: 0, average_price: 0 },
    won: { count: 0, total_price: 0, average_price: 0 },
    quoted: { count: 0, total_price: 0, average_price: 0 },
  });

  const [chartType, setChartType] = useState("Pie");

  const fetchLeadStatusCounts = () => {
    const start = startDate.toISOString().split("T")[0];
    const end = endDate.toISOString().split("T")[0];

    fetch(
      `${config.baseURL}/lead-status-counts?start_date=${start}&end_date=${end}`
    )
      .then((response) => response.json())
      .then((data) => setLeadStatusCounts(data))
      .catch((error) =>
        console.error("Error fetching lead status counts:", error)
      );
  };

  useEffect(() => {
    fetchLeadStatusCounts();
  }, [startDate, endDate]);

  const chartData = {
    labels: ["Quoted Leads", "Won Jobs", "Lost Jobs"],
    datasets: [
      {
        label: "Leads Count",
        data: [
          leadStatusCounts.quoted?.count,
          leadStatusCounts.won?.count,
          leadStatusCounts.lost?.count,
        ],
        backgroundColor: ["#f39c12", "#2ecc71", "#e74c3c"],
        borderColor: ["#f39c12", "#2ecc71", "#e74c3c"],
        borderWidth: 1,
      },
    ],
  };

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  const renderChart = () => {
    switch (chartType) {
      case "Pie":
        return <Pie data={chartData} />;
      case "Bar":
        return <Bar data={chartData} />;
      case "Line":
        return <Line data={chartData} />;
      case "Doughnut":
        return <Doughnut data={chartData} />;
      case "Radar":
        return <Radar data={chartData} />;
      default:
        return <Pie data={chartData} />;
    }
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
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="chartType" style={{ marginRight: "0.5rem" }}>
              Select Chart Type:
            </label>
            <select
              id="chartType"
              value={chartType}
              onChange={handleChartTypeChange}
            >
              <option value="Pie">Pie Chart</option>
              <option value="Bar">Bar Chart</option>
              <option value="Line">Line Chart</option>
              <option value="Doughnut">Doughnut Chart</option>
              <option value="Radar">Radar Chart</option>
            </select>
          </div>
          {renderChart()}
        </div>
        <div style={styles.chartContainer}>
          <h3>Quoted Prices</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Status</th>
                <th>Count</th>
                <th>Total Quoted Price</th>
                <th>Average Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Quoted Leads</td>
                <td>{leadStatusCounts.quoted?.count}</td>
                <td>£{leadStatusCounts.quoted?.total_price}</td>
                <td>£{leadStatusCounts.quoted?.average_price?.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Lost Jobs</td>
                <td>{leadStatusCounts.lost?.count}</td>
                <td>£{leadStatusCounts.lost.total_price}</td>
                <td>£{leadStatusCounts.lost.average_price.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <h3>Sales Prices</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Status</th>
                <th>Count</th>
                <th>Total Sales</th>
                <th>Average Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Won Jobs</td>
                <td>{leadStatusCounts.won?.count}</td>
                <td>£{leadStatusCounts.won.total_payment}</td>
                <td>£{leadStatusCounts.won.average_price.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
