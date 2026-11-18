# External KTU catalogue integration

## Scope
KTU Connect Max will independently implement the useful workflows found in the
authorized KeralaTimetable source: notes discovery, PYQ indexing, syllabus and
subject catalogues, timetable/notice discovery, activity-point calculation data,
and PDF utilities. The existing KTU Connect Max UI and navigation remain the product experience.

## Integration rules
- Keep 2019 and 2024 scheme records explicitly separated.
- Preserve source URL, source title, retrieval time, and a content hash for every imported record.
- Imports enter a staging queue. They do not become student-visible until an administrator verifies the source and academic mapping.
- Detect duplicates by source and normalized record hash; retain original source links instead of silently mirroring files.
- Treat third-party timetable and notice dates as candidates until checked against official KTU publications.
- Activity-point values must come from the applicable official KTU handbook. Never seed values from an unverified third-party calculator.
- PDF processing is limited to files the user owns or is authorized to modify.

## Delivery sequence
1. Source registry, import batches, staging records, and provenance.
2. Notes/PYQ/syllabus import adapters with validation and duplicate detection.
3. Timetable and notice discovery, official-source review, and publication.
4. Verified activity-point rule catalogue and scheme-specific calculator.
5. Secure PDF tools: merge, add a user watermark, preview, and download.
6. Admin review UI, import reports, audit events, and end-to-end tests.

## Database foundation
Migration 008 adds the service-role-only staging model, notice catalogue, and activity-point rule catalogue. It contains no imported academic claims or hard-coded activity-point values.
