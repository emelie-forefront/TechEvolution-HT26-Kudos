import { colleagues } from '../../data/colleagues'
import type { Kudos } from '../../domain/kudos'
import { formatDate } from '../../utils/formatDate'
import { getColleaguesNeedingRecognition } from './getRecognitionStatus'
import './status.css'

type RecognitionStatusProps = {
  kudos: Kudos[]
}

export function RecognitionStatus({ kudos }: RecognitionStatusProps) {
  const statuses = getColleaguesNeedingRecognition(colleagues, kudos)

  if (statuses.length === 0) {
    return <p className="status-all-clear">Everyone has received kudos in the last seven days.</p>
  }

  return (
    <ul className="status-list" aria-live="polite">
      {statuses.map(({ colleague, lastReceivedAt }) => (
        <li key={colleague.id}>
          <div>
            <strong>{colleague.name}</strong>
            <span>{colleague.role}</span>
          </div>
          <span className="status-list__date">
            {lastReceivedAt ? `Last received ${formatDate(lastReceivedAt)}` : 'Never received kudos'}
          </span>
        </li>
      ))}
    </ul>
  )
}