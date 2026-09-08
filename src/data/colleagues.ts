import colleagueData from '../../data/colleagues.json'

export type Colleague = {
  id: string
  name: string
  role: string
}

export const colleagues: Colleague[] = colleagueData

export function findColleague(id: string): Colleague | undefined {
  return colleagues.find((colleague) => colleague.id === id)
}

export function getColleagueLabel(id: string): string {
  return findColleague(id)?.name ?? `Unknown colleague (${id})`
}