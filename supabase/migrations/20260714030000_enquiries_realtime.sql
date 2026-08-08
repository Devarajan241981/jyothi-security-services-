-- Enable Realtime change streaming for enquiries so the admin panel can
-- show new/updated/deleted rows live, without a manual page refresh.
alter publication supabase_realtime add table enquiries;
