-- Testimonials: add organization name + star rating so the admin feedback
-- form (and the public site) can show who the client is and how they rated
-- JSS, not just a name/role/quote.

alter table testimonials add column organization text;
alter table testimonials add column rating smallint not null default 5;
alter table testimonials add constraint testimonials_rating_range check (rating between 1 and 5);

-- Starter testimonials so the site isn't empty on day one — fully editable
-- and deletable by the admin from here on (Admin > Testimonials).
insert into testimonials (name, role, organization, quote, rating, is_published) values
  ('Radha Nagaraj', 'School Principal', 'Sunrise International School', 'The guards are punctual, courteous with parents, and firm at the gate. Exactly what a school campus needs.', 5, true),
  ('Suresh Kumar', 'Factory Manager', 'Kolar Steel Works', 'Shift handovers are smooth and the patrolling logs give us real visibility into our night security.', 5, true),
  ('Manjula P.', 'Apartment Association', 'Green Valley Apartments', 'Visitor logging has made our residents feel far more secure. The guards know every family by name.', 4, true),
  ('Anil Verma', 'Warehouse Owner', 'Verma Logistics', 'Stock checks at the gate have reduced pilferage significantly since JSS took over our security.', 5, true),
  ('Priya D.', 'Company HR', 'Bright Corp Technologies', 'Replacement guards arrive within hours whenever needed. Reliable and easy to coordinate with.', 5, true);
