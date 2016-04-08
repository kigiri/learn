const h = require('lib/h');
const calcWidth = require('helper/calc-width')

require('./side.css');

const rightSide = h.curry('.right-side').style;
const leftSide = h.curry('.left-side').style;

module.exports = {
  right: (props, children) => rightSide({
    width: calcWidth(props),
  }, children),

  left: (props, children) => leftSide({
    width: Math.max(props.viewWidth - calcWidth(props) - 0.5, 0),
  }, children),
}
