const api = require('lib/api')
const assignDeep = require('lib/assign-deep')
const { btoa } = require('global/window')
const state = require('state').observ
const { config } = state

const BRANCH = 'master'
const REPO = 'kigiri/sauce'
const API = 'https://api.github.com'

// this is what i can later access in my urls
const available = {}

// github headers
const baseHeaders = {
  Accept: 'application/vnd.github.v3+json',
  Authorization: 'Basic '+ (window.localStorage.user || '')
}

const syncConfig = c => {
  available.config = c
}

config(syncConfig)
syncConfig(config())

const toText = r => r.text()
const rawDl = (repo, path) =>
  fetch(`https://raw.githubusercontent.com/${repo}/${BRANCH}/${path}`)
    .then(toText)

const dl = path => rawDl(available.config.repo, path)
dl.src = path => rawDl(REPO, path)

const github = api(available, baseHeaders, {
  fork: { method: 'POST', url: `${API}/repos/${REPO}/forks` },
  browse: `${API}/repos/:repo/contents/:path`,
  loadUser: `${API}/user`,
  loadUpstream: `${API}/repos/${REPO}/git/refs/heads/${BRANCH}`,
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
      branch: branch => branch || BRANCH,
      committer: {
        name: 'Clement Denis',
        email: 'le.mikmac@gmail.com',
      },
    },
  },
})

github.dl = dl

// shorthands for known repositories :
github.browse.exercises = () => github.browse({
  repo: available.config.repo,
  path: 'exercises'
})

github.browse.exemples = () => github.browse({
  repo: REPO,
  path: 'exemples'
})

github.browse.tests = () => github.browse({
  repo: REPO,
  path: 'tests'
})

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
