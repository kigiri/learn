const observables = require('state').observ;

require([
  "codemirror",
  "codemirror/keymap/sublime",
  "codemirror/mode/javascript/javascript",
  "codemirror/addon/display/rulers",
  "codemirror/addon/lint/lint",
  // css
  "codemirror/lib/codemirror.css",
  "codemirror/theme/dracula.css",
], observables.codeMirror.set);
