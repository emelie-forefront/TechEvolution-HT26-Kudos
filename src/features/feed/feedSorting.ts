import { findColleague } from '../../data/colleagues'
import { KUDOS_CATEGORIES, type Kudos } from '../../domain/kudos'

export const FEED_SORT_OPTIONS = [
  { value: 'date-newest', label: 'Newest first' },
  { value: 'date-oldest', label: 'Oldest first' },
  { value: 'recipient-role', label: 'Recipient role' },
  { value: 'category', label: 'Category' },
] as const

export type FeedSort = (typeof FEED_SORT_OPTIONS)[number]['value']

function compareNewestThenId(left: Kudos, right: Kudos): number {
  return Date.parse(right.createdAt) - Date.parse(left.createdAt) || left.id.localeCompare(right.id)
}

function compareRecipientRole(left: Kudos, right: Kudos): number {
  const leftRole = findColleague(left.to)?.role
  const rightRole = findColleague(right.to)?.role

  if (!leftRole && !rightRole) return compareNewestThenId(left, right)
  if (!leftRole) return 1
  if (!rightRole) return -1

  return leftRole.localeCompare(rightRole) || compareNewestThenId(left, right)
}

function compareCategory(left: Kudos, right: Kudos): number {
  return (
    KUDOS_CATEGORIES.indexOf(left.category) - KUDOS_CATEGORIES.indexOf(right.category) ||
    compareNewestThenId(left, right)
  )
}

export function sortKudos(kudos: Kudos[], sort: FeedSort): Kudos[] {
  return [...kudos].sort((left, right) => {
    switch (sort) {
      case 'date-oldest':
        return Date.parse(left.createdAt) - Date.parse(right.createdAt) || left.id.localeCompare(right.id)
      case 'recipient-role':
        return compareRecipientRole(left, right)
      case 'category':
        return compareCategory(left, right)
      default:
        return compareNewestThenId(left, right)
    }
  })
}