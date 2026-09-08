import { Button } from '../../ui/Button'

type EmptyFeedProps = {
  onCreateKudos: () => void
}

export function EmptyFeed({ onCreateKudos }: EmptyFeedProps) {
  return (
    <div className="empty-feed">
      <h3>No kudos yet</h3>
      <p>Recognize a colleague and start the wall.</p>
      <Button onClick={onCreateKudos}>Send the first kudos</Button>
    </div>
  )
}