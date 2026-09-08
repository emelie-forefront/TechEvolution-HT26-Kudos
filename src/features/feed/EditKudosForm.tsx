import { useState, type FormEvent } from 'react'
import { colleagues } from '../../data/colleagues'
import {
  KUDOS_CATEGORIES,
  KUDOS_CATEGORY_LABELS,
  type Kudos,
  type KudosEdit,
} from '../../domain/kudos'
import {
  MAX_KUDOS_MESSAGE_LENGTH,
  validateKudosEdit,
} from '../../domain/validation'
import type { UpdateKudosResult } from '../../hooks/useKudos'
import { Button } from '../../ui/Button'

type EditKudosFormProps = {
  kudos: Kudos
  onSave: (id: string, edit: KudosEdit) => UpdateKudosResult
  onCancel: () => void
}

export function EditKudosForm({ kudos, onSave, onCancel }: EditKudosFormProps) {
  const [recipientId, setRecipientId] = useState(kudos.to)
  const [category, setCategory] = useState(kudos.category)
  const [message, setMessage] = useState(kudos.message)
  const [saveError, setSaveError] = useState('')
  const validation = validateKudosEdit({ to: recipientId, category, message })
  const errors = validation.ok ? {} : validation.errors

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validation.ok) return

    const result = onSave(kudos.id, validation.value)
    if (result.ok) {
      onCancel()
    } else {
      setSaveError(result.errors.message ?? 'This kudos could not be saved.')
    }
  }

  return (
    <form className="edit-kudos" onSubmit={handleSubmit} noValidate>
      <div className="edit-kudos__field">
        <label htmlFor={`edit-recipient-${kudos.id}`}>Recipient</label>
        <select
          id={`edit-recipient-${kudos.id}`}
          value={recipientId}
          aria-describedby={errors.to ? `edit-recipient-error-${kudos.id}` : undefined}
          aria-invalid={Boolean(errors.to)}
          onChange={(event) => setRecipientId(event.target.value)}
        >
          {!colleagues.some(({ id }) => id === recipientId) && (
            <option value={recipientId}>Unknown colleague ({recipientId})</option>
          )}
          {colleagues.map((colleague) => (
            <option key={colleague.id} value={colleague.id}>
              {colleague.name} · {colleague.role}
            </option>
          ))}
        </select>
        {errors.to && (
          <span id={`edit-recipient-error-${kudos.id}`} className="field__error">
            {errors.to}
          </span>
        )}
      </div>

      <div className="edit-kudos__field">
        <label htmlFor={`edit-category-${kudos.id}`}>Category</label>
        <select
          id={`edit-category-${kudos.id}`}
          value={category}
          onChange={(event) => setCategory(event.target.value as KudosEdit['category'])}
        >
          {KUDOS_CATEGORIES.map((option) => (
            <option key={option} value={option}>{KUDOS_CATEGORY_LABELS[option]}</option>
          ))}
        </select>
      </div>

      <div className="edit-kudos__field">
        <div className="edit-kudos__label-row">
          <label htmlFor={`edit-message-${kudos.id}`}>Message</label>
          <span>{message.length}/{MAX_KUDOS_MESSAGE_LENGTH}</span>
        </div>
        <textarea
          id={`edit-message-${kudos.id}`}
          value={message}
          maxLength={MAX_KUDOS_MESSAGE_LENGTH}
          rows={4}
          autoFocus
          aria-describedby={errors.message ? `edit-message-error-${kudos.id}` : undefined}
          aria-invalid={Boolean(errors.message)}
          onChange={(event) => setMessage(event.target.value)}
        />
        {errors.message && (
          <span id={`edit-message-error-${kudos.id}`} className="field__error">
            {errors.message}
          </span>
        )}
      </div>

      {saveError && <p className="field__error" role="alert">{saveError}</p>}
      <div className="edit-kudos__actions">
        <Button type="submit" size="small" disabled={!validation.ok}>Save changes</Button>
        <Button type="button" size="small" variant="quiet" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}