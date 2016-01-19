const h = require('lib/h');

require('./side.css');

const rightSide = h.curry('div.right-side').style;
const leftSide = h.curry('div.left-side').style;

module.exports = {
  right: (props, children) => rightSide({
    width: props.split * props.viewWidth,
  }, children),

  left: (props, children) => leftSide({
    width: props.viewWidth - props.split * props.viewWidth,
  }, children),
}
