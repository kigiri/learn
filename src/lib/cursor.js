const document = require('global/document');
const str = require('lib/str');
const store = require('lib/store');

const setCursor = (style => value => {
  style || (style = document.body.style)
  style.cursor = value;
})(document && document.body && document.body.style)

module.exports = store([
  'auto',
  'default',
  'none',
  'context-menu',
  'help',
  'pointer',
  'progress',
  'wait',
  'cell',
  'crosshair',
  'text',
  'vertical-text',
  'alias',
  'copy',
  'move',
  'no-drop',
  'not-allowed',
  'e-resize',
  'n-resize',
  'ne-resize',
  'nw-resize',
  's-resize',
  'se-resize',
  'sw-resize',
  'w-resize',
  'ew-resize',
  'ns-resize',
  'nesw-resize',
  'nwse-resize',
  'col-resize',
  'row-resize',
  'all-scroll',
  'zoom-in',
  'zoom-out',
  'grab',
  'grabbing',
], (acc, key) => acc[str.toCamel(key)] = () => setCursor(key), setCursor)
