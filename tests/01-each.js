const baseEachIter = (fn, arr) => {
  const max = arr.length
  let idx = -1

  while (++idx < max) {
    if (fn(arr[idx], idx, arr) === false) break
  }
  
  return arr
}

const baseEachKeys = (fn, obj) => {
  const keys = Object.keys(obj)
  const max = keys.length
  let idx = -1
	let key

  while (++idx < max) {
    key = keys[idx]
    if (fn(obj[key], key, obj) === false) break
  }
  
  return obj
}

const simpleBaseFor = (fn, set) => {
  let idx = 0
  for (const value of set) {
    if (fn(value, idx++, set) === false) break
  }
  
  return set
}

const keyBaseFor = (fn, map) => {
  for (const [ key, value ] of map) {
    if (fn(value, key, map) === false) break
  }
  
  return map
}

const polymorphiqueEach = (fn, collection) => {
  if (!collection) return collection
  switch (collection.constructor) {
    case Set: return simpleBaseFor(fn, collection)
    case Map: return keyBaseFor(fn, collection)
    case Array:
    case String: return baseEachIter(fn, collection)
    default: return baseEachKeys(fn, collection)
  }
}

const each = (fn, ...args) => {
	if (args.length > 0) return polymorphiqueEach(fn, ...args)
  return arr => polymorphiqueEach(fn, arr)
}



