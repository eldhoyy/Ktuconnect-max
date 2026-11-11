# Cohertx — Design brief

## Concept: The campus field journal

Cohertx should feel like a well-kept engineering student's field journal connected to a precise planning desk. The learning side is tactile and editorial: paper surfaces, ruled divisions, margin notes and typographic hierarchy. The planning side is measured and instrument-like: compact labels, clear dates, progress marks and disciplined data layouts. It is not a generic productivity SaaS dashboard.

## Brand naming

1. **Cohertx** — A compact, ownable-feeling blend of cohort and context; it signals a shared academic workspace without limiting the product to one feature.
2. **Termwise** — Makes semester-by-semester learning and planning feel approachable and structured.
3. **Studiora** — Suggests a focused studio for study resources, revision and academic progress.

Cohertx is the selected working brand for this foundation.

## Palette

- Canvas: warm limestone `#F2EFE6`
- Paper: soft ivory `#FBFAF6`
- Ink: deep green-black `#202923`
- Primary: campus evergreen `#176B59`
- Signal: burnt vermilion `#BD623F`
- Muted text: `#59645C`
- Dividers: warm graphite `#D8D5C9`

Dark mode moves to forest-charcoal surfaces with pale ink and a softened evergreen accent. All text and interactive states must be checked for WCAG AA contrast; colour is never the only status cue.

## Typography

Fraunces is the expressive display face for headlines and editorial moments. DM Sans carries navigation, labels, long-form notes and dense academic data. Use tabular numerals for dates, countdowns and progress values. Keep display type rare enough to retain its character.

## Grid and spacing

Use a 12-column desktop grid with a readable content measure (roughly 68–76 characters for prose). Tablet layouts collapse to 8 columns; mobile uses 4 columns with 16–20px outer gutters. Spacing follows a 4px base rhythm. Avoid uniform card grids: mix open editorial sections, ruled lists, compact data strips and a small number of featured panels.

## Shape, depth and texture

Use three radii deliberately: 8px for controls, 18px for standard panels and 30px for feature surfaces. Shadows are layered and restrained. A subtle grain texture may sit on large paper surfaces only; never reduce text clarity or contrast.

## Motion principles

Motion should explain hierarchy and state, not decorate. Prefer short transform/opacity transitions (160–240ms), restrained stagger and clear pressed/focus feedback. Respect `prefers-reduced-motion`; no scroll hijacking, perpetual motion or motion-dependent information.

## Do / don't

**Do:** show verification status beside academic dates; retain source context; use clear empty states; make keyboard focus visible; design mobile at 360px first; keep actions explicit.

**Don't:** invent exam dates, resources, usage counts, testimonials or AI output; present student-entered dates as official; use purple gradients, emoji icons, stock icon tiles, excessive pill shapes or identical rounded white cards. 