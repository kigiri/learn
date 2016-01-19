function noop() {}

export default (em, handlers) => em.sub(e => (handlers[e.keyCode] || noop)(e))