-- Storage policies for buckets `cms` (private) and `uploads` (public).
-- The server uses the service_role key, which bypasses RLS.
-- Public SELECT on `uploads` lets browsers load photos by URL.

drop policy if exists "Public read uploads" on storage.objects;
create policy "Public read uploads"
on storage.objects
for select
to public
using (bucket_id = 'uploads');
