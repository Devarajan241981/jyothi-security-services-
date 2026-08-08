-- Soft-delete for enquiries: "delete" archives instead of destroying the row,
-- so admin can look up a rejected enquiry's phone number later once JSS
-- expands into that area and re-contact them.

alter table enquiries add column deleted_at timestamptz;

create index enquiries_deleted_at_idx on enquiries (deleted_at);
