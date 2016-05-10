/* I set the function window.atob to a variable with a more expressive name
 * It's a reference to the same function, so that's exactly the same function
 * just now accessible in a new name. */
var decodeFromBase64 = window.atob

/* In case you wanted not to be remember,
 * you need to make this if condition valid :) */
if (decodeFromBase64(window.localStorage.user) === ':') {
  // I use the delete statement
  delete window.localStorage.user
} else {
  // otherwise, I need to confirm with github
  github.loadUser()
}

/* The documentation TL;DR corner :
 *
 * window.btoa is available on modern browser to encode to base64
 * -> developer.mozilla.org/en-US/docs/Web/API/WindowBase64/btoa
 *
 * window.atob reverse btoa, so it decodes base64 strings
 * -> developer.mozilla.org/en-US/docs/Web/API/WindowBase64/atob
 *
 * window.localStorage is a local data store in your browser
 * -> developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 *
 * Want more ? List of all the available statements in javascript
 * -> developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements
 */
