// LOAD github sauce
const state = require('state').observ
const passError = require('lib/err')
const github = require('helper/github')
const hash = require('lib/hash')
const { immediate } = require('lib/emiter/observ')
const theCook = require('component/the-cook')

// arrayToMap.name = arrayToMap('name')


// load repo
immediate(hash, h => github.browse.tests().then(err => {
  console.log('error', err)
}).catch(wesh))

// login user


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

