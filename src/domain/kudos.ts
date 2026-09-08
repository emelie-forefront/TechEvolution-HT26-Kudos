export const KUDOS_CATEGORIES = [
  'TEAMWORK',
  'EXTRA_MILE',
  'MENTORSHIP',
  'CRAFT',
  'CUSTOMER_IMPACT',
] as const

export type KudosCategory = (typeof KUDOS_CATEGORIES)[number]

export const KUDOS_CATEGORY_LABELS: Record<KudosCategory, string> = {
  TEAMWORK: 'Teamwork',
  EXTRA_MILE: 'Extra mile',
  MENTORSHIP: 'Mentorship',
  CRAFT: 'Craft',
  CUSTOMER_IMPACT: 'Customer impact',
}

export type Kudos = {
  id: string
  from: string
  to: string
  message: string
  category: KudosCategory
  createdAt: string
}

export type KudosDraft = Pick<Kudos, 'from' | 'to' | 'message' | 'category'>

export type KudosEdit = Pick<Kudos, 'to' | 'message' | 'category'>

export function isKudosCategory(value: unknown): value is KudosCategory {
  return KUDOS_CATEGORIES.includes(value as KudosCategory)
}