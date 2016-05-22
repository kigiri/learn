// LOAD github exercise
const state = require('state').observ
const passError = require('lib/err')
const github = require('helper/github')
const hash = require('lib/hash')
const store = require('lib/store')
const reduce = require('lib/collection/reduce')
const { immediate } = require('lib/emiter/observ')
const theCook = require('component/the-cook')
const defaults = require('data/defaults')
const chaininfy = reduce((prev, next) => {
  prev.next = next
  next.prev = prev
  return next
})

const unabriged = {
  prev: 'previous',
  next: 'next',
}

const __load = key => {
  const tests = state.tests()
  if (!tests) return console.warn('unable to load tests')
  const ex = tests[state.exercise()]
  if (!ex || !ex[key]) return console.warn(`unable to find ${key} test`)
  console.log(`loading ${unabriged[key]} test : ${ex[key].name}`)
  state.exercise.set(ex[key].name)
}

const loadNext = () => __load('next')
const loadPrev = () => __load('prev')

const prepareFiles = arr => {
  const files = store(arr, (acc, val) => acc[val.name] = val)

  files.__last__ = chaininfy(files)
  files.__first__ = arr[0]
  files.__arr__ = arr

  files.__first__.prev = undefined
  files.__last__.next = undefined

  return files
}

let progressFiles = {}
Object.assign(window, {
  next: loadNext,
  prev: loadPrev,
  git: {
    raw: github,
    logout: () => delete window.localStorage.__ID__,
    login: (login, password) => {
      if (!login) {
        if (!window.localStorage.__ID__) {
          return console.warn('You must enter a username')
        }
      } else if (!password) {
        password = prompt('Enter you github password')
      }
      github.verifyUser({ login, password }).then(github.fork.progress)
        .then(repo => {
          state.config.update({ repo: repo.full_name })
          console.log('You are successfully logged in, using repo',
            repo.full_name)
          return github.browse.progress().catch(err => {
            console.log('Uh oh, creating ?')
            console.dir(err)
            return github.create.progress(state.exercise(), '')
              .then(ex => wesh([ ex.content ]))
          })
        }).then(files => {
          progressFiles = prepareFiles(files)
          console.log('progress restaured, jumping to exercise',
            progressFiles.__last__.name)
          state.exercise.set(progressFiles.__last__.name)
        })
    },
  },
  commit: msg => {},
  loadExercise: state.exercise.set,
  load: hash.set,
})


if (window.localStorage.__ID__) {
  window.git.login()
}

// load tests
immediate(state.exercise, ex => {
  if (!ex) return
  const hashParts = hash.parts()
  const hashEx = hashParts[3]
  if (!hashEx || hashEx !== ex) {
    hashParts[3] = ex
    hash.set(hashParts.join('/'))
  }
  
  if (!window.localStorage[ex]) {
    github.dl.progress(ex).then(state.progress.set)
  }
  github.dl.test(ex).then(state.test.set)
})

// load repo
let _prevRepo
const loadRepo = repo => {
  _prevRepo = repo
  hash.set(repo)
  return github.browse.tests().then(tests => {
    state.tests.set(prepareFiles(tests))
    if (!state.exercise()) {
      state.exercise.set(tests[0].name)
    }
    const { srcRepo, branch } = state.config()
    theCook.greet(true)
  }).catch(err => {
    if (!err.res) throw err
    hash.set('')
    console.error(`Unable to load tests from repo ${repo}`
      +`Github API Error : ${err.res.status} - ${err.message}`
      +`Falling back to default repo`)
  })
}

immediate(state.config, ({ srcRepo, branch }) => {
  const repo = `${srcRepo}/${branch}`

  if (_prevRepo === repo) return

  if (branch === defaults.branch && srcRepo === defaults.srcRepo) {
    return loadRepo(repo).catch(err => {
      delete window.localStorage.user
      return loadRepo(repo)
    })
  }

  return github.loadUser().then(user => {
    state.config.update(user)
    loadRepo(repo)
  }, err => {
    console.error('Failed to load repo', repo, 'failling back to default')
    console.log(`Use cmd.login('user', 'pwd') followed by cmd.load(${repo}) to do it manualy.`)
    hash.set('')
    // In case we could not load the user, we must ask to login
  })
})

// login user
// immediate(config)

// const init = () => github.loadUser()
//   .then(updateConfig)
//   .then(() => github.fork())
//   .then(repo => updateConfig({ repo: repo.full_name }))
//   // .then(() => github.reset())
//   .then((q => () => q)(github.browse.tests()
//     .then(arrayToMap.name)
//     .then(state.tests.set)))
//   .then(() => github.browse.exercises()
//     .catch(err => {
//       if (err.message !== 'Not Found') throw err

//       const tests = state.tests()
//       const srcEx = tests[Object.keys(tests)[0]]

//       return dl.src(srcEx.path)
//         .then(content => github.create({
//           content,
//           path: 'exercises/'+ srcEx.name,
//           message: 'My first exercise !',
//         })).then(ex => [ ex.content ])
//     }))
//   .then(exercises => {
//     state.exercises.set(arrayToMap.name(exercises))
//   })
//   .catch(err => theCook.say('X', 'initialization problem: '
//     + (err.code || err.message)), true)


module.exports = {
  next: loadNext,
  prev: loadPrev,
}
