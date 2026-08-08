-- Defense in depth: the app validates enquiry/application submissions with
-- zod before calling submit_enquiry / submit_job_application, but those are
-- SECURITY DEFINER functions callable directly with only the public anon
-- key (e.g. via curl or Postman), completely bypassing the app's
-- validation, rate limiting and honeypot. These CHECK constraints mirror
-- the app's zod limits at the database layer so a direct RPC call can't
-- insert unbounded-length text or nonsensical numbers, regardless of which
-- path (RPC or, if ever re-enabled, a direct table insert) is used.

alter table enquiries
  add constraint enquiries_company_name_len check (char_length(company_name) <= 200),
  add constraint enquiries_contact_person_len check (char_length(contact_person) <= 120),
  add constraint enquiries_location_len check (char_length(location) <= 300),
  add constraint enquiries_additional_requirements_len check (
    additional_requirements is null or char_length(additional_requirements) <= 2000
  ),
  add constraint enquiries_guard_count_range check (guard_count between 1 and 500);

alter table job_applications
  add constraint job_applications_full_name_len check (char_length(full_name) <= 120),
  add constraint job_applications_address_len check (char_length(address) <= 500),
  add constraint job_applications_experience_len check (
    experience is null or char_length(experience) <= 1000
  ),
  add constraint job_applications_age_range check (age between 18 and 60);

-- Close the now-unused direct-table insert path. The public forms have
-- exclusively used submit_enquiry / submit_job_application (SECURITY
-- DEFINER functions, which run with the function owner's privileges and
-- don't need these table-level grants) since that was introduced — these
-- leftover anon policies/grants were dead code that only widened the
-- direct-REST attack surface with none of the app's validation behind them.
drop policy if exists "anon can submit enquiries" on enquiries;
drop policy if exists "anon can submit applications" on job_applications;

revoke insert, select on public.enquiries from anon;
revoke insert, select on public.job_applications from anon;
