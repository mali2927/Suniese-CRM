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

const Overview = ({ startDate, endDate }) => {
  const [leadStatusCounts, setLeadStatusCounts] = useState({
    hot: { count: 0, total_price: 0, average_price: 0 },
    cold: { count: 0, total_price: 0, average_price: 0 },
    warm: { count: 0, total_price: 0, average_price: 0 },
    lost: { count: 0, total_price: 0, average_price: 0 },
    won: { count: 0, total_price: 0, average_price: 0 },
    quoted: { count: 0, total_price: 0, average_price: 0 },
  });

  const [weeklyData, setWeeklyData] = useState({
    weeks: [],
    total_leads: [],
    converted_sales: [],
  });

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

  // Weekly data fetching logic can also include date filtering as needed.

  const pieData = {
    labels: ["Quoted Leads", "Won Jobs", "Lost Jobs"],
    datasets: [
      {
        data: [
          leadStatusCounts.quoted?.count,
          leadStatusCounts.won?.count,
          leadStatusCounts.lost?.count,
        ],
        backgroundColor: ["#f39c12", "#2ecc71", "#e74c3c"],
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
                <th>Average Price</th> {/* New column for Average */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cold Leads</td>
                <td>£{leadStatusCounts.cold.total_price}</td>
                <td>£{leadStatusCounts.cold.average_price.toFixed(2)}</td>{" "}
                {/* Average */}
              </tr>
              <tr>
                <td>Quoted Leads</td>
                <td>£{leadStatusCounts.quoted?.total_price}</td>
                <td>
                  £{leadStatusCounts.quoted?.average_price?.toFixed(2)}
                </td>{" "}
                {/* Average */}
              </tr>
              <tr>
                <td>Hot Leads</td>
                <td>£{leadStatusCounts.hot.total_price}</td>
                <td>£{leadStatusCounts.hot.average_price.toFixed(2)}</td>{" "}
                {/* Average */}
              </tr>
              <tr>
                <td>Lost Jobs</td>
                <td>£{leadStatusCounts.lost.total_price}</td>
                <td>£{leadStatusCounts.lost.average_price.toFixed(2)}</td>{" "}
                {/* Average */}
              </tr>
            </tbody>
          </table>

          <h3>Sales Prices</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Status</th>
                <th>Total Sales</th>
                <th>Average Price</th> {/* New column for Average */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Won Jobs</td>
                <td>£{leadStatusCounts.won.total_payment}</td>
                <td>£{leadStatusCounts.won.average_price.toFixed(2)}</td>{" "}
                {/* Average */}
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
