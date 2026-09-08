import { useRef, useState } from 'react'
import { colleagues } from './data/colleagues'
import { KudosFeed } from './features/feed/KudosFeed'
import { CurrentColleagueSelect } from './features/send/CurrentColleagueSelect'
import { SendKudosForm } from './features/send/SendKudosForm'
import { RecognitionStatus } from './features/status/RecognitionStatus'
import { useKudos } from './hooks/useKudos'
import './App.css'

function App() {
  const [currentColleagueId, setCurrentColleagueId] = useState(colleagues[0]?.id ?? '')
  const recipientRef = useRef<HTMLSelectElement>(null)
  const { kudos, addKudos, updateKudos } = useKudos()

  function focusSendForm() {
    const scrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth'
    recipientRef.current?.scrollIntoView({ behavior: scrollBehavior, block: 'center' })
    recipientRef.current?.focus({ preventScroll: true })
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="app-header__eyebrow">Forefront</p>
        <h1>Kudos Wall</h1>
        <p>Public recognition for the work that moves the team forward.</p>
      </header>

      <div className="app-layout">
        <div className="app-sidebar">
          <section className="app-section" aria-labelledby="send-heading">
            <h2 id="send-heading">Send kudos</h2>
            <CurrentColleagueSelect
              value={currentColleagueId}
              onChange={setCurrentColleagueId}
            />
            <SendKudosForm
              senderId={currentColleagueId}
              recipientRef={recipientRef}
              onAddKudos={addKudos}
            />
          </section>

          <section className="app-section" aria-labelledby="status-heading">
            <h2 id="status-heading">Needs recognition</h2>
            <p className="app-section__intro">No kudos received in the last seven days.</p>
            <RecognitionStatus kudos={kudos} />
          </section>
        </div>

        <section className="app-section app-feed" aria-labelledby="feed-heading">
          <div className="app-feed__heading">
            <h2 id="feed-heading">Recent kudos</h2>
            <span>{kudos.length} total</span>
          </div>
          <KudosFeed
            kudos={kudos}
            onCreateKudos={focusSendForm}
            onUpdateKudos={updateKudos}
          />
        </section>
      </div>
    </main>
  )
}

export default App
