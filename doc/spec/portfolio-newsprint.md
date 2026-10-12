# Spec: Newsprint portfolio + restyled JSON tools

## Problem
Design "Portfolio A3 - Newsprint" (claude.ai/design project ac74a08e, a React-based `.dc.html`) must become a
plain HTML/CSS/JS site (no frameworks, no Rust, no build step). The two existing dev tools
(`JSON_Formatter.html`, `JSON_Diff.html`) must adopt the same visual system and be linked from the portfolio.

## Deliverables
- `index.html`, `style.css`, `app.js` (portfolio; vanilla JS port of the design's logic and DATA).
- `JSON_Formatter.html`, `JSON_Diff.html` restyled: Newsprint tokens/fonts, shared sticky header
  (brand, nav back to portfolio, theme toggle), shared footer. Behaviour and all element ids/classes the JS depends on stay intact.
- `assets/portrait.png` (provided by user; fallback styled placeholder if missing/corrupt), `assets/Jayasuriya_MK_CV.pdf` (user-provided).
- Shared `tools.css` / `theme.js` used by both tools (no duplicated theme code).

## Requirements
1. Tokens, fonts (Newsreader, Archivo, JetBrains Mono), light/dark (system + manual toggle persisted in localStorage `jmk-theme`), identical to the design.
2. Sections home / work / about / contact; sticky glass header with scroll-progress bar and active-nav highlight.
3. Motion: scroll reveals, hero word-split, hover bump, portrait parallax; all disabled under `prefers-reduced-motion`.
4. Contact: topic radiogroup, name/email/message validation, 1000-char counter, mailto draft, copy-email button.
5. "JSON Tools" card links to both tool pages. Tools have a back link to the portfolio.
6. Tools: replace blue palette with Newsprint tokens; keep syntax/diff semantic colours legible in both themes; responsive.
7. Fix known defects in the tools: malformed duplicate document wrapper in Diff (lines 1-2, 1205-1208), deprecated `substr`, empty `keyCell` branch, missing theme toggle.
8. No external JS libraries; Google Fonts only.

## Acceptance Criteria
- AC1 Given index.html loaded, when toggling theme, then `data-theme` flips, choice persists after reload.
- AC2 Given scroll, then progress bar width tracks scroll and nav item of the section in view is active.
- AC3 Given empty/invalid form, when submit, then the status message says what is missing and no mailto opens; given valid input, a mailto link with topic/name/message is opened.
- AC4 Given reduced motion, then all content visible with no transitions.
- AC5 Given the Formatter, when valid/invalid/Rust-debug JSON is formatted, behaviour is unchanged from the original and styling uses Newsprint tokens in both themes.
- AC6 Given the Diff, when two JSON docs are compared, results/filters/search/copy work as before; the file is one well-formed HTML document.
- AC7 Given widths 360 / 768 / 1280, no horizontal overflow on any page.
