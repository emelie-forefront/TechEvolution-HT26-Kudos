import { useState, type FormEvent, type Ref } from 'react'
import { colleagues } from '../../data/colleagues'
import {
  KUDOS_CATEGORIES,
  KUDOS_CATEGORY_LABELS,
  type KudosDraft,
} from '../../domain/kudos'
import {
  MAX_KUDOS_MESSAGE_LENGTH,
  validateKudosDraft,
  type KudosDraftErrors,
} from '../../domain/validation'
import type { AddKudosResult } from '../../hooks/useKudos'
import { Button } from '../../ui/Button'
import './send.css'

type SendKudosFormProps = {
  senderId: string
  recipientRef?: Ref<HTMLSelectElement>
  onAddKudos: (draft: KudosDraft) => AddKudosResult
}

export function SendKudosForm({
  senderId,
  recipientRef,
  onAddKudos,
}: SendKudosFormProps) {
  const [recipientId, setRecipientId] = useState('')
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [submitErrors, setSubmitErrors] = useState<KudosDraftErrors>({})

  const validation = validateKudosDraft({
    from: senderId,
    to: recipientId,
    category,
    message,
  })
  const errors = validation.ok ? {} : validation.errors

  function markTouched(field: string) {
    setTouchedFields((fields) => new Set(fields).add(field))
  }

  function getVisibleError(field: keyof KudosDraftErrors) {
    return touchedFields.has(field) ? errors[field] ?? submitErrors[field] : undefined
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validation.ok) {
      setSubmitErrors(validation.errors)
      return
    }

    const result = onAddKudos(validation.value)
    if (!result.ok) {
      setSubmitErrors(result.errors)
      return
    }

    setRecipientId('')
    setCategory('')
    setMessage('')
    setTouchedFields(new Set())
    setSubmitErrors({})
  }

  const recipientError = getVisibleError('to')
  const categoryError = getVisibleError('category')
  const messageError = getVisibleError('message')

  return (
    <form className="send-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="kudos-recipient">Recipient</label>
        <select
          ref={recipientRef}
          id="kudos-recipient"
          value={recipientId}
          aria-describedby={recipientError ? 'recipient-error' : undefined}
          aria-invalid={Boolean(recipientError)}
          onBlur={() => markTouched('to')}
          onChange={(event) => setRecipientId(event.target.value)}
        >
          <option value="">Choose a colleague</option>
          {colleagues.map((colleague) => (
            <option key={colleague.id} value={colleague.id}>
              {colleague.name} · {colleague.role}
            </option>
          ))}
        </select>
        {recipientError && <p id="recipient-error" className="field__error">{recipientError}</p>}
      </div>

      <fieldset
        className="category-field"
        aria-describedby={categoryError ? 'category-error' : undefined}
        onBlur={() => markTouched('category')}
      >
        <legend>Category</legend>
        <div className="category-options">
          {KUDOS_CATEGORIES.map((option) => (
            <label key={option} className="category-option">
              <input
                type="radio"
                name="category"
                value={option}
                checked={category === option}
                onChange={(event) => setCategory(event.target.value)}
              />
              <span>{KUDOS_CATEGORY_LABELS[option]}</span>
            </label>
          ))}
        </div>
        {categoryError && <p id="category-error" className="field__error">{categoryError}</p>}
      </fieldset>

      <div className="field">
        <div className="field__label-row">
          <label htmlFor="kudos-message">Message</label>
          <span>{message.length}/{MAX_KUDOS_MESSAGE_LENGTH}</span>
        </div>
        <textarea
          id="kudos-message"
          value={message}
          maxLength={MAX_KUDOS_MESSAGE_LENGTH}
          rows={5}
          aria-describedby={messageError ? 'message-error' : undefined}
          aria-invalid={Boolean(messageError)}
          onBlur={() => markTouched('message')}
          onChange={(event) => setMessage(event.target.value)}
        />
        {messageError && <p id="message-error" className="field__error">{messageError}</p>}
      </div>

      <Button type="submit" disabled={!validation.ok}>Send kudos</Button>
    </form>
  )
}