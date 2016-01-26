function removeFromHistory(history, el) {
  let idx

  while ((idx = history.indexOf(el)) !== -1) {
    history.splice(idx, 1)
  }
}

module.exports = limit => {
  limit || (limit = Infinity)
  const history = []

  return {
    get: () => history,
    stash: (val => arg => arg ? val = arg : val)(),
    remove: el => removeFromHistory(history, el),
    push: el => {
      removeFromHistory(history, el)
      history.unshift(el)
      while (history.length > limit) {
        history.shift()
      }
    },
  }
}
