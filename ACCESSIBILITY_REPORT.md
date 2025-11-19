# Accessibility and Contrast Report — anestesia (Demo UI)

Date: 2025-11-18

Summary:
- Performed a light accessibility (contrast) audit focused on the dark theme of the prototype and the Demo Clinica panel.
- Found several cases where components used `bg-white` with text styled as `text-white` or white-like values, leading to white-on-white rendering.
- Addressed several instances of low-contrast text and improved component defaults for dark cards.

Actions taken:
1. Global CSS adjustments
   - `.card` now sets `color: rgba(255,255,255,0.95)` so child text defaults to readable values on dark cards.
   - `.small-muted` increased from rgba(255,255,255,0.6) to rgba(255,255,255,0.78) to meet contrast for small text on dark backgrounds.
2. Components updated to use dark cards or to discard white backgrounds where inappropriate for dark theme:
   - `UseCaseFlow.tsx`: replaced `bg-white` panel cards with `card` class and changed inner texts to white colors so that they are legible.
   - `Header.tsx`: replaced the branded image with a neutral FA mark and ensured text contrasts with the header background.
   - `PreAnesthesiaForm.tsx` / `Pharmacogenomics.tsx`: hidden/disabled PGx application on pages where it should not run; visible UI updated for dark backgrounds.
3. Specific corrections made to the Demo Clinica panel:
   - Converted `bg-white` containers into `card` or `bg-white/6` + white text where appropriate to keep card contrast while maintaining content hierarchy.
   - Converted `pre` tagged PGx preview to `bg-white/6` + white text for readability.

Remaining items / Recommendations:
- Replace remaining `bg-white` marketing or layout cards where an explicit theme toggle is expected (e.g., `ProjectExplanation`). For now those were left intentionally white because they serve as marketing content.
- Convert `bg-white` usage in `UseCaseCard`, `ProjectExplanation`, and `PharmacogenomicsPanel` if the dark-theme should be consistent everywhere; otherwise add a theme toggler for dark/light.
- For true WCAG conformance, run a color contrast analyzer tool (e.g. Axe, Lighthouse) across pages and generate a coverage report; this repo change includes improvements, but automated testing would finalize compliance.
- Consider making `--muted` color a CSS variable and applying color steps for small/normal text sizes.

Next steps (optional):
- Run a Lighthouse audit for Accessibility and produce a report with actionable items.
- Add a theme switcher (dark/light) for demos and ensure consistent whitespace and background readings per theme.
- Add accessibility testing to CI with `axe-core` or `lighthouse-ci` so we keep compliance as the UI evolves.

If you'd like, I can proceed with a full site sweep to replace `bg-white` cards with `card` variants and add a theme switcher. Otherwise, we can selectively adjust which pages should stay light/marketing (dark theme remains default for clinical screens).

-- Análisis inicial automatizado + ajustes básicos por GitHub Copilot (Raptor mini)
