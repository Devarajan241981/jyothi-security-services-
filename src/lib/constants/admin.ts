export const CLIENT_TYPES = [
  "schools",
  "colleges",
  "hospitals",
  "factories",
  "industries",
  "corporateOffices",
  "warehouses",
  "banks",
  "hotels",
  "retailStores",
  "shoppingMalls",
  "constructionCompanies",
  "residentialCommunities",
  "governmentOffices",
] as const;

export const CLIENT_TYPE_LABELS: Record<(typeof CLIENT_TYPES)[number], string> = {
  schools: "School",
  colleges: "College",
  hospitals: "Hospital",
  factories: "Factory",
  industries: "Industry",
  corporateOffices: "Corporate Office",
  warehouses: "Warehouse",
  banks: "Bank",
  hotels: "Hotel",
  retailStores: "Retail Store",
  shoppingMalls: "Shopping Mall",
  constructionCompanies: "Construction Company",
  residentialCommunities: "Residential Community",
  governmentOffices: "Government Office",
};

export const GUARD_STATUS_LABELS = {
  active: "Active",
  inactive: "Inactive",
  on_leave: "On Leave",
} as const;

export const ENQUIRY_STATUS_LABELS = {
  new: "New",
  contacted: "Contacted",
  converted: "Converted",
  closed: "Closed",
} as const;

export const APPLICATION_STATUS_LABELS = {
  new: "New",
  reviewed: "Reviewed",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  hired: "Hired",
} as const;
