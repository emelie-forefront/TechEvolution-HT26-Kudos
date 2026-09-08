import { useState } from 'react'
import type { Kudos } from '../../domain/kudos'
import { FeedSortControl } from './FeedSortControl'
import { KudosCard } from './KudosCard'
import { sortKudos, type FeedSort } from './feedSorting'

type KudosFeedProps = {
  kudos: Kudos[]
  onCreateKudos: () => void
}

export function KudosFeed({ kudos }: KudosFeedProps) {
  const [sort, setSort] = useState<FeedSort>('date-newest')
  const sortedKudos = sortKudos(kudos, sort)

  return (
    <>
      <FeedSortControl value={sort} onChange={setSort} />
      <div className="kudos-feed">
        {sortedKudos.map((entry) => <KudosCard key={entry.id} kudos={entry} />)}
      </div>
    </>
  )
}