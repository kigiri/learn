function checkPresence(url) {
  return reduce(document.body.getElementsByTagName('script'), (skip, script) =>
    skip || script.getAttribute('src').indexOf(url) !== -1, false);
}

const errorHanlder = (url, reject) => event => {
  const err = new Error('Error loading script '+ url);
  err.event = event;
  reject(err);
}

export default url => {
  if (checkPresence(url)) {
    return promise.reject(new Error('script '+ url +' already injected'));
  }
  const script = document.createElement('script');
  const p = new Promise((resolve, reject) => {
    script.onerror = errorHanlder(url, reject);
    script.onload = resolve; // TODO: check if onload can be call multiple times
  })

  script.type = 'text/javascript';
  script.src = url;
  document.body.appendChild(script);

  return p;
}
