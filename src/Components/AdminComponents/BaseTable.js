import React from "react";
import IndividualLeadsTable from "./IndividualLeadsTable";
import GeneralLeadsTable from "./GeneralLeadsTable";

const BaseTable = ({
  type,
  leads,
  handleStatusChange,
  convertToSale,
  onViewReport,
  salesConsultants,
}) => {
  return type === "individualLeads" ? (
    <IndividualLeadsTable
      salesConsultants={salesConsultants}
      onViewReport={onViewReport}
    />
  ) : (
    <GeneralLeadsTable
      leads={leads}
      handleStatusChange={handleStatusChange}
      convertToSale={convertToSale}
    />
  );
};

export default BaseTable;
