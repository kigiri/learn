/* the cook
So let's do the others, first of, map.
Must behave like Array.map plus polymorphism and currying
*/

const getCollectionType = collection => {
  if (!collection) return 'null'
  switch (typeof collection) {
    case 'string': return 'string' 
    case 'object': {
      switch (collection.constructor) {
        case Array: return 'array'
        case Map: return 'map'
        case Set: return 'set'
        default: return 'object'
      }
    } 
  }
}

const getValueDefault = (collection, key) => collection[key]
const getValueGetter = (collection, key) => collection.get(key)
const getAccessor = collection => {
  switch (getCollectionType(collection)) {
    case 'map': case 'set': return getValueGetter
    default: return getValueDefault
  }
}

const getValue = (collection, ...args) => {
  const get = getAccessor(collection)
  return args.length
    ? get(collection, args[0])
    : key => get(collection, key)
}

const getLength = collection => {
  switch (getCollectionType(collection)) {
    case 'map': case 'set': return collection.size
    case 'object': return Object.keys(collection).length
    default: return collection.length || 0
  }
}

const collectionEqual = (a, b) => {
  if (getLength(a) !== getLength(b)) throw Error('Collection length differs')
  const typeA = getCollectionType(a)
  const typeB = getCollectionType(b)
  if (typeA !== typeB) {
    throw Error(`Collection types mismatch ${typeA} and ${typeB}`)
  }
  const get = getValue(b)
  each((value, key) => {
    if (value !== get(key)) throw Error(`Values mismatch for key ${key}`)
  }, a)
}

const arrayToObject = arr => {
  const obj = {}
  return each((value, key) => obj[key] = value)
}

const times2 = map(v => v * 2)
const addPrefix = map(v => 'pfx_'+ v)
const baseArray = [ 2, 4, 16, 256 ]
const baseObject = arrayToObject(baseArray)
const baseObjectTimes2 = arrayToObject(baseArrayTimes2)
const baseObjectPrefixed = arrayToObject(baseArrayPrefixed)
const baseSet = new Set(baseArray)
const baseSetTimes2 = new Set(baseArrayTimes2)
const baseSetPrefixed = new Set(baseArrayPrefixed)
const baseArrayTimes2 = [ 4, 8 , 32, 512 ]
const baseArrayPrefixed = [ 'pfx_4', 'pfx_8' , 'pfx_32', 'pfx_512' ]

collectionEqual(times2(baseArray), baseArrayTimes2)
collectionEqual(addPrefix(baseArray), baseArrayPrefixed)

collectionEqual(times2(baseSet), baseSetTimes2)
collectionEqual(addPrefix(baseSet), baseSetPrefixed)

collectionEqual(times2(baseObject), baseObjectTimes2)
collectionEqual(addPrefix(baseObject), baseObjectPrefixed)

