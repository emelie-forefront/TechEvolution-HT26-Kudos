import { FEED_SORT_OPTIONS, type FeedSort } from './feedSorting'

type FeedSortControlProps = {
  value: FeedSort
  onChange: (sort: FeedSort) => void
}

export function FeedSortControl({ value, onChange }: FeedSortControlProps) {
  return (
    <div className="feed-sort">
      <label htmlFor="feed-sort">Sort by</label>
      <select
        id="feed-sort"
        value={value}
        onChange={(event) => onChange(event.target.value as FeedSort)}
      >
        {FEED_SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )
}