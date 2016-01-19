import is from './is'

const defaultTest = (a, b) => a !== b;

export default (key, test) => {
  if (!is.fn(test)) { test = defaultTest }
  return (state, val) => test(state[key], val) && (state[key] = val, true)
}
