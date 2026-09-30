# Mobile-first reorganization

## Goal
Make StayInKo easy to scan and operate on a phone, with the most important actions visible first and no crowded controls.

## Changes
- Simplify the mobile header into a compact brand row and a persistent bottom navigation for Home, Search, Concierge, and Account.
- Reorder the home screen around the primary journey: search first, featured stays, concierge help, cities, then supporting trust and information sections.
- Tighten mobile spacing and typography while preserving the current desktop layout and orange brand styling.
- Turn listing cards into compact, touch-friendly mobile rows where appropriate, with clearer price, location, rating, and status hierarchy.
- Replace the crowded search filter panel on phones with a compact summary and bottom drawer, keeping results visible sooner.
- Improve tap targets, horizontal scrolling controls, sticky actions, and safe-area spacing across mobile screens.
- Fix the mobile listing gallery indicator behavior and ensure key detail actions remain reachable.

## Validation
- Check the home, search, and listing-detail screens at a 390 × 844 phone viewport.
- Confirm there is no horizontal overflow and that navigation, search, filters, cards, and booking actions are usable.
- Confirm the project builds without errors.

## Technical notes
- Reuse the existing design tokens and shared buttons.
- Keep current data, authentication, booking, payment, and helper behavior unchanged.
