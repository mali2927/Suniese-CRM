import React from "react";
import { Modal, Button, Table } from "react-bootstrap";
import config from "../../../config";

const ViewLeadModal = ({ show, handleClose, lead }) => {
  if (!lead) return null; // If no lead data, return null

  const handleDownloadReport = () => {
    window.open(`${config.baseURL}/leads/${lead.id}/report`, "_blank");
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Lead Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover responsive>
          <tbody>
            <tr>
              <td>
                <strong>Title</strong>
              </td>
              <td>{lead.title}</td>
            </tr>
            <tr>
              <td>
                <strong>First Name</strong>
              </td>
              <td>{lead.first_name}</td>
            </tr>
            <tr>
              <td>
                <strong>Surname</strong>
              </td>
              <td>{lead.surname}</td>
            </tr>
            <tr>
              <td>
                <strong>Email</strong>
              </td>
              <td>{lead.email}</td>
            </tr>
            <tr>
              <td>
                <strong>Phone Number</strong>
              </td>
              <td>{lead.phone_number}</td>
            </tr>
            <tr>
              <td>
                <strong>House Number</strong>
              </td>
              <td>{lead.house_number}</td>
            </tr>
            <tr>
              <td>
                <strong>Street Name</strong>
              </td>
              <td>{lead.street_name}</td>
            </tr>
            <tr>
              <td>
                <strong>Town/City</strong>
              </td>
              <td>{lead.town_city}</td>
            </tr>
            <tr>
              <td>
                <strong>Postal Code</strong>
              </td>
              <td>{lead.postal_code}</td>
            </tr>
            <tr>
              <td>
                <strong>Homeownership Status</strong>
              </td>
              <td>{lead.homeownership_status}</td>
            </tr>
            <tr>
              <td>
                <strong>Quoted Price</strong>
              </td>
              <td>{lead.quoted_price}</td>
            </tr>
            <tr>
              <td>
                <strong>Meeting Time</strong>
              </td>
              <td>{lead.meeting_time}</td>
            </tr>
            <tr>
              <td>
                <strong>Cutomer Type</strong>
              </td>
              <td>{lead.customer_type}</td>
            </tr>
            <tr>
              <td>
                <strong>Best Time to Call</strong>
              </td>
              <td>{lead.best_time_to_call}</td>
            </tr>
            <tr>
              <td>
                <strong>Status</strong>
              </td>
              <td>{lead.status?.title}</td>
            </tr>
            <tr>
              <td>
                <strong>Total Payment</strong>
              </td>
              <td>{lead.total_payment}</td>
            </tr>
            <tr>
              <td>
                <strong>System Quoted</strong>
              </td>
              <td>{lead.system_quoted}</td>
            </tr>
            <tr>
              <td>
                <strong>Client Name</strong>
              </td>
              <td>{lead.client_name || "-"}</td>
            </tr>
            <tr>
              <td>
                <strong>End User</strong>
              </td>
              <td>{lead.end_user || "-"}</td>
            </tr>
            <tr>
              <td>
                <strong>Service Description</strong>
              </td>
              <td>{lead.service_description || "-"}</td>
            </tr>
            <tr>
              <td>
                <strong>Total Contract Value Net</strong>
              </td>
              <td>{lead.total_contract_value_net || "-"}</td>
            </tr>{" "}
            <tr>
              <td>
                <strong>Total Contract Value Gross</strong>
              </td>
              <td>{lead.total_contract_value_gross || "-"}</td>
            </tr>
            <tr>
              <td>
                <strong>Commission</strong>
              </td>
              <td>{lead.commission || "-"}</td>
            </tr>
            <tr>
              <td>
                <strong>Sales Consultant</strong>
              </td>
              <td>{lead.user?.name || "N/A"}</td>
            </tr>
            <tr>
              <td>
                <strong>Created At</strong>
              </td>
              <td>{new Date(lead.created_at).toLocaleString()}</td>
            </tr>
            <tr>
              <td>
                <strong>Updated At</strong>
              </td>
              <td>{new Date(lead.updated_at).toLocaleString()}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleDownloadReport}>
          Download Report
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewLeadModal;
