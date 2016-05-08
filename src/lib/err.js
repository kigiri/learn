const errorSet = new WeakSet()

function TypedError(errOrMsg, meta) {
  const err = errOrMsg instanceof Error ? errOrMsg : Error(errOrMsg)
  errorSet.add(err)
  return Object.assign(err, meta)
}

const test = (errorConstructor, meta, trigger) => err => {
  if (!errorSet.has(err)) {
    const typedErr = errorConstructor(err, meta)
    if (typeof trigger === 'function') {
      const triggerRet = trigger(typedErr)
      if (triggerRet !== undefined) return triggerRet
    }
  }
  throw err
}

const testAndCheck = (errorConstructor, meta, check, trigger) => {
  const checker = buildChecker(check)
  const tester = test(errorConstructor, meta, trigger)

  return err => {
    if (checker(err)) return tester(err)
    throw errorConstructor(err)
  }
}

const pass = (meta, trigger) => test(TypedError, meta, trigger)

pass.new = TypedError

const buildChecker = check => {
  switch (typeof check) {
    case 'function': return check
    case 'string': return err => err.message === check
    default: throw Error('Unexpected type of check source')
  }
}

pass.check = (meta, check, trigger) =>
  testAndCheck(TypedError, meta, check, trigger)

// pass.tester = () => {
//   const errorConstructor = (err, codeOrMeta) => {
//     if (typeof codeOrMeta === 'string') {
//       handlers[]
//     }
//   }
//   const state = {
//     handlers: {},
//     new: errorConstructor
//   }


//   return state
// }

module.exports = test
