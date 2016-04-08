/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule CSSProperty
 */
const store = require('lib/store');
const each = require('lib/collection/each');
const is = require('lib/is');
const capitalize = require('lib/str').capitalize;
const prefixes = ['Webkit', 'ms', 'Moz', 'O', ''];
/**
 * CSS properties which accept numbers but are not in units of "px".
 */
const isUnitlessNumber = store([
  'animationIterationCount',
  'boxFlex',
  'boxFlexGroup',
  'boxOrdinalGroup',
  'columnCount',
  'flex',
  'flexGrow',
  'flexPositive',
  'flexShrink',
  'flexNegative',
  'flexOrder',
  'gridRow',
  'gridColumn',
  'fontWeight',
  'lineClamp',
  'lineHeight',
  'opacity',
  'order',
  'orphans',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',

  // SVG-related properties
  'fillOpacity',
  'stopOpacity',
  'strokeDashoffset',
  'strokeOpacity',
  'strokeWidth',
], (acc, key) => each(prefix => acc[prefixKey(prefix, key)] = true), prefixes)

function prefixKey(prefix, key) {
  return prefix ? prefix + capitalize(key) : key;
}

const pixelize = (val, key, style) => {
  if (val && is.num(val) && !isUnitlessNumber[key]) {
    style[key] = val +'px';
  }
}

module.exports = each(pixelize);
