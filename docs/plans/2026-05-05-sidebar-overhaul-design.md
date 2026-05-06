# Sidebar Overhaul Design

**Date:** 2026-05-05  
**Status:** Approved

## Problem

The GT Studio sidebar panel has three UX issues:

1. PAINT and RIM COLOR sections always render their full swatch grids, making the panel extremely long with no way to hide them.
2. Every `CarouselCard` section has a hardcoded `borderBottom` divider that creates visual clutter.
3. The Panel collapse toggle works (collapses), but clicking it again does not re-expand — the chevron icon logic is inverted relative to the panel's position on the right side of the screen.

## Approach: Accordion Header Row (Approach A)

Minimal-scope fix. No data model changes. Two files touched: `CarouselCard.jsx` and `Panel.jsx`.

## Design

### 1. CarouselCard — Color Section Accordion

Color sections are detected by the existing `hasColors` check (`options[0]?.color !== undefined`). This applies to PAINT and RIM COLOR.

**Behavior:**
- `open` state defaults to `false` (collapsed on load).
- The section header is a full-width clickable row.
- Left: section label (existing typography — 9px, tracking-wide, uppercase, zinc-500).
- Right: `ChevronDown` from lucide-react, rotates 180° when open. Transition: `rotate 200ms ease`.
- Collapsed header also shows: a small circle (10px) filled with the currently selected color + the selected color's label name. This keeps the selection visible without opening the panel.
- Expanded: swatch grid animates open using `max-height` transition (`0px` → `320px`, `duration-300 ease-in-out`). The selected label below the grid remains as-is.

**Non-color sections (carousels):** No accordion — they remain always-visible. Their label typography and padding stay the same.

### 2. Removing Dividers

Remove `borderBottom: '1px solid rgba(255,255,255,0.06)'` from both render paths in `CarouselCard`. Vertical rhythm is maintained through consistent padding (`pt-4 pb-3` per section). No other separators added.

### 3. Panel Toggle Fix

`Panel.jsx` sits on the **right side** of the viewport. The correct icon intent:
- `open = true` → show `ChevronRight` (arrow points right = close/push away)
- `open = false` → show `ChevronLeft` (arrow points left = expand/pull in)

Current code has these swapped. Fix: swap the two icon components in the ternary.

## Files Changed

| File | Change |
|------|--------|
| `src/components/CarouselCard.jsx` | Add `useState(false)` accordion for color sections; show selected swatch in collapsed header; remove `borderBottom` from both render paths |
| `src/components/Panel.jsx` | Swap `ChevronRight` / `ChevronLeft` in the open/closed ternary |

## Out of Scope

- Grouping sections (Exterior / Wheels / Scene) — separate phase
- Non-color sections getting accordion behavior
- Any changes to `carOptions.js` or `App.jsx`
