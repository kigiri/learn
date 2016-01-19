import build from './buildReducer'
import store from './store'
import setter from './setter'

let builded = false;

const all = [];

const add = store([ 'event', 'input' ],
  (add, type) => add[type] = key => add(key, { [type]: setter(key) }),
  (key, reducers) => builded
    ? console.warn('Trying to add reducer', key, 'after the reduce build')
    : all.push({ [key]: reducers }));

const reducer = {
  add,
  build: () => (builded = true, build(all))
};

export default reducer;