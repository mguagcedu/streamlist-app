const KEY = 'streamlist:v1'

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : { favorites: [], events: [] }
  } catch {
    return { favorites: [], events: [] }
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {}
}

export function logEvent(type, detail) {
  const state = loadState()
  const evt = { id: crypto.randomUUID(), ts: Date.now(), type, detail }
  state.events.unshift(evt)
  saveState(state)
  return evt
}
