# External KTU catalogue integration

## Included upstream source

The complete authorized KeralaTimetable repository is pinned as a Git submodule
at `integrations/keralatimetable-source`. It contains the upstream HTML tools,
notes pages, syllabus pages, Python automation, structured JSON datasets,
timetable and academic-calendar PDFs, images, and other static resources.

Upstream repository: https://github.com/KeralaTimetable/keralatimetable.github.io
Pinned commit: `9612b2a4238dfd31f0f136d9b56d552a0cb528dd`

## Native integration scope

KTU Connect Max should adapt these capabilities into its existing Next.js UI:
notes discovery, PYQ search, syllabus/subject catalogue, timetable and notice
discovery, activity-point calculator, and PDF utilities. The submodule preserves
the complete source; it does not mean every upstream page has already been
ported into the native UI or deployed.

## Data integrity
- Keep 2019 and 2024 scheme records explicitly separated.
- Preserve source URL, source title, retrieval time, and a content hash.
- Imports enter a staging queue and remain hidden until an administrator verifies them.
- Detect duplicates by source and normalized record hash.
- Treat timetable/notice dates as candidates until checked against official KTU publications.
- Activity-point values must come from the applicable official KTU handbook.
- PDF processing is limited to files the user owns or is authorized to modify.

## Database foundation
Migration `008_external_catalogue_ingestion.sql` adds a service-role-only staging
model, academic notice catalogue, and scheme-separated activity-point rule
catalogue. No unverified academic claims or activity-point values are seeded.
