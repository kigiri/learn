const map = require('lib/map');
const str = require('lib/str');
const router = require('lib/router');
const cursor = require('lib/cursor');
const observables = require('state').observ;

const routes = {
  '/home': { load: require('route/home') },
  '/user': { load: require('route/user') },
  '/train': { load: require('route/train') },
}

const loadView = view =>
  Promise.resolve(view.load(observables))
    .then(() => {
      router.view.set(view.render);
      cursor('');
    })

const loadHref = atom => {
  const route = routes[atom];

  router.view.set(null);
  cursor.wait();

  if (!route) {
    return router.atom.set('/home');
  }

  route.load().then(loadView);
}

router.atom(loadHref);

if (routes[router.atom()]) {
  loadHref(router.atom());
} else {
  router.atom.set('/home');
}

module.exports = map.toArray(routes, (route, path) => ({
  path,
  label: str.capitalize(path.slice(1))
}))
