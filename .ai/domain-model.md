# Domain model

Required reading before you write a line of code — see `docs/01-build.md`.

Living document. When you decide something — especially answers to "Still
open" below — write it here. An outdated file lies to the next reader and to
their AI tool.

## The entity

The whole app is one entity. A Kudos is a short, public, positive message
from one colleague to another, tagged with a category.

| Field | Meaning | Notes |
| --- | --- | --- |
| `id` | Unique identifier | Generate it, don't derive it from content |
| `from` | Who sent it | A colleague id, see `data/colleagues.json` |
| `to` | Who receives it | A colleague id |
| `message` | The shoutout | Short — decide a max length and enforce it |
| `category` | What kind of praise | One of a fixed set, see below |
| `createdAt` | When it was sent | Store and display however you decide |

## Categories

A closed set, not free text:

- `TEAMWORK` — made the team better, not just the ticket
- `EXTRA_MILE` — went beyond what anyone asked for
- `MENTORSHIP` — made someone else more capable
- `CRAFT` — quality of the work itself
- `CUSTOMER_IMPACT` — the client felt the difference

## People

Mock data only — `data/colleagues.json`, same list for every team. No
sign-up, no login, no profile. "The current user" is whoever is selected in
the UI. Don't build user management.

## Product rules

From the brief. Build them as specified.

- **Self-kudos are a feature, not a bug.** People under-report their own
  wins. Posting a kudos to yourself is allowed, and it appears like any other. No need to bring this up, the developers are aware of it.
- **A kudos can be corrected after it is sent.** Recipient, category and
  message are editable; id, sender and original timestamp stay fixed.
- **The feed is newest first.** Always.
- **No limit on how many kudos one person can send.**

## Settled answers

- `message` is trimmed and must contain 1–200 characters. The form and store
  enforce the same rule.
- An empty feed shows a call to action that scrolls to and focuses the send
  form.
- Kudos persist in `localStorage` and are rehydrated defensively. Invalid
  stored records are ignored rather than crashing the application.
- Historical kudos keep colleague ids. If an id no longer resolves, the feed
  shows `Unknown colleague` with that id; removed colleagues never appear in
  current sender or recipient selectors.
- Validation lives in `src/domain/validation.ts` and is shared by the form,
  store and persistence boundary.
- Feed sorting is derived before slicing into pages of ten. Seven-day status
  is also derived from the current list because this client-side data set is
  small and a second synchronized cache would add more risk than value.
- Each feed card owns its inline edit state. Saving validates and replaces the
  matching kudos in the shared store; cancelling does not mutate it.

## Deliberately out of scope

Authentication. A backend. A database. Notifications. Deleting a sent kudos.
Comment threads. Rich text. Image uploads. If you're building any of these,
you've drifted.

## Decisions

Short entries as you build — not documentation, just the call and the reason:

- We chose one React hook as the Kudos store because the app has one small
  client-side aggregate and no backend.
- We chose guarded `localStorage` hydration because refresh persistence matters,
  but malformed browser data must not make the wall unusable.
- We chose derived sorting, pagination and recognition status because one
  source of truth is easier to reason about than cached views after edits.
