const now = require('performance-now');
const store = require('lib/store');
const map = require('lib/map');
const window = require('global/window');
const is = require('lib/is');

const noOp = () => {};
const pass = _ => _;

const traceStyle = 'color: blue; margin-left: 5px; text-decoration: none;'
  +'display:block!important; color: #ccc';

const buildTrace = () => {
  const e = new Error();
  const stack = e.stack || e.stacktrace;
  if(!stack) return '%c'; // fix undefined issue reported by @sigod

  // correct line number according to how Log().write implemented
  const match = stack.split('\n')[4] || '';
  const line = (match.indexOf(' (') >= 0
      ? match.split(' (')[1].slice(0, -1)
      : match.split('at ')[1])
  if (/<anonymous>/.test(line)) {
    return '%c'
  }
  return '%c'+ line;
}

const buildTimeStampStyle = delta => 'color: hsl('+ (delta > 16
  ? 200
  : 200 - delta / 16 * 200) +', 70%, 50%);'

const pad = n => ('    '+ (is.num(n) ? Math.floor(n) : n)).slice(-4);

const prettyPrintDelta = delta => {
  if (delta < 1) return '%c'+ pad(delta * 10000) +'µs';
  if (delta < 10) return '%c'+ pad(delta.toFixed(2)) +'ms';
  if (delta < 16) return '%c'+ pad(delta.toFixed(1)) +'ms';
  if (delta < 100) return '%c'+ pad(delta.toFixed(1)) +'ms';
  if (delta < 1000) return '%c'+ pad(delta) +'ms';
  if (delta < 10000) return '%c'+ pad((delta / 1000).toFixed(2)) +'s';
  if (delta < 100000) return '%c'+ pad((delta / 1000).toFixed(1)) +'s';
  if (delta < 999999) return '%c'+ pad(delta / 1000) +'s';
  return '%c 999+s';
}

const toArray = arg => arg;

const applyOpts = opts => ((style, time) => args => {
  args.unshift('\n❯');
  if (opts.timestamp) {
    const newTime = now();
    const delta = (newTime - time); 

    if (opts.trace) {
      args.unshift(prettyPrintDelta(delta) + buildTrace(),
        buildTimeStampStyle(delta), traceStyle);
    } else {
      args.unshift(prettyPrintDelta(delta), buildTimeStampStyle(delta));
    }
    time = newTime;
  } else if (opts.trace) {
    args.unshift(buildTrace(), traceStyle);
  }

  return args;
})(opts.traceStyle || traceStyle, now());

const getLogger = (key, opts, setOpts) => {
  const log = (...args) => {
    console[key].apply(console, setOpts(map(args, toArray)));
    return args[0];
  }

  const curry = (...l) => (...args) => {
    console[key].apply(console, setOpts([...l, ...args]));
    return args[0];
  }

  const logger = opts.active ? log : pass;

  logger.curry = opts.active
    ? curry
    : () => pass;

  logger.curryLeft = opts.active
    ? (...r) => (...l) => log([ ...l, ...r ])
    : () => pass;

  return logger;
};

module.exports = opts  => {
  const setOpts = applyOpts(opts);
  const log = store(['log', 'warn', 'error', 'trace', 'dir'], (s, key) =>
    s[key] = getLogger(key, opts, setOpts), getLogger('log', opts, setOpts));

  log.debug = console.log.bind(console);

  if (window) {
    window.log = log;
  } else {
    global.log = log;
  }
}
