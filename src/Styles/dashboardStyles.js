// dashboardStyles.js
export const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #ddd",
  },
  sidebarItem: {
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    cursor: "pointer",
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    color: "#2d3436",
    transition: "background-color 0.2s",
  },
  sidebarItemActive: {
    backgroundColor: "#3498db",
    color: "#ffffff",
  },
  sidebarIcon: {
    marginRight: "0.5rem",
  },
  mainContent: {
    flex: 1,
    padding: "2rem",
  },
  card: {
    padding: "1rem",
    borderRadius: "0.25rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    textAlign: "center",
    flex: 1,
  },
  cardIcon: {
    fontSize: "2rem",
    color: "#3498db",
  },
  chartContainer: {
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: "0.25rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
};
