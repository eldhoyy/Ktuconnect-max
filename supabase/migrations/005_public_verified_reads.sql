-- Public academic catalogue reads are safe because every policy exposes only
-- explicitly approved/verified rows. Student-owned tables remain private.
grant select on public.universities, public.academic_schemes, public.programmes,
  public.branches, public.subjects, public.subject_modules,
  public.timetable_sources, public.exam_timetables, public.exam_events,
  public.study_resources, public.knowledge_documents, public.knowledge_chunks
to anon, authenticated;

create policy "Public read university catalogue"
  on public.universities for select to anon, authenticated using (true);
create policy "Public read academic schemes"
  on public.academic_schemes for select to anon, authenticated using (true);
create policy "Public read programmes"
  on public.programmes for select to anon, authenticated using (true);
create policy "Public read branches"
  on public.branches for select to anon, authenticated using (true);
create policy "Public read verified subjects"
  on public.subjects for select to anon, authenticated using (verification_status = 'verified');
create policy "Public read modules for verified subjects"
  on public.subject_modules for select to anon, authenticated using (
    exists (select 1 from public.subjects s
      where s.id = subject_id and s.verification_status = 'verified')
  );
create policy "Public read verified timetable sources"
  on public.timetable_sources for select to anon, authenticated using (verification_status = 'verified');
create policy "Public read verified timetables"
  on public.exam_timetables for select to anon, authenticated using (status = 'verified');
create policy "Public read events from verified timetables"
  on public.exam_events for select to anon, authenticated using (
    exists (select 1 from public.exam_timetables t
      where t.id = timetable_id and t.status = 'verified')
  );
create policy "Public read approved resources"
  on public.study_resources for select to anon, authenticated using (verification_status = 'approved');
create policy "Public read verified knowledge documents"
  on public.knowledge_documents for select to anon, authenticated using (verification_status = 'verified');
create policy "Public read chunks from verified documents"
  on public.knowledge_chunks for select to anon, authenticated using (
    exists (select 1 from public.knowledge_documents d
      where d.id = document_id and d.verification_status = 'verified')
  );
