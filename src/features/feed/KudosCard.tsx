import { findColleague, getColleagueLabel } from '../../data/colleagues'
import { KUDOS_CATEGORY_LABELS, type Kudos } from '../../domain/kudos'
import { formatDate } from '../../utils/formatDate'

type KudosCardProps = {
  kudos: Kudos
}

function getRole(id: string): string | undefined {
  return findColleague(id)?.role
}

export function KudosCard({ kudos }: KudosCardProps) {
  const senderRole = getRole(kudos.from)
  const recipientRole = getRole(kudos.to)

  return (
    <article className="kudos-card">
      <header className="kudos-card__people">
        <div>
          <span className="kudos-card__label">From</span>
          <strong>{getColleagueLabel(kudos.from)}</strong>
          {senderRole && <span>{senderRole}</span>}
        </div>
        <div>
          <span className="kudos-card__label">To</span>
          <strong>{getColleagueLabel(kudos.to)}</strong>
          {recipientRole && <span>{recipientRole}</span>}
        </div>
      </header>
      <p className="kudos-card__message">{kudos.message}</p>
      <footer className="kudos-card__meta">
        <span>{KUDOS_CATEGORY_LABELS[kudos.category]}</span>
        <time dateTime={kudos.createdAt}>{formatDate(kudos.createdAt)}</time>
      </footer>
    </article>
  )
}