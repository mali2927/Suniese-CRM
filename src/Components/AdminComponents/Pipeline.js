import React, { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../SideBar";
import { styles } from "../../Styles/dashboardStyles";
import { Tabs, Tab } from "react-bootstrap";
import WonLeads from "./PipelineTabs/WonLeads";
import LostLeads from "./PipelineTabs/LostLeads";
import ChaseLeads from "./PipelineTabs/ChaseLeads";

const Pipeline = () => {
  const [key, setKey] = useState("won");
  const [searchTermWon, setSearchTermWon] = useState("");
  const [searchTermLost, setSearchTermLost] = useState("");
  const [searchTermChase, setSearchTermChase] = useState("");
  const [currentPageWon, setCurrentPageWon] = useState(1);
  const [currentPageLost, setCurrentPageLost] = useState(1);
  const [currentPageChase, setCurrentPageChase] = useState(1);
  const leadsPerPage = 10; // Number of leads per page

  return (
    <>
      <div style={styles.container}>
        <Sidebar />
        <main style={styles.mainContent}>
          <Navbar />
          <h2>Pipeline</h2>
          <Tabs
            id="pipeline-tabs"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
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
            <Tab eventKey="chase" title="Chase Leads">
              <ChaseLeads
                searchTerm={searchTermChase}
                setSearchTerm={setSearchTermChase}
                currentPage={currentPageChase}
                setCurrentPage={setCurrentPageChase}
                leadsPerPage={leadsPerPage}
              />
            </Tab>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default Pipeline;
