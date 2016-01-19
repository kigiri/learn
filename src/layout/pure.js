const is = require('lib/is');
const store = require('lib/store');
const assign = require('lib/assign');
const h = require('lib/h');
const dashMatch = x => '-'+ x.toLowerCase();
const matchUpperLetters = /[A-Z]/g;
const kebab = str => str.replace(matchUpperLetters, dashMatch);
const purify = key => 'pure-'+ kebab(key);

require('./pure.css');

const addClass = (className, args) => {
  if (args.props.className) {
    args.props.className = className +' '+ args.props.className;
  } else {
    args.props.className = className;
  }
  return args;
}

const checkArgs = (props, children) => {
  if (!children && is.children(props)) {
    children = props;
    props = {};
  } else if (!props) {
    props = {};
  }
  return { children, props };
}

const checkAndAddClass = (className, props, children) =>
  addClass(className, checkArgs(props, children));

const hExpend = (tagName, args) => h(tagName, args.props, args.children);

const hCurry = (tagName, className) => (props, children) =>
  hExpend(tagName, checkAndAddClass(className, props, children));

const pure = store({
  button: {
    tagName: 'button',
    alt: [ 'active', 'primary' ]
  },
  menuLink: 'a',
  menu: {
    alt: [ 'horizontal', 'fixed', 'scrollable' ]
  },
  g: 'div',
  menuList:'ul',
  menuChildren:'ul',
  menuItem: {
    tagName: 'li',
    alt: [ 'selected', 'disabled', 'hasChildren' ]
  },
  menuHeading: 'span',
  table: {
    tagName: 'table',
    alt: [ 'bordered', 'horizontal', 'striped' ]
  },
  img: 'img',
  inputRounded: 'input',
  group: 'div',
  formMessage: 'span',
  formMessageInline: 'span',
}, (acc, pureClass, key) => {
  const cssKey = purify(key);
  const tagName = is.str(pureClass) ? pureClass : (pureClass.tagName || 'div');

  acc[key] = hCurry(tagName, cssKey);
  pureClass.alt && pureClass.alt.forEach(altKey =>
    acc[key][altKey] = hCurry(tagName, cssKey +' '+ cssKey +'-'+ kebab(altKey)));
}, (a, b, c) => h(a, b, c));

const subway = (key, apply) => src =>
  src[key] = (props, children) => (!children && is.children(children))
    ? src(apply({}), props)
    : src(apply(props.disabled), children);

const addProps = (key, extend) => subway(key, props => assign(props, extend));

const disableable = addProps('disabled', { disabled: true });

disableable(pure.button);
disableable(pure.button.primary);

// const availablesRanges = [ 1, 2, 3, 4, 5, 6, 8, 12, 24 ];
const dashJoin = (a, b) => b ? (a +'-'+ b) : a;

const gridUnit = prefix => (unit, base, props, children) =>
  hExpend('div', checkAndAddClass(prefix + dashJoin(unit, base), props, children));

pure.u = gridUnit('pure-u-');
pure.u.sm = gridUnit('pure-u-sm-');
pure.u.md = gridUnit('pure-u-md-');
pure.u.lg = gridUnit('pure-u-lg-');
pure.u.xl = gridUnit('pure-u-xl-');

const formCurry = (className, fieldsetProps) => (props, children) =>
  hExpend('form', className, h('fieldset', fieldsetProps, [
    props.title ? h('legend', props.title) : null,
    children,
  ]));

pure.form = formCurry('pure-form');
pure.form.aligned = formCurry('pure-form pure-form-aligned');
pure.form.stacked = formCurry('pure-form pure-form-stacked');
pure.form.grouped = formCurry('pure-form', { className: 'pure-group' })

const pureInput = (label, args, className) => {
  args.props.id || (args.props.id = 'uniq-id-'+ Math.random())
  log(label)
  return h('label', {
    className,
    htmlFor: args.props.id
  }, [ log(hExpend('input', args)), label ]);
}

pure.input = (label, props) =>
  pureInput(label, { props: props || {} });

pure.input.rounded = (label, props) =>
  pureInput(label, checkAndAddClass('pure-input-rounded', props));

pure.checkbox = (label, props) => {
  const args = { props: props || {} };
  args.props.type = 'checkbox';

  return pureInput(label, args, 'pure-checkbox');
}
pure.radio = (label, props) => {
  const args = { props: props || {} };
  args.props.type = 'radio';

  return pureInput(label, args, 'pure-radio');
}

module.exports = pure;
