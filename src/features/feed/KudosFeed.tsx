import type { Kudos } from '../../domain/kudos'
import { KudosCard } from './KudosCard'

type KudosFeedProps = {
  kudos: Kudos[]
  onCreateKudos: () => void
}

export function KudosFeed({ kudos }: KudosFeedProps) {
  return (
    <div className="kudos-feed">
      {kudos.map((entry) => <KudosCard key={entry.id} kudos={entry} />)}
    </div>
  )
}