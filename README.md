# Cohertx

A KTU student workspace that brings academic resources and exam planning into one experience.

## Stage 1 foundation

- Next.js 15 App Router, React 19, strict TypeScript and Tailwind CSS v4.
- Editorial field-journal design system with light/dark tokens.
- Supabase browser, server and service-role clients.
- Ported planner, timetable verification and approved timetable filtering logic.
- Ported evidence-backed important-topic dataset and November 2026 timetable catalogue.
- Reusable UI primitives, responsive application shell and keyboard command palette.

## Local setup

Node.js 20.9+ is required.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` when enabling Supabase/admin features. Keep service-role and admin secrets server-only.

## Quality checks

```bash
npm run lint
npm run build
npm run typecheck
```

## Data integrity

- Timetable records are scoped by branch, semester and scheme. Only approved catalogue records are eligible for display.
- Discovery candidates are not verified timetables.
- Student-entered dates must remain explicitly unverified.
- Important-topic priorities retain supplied paper-count and evidence notes; they are study signals, not predictions.
- No AI service or generated academic facts are claimed.

## Roadmap

This repository is being built in reviewable stages. Learn routes and subject-level resource pages are scheduled for Stage 3; the full planner experience is scheduled for Stage 4.
