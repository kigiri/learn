
module.exports = (obs, fn) => (requested => {
  const once = () => requested = true;

  once.destroy = obs(val => {
    if (requested) {
      fn(val, once.destroy);
      requested = false;
    }
  });

  return once;
})(false);
