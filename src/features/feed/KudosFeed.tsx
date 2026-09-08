import { useEffect, useState } from 'react'
import type { Kudos, KudosEdit } from '../../domain/kudos'
import type { UpdateKudosResult } from '../../hooks/useKudos'
import { EmptyFeed } from './EmptyFeed'
import { FeedPagination } from './FeedPagination'
import { FeedSortControl } from './FeedSortControl'
import { KudosCard } from './KudosCard'
import { sortKudos, type FeedSort } from './feedSorting'
import './feed.css'

type KudosFeedProps = {
  kudos: Kudos[]
  onCreateKudos: () => void
  onUpdateKudos: (id: string, edit: KudosEdit) => UpdateKudosResult
}

const PAGE_SIZE = 10

export function KudosFeed({ kudos, onCreateKudos, onUpdateKudos }: KudosFeedProps) {
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

  if (kudos.length === 0) {
    return <EmptyFeed onCreateKudos={onCreateKudos} />
  }

  return (
    <>
      <FeedSortControl value={sort} onChange={handleSortChange} />
      <div className="kudos-feed">
        {pageKudos.map((entry) => (
          <KudosCard key={entry.id} kudos={entry} onUpdateKudos={onUpdateKudos} />
        ))}
      </div>
      <FeedPagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </>
  )
}