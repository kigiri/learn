// LOAD github sauce
const state = require('state').observ
const passError = require('lib/err')
const github = require('helper/github')
const hash = require('lib/hash')
const store = require('lib/store')
const { immediate } = require('lib/emiter/observ')
const theCook = require('component/the-cook')
const defaults = require('data/defaults')
const arrayToMap = key => arr => store(arr, (acc, val) => acc[val[key]] = val)

const mapFromName = arrayToMap('name')

window.cmd = {
  showExercise: () => {},
  login: (login, password) => github.verifyUser({ login, password }),
  load: hash.set,
}

// load tests
state.progress(val => window.localStorage[state.sauce()] = val)

immediate(state.sauce, sauce => {
  if (!sauce) return
  github.dl.all(wesh(sauce, 'HOT SAUCE'))
  .then(([ test, progress ]) => {
    console.log({ test, progress })
    state.test.set(test)
    state.progress.set(progress)
  })
})

// load repo
const loadRepo = repo => {
  hash.set(repo)
  return github.browse.tests().then(tests => {
    state.tests.set(mapFromName(tests))
    state.sauce.set(tests[0].name)
    console.log(state.tests())
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

immediate(hash, h => {
  const { srcRepo, branch } = state.config()
  const repo = `${srcRepo}/${branch}`

  if (branch === defaults.branch && srcRepo === defaults.srcRepo) {
    return loadRepo(repo)
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

