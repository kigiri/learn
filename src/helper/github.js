const api = require('lib/api')
const assignDeep = require('lib/assign-deep')
const { btoa } = require('global/window')
const state = require('state').observ
const { config } = state

const API = 'https://api.github.com'

// this is what i can later access in my urls
const _ = {}

// github headers
const baseHeaders = {
  Accept: 'application/vnd.github.v3+json',
  Authorization: 'Basic '+ (window.localStorage.user || '')
}

const syncConfig = c => {
  _.config = c
}

config(syncConfig)
syncConfig(config())

const toText = r => r.text()
const rawDl = (repo, path) =>
  fetch(`https://raw.githubusercontent.com/:config.srcRepo/:config.branch/${path}`)
    .then(toText)

const dl = path => rawDl(_.config.repo, path)
dl.src = path => rawDl(_.config.srcRepo, path)

const github = api(_, baseHeaders, {
  fork: { method: 'POST', url: `${API}/repos/:repo/forks` },
  browse: `${API}/repos/:repo/contents/:path`,
  loadUser: `${API}/user`,
  loadUpstream: `${API}/repos/:config.srcRepo/git/refs/heads/:config.branch`,
  update: {
    method: 'PATCH',
    url: `${API}/repos/:config.repo/git/:ref`,
    body: {
      sha: String,
      force: true,
    }
  },
  create: {
    method: 'PUT',
    url: `${API}/repos/:config.repo/contents/:path`,
    body: {
      path: String,
      message: String,
      content: content => btoa(String(content)),
      branch: branch => branch || _.config.branch,
      committer: {
        name: 'Clement Denis',
        email: 'le.mikmac@gmail.com',
      },
    },
  },
})

github.dl = dl

const getProgressPath = () => `${_.config.branch}-${
  _.config.srcRepo.replace('/', '-')
}`

// shorthands for known repositories :
github.browse.progress = () => github.browse({
  repo: _.config.repo,
  path: getProgressPath(),
})

github.browse.exemples = () => github.browse({
  repo: _.config.srcRepo,
  path: 'exemples'
})

github.browse.tests = () => github.browse({
  repo: _.config.srcRepo,
  path: 'tests'
})

github.fork.progress = () => github.fork('kigiri/lambda-love-progress')

github.reset = () => github.loadUpstream()
  .then(us => github.update({ ref: us.ref, sha: us.object.sha }))

github.verifyUser = user => {
  baseHeaders.Authorization = 'Basic '+ btoa(user.login +':'+ user.password)
  return github.loadUser()
    .then(info => {
      config.set(assignDeep(config(), info))
    })
}













module.exports = github
