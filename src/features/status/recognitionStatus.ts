import type { Colleague } from '../../data/colleagues'
import type { Kudos } from '../../domain/kudos'

const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000

export type ColleagueRecognitionStatus = {
  colleague: Colleague
  lastReceivedAt: string | null
}

export function getColleaguesNeedingRecognition(
  colleagues: Colleague[],
  kudos: Kudos[],
  now = new Date(),
): ColleagueRecognitionStatus[] {
  return colleagues
    .map((colleague) => {
      const receivedKudos = kudos
        .filter((entry) => entry.to === colleague.id)
        .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))

      return {
        colleague,
        lastReceivedAt: receivedKudos[0]?.createdAt ?? null,
      }
    })
    .filter(({ lastReceivedAt }) => (
      lastReceivedAt === null || now.getTime() - Date.parse(lastReceivedAt) >= SEVEN_DAYS_IN_MS
    ))
    .sort((left, right) => {
      if (left.lastReceivedAt === right.lastReceivedAt) {
        return left.colleague.name.localeCompare(right.colleague.name)
      }
      if (left.lastReceivedAt === null) return -1
      if (right.lastReceivedAt === null) return 1
      return Date.parse(left.lastReceivedAt) - Date.parse(right.lastReceivedAt)
    })
}