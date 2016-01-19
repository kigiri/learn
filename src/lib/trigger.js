import ev from './event';
import each from './each';
import domEvents from './domEvents'

const extract = datakey => event => (event.target || event)[datakey]
const getData = key => ev[key].map(extract('data-'+ key)).filter(Boolean)

export default state => each([
  'click',
  'focus',
  'hover',
  'kdown',
  'kpress',
  'kup',
], key => getData(key).sub(({ type, payload }) => state.act(type, payload)));