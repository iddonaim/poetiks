---
name: POETIKS Hub (פה־אתיקה)
description: The annotated map — a scroll-driven camera over the hand-drawn project map, scribbled on in red marker with white sticker captions.
colors:
  marker-red: "#d2232a"
  ink: "#141414"
  paper: "#f4f1ea"
  sticker-white: "#ffffff"
  faded-ink: "#6f6a60"
typography:
  display:
    fontFamily: "Secular One, sans-serif"
    fontSize: "clamp(52px, 15vw, 72px)"
    fontWeight: 400
    lineHeight: 1.02
  display-latin:
    fontFamily: "Anton, sans-serif"
    fontSize: "clamp(20px, 5.5vw, 26px)"
    fontWeight: 400
    letterSpacing: "0.34em"
  headline:
    fontFamily: "Rubik, sans-serif"
    fontSize: "clamp(22px, 6vw, 28px)"
    fontWeight: 900
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Arimo, sans-serif"
    fontSize: "15.5px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Rubik, sans-serif"
    fontSize: "14px"
    fontWeight: 700
  aside:
    fontFamily: "Arimo, sans-serif"
    fontSize: "11.5px"
    fontWeight: 400
    letterSpacing: "0.02em"
components:
  sticker:
    backgroundColor: "{colors.sticker-white}"
    textColor: "{colors.ink}"
    padding: "18px 20px 20px"
    width: "420px"
  button-go:
    backgroundColor: "{colors.marker-red}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    padding: "10px 18px"
  link-chip:
    backgroundColor: "{colors.sticker-white}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "8px 12px"
  link-chip-hover:
    backgroundColor: "{colors.marker-red}"
    textColor: "#ffffff"
---

# Design System: POETIKS Hub (פה־אתיקה)

## Overview

**Creative North Star: "The Annotated Map"**

The hub does not describe the project — it explains it the way a meme explains anything: by circling things in red marker and captioning them deadpan. The only backdrop in the entire world is the hand-drawn project map (1220×818); a scroll-driven camera pans and zooms across it while self-drawing red marker strokes circle each district and white sticker cards land on top with the caption. Everything on screen is either the map, a marker stroke, or a sticker. There is no page chrome: no nav, no card grid, no section backgrounds.

The material language is physical: stickers are flat white rectangles with 2px ink borders, hard offset shadows, and a slight rotation, as if slapped onto the drawing. The document is Hebrew-first RTL (`lang="he" dir="rtl"`); English appears only as small, faded, LTR asides (`lang="en" dir="ltr"`) inside the stickers. Humor is method, not decoration — captions are one deadpan sentence, and the scroll cue says "גללו. זה מסביר את עצמו." ("Scroll. It explains itself.")

