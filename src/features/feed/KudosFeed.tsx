import { useEffect, useState } from 'react'
import type { Kudos } from '../../domain/kudos'
import { FeedPagination } from './FeedPagination'
import { FeedSortControl } from './FeedSortControl'
import { KudosCard } from './KudosCard'
import { sortKudos, type FeedSort } from './feedSorting'

type KudosFeedProps = {
  kudos: Kudos[]
  onCreateKudos: () => void
}

const PAGE_SIZE = 10

export function KudosFeed({ kudos }: KudosFeedProps) {
  const [sort, setSort] = useState<FeedSort>('date-newest')
  const [page, setPage] = useState(1)
  const sortedKudos = sortKudos(kudos, sort)
  const pageCount = Math.max(1, Math.ceil(sortedKudos.length / PAGE_SIZE))
  const pageKudos = sortedKudos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, pageCount))
  }, [pageCount])

  function handleSortChange(nextSort: FeedSort) {
    setSort(nextSort)
    setPage(1)
  }

  return (
    <>
      <FeedSortControl value={sort} onChange={handleSortChange} />
      <div className="kudos-feed">
        {pageKudos.map((entry) => <KudosCard key={entry.id} kudos={entry} />)}
      </div>
      <FeedPagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </>
  )
}