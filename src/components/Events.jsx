import React from 'react'
import { loadState } from '../utils/localStorage.js'

export default function Events() {
  const { events } = loadState()
  if (!events.length) return <p className="kbd">No recent events.</p>
  return (
    <section aria-label="Recent user events">
      <h2>Recent Events</h2>
      <ul>
        {events.slice(0, 10).map(e => (
          <li key={e.id} className="meta">
            <strong>{e.type}</strong> • {new Date(e.ts).toLocaleString()} • {e.detail}
          </li>
        ))}
      </ul>
    </section>
  )
}
