import { Button } from '../../ui/Button'

type FeedPaginationProps = {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

export function FeedPagination({
  page,
  pageCount,
  onPageChange,
}: FeedPaginationProps) {
  if (pageCount <= 1) {
    return null
  }

  return (
    <nav className="feed-pagination" aria-label="Kudos pages">
      <Button
        variant="quiet"
        size="small"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span aria-live="polite">Page {page} of {pageCount}</span>
      <Button
        variant="quiet"
        size="small"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  )
}