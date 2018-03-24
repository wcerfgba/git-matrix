export const on = (o, event, listener) => {
  o.eventListeners[event] = o.eventListeners[event] || []
  o.eventListeners[event].push(listener)
}

export const fire = (o, event, data) => {
  o.eventListeners[event] = o.eventListeners[event] || []
  o.eventListeners[event].forEach(
    (listener) => listener(data)
  )
}