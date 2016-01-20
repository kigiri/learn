const start = (b) => Boolean(b)

const state = {}

const add = (currentTest => (typeName, test) => {
  currentTest.next = test[typeName] = test

  state[typeName] = test;

  add[typeName] = (actionName, action) =>
    add.action(typeName, actionName, action)

  // walk the chain
  currentTest = currentTest.next;  

  return state;
})(start)

add.action = (typeName, actionName, action) => {
  state[typeName][actionName] = action;

  return state;
}

const executeAction = (actionName, collection, ...args) => {
  let type;

  if (!start(collection)) { return collection }

  while (type = start.next) {
    if (type(collection)) {
      const action = type[actionName];
      return action ? action(collection, ...args) : collection;
    }
  }
  return collection;
}