**Key Characteristics:**
- One backdrop: the hand-drawn map, moved by a camera, never replaced by a page background.
- One annotation instrument: red marker (#d2232a) strokes, drawn live in map coordinates.
- Paper physics: hard offset ink shadows, square corners, slight sticker rotation, no blur.
- Hebrew-first RTL with quiet English asides; four fonts, each with exactly one job.
- Everything shown is a real artifact (screenshots, plates, the live map video) — never a description.

## Colors

Three inks and a paper: marker red does all the pointing, near-black does all the structure, and the map's own paper tone fills every gap.

### Primary
- **Marker Red** (#d2232a): the annotation instrument. Used only where the marker "touches" the page — SVG marker strokes and arrows, the `.go` action buttons, the caption highlighter tint (as `rgba(210,35,42,.4)` under headline words), the Anton Latin wordmark, the scroll-cue arrow, link hover fills, and inline link text. Never a background wash, never body text.

### Neutral
- **Ink** (#141414): all text, all 2px borders, and (as `rgba(20,20,20,.85)`) every hard offset shadow.
- **Paper** (#f4f1ea): the page/stage background — deliberately close to the map's own paper so the map never sits "on" a different surface.
- **Sticker White** (#ffffff): the surface of every sticker, chip, and link chip — the only thing brighter than the map.
- **Faded Ink** (#6f6a60): English asides and footer metadata; also the footer hairline at #d8d3c8. Quiet by design.

### Named Rules
**The One Marker Rule.** Red exists only as the marker: strokes, arrows, highlights, and actions. If red appears somewhere a marker couldn't have drawn or a sticker couldn't carry, it's wrong.

**The Map's Paper Rule.** No new background colors. The stage is `--paper`, chosen to disappear against the map's own paper. Any new surface is either the map or a white sticker.

## Typography

**Hebrew Display Font:** Secular One (sans-serif fallback)
**Latin Display Font:** Anton (sans-serif fallback)
**Headline/Action Font:** Rubik 900 / 700 (sans-serif fallback)
**Body Font:** Arimo (sans-serif fallback)

All four families are embedded base64 in `fonts.css` — the hub is self-contained and loads no external font network requests.

**Character:** Loud, compressed display over a plain, legible body — a poster voice and a caption voice. Each family has exactly one job; none substitutes for another.

### Hierarchy
- **Display** (Secular One 400, clamp(52px, 15vw, 72px), 1.02): the Hebrew wordmark פה־אתיקה. Title sticker and (at 17px) the fixed wordmark chip only.
- **Display Latin** (Anton 400, clamp(20px, 5.5vw, 26px), letter-spacing .34em with matching text-indent): POETIKS, in Marker Red, directly under the Hebrew wordmark.
- **Headline** (Rubik 900, clamp(22px, 6vw, 28px), 1.15, -0.01em): sticker caption headlines. One phrase per headline carries the red highlighter span (`.u`).
- **Body** (Arimo 400, 15.5px, 1.5): the one-sentence Hebrew caption in each sticker.
- **Label** (Rubik 700, 14–16px): actions and wayfinding — `.go` buttons (16px), link chips (14px), scroll cue (14px).
- **Aside** (Arimo 400, 11.5px, .02em, Faded Ink, LTR): the English one-liner at the bottom of each sticker.

### Named Rules
**The Four Voices Rule.** Secular One speaks Hebrew display, Anton speaks Latin display, Rubik shouts headlines and labels actions, Arimo explains. No fifth font, no role-swapping.

**The Quiet English Rule.** English is an aside, never a peer: `lang="en" dir="ltr"`, 11.5px, Faded Ink, last inside the sticker (centered only in the title sticker).

## Layout

The world is a fixed full-viewport stage (`#stage`) holding the map, its SVG annotation layer, and the title video; scrollable content (`main`, z-index 2) rides above it. All annotation geometry lives in the map's own coordinate space: 1220×818.

**The camera:** each scroll stop has a focus rect `[x, y, w, h]` in map coords. The camera fits that rect (padded ×1.12) into the band above the sticker — the top ~55% of the viewport — with a scale cap of 1.5 and a floor guaranteeing the map always covers the band (no paper gaps mid-journey). The title stop covers the full viewport (behind the video); the finale fits the whole map, centered in the band, `contain`-style. Camera moves via a single transform: `transition: transform 1.1s cubic-bezier(.22,.9,.3,1)`.

**Scroll sections:** `min-height: 118vh` per stop (title 100vh, finale 130vh), stickers bottom-anchored and centered with `padding: 0 14px calc(30px + env(safe-area-inset-bottom))`. Sections are `pointer-events: none`; only stickers are interactive. Stops activate at IntersectionObserver threshold 0.45; marker groups accumulate (stop *n* shows strokes 1…*n*; the finale shows all five).

**Responsive:** mobile-first (the QR scan is the primary entry). One breakpoint at 760px: stickers shift from centered to `justify-content: flex-start` with `padding-inline-start: 6vw` (title stays centered); sticker max-width 400px (420px base, 340px title, 440px finale).

**Extension grammar:** a new stop = one new focus rect + one new annotation group (`#a6`, …) in map coords + one new `<section data-stop>` with a sticker. `/x/<doc>` one-pager routes use the same grammar — an annotated close-up per printed document.

## Elevation & Depth

Depth is paper stacking, not lighting. Every shadow is a hard offset in translucent ink — `rgba(20,20,20,.85)`, zero blur — reading as a sticker lifted off the drawing. The single soft shadow in the system belongs to the map itself (`0 5px 26px rgba(20,20,20,.2)`), an ambient cue that the map is a physical sheet.

### Shadow Vocabulary
- **Sticker** (`box-shadow: 7px 8px 0 rgba(20,20,20,.85)`): caption cards.
- **Button rest** (`4px 4px 0 rgba(20,20,20,.85)`): `.go` action buttons.
- **Button hover** (`6px 6px 0` + `translate(-2px,-2px)`): the button lifts toward the cursor.
- **Button press** (`1px 1px 0` + `translate(2px,2px)`): the button pushes into the page.
- **Chip** (`3px 3px 0 rgba(20,20,20,.85)`): link chips and the fixed wordmark chip.
- **Map ambient** (`0 5px 26px rgba(20,20,20,.2)`): the map sheet only. The one blurred shadow allowed.

### Named Rules
**The Hard Shadow Rule.** Interface shadows are hard-offset ink, never blurred. Blur belongs to the map sheet alone.

## Shapes

Square corners everywhere — border-radius is 0 on every element; the form language is cut paper, not UI. Every surface (sticker, button, chip, artifact image) carries a `2px solid` Ink border. Imperfection is deliberate and small: stickers rotate −1.4° (odd stops), +1.2° (even stops), −1.8° (title), and the wordmark chip −2°. The counterpoint to all this rectilinearity is the marker line: SVG strokes (stroke-width 5–7, round caps and joins) drawn as wobbly hand loops and arrows, plus the red connector scribble that ties each sticker to its circled district (`.sticker::before`, a 38×26 inline-SVG curve at the sticker's top inline-start; suppressed on the title sticker).

## Components

### Sticker (caption card)
The core unit — one per scroll stop. **Character:** a caption slapped onto the map.
- **Surface:** Sticker White, `2px solid` Ink border, `7px 8px 0` hard shadow, rotated ±1.2–1.8°, max-width 420px (340 title / 440 finale / 400 ≥760px), padding 18px 20px 20px.
- **Anatomy (in order):** Rubik 900 headline with one red-highlighted span (`.u`) → one Hebrew body sentence → optional `.strip` artifact row → English aside → optional `.go` button.
- **Connector:** `.sticker::before` red scribble bridging up toward the marker stroke (hidden on the title sticker).
- **Entrance:** fade + 26px rise, `opacity .5s ease-out, transform .6s cubic-bezier(.16,1,.3,1)`, triggered by the section's `.on` class.

### Go Button (primary action)
- **Shape:** square, Marker Red fill, white text, Rubik 700 16px, `2px` Ink border, padding 10px 18px.
- **States:** rest `4px 4px 0` shadow → hover/focus-visible lifts (−2px,−2px / `6px 6px 0`) → active presses (+2px,+2px / `1px 1px 0`). Transition .12s. Focus is the hover treatment (no separate ring).
- **Copy:** one Hebrew verb phrase ending with the RTL-pointing arrow "←" (e.g. "לגלריה ←").

### Strip (artifact row)
- **Layout:** flex row, 6px gap, 12px top margin; images share width equally (`width:0; flex:1`).
- **Images:** aspect-ratio 3/4 portrait by default, `.wide` variant 4/3 for a single landscape shot; `object-fit: cover`, `2px` Ink border. Real artifacts only (meme graphics, app screenshots, variation plates, field stills).

### Link Chips (finale)
- **Style:** Sticker White, Ink text, Rubik 700 14px, `2px` Ink border, `3px 3px 0` shadow, padding 8px 12px; flex-wrapped with 8px gap.
- **Hover/focus:** inverts to Marker Red fill with white text.

### Wordmark Chip
- **Style:** fixed top inline-start (safe-area aware), פה־אתיקה in Secular One 17px on a white sticker, `2px` Ink border, `3px 3px 0` shadow, rotated −2°, z-index 3.
- **Behavior:** hidden on the title stop; fades in (.4s) once `body.past-title` is set. Non-interactive (`pointer-events: none`).

### Scroll Cue
- **Style:** deadpan Rubik 700 14px line, absolutely positioned at the title section's bottom, with a red "↓" arrow bobbing 7px on a 1.6s ease-in-out loop.

### Marker Annotations (signature component)
- **Structure:** one SVG layer (`#anno`, viewBox 0 0 1220 818) over the map; one `<g id="a1">…"a5">` per stop. Main path: a hand-wobbled circling loop, stroke-width 6.5–7. Optional `.p2` second path: an arrow (shaft + two head strokes), stroke-width 5.5–6.
- **Draw-on:** stroke-dasharray/dashoffset animation; path lengths measured at runtime (`getTotalLength() + 2`) into `--len`. On stop entry the group gets `.on` and strokes draw over `1s cubic-bezier(.5,0,.2,1)`, with `.p2` delayed .45s. This is the system's one authored motion moment.
- **Accumulation:** strokes persist once drawn; the finale shows all five at full-map zoom.
- **Reduced motion:** `prefers-reduced-motion` swaps the stroke draw for simple opacity gating (strokes appear pre-drawn) and disables the camera transition and cue bob.

## Do's and Don'ts

### Do:
- **Do** author all new annotation geometry in map coordinates (1220×818): a new stop is a focus rect + an annotation `<g>` + a sticker section, nothing else.
- **Do** build `/x/<doc>` one-pager routes in the same grammar — an annotated close-up of the map per printed document, with the same sticker/marker vocabulary.
- **Do** keep every artifact image real (project's own memes, screenshots, plates) with a 3/4 or 4/3 crop and a 2px Ink border.
- **Do** keep the sticker anatomy order: red-highlighted headline, one Hebrew sentence, artifact strip, quiet English aside, one action.
- **Do** honor `prefers-reduced-motion`: any new draw-on or camera behavior needs an opacity-gated fallback.
- **Do** treat Hebrew captions as owner-canonical — new caption drafts ship only after owner approval.

### Don't:
- **Don't** transliterate "Cuboid" — it stays Latin script, always (owner correction).
- **Don't** add navigation bars, card grids, section backgrounds, or any page chrome — the map is the only backdrop and stickers are the only surfaces.
- **Don't** round a corner or blur an interface shadow; the only blurred shadow is the map sheet's ambient one.
- **Don't** use Marker Red as a background wash or body text color — it is the marker (strokes, highlights, actions, hover fills) and nothing else.
- **Don't** add a second authored motion moment; the marker draw-on is the one. Entrances stay as the standard fade + rise.
- **Don't** let English text take Hebrew's role — asides stay small, faded, LTR, and last.
