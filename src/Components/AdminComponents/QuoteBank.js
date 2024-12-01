import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Sidebar from "../SideBar";
import { styles } from "../../Styles/dashboardStyles";
import { Tabs, Tab } from "react-bootstrap";
import NotQuoted from "./QuoteBankTabs/NotQuoted";
import QuotedLeads from "./QuoteBankTabs/QuotedLeads"; // New component for quoted leads
import QuoteNowModal from "./Modals/QuoteNowModal";
import config from "../../config"; // Adjust path if needed

const QuoteBank = () => {
  const [key, setKey] = useState("notQuoted");
  const [chaseLeads, setChaseLeads] = useState([]);
  const [quotedLeads, setQuotedLeads] = useState([]); // State for quoted leads
  const [searchTermNotQuoted, setSearchTermNotQuoted] = useState("");
  const [currentPageNotQuoted, setCurrentPageNotQuoted] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [quoteUrl, setQuoteUrl] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState(null); // Track the selected lead

  const quotesPerPage = 10; // Number of quotes per page

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${config.baseURL}/leads`);
      const result = await response.json();

      if (result.success) {
        // Filter leads for not quoted and quoted separately
        const chase = result.data.filter(
          (lead) => lead.id !== 5 && lead.quote_status == 0
        );
        setChaseLeads(chase);

        const quoted = result.data.filter(
          (lead) => lead.quote_status !== 0 // Filter quoted leads
        );
        setQuotedLeads(quoted); // Set quoted leads
      } else {
        console.error("Failed to fetch leads");
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const updateQuoteStatus = async (leadId, url) => {
    try {
      const response = await fetch(`/leads/${leadId}/update-quote-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Quote status updated successfully!");
        fetchLeads(); // Re-fetch the leads after updating the quote status
      } else {
        alert("Failed to update quote status");
      }
    } catch (error) {
      console.error("Error updating quote status:", error);
    }
  };

  useEffect(() => {
    fetchLeads(); // Fetch leads when the component mounts
  }, []);

  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.mainContent}>
        <Navbar />
        <h2>Quote Bank</h2>
        <Tabs
          id="quote-bank-tabs"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
        >
          <Tab eventKey="notQuoted" title="Not Quoted">
            <NotQuoted
              leads={chaseLeads}
              searchTerm={searchTermNotQuoted}
              setSearchTerm={setSearchTermNotQuoted}
              currentPage={currentPageNotQuoted}
              setCurrentPage={setCurrentPageNotQuoted}
              quotesPerPage={quotesPerPage}
              setShowModal={setShowModal}
              setSelectedLeadId={setSelectedLeadId} // Pass the selected lead ID
            />
          </Tab>

          {/* New Tab for Quoted Leads */}
          <Tab eventKey="quoted" title="Quoted Leads">
            <QuotedLeads
              leads={quotedLeads}
              searchTerm={searchTermNotQuoted}
              setSearchTerm={setSearchTermNotQuoted}
              currentPage={currentPageNotQuoted}
              setCurrentPage={setCurrentPageNotQuoted}
              quotesPerPage={quotesPerPage}
            />
          </Tab>
        </Tabs>
      </main>

      {/* QuoteNowModal component */}
      <QuoteNowModal
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setSelectedLeadId(null); // Reset the selected lead ID
          setQuoteUrl(""); // Reset the quote URL
        }}
        handleSubmit={() => {
          setShowModal(false);
          setSelectedLeadId(null); // Reset the selected lead ID
          setQuoteUrl(""); // Reset the quote URL
        }}
        quoteUrl={quoteUrl}
        setQuoteUrl={setQuoteUrl}
        leadId={selectedLeadId} // Pass the selected lead ID to the modal
        updateQuoteStatus={updateQuoteStatus} // Pass the updateQuoteStatus function
      />
    </div>
  );
};

export default QuoteBank;
