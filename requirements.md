# Requirements

Consolidated requirements for the Kudos Wall lab, gathered from `README.md`,
`docs/01-build.md`, `.ai/domain-model.md`, `.ai/architecture.md`,
`.ai/conventions.md` and `data/README.md`. Includes answers to the "Still
open" questions from the domain model, plus later requirements for feed
sorting, recognition status and editing.

## The product in one line

A Kudos Wall: colleagues send short, public, positive shoutouts to each
other. One entity, one screen, no backend.

## Stack & constraints (given, not decided)

- React + TypeScript, Vite — already scaffolded in `src/`.
- No backend, no database, no auth. All state lives on the client.
- Mock colleague list in `data/colleagues.json` — same list for every team.
- "Current user" = whichever colleague is selected in the UI. No login,
  no profile, no user management.

## The entity

A `Kudos` has:

| Field | Type / source | Notes |
| --- | --- | --- |
| `id` | Generated (e.g. `crypto.randomUUID()`) | Not derived from content |
| `from` | Colleague `id` from `data/colleagues.json` | Never store the name |
| `to` | Colleague `id` from `data/colleagues.json` | Never store the name |
| `message` | Non-empty string, max 200 chars | See rules below |
| `category` | One of the fixed set below | Closed set, not free text |
| `createdAt` | Timestamp (ISO string) | Display format is our choice |

### Categories (closed set)

- `TEAMWORK` — made the team better, not just the ticket
- `EXTRA_MILE` — went beyond what anyone asked for
- `MENTORSHIP` — made someone else more capable
- `CRAFT` — quality of the work itself
- `CUSTOMER_IMPACT` — the client felt the difference

## MVP — must be built

1. **Send a kudos.** Form with:
   - pick a recipient from the colleague list (self-kudos allowed),
   - write a message,
   - choose a category.
   On submit, the kudos is added to the store and the form is cleared.
2. **See the feed.** All kudos, **newest first**, each showing sender,
   recipient, message, category and time.

## Product rules (from the brief — build as written)

- Self-kudos are a feature. A kudos to yourself is allowed and appears
  like any other.
- A kudos can be edited after it is sent. It cannot be deleted.
- The feed is **newest first**, always.
- No limit on how many kudos one person can send.

## Answers to the "Still open" questions

These were open in `.ai/domain-model.md`. Decided now:

- **Message length / emptiness.** `message` must not be empty and must not
  be whitespace only. Maximum length is **200 characters**. Enforced at
  submit; the submit button is disabled while invalid.
- **Empty feed state.** When there are no kudos, the feed shows a
  call-to-action button that opens / focuses the "send a kudos" form.
- **Persistence across refresh.** Kudos are persisted to
  `localStorage` and rehydrated on app start. The colleague list is
  read from `data/colleagues.json` and is **not** persisted.
- **Kudos referencing a colleague no longer in the list.** A removed
  colleague can no longer be picked as sender or recipient — the UI
  simply prevents new kudos to/from them. **Existing kudos survive** and
  stay visible in the feed (render the stored `id` with a fallback label
  if the colleague can no longer be resolved, e.g. "Unknown colleague").
- **Where validation lives.** *Open for the team — suggestion below.*

  Suggested approach: put validation in **one place**, colocated with the
  domain — e.g. a `validateKudos(input)` function in something like
  `src/domain/kudos.ts` that returns a typed result (`{ ok: true, kudos }`
  or `{ ok: false, errors }`). The form calls it for live feedback and
  again on submit; the store calls the same function before appending so
  invalid data can't get in even if the form is bypassed. Rationale:
  duplicating rules between form and store is the classic drift bug — one
  source of truth for "what makes a Kudos valid" keeps the form UX and
  the store's integrity in sync.

- **Performance as the feed grows.** Use **pagination**: page 1 shows the
  **10 latest** kudos. Additional pages / a "load more" control reveal
  older ones. This avoids re-rendering the entire list and keeps derived
  work (sorting, filtering) bounded per page.

## New requirement — feed sorting

The feed must support **date sorting**:

- **Date** — newest first (default) and oldest first.

Notes:

- Sorting is applied **before pagination** — the "10 latest" page reflects
  the currently selected sort order.
- Default order stays "newest first" so the product rule ("the feed is
  newest first, always") is honoured until the user explicitly changes it.
- Sort control lives above the feed and is a single-select (one active
  sort at a time) to keep the mental model simple.

## New requirement — seven days without kudos

The UI must make it possible to see when a colleague has **not received a
kudos in the last seven days**.

- The status is based on the most recent kudos received by each colleague.
- A colleague who has never received a kudos also has this status.
- The seven-day period is calculated from the current date and time.

## New requirement — edit a kudos

Every kudos in the feed has a visible **Edit** button connected to that
specific kudos.

- Editing opens an inline form in the kudos panel.
- The recipient, category and message can be changed.
- The same recipient, category and message validation used when sending also
  applies when saving an edit.
- The kudos `id`, sender and original `createdAt` timestamp do not change.
- **Save changes** updates the kudos in the store and `localStorage`.
- **Cancel** closes the form without changing the kudos.
- A removed colleague is not available as a new recipient while editing.

## Explicitly out of scope

Straight from `.ai/domain-model.md`:

Authentication. A backend. A database. Notifications. Deleting a sent kudos.
Comment threads. Rich text. Image uploads.

## Architecture shape (from `.ai/architecture.md`)

One source of truth for the kudos list:

```
[ Send form ] --add(kudos)----> [ kudos store ] --read(kudos[])--> [ Feed ]
[ Edit form ] --update(kudos)-> [ kudos store ]
```

Folder layout, state library choice and persistence details are ours to
decide, as long as this shape holds.

## Conventions to follow (from `.ai/conventions.md`)

- Use domain words: a `Kudos` is a `Kudos` — not `Message`, `Post`, `Item`.
- Booleans as questions (`isValid`, `canSend`).
- One component per file, ~200 lines max per file.
- Comment the **why**, not the what.
- Commits: small, imperative, meaningful messages.

## "Done" checklist (from `docs/01-build.md`, adapted)

- [ ] Runs from a clean clone via the README.
- [ ] MVP works end to end: send a kudos, see it in the feed.
- [ ] Product rules implemented as written (self-kudos, editable,
      newest-first default, no send limit or deletion).
- [ ] Message validation (non-empty, ≤ 200 chars) enforced.
- [ ] Empty-feed CTA present.
- [ ] Kudos persist across refresh via `localStorage`.
- [ ] Removed colleagues can't be picked; historical kudos still render.
- [ ] Feed pagination (10 per page).
- [ ] Feed sorting (newest / oldest).
- [ ] Each kudos can edit recipient, category and message inline.
- [ ] Saving an edit persists it; cancel leaves the kudos unchanged.
- [ ] Colleagues without a received kudos in the last seven days are visible.
- [ ] `.ai/domain-model.md` "Still open" answered and 2–3 Decisions logged.
- [ ] Everyone in the group can explain every part.
