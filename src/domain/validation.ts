import { colleagues } from '../data/colleagues'
import {
  isKudosCategory,
  type Kudos,
  type KudosDraft,
} from './kudos'

export const MAX_KUDOS_MESSAGE_LENGTH = 200

export type KudosDraftInput = Omit<KudosDraft, 'category'> & {
  category: string
}

export type KudosDraftErrors = Partial<Record<keyof KudosDraftInput, string>>

export type KudosValidationResult =
  | { ok: true; value: KudosDraft }
  | { ok: false; errors: KudosDraftErrors }

const colleagueIds = new Set(colleagues.map(({ id }) => id))

export function validateKudosDraft(draft: KudosDraftInput): KudosValidationResult {
  const errors: KudosDraftErrors = {}
  const message = draft.message.trim()

  if (!colleagueIds.has(draft.from)) {
    errors.from = 'Choose who is sending this kudos.'
  }

  if (!colleagueIds.has(draft.to)) {
    errors.to = 'Choose a recipient.'
  }

  if (!isKudosCategory(draft.category)) {
    errors.category = 'Choose a category.'
  }

  if (!message) {
    errors.message = 'Write a message before sending.'
  } else if (message.length > MAX_KUDOS_MESSAGE_LENGTH) {
    errors.message = `Keep the message to ${MAX_KUDOS_MESSAGE_LENGTH} characters or fewer.`
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    value: { ...draft, category: draft.category as KudosDraft['category'], message },
  }
}

export function isStoredKudos(value: unknown): value is Kudos {
  if (!value || typeof value !== 'object') {
    return false
  }

  const kudos = value as Record<string, unknown>
  return (
    typeof kudos.id === 'string' &&
    typeof kudos.from === 'string' &&
    typeof kudos.to === 'string' &&
    typeof kudos.message === 'string' &&
    kudos.message.trim().length > 0 &&
    kudos.message.length <= MAX_KUDOS_MESSAGE_LENGTH &&
    isKudosCategory(kudos.category) &&
    typeof kudos.createdAt === 'string' &&
    Number.isFinite(Date.parse(kudos.createdAt))
  )
}