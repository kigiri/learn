var features = {
  let: '"use strict"; const b = 5; let c = 5', // and const
  arrow: '_ => _',
  object: 'var b = 5, c = {b, [b]: 5}',
  method: 'var b = { r() {} }',
  rest: '(...arg) => [...arg]', // and spread
  default: '(a = 5) => a',
  destructuring: 'var b = { a: 5}, { a } = b',
  string: 'var b = 5, c = `${b}`',
  promise: 'Promise.resolve(5).then().catch()',
  // forof
  // class
  // Generator function
  // Binary and octal numeric literals
};

var unsupported = [];

Object.keys(features).forEach(function (key) {
  try { eval(features[key]) } // eslint-disable-line
  catch (err) { unsupported.push(key) }
})

export default unsupported;
