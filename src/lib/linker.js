import Emiter from './emiter'
import reduce from './reduce'
import setter from './setter'
import store from './store'
import loop from './loop'
import is from './is'

const prepareState = (state, accessor, key) => state[key] = accessor();
const prepareSetters = (set, key, test) => set[key] = setter(key, test);
const defaultTest = (a, b) => a !== b;

function linkers(accessors, test) {
  const keys = Object.keys(accessors);
  const set = store(keys, prepareSetters, test);
  const state = store(accessors, prepareState);
  const updateAll = (flag, key) => (set[key](state, accessors[key]()) || flag);

  return Emiter(next => loop.sub(() => {
    if (reduce(keys, updateAll, false)) {
      next(state);
    }
  }));
}

function linker(accessor, test = defaultTest) {
  let val = accessor();

  return Emiter(next => loop.sub(() => {
    const newVal = accessor()

    if (test(val, newVal)) {
      next(val = newVal);
    }
  }));
}

export default (accessor, test) =>
  (is.fn(accessor) ? linker : linkers)(accessor, test)
