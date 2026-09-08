import { colleagues } from '../../data/colleagues'

type CurrentColleagueSelectProps = {
  value: string
  onChange: (colleagueId: string) => void
}

export function CurrentColleagueSelect({
  value,
  onChange,
}: CurrentColleagueSelectProps) {
  return (
    <div className="field">
      <label htmlFor="current-colleague">Sending as</label>
      <select
        id="current-colleague"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {colleagues.map((colleague) => (
          <option key={colleague.id} value={colleague.id}>
            {colleague.name} · {colleague.role}
          </option>
        ))}
      </select>
    </div>
  )
}