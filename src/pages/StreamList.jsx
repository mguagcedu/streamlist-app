import { useState } from 'react'

export default function StreamList() {
  const [input, setInput] = useState('')        // text field state
  const [items, setItems] = useState([])        // list state

  // add item
  function handleAdd(e) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    console.log('[StreamList] add:', trimmed)
    setItems(prev => [...prev, trimmed])
    setInput('')
  }

  // remove item
  function handleRemove(idx) {
    const item = items[idx]
    console.log('[StreamList] remove:', item)
    setItems(prev => prev.filter((_, i) => i !== idx))
  }

  return (
    <div className="grid grid-2">
      <section className="card">
        <h1>StreamList</h1>
        <p className="helper">Add titles to your list.</p>

        <form onSubmit={handleAdd} className="input-row" aria-label="Add to StreamList">
          <input
            className="input"
            placeholder="Example: Mission Impossible"
            value={input}
            onChange={e => setInput(e.target.value)}
            aria-label="Title"
          />
          <button className="btn" type="submit">
            <span className="material-icons" aria-hidden>add</span>
            &nbsp;Add
          </button>
        </form>

        <ul className="list" aria-live="polite">
          {items.map((item, idx) => (
            <li key={idx}>
              <span>{item}</span>
              <button className="btn" onClick={() => handleRemove(idx)} aria-label={`Remove ${item}`}>
                <span className="material-icons" aria-hidden>delete</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <aside className="card">
        <h2>Routes</h2>
        <ul className="list">
          <li><strong>Movies</strong><span className="material-icons">movie</span></li>
          <li><strong>Cart</strong><span className="material-icons">shopping_cart</span></li>
          <li><strong>About</strong><span className="material-icons">info</span></li>
        </ul>
      </aside>
    </div>
  )
}
