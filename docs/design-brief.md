# Datum — BLUEPRINT design brief

## Brand
**Datum** is the reference point from which a drawing, measurement or plan is set out. It gives the platform a concise engineering identity without tying it to one department.

Other considered names:
- **Vector** — communicates direction and forward movement.
- **Draft** — evokes technical drawings, iteration and making a plan.

## Concept
An engineering student's desk, viewed as a precise working surface: drafting grids, dimension lines, measured progress and clear source labels. The interface should feel like a tool used by a serious student, not a lifestyle brand or generic SaaS dashboard.

## Palette
- Ink / primary text: `#0A1628`
- Paper / page: `#EEF1F5`
- Surface / cards: `#FFFFFF`
- Line: `#E3E8EF`
- Muted text: `#4A5A70`
- Signal accent: `#FF6B2C` (always paired with dark ink, never white)
- Secondary dark line: `#5B6F8A`
- Dark page: `#0A1628`; dark surface: `#0F1B2E`
- Dark muted text: `#9FB0C5` and `#B8C5D6`

Accent is reserved for the primary action, measured markers and important state. Never add a second decorative accent. Contrast must meet WCAG AA; colour is never the only status cue.

## Typography
Manrope 600/800 carries all UI and headings. JetBrains Mono 500 is reserved for codes, dates, counts, measurements and compact labels. Headings use approximately -0.03em tracking. All changing numbers use tabular numerals.

## Grid and spacing
A 4px spacing base. Mobile starts at 390px with 16–20px gutters; tablet uses a deliberate two-column layout; desktop uses a wide editorial grid with a constrained reading measure. The hero uses a 26px square drafting grid drawn in CSS at 6% white opacity.

## Shape and depth
Cards: 18px radius. Buttons: 12px. Chips: 8px. Small bars: 3–4px. Floating surfaces use one restrained layered shadow: `0 8px 24px rgba(10,22,40,.12)`. Use ruled lists and open space; avoid uniform card grids.

## Motion
Motion explains sequencing and progress. Animate transform, opacity and SVG stroke only. Headline lines rise with a 60ms stagger; the dimension line draws in 900ms; the floating Today panel follows with a restrained spring; progress fills once on entry. No loud loops. Respect reduced motion and the persisted user preference.

## Do / don't
**Do:** show source and verification state; label all sample planner content; keep dates and counts in mono; provide 44px touch targets; keep layouts readable at 390px and genuinely recompose at desktop widths.

**Don't:** use cream, serif typography, terracotta, purple gradients, emoji, stacked small-caps eyebrow systems, decorative coordinates, invented progress, fake testimonials, or generic identical cards.
