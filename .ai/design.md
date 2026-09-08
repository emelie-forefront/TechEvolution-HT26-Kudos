# Design and graphic profile

Point your AI tool at this file when building or reviewing UI. It is the
visual counterpart to `.ai/architecture.md`: it defines the shared direction
and reusable building blocks, not a pixel-perfect screen specification.

## Source of truth

The Kudos Wall uses the visual language of
[Forefront's public website](https://www.forefront.se/). No formal brand
guidelines are available yet, so the public site is the current reference.
The values below were observed on the site in September 2026 and should be
rechecked when official brand assets or guidelines become available.

Do not copy page layouts wholesale. Apply the same graphic profile to a
focused, accessible product interface.

## Visual direction

- **Clear and confident.** Strong hierarchy, direct language and generous
  whitespace.
- **Warm, not decorative.** A neutral base with wine as the main accent.
- **People-centred.** When imagery is needed, use authentic photography of
  people and work rather than abstract decoration or generic stock imagery.
- **Editorial, but practical.** Use expressive headings while keeping forms,
  controls and the feed compact and easy to scan.

## Colour

Define these once as CSS custom properties. Components consume tokens; they
must not introduce local approximations of brand colours.

| Token | Value | Use |
| --- | --- | --- |
| `--color-brand` | `#744059` | Primary actions, links and selected states |
| `--color-brand-strong` | `#5d3347` | Hover/pressed primary actions |
| `--color-ink` | `#000000` | Primary text |
| `--color-surface` | `#ffffff` | Page and control surfaces |
| `--color-surface-muted` | `#f5f5f7` | Feed sections and subtle grouping |
| `--color-accent-secondary` | `#3d3d66` | Sparing secondary accent, never a competing CTA |
| `--color-border` | `#d9d7dc` | Inputs, dividers and outlined controls |
| `--color-focus` | `#3d3d66` | Keyboard focus ring |
| `--color-danger` | `#b42318` | Validation errors only |

Use white text on `--color-brand`. Verify all other combinations meet WCAG
AA contrast. Do not use colour alone to communicate category, validation or
selection.

## Typography

Forefront uses **Manrope** for display text and controls and **DM Sans** for
body text. Load both once at application level, with `sans-serif` as fallback.

| Role | Family | Size / line height | Weight |
| --- | --- | --- | --- |
| Page title | Manrope | `48px / 1.1` desktop, `40px / 1.1` mobile | 600 |
| Section title | Manrope | `32px / 1.2` | 600 |
| Card title | Manrope | `20px / 1.3` | 600 |
| Body | DM Sans | `16px / 1.5` | 400 |
| Label / action | Manrope | `16px / 1.5` | 500 |
| Metadata | DM Sans | `14px / 1.4` | 400 |

Keep letter spacing at `0`. Use sentence case. Do not shrink essential text
below `14px`.

## Spacing and shape

- Use an 8px spacing scale: `8`, `16`, `24`, `32`, `48`, `64`.
- Keep content within a centred `1200px` maximum width with `24px` desktop
  and `16px` mobile gutters.
- Use `8px` corner radii for buttons, inputs and product panels.
- Use `16px` radii only for large photographic media, reflecting the public
  site's image treatment.
- Prefer whitespace and dividers over shadows. If elevation is necessary,
  keep it subtle and reserve it for overlays.

## Buttons: one reusable component

All command actions use one shared `Button` component. This is the boundary
that prevents styling and behaviour from spilling into feature components.

```tsx
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'quiet'
  size?: 'small' | 'medium'
  isLoading?: boolean
}
```

- **Primary:** wine background, white text. Use once per action group for the
  main action, such as `Send kudos`.
- **Secondary:** white background, wine text and wine border. Use for
  alternative actions.
- **Quiet:** transparent background and wine text. Use for low-emphasis
  commands, such as pagination.
- Medium buttons use `12px 24px` padding, matching the public site. Small
  buttons use `8px 16px`. All use an `8px` radius.
- Hover, active, focus, disabled and loading states belong to `Button`, not to
  its callers. Keep a stable height and width while loading.
- Use native `<button>` for commands and `<a>` for navigation. A link may share
  the same visual treatment, but must retain link semantics.
- Icon-only buttons require an accessible name and tooltip. Use a shared icon
  library rather than hand-drawn SVGs when icons are introduced.

Suggested ownership:

```text
src/ui/Button.tsx          Shared markup, variants and states
src/styles/tokens.css      Colour, typography, spacing and shape tokens
src/styles/global.css      Font loading and document defaults
```

Feature components may choose a button variant, but must not override button
colours, padding, radius or interaction states.

## Forms and feed

- Labels remain visible above fields; placeholders never replace labels.
- Inputs use the shared radius and border tokens and show the common focus
  ring. Validation text appears next to the affected field.
- Keep the send form and feed as unframed page regions. Use panels only for
  individual kudos or genuinely grouped controls; do not nest panels.
- A kudos panel prioritises sender, recipient and message. Category and time
  are quieter metadata, but remain readable without relying on colour.
- Sorting, pagination and empty-state actions reuse the shared controls and
  `Button`; do not create feature-specific button styles.

## Responsive and accessible by default

- Start with one column. At wider viewports, the form and feed may sit side by
  side only if both remain comfortable to read and operate.
- All controls must remain usable at 320px width without horizontal scrolling
  or overlapping text.
- Interactive targets are at least `44px` high on touch layouts.
- Every interactive element has a visible keyboard focus state.
- Respect `prefers-reduced-motion`; motion must not be required to understand
  state changes.

## Given, not decided

- The Forefront public site is the visual reference until official guidelines
  replace it.
- Exact screen composition and responsive breakpoints are implementation
  decisions, provided they follow this profile.
- Do not redraw or alter the Forefront wordmark. Use only an approved asset if
  one is supplied; otherwise identify the product with text.