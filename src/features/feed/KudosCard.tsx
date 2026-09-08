import { useState } from 'react'
import { findColleague, getColleagueLabel } from '../../data/colleagues'
import { KUDOS_CATEGORY_LABELS, type Kudos, type KudosEdit } from '../../domain/kudos'
import type { UpdateKudosResult } from '../../hooks/useKudos'
import { Button } from '../../ui/Button'
import { formatDate } from '../../utils/formatDate'
import { EditKudosForm } from './EditKudosForm'

type KudosCardProps = {
  kudos: Kudos
  onUpdateKudos: (id: string, edit: KudosEdit) => UpdateKudosResult
}

function getRole(id: string): string | undefined {
  return findColleague(id)?.role
}

export function KudosCard({ kudos, onUpdateKudos }: KudosCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const senderRole = getRole(kudos.from)
  const recipientRole = getRole(kudos.to)

  if (isEditing) {
    return (
      <article className="kudos-card">
        <EditKudosForm
          kudos={kudos}
          onSave={onUpdateKudos}
          onCancel={() => setIsEditing(false)}
        />
      </article>
    )
  }

  return (
    <article className="kudos-card">
      <div className="kudos-card__actions">
        <Button variant="secondary" size="small" onClick={() => setIsEditing(true)}>
          Edit
        </Button>
      </div>
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