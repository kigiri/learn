import inject from '../lib/inject'
import detect from '../lib/detect'
import route from '../lib/route'
import log from '../lib/log'


const unsupported = '?' + detect.join('&');
const errorHandler = log.warn.bake('unable to load route');

export default (state, url) => {
  if (state.url === url) return false;
  if (route[url]) {
    route[url](state);
  } else {
    inject('./js/' + url + '.js' + unsupported)
      .then(() => route[url](state))
      .catch(errorHandler);
  }
  state.url = url;
}
