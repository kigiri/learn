import each from '../lib/each'
import domEvents from '../lib/domEvents'
import reducer from '../lib/reducer'
import url from './history'

reducer.add('url', { set: url });
reducer.add('count', {
  increment: state => state.count++,
  decrement: state => state.count--,
});

each(domEvents, reducer.add.event);

export default reducer;
