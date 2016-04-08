const delay = (setter, emiter, delay) =>
  emiter(val => setTimeout(() => setter(val), delay))

const delayWithSelector = (setter, emiter, delay, test) => {
  const fn = buildTest(test)

  emiter(val => fn(val) ? setTimeout(() => setter(val), delay) : setter(val))
}

delay.withSelector = delayWithSelector

module.exports = delay
