// LOAD github sauce
const state = require('state').observ
const passError = require('lib/err')
const github = require('helper/github')

const updateConfig = cfg => state.config.set(assignDeep(state.config(), cfg))
const arrayToMap = key => arr => store(arr, (acc, el) => acc[el[key]] = el)

arrayToMap.name = arrayToMap('name')

const init = () => github.loadUser()
  .catch(passError.check({ code: 'Wrong Credentials' }, err => {
    console.log(err)
    return true
  }))
  .then(updateConfig)
  .then(() => github.fork())
  .then(repo => updateConfig({ repo: repo.full_name }))
  // .then(() => github.reset())
  .then((q => () => q)(github.browse.tests()
    .then(arrayToMap.name)
    .then(state.tests.set)))
  .then(() => github.browse.exercises()
    .catch(err => {
      if (err.message !== 'Not Found') throw err

      const tests = state.tests()
      const srcEx = tests[Object.keys(tests)[0]]

      return dl.src(srcEx.path)
        .then(content => github.create({
          content,
          path: 'exercises/'+ srcEx.name,
          message: 'My first exercise !',
        })).then(ex => [ ex.content ])
    }))
  .then(exercises => {
    state.exercises.set(arrayToMap.name(exercises))
  })
  .catch(err => state.cookProps.set({
    eye: 'X',
    message: 'initialization problem: '+ (err.code || err.message),
  }))



const render = ({ exercises, tests }) => map.toArray(tests, (info, key) => {
  exercises[key]
})


render.init = init

module.exports = render
