const observables = require('state').observ;

require([
  "codemirror",
  "codemirror/keymap/sublime",
  "codemirror/mode/javascript/javascript",
  "codemirror/addon/scroll/scrollpastend",
  "codemirror/addon/display/rulers",
  // css
  "codemirror/lib/codemirror.css",
  "codemirror/theme/dracula.css",
  // "codemirror/addon/scroll/simplescrollbars",
  // "codemirror/addon/scroll/simplescrollbars.css",
], observables.codeMirror.set);
