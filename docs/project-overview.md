# Kudos Wall: five-minute technical briefing

## What we built

Kudos Wall is a single-page React application where a selected colleague can send public recognition to another colleague or to themselves. A kudos contains a sender, recipient, category, message, unique ID, and creation time.

The app supports the complete required flow:

- Create and edit kudos, but never delete them.
- Validate messages and colleague/category choices.
- Show a feed sorted newest-first by default or oldest-first on request.
- Paginate the sorted feed in groups of 10.
- Show colleagues who have not received kudos in the last seven days.
- Persist kudos in the browser across refreshes.

There is deliberately no login, server, or database. The colleague selected under **Sending as** acts as the current user.

## Stack and why

- **React 19:** components and state make the interactive forms, feed, and edit mode manageable.
- **TypeScript:** types define valid kudos and categories and catch incorrect data usage during development.
- **Vite:** provides a small, fast development and production build setup.
- **CSS:** styles are split by shared UI and feature instead of adding a UI framework for one screen.
- **localStorage:** meets the persistence requirement without introducing an out-of-scope backend.

This is intentionally a small dependency set. The domain logic is simple enough that extra state-management, validation, and date libraries would add more complexity than value.

## Architecture and data flow

```text
Send form ---- addKudos ----> useKudos ---- kudos[] ----> Feed
Edit form --- updateKudos -->    |   |                    Status
                                 |   |
                           validation
                                 |
                            localStorage
```

`App.tsx` is the composition root. It selects the current colleague, gets state and actions from `useKudos`, and passes data and callbacks down to the features. Child components do not own separate copies of the kudos list.

`useKudos` is the single source of truth. On startup it loads and checks stored data. After state changes, a React effect writes the list to `localStorage`. Both create and edit operations validate again at this boundary, so invalid data cannot enter merely by bypassing a form.

Data travels downward through props; user actions travel upward through callbacks. This keeps the flow explicit and is sufficient for an app of this size. A global state library would be unnecessary here.

## Project structure

```text
data/colleagues.json       Shared mock colleague data
src/
  data/                    Typed access to colleague data
  domain/                  Kudos types, categories, and validation
  hooks/useKudos.ts        State operations and localStorage persistence
  features/
    send/                  Current-user selector and create form
    feed/                  Cards, inline editing, sorting, pagination
    status/                Seven-day recognition calculation and UI
  ui/                      Reusable generic controls
  styles/                  Global styles and design tokens
  App.tsx                  Connects all features
requirements.md            Consolidated product requirements
docs/                      Build brief and this explanation
```

The folders are organized by feature while shared business rules stay in `domain/`. This makes it easy to find user-facing behavior without duplicating the definition of a valid kudos.

## Important implementation decisions

### One domain model

`Kudos` stores colleague IDs rather than names. Names and roles come from the colleague list when rendering. This avoids copying data that could become inconsistent. Fixed categories use a TypeScript literal union, so unsupported categories are rejected.

### Validation in one place

Create and edit forms both call functions from `domain/validation.ts`. The store calls the same functions before changing state. A message is trimmed, must contain text, and can contain at most 200 characters. Recipient, sender, and category must also be valid.

The forms validate live for useful feedback, while store-level validation protects data integrity. This duplication of *calls* is intentional; the validation *rules* themselves are not duplicated.

### Safe browser persistence

Stored JSON is untrusted input. Loading therefore uses `try/catch`, confirms the value is an array, filters entries through `isStoredKudos`, and defaults to an empty list if parsing fails. Historical kudos can still display if a colleague disappears because stored sender and recipient IDs remain intact and the UI has an unknown-colleague fallback.

The limitation is that data belongs only to one browser and origin. Different users or devices do not share a wall. That is acceptable because a backend and authentication are explicitly out of scope.

### Derived views, not duplicate state

Sorting, pagination, and recognition status are calculated from the kudos list instead of being stored separately. This prevents stale copies.

The feed sorts first and then slices the selected page, so each page respects the chosen order. Sorting copies the array before using `.sort()`, avoiding mutation of React state. An ID tie-breaker gives stable ordering when timestamps match.

Recognition status finds each colleague's latest received kudos and compares it with the current time. Someone with no received kudos, or whose latest is at least seven days old, appears in the list. The function accepts `now` as an optional argument, which makes the time-dependent logic easier to test deterministically.

### Editing preserves identity

An edit may replace only `to`, `message`, and `category`. The existing object supplies `id`, `from`, and `createdAt`, so those fields cannot accidentally change through the edit API. Cancel simply closes the local edit form without calling the store.

### Small accessibility choices

Forms use real labels, fieldsets, buttons, `aria-invalid`, and linked error text. The empty-feed action scrolls to and focuses the recipient field. Smooth scrolling respects the user's reduced-motion preference.

## Tradeoffs and next steps

The project favors clarity and the stated scope over production infrastructure. There is no synchronization between tabs, storage quota handling beyond a safe load fallback, authentication, server persistence, or automated test suite. For production, the next major changes would be an API/database, authenticated identities, server-side validation, and focused unit/component tests.

## Quick classroom answers

- **Why no Context or Redux?** One hook owns a small state tree, and only `App` needs to distribute it. Props keep the dependencies visible.
- **Why validate twice?** The form provides immediate UX; the state boundary guarantees integrity. Both use the same rule functions.
- **Why IDs instead of names?** IDs represent identity; names are display data and may change.
- **Why derive sorting/status?** Derived values stay consistent with the one source of truth.
- **Why localStorage?** It satisfies refresh persistence within the explicit no-backend constraint.
- **What is the main weakness?** Persistence is device-local and there are currently no automated tests.
- **How do we verify it?** Run `npm run build`, then manually test create, refresh, sort, paginate, edit/save, edit/cancel, self-kudos, validation, empty state, and seven-day status.
