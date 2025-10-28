import { useEffect, useMemo, useState } from 'react'

export default function StreamList() {
  const [input, setInput] = useState('')
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('sl_items')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('sl_events')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [showEvents, setShowEvents] = useState(true)

  const completedCount = useMemo(() => items.filter(i => i.completed).length, [items])

  useEffect(() => localStorage.setItem('sl_items', JSON.stringify(items)), [items])
  useEffect(() => localStorage.setItem('sl_events', JSON.stringify(events)), [events])

  function logEvent(type, detail) {
    const entry = { ts: new Date().toISOString(), type, detail }
    setEvents(prev => [entry, ...prev].slice(0, 100))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    const newItem = { id: crypto.randomUUID(), text, completed: false }
    setItems(prev => [newItem, ...prev])
    logEvent('add', `Added: "${text}"`)
    setInput('')
  }

  function handleDelete(id) {
    const item = items.find(i => i.id === id)
    setItems(prev => prev.filter(i => i.id !== id))
    logEvent('delete', `Deleted: "${item?.text ?? id}"`)
  }

  function handleToggle(id) {
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, completed: !i.completed } : i))
    )
    const item = items.find(i => i.id === id)
    logEvent('complete', `Toggled complete: "${item?.text ?? id}"`)
  }

  function startEdit(id) {
    const item = items.find(i => i.id === id)
    if (!item) return
    setEditingId(id)
    setEditingText(item.text)
  }

  function saveEdit() {
    const text = editingText.trim()
    if (!text) return
    setItems(prev => prev.map(i => (i.id === editingId ? { ...i, text } : i)))
    logEvent('edit', `Edited to: "${text}"`)
    cancelEdit()
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingText('')
  }

  function clearAll() {
    setItems([])
    setEvents([])
    logEvent('reset', 'Cleared all items and events')
  }

  return (
    <div className="grid grid-2">
      <section className="card">
        <h1>StreamList</h1>
        <form
          onSubmit={handleSubmit}
          className="row gap"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
          }}
        >
          <input
            aria-label="Add item"
            placeholder="Add a movie or task"
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{
              flexGrow: 1,
              padding: '10px 12px',
              borderRadius: '10px',
              border: '1px solid #223242',
              background: '#0a1219',
              color: 'var(--text)',
            }}
          />
          <button type="submit" className="btn primary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="material-icons">add_circle</span> Add
          </button>
          <button
            type="button"
            className="btn"
            onClick={clearAll}
            title="Clear all"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span className="material-icons">restart_alt</span> Clear
          </button>
        </form>

        <div className="stats" style={{ marginBottom: '10px' }}>
          <strong>Total:</strong> {items.length}{' '}
          <strong>Completed:</strong> {completedCount}{' '}
          <strong>Open:</strong> {items.length - completedCount}
        </div>

        <ul className="list">
          {items.map(item => (
            <li key={item.id} className={item.completed ? 'done row between' : 'row between'}>
              {editingId === item.id ? (
                <>
                  <input
                    value={editingText}
                    onChange={e => setEditingText(e.target.value)}
                    className="grow"
                    style={{
                      flexGrow: 1,
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #223242',
                      background: '#0a1219',
                      color: 'var(--text)',
                    }}
                  />
                  <div className="row gap">
                    <button className="btn" onClick={saveEdit} title="Save">
                      <span className="material-icons">save</span>
                    </button>
                    <button className="btn" onClick={cancelEdit} title="Cancel">
                      <span className="material-icons">close</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <label className="row gap grow">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggle(item.id)}
                    />
                    <span>{item.text}</span>
                  </label>
                  <div className="row gap">
                    <button className="btn" onClick={() => startEdit(item.id)}>
                      <span className="material-icons">edit</span>
                    </button>
                    <button className="btn danger" onClick={() => handleDelete(item.id)}>
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
          {items.length === 0 && <li className="muted">No items yet. Add your first entry above.</li>}
        </ul>
      </section>

      <aside className="card">
        <div className="row between" style={{ alignItems: 'center' }}>
          <h2>User Events</h2>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
            <input
              type="checkbox"
              checked={showEvents}
              onChange={() => setShowEvents(!showEvents)}
            />
            {showEvents ? 'Hide' : 'Show'}
          </label>
        </div>

        {showEvents && (
          <ul className="list small">
            {events.map((e, idx) => (
              <li key={idx} className="row between">
                <span>
                  <strong>{e.type}</strong> — {e.detail}
                </span>
                <time className="muted">{new Date(e.ts).toLocaleString()}</time>
              </li>
            ))}
            {events.length === 0 && <li className="muted">No events recorded yet.</li>}
          </ul>
        )}

        <h2>Tips</h2>
        <ul className="list small">
          <li>Use the check box to complete an item.</li>
          <li>Click the pencil to edit, the trash to delete.</li>
          <li>Entries and events persist locally in your browser.</li>
        </ul>
      </aside>
    </div>
  )
}
