module.exports = (package, ...args) => {
  console.log(package, ...args)
  const uselessRequire = require(package);
  return new uselessRequire(...args);
};
