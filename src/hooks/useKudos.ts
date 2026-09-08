import { useEffect, useState } from 'react'
import type { Kudos, KudosDraft } from '../domain/kudos'
import {
  isStoredKudos,
  validateKudosDraft,
  type KudosDraftErrors,
} from '../domain/validation'

export const KUDOS_STORAGE_KEY = 'kudos-wall:kudos'

export type AddKudosResult =
  | { ok: true; kudos: Kudos }
  | { ok: false; errors: KudosDraftErrors }

function compareNewestFirst(left: Kudos, right: Kudos): number {
  return Date.parse(right.createdAt) - Date.parse(left.createdAt)
}

function loadKudos(): Kudos[] {
  try {
    const storedValue = localStorage.getItem(KUDOS_STORAGE_KEY)
    if (!storedValue) {
      return []
    }

    const parsedValue: unknown = JSON.parse(storedValue)
    if (!Array.isArray(parsedValue)) {
      return []
    }

    return parsedValue.filter(isStoredKudos).sort(compareNewestFirst)
  } catch {
    return []
  }
}

export function useKudos() {
  const [kudos, setKudos] = useState<Kudos[]>(loadKudos)

  useEffect(() => {
    localStorage.setItem(KUDOS_STORAGE_KEY, JSON.stringify(kudos))
  }, [kudos])

  function addKudos(draft: KudosDraft): AddKudosResult {
    const validation = validateKudosDraft(draft)
    if (!validation.ok) {
      return validation
    }

    const createdKudos: Kudos = {
      ...validation.value,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }

    setKudos((currentKudos) => [createdKudos, ...currentKudos])
    return { ok: true, kudos: createdKudos }
  }

  return { kudos, addKudos }
}