import type { Kudos } from '../../domain/kudos'

export const FEED_SORT_OPTIONS = [
  { value: 'date-newest', label: 'Newest first' },
  { value: 'date-oldest', label: 'Oldest first' },
] as const

export type FeedSort = (typeof FEED_SORT_OPTIONS)[number]['value']

function compareNewestThenId(left: Kudos, right: Kudos): number {
  return Date.parse(right.createdAt) - Date.parse(left.createdAt) || left.id.localeCompare(right.id)
}

export function sortKudos(kudos: Kudos[], sort: FeedSort): Kudos[] {
  return [...kudos].sort((left, right) => {
    switch (sort) {
      case 'date-oldest':
        return Date.parse(left.createdAt) - Date.parse(right.createdAt) || left.id.localeCompare(right.id)
      default:
        return compareNewestThenId(left, right)
    }
  })
}