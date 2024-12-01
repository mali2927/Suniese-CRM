import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import Navbar from "../Navbar";
import { styles } from "../../Styles/dashboardStyles";
import config from "../../config";
import { Button, Form, Pagination } from "react-bootstrap";
import ViewLeadModal from "../AdminComponents/Modals/ViewLeadModal";

const UserArchive = () => {
  const [archivedLeads, setArchivedLeads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const selectedConsultantId = localStorage.getItem("user_id");

  useEffect(() => {
    fetch(`${config.baseURL}/archived-leads`)
      .then((response) => response.json())
      .then((data) => {
        const filteredLeads = data.filter(
          (lead) => lead.user_id === Number(selectedConsultantId)
        );
        setArchivedLeads(filteredLeads);
      })
      .catch((error) => console.error("Error fetching archived leads:", error));
  }, [selectedConsultantId]);

  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLead(null);
  };

  const handleDeleteLead = (leadId) => {
    fetch(`${config.baseURL}/delete-lead/${leadId}`, { method: "DELETE" })
      .then(() => {
        setArchivedLeads(archivedLeads.filter((lead) => lead.id !== leadId));
      })
      .catch((error) => console.error("Error deleting lead:", error));
  };

  const handleRestoreLead = (leadId) => {
    fetch(`${config.baseURL}/restore-lead/${leadId}`, { method: "POST" })
      .then(() => {
        setArchivedLeads(archivedLeads.filter((lead) => lead.id !== leadId));
      })
      .catch((error) => console.error("Error restoring lead:", error));
  };

  // Filter and Paginate Leads
  const filteredLeads = archivedLeads.filter((lead) =>
    `${lead.title} ${lead.first_name} ${lead.surname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.mainContent}>
        <Navbar />
        <h2>Archived Leads</h2>

        {/* Search Bar */}
        <Form className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form>

        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>First Name</th>
                <th>Surname</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.id}</td>
                  <td>{lead.title}</td>
                  <td>{lead.first_name}</td>
                  <td>{lead.surname}</td>
                  <td>{lead.email}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleViewLead(lead)}
                    >
                      View
                    </Button>{" "}
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleRestoreLead(lead.id)}
                    >
                      Restore
                    </Button>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteLead(lead.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination>
          <Pagination.Prev
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </main>

      <ViewLeadModal
        show={showModal}
        handleClose={handleCloseModal}
        lead={selectedLead}
      />
    </div>
  );
};

export default UserArchive;
