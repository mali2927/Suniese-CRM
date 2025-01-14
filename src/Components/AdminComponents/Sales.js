import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Sidebar from "../SideBar";
import { styles } from "../../Styles/dashboardStyles";
import { Tabs, Tab } from "react-bootstrap";
import WonLeads from "./PipelineTabs/WonLeads";
import LostLeads from "./PipelineTabs/LostLeads";
import ChaseLeads from "./PipelineTabs/ChaseLeads";
import NotQuoted from "./QuoteBankTabs/NotQuoted";
import QuotedLeads from "./QuoteBankTabs/QuotedLeads";
import QuoteNowModal from "./Modals/QuoteNowModal";
import config from "../../config"; // Adjust path if needed

const Sales = () => {
  const [key, setKey] = useState("won"); // Default tab is 'Won Leads'
  const [searchTermWon, setSearchTermWon] = useState("");
  const [searchTermLost, setSearchTermLost] = useState("");
  const [searchTermChase, setSearchTermChase] = useState("");
  const [searchTermNotQuoted, setSearchTermNotQuoted] = useState("");
  const [searchTermQuoted, setSearchTermQuoted] = useState("");

  const [currentPageWon, setCurrentPageWon] = useState(1);
  const [currentPageLost, setCurrentPageLost] = useState(1);
  const [currentPageChase, setCurrentPageChase] = useState(1);
  const [currentPageNotQuoted, setCurrentPageNotQuoted] = useState(1);
  const [currentPageQuoted, setCurrentPageQuoted] = useState(1);

  const [chaseLeads, setChaseLeads] = useState([]);
  const [quotedLeads, setQuotedLeads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [quoteUrl, setQuoteUrl] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState(null); // Track the selected lead

  const leadsPerPage = 10; // Number of leads per page
  const quotesPerPage = 10; // Number of quotes per page

  // Fetch leads data
  const fetchLeads = async () => {
    try {
      const response = await fetch(`${config.baseURL}/leads`);
      const result = await response.json();

      if (result.success) {
        // Filter leads for different categories
        const chase = result.data.filter((lead) => lead.quote_status == "0");
        setChaseLeads(chase);

        const quoted = result.data.filter(
          (lead) => lead.quote_status != "0" // Filter quoted leads
        );
        setQuotedLeads(quoted); // Set quoted leads
      } else {
        console.error("Failed to fetch leads");
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
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
        <h2>Sales</h2>
        <Tabs
          id="pipeline-tabs"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
        >
          <Tab eventKey="quoted" title="Quoted Leads">
            <QuotedLeads
              leads={quotedLeads}
              searchTerm={searchTermQuoted}
              setSearchTerm={setSearchTermQuoted}
              currentPage={currentPageQuoted}
              setCurrentPage={setCurrentPageQuoted}
              quotesPerPage={quotesPerPage}
            />
          </Tab>
          {/* Sales Tabs */}
          <Tab eventKey="won" title="Won Leads">
            <WonLeads
              searchTerm={searchTermWon}
              setSearchTerm={setSearchTermWon}
              currentPage={currentPageWon}
              setCurrentPage={setCurrentPageWon}
              leadsPerPage={leadsPerPage}
            />
          </Tab>
          <Tab eventKey="lost" title="Lost Leads">
            <LostLeads
              searchTerm={searchTermLost}
              setSearchTerm={setSearchTermLost}
              currentPage={currentPageLost}
              setCurrentPage={setCurrentPageLost}
              leadsPerPage={leadsPerPage}
            />
          </Tab>
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
          <Tab eventKey="chase" title="Chase Leads">
            <ChaseLeads
              searchTerm={searchTermChase}
              setSearchTerm={setSearchTermChase}
              currentPage={currentPageChase}
              setCurrentPage={setCurrentPageChase}
              leadsPerPage={leadsPerPage}
            />
          </Tab>

          {/* Quote Bank Tabs */}
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
      />
    </div>
  );
};

export default Sales;
