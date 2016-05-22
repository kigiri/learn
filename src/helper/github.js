const is = require('lib/is')
const api = require('lib/api')
const get = require('lib/fetch-trace')
const hash = require('lib/hash')
const state = require('state').observ
const { btoa } = require('global/window')
const assignDeep = require('lib/assign-deep')
const { config } = state

const API = 'https://api.github.com'

// this is what i can later access in my urls
const _ = {}

// github headers
const baseHeaders = {
  Accept: 'application/vnd.github.v3+json',
  Authorization: window.localStorage.__ID__
    ? ('Basic '+ window.localStorage.__ID__)
    : undefined
}

const syncConfig = c => _.config = c

config(syncConfig)
syncConfig(config())

const skip404 = err => {
  if (!err.res || err.res.status !== 404) throw err
  return ''
}

const rawDl = (repo, path) => get([
  'https://raw.githubusercontent.com',
  repo,
  _.config.branch,
  path,
].join('/')).then(get.text).catch(skip404)

const dl = path => rawDl(_.config.repo, path)
dl.src = path => rawDl(_.config.srcRepo, path)

const github = Object.assign(api(_, {}, {
  browse: `${API}/repos/:repo/contents/:path?ref`,
}), api(_, baseHeaders, {
  fork: { method: 'POST', url: `${API}/repos/:repo/forks` },
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
      branch: branch => branch || 'master',
    },
  },
}))

github.dl = dl

const getProgressPath = name => `${_.config.branch}-${
  _.config.srcRepo.replace('/', '-')
}/${name || ''}`


window.github = github

github.dl.test = name => dl.src(`tests/${name}`)
github.dl.progress = name => is.undef(_.config.repo)
  ? dl.src(`exemples/${name}`)
  : dl(getProgressPath(name))
    .catch(err => dl.src(`exemples/${name}`))

github.create.progress = (filename, content) => github.create({
  path: getProgressPath(filename),
  message: 'Init progress for ex '+ filename,
  content: content || '',
})

// shorthands for known repositories :
github.browse.progress = () => github.browse({
  repo: _.config.repo,
  ref: 'master',
  path: getProgressPath(),
})

github.browse.exemples = () => github.browse({
  repo: _.config.srcRepo,
  ref: _.config.branch,
  path: 'exemples'
})

github.browse.tests = () => github.browse({
  repo: _.config.srcRepo,
  ref: _.config.branch,
  path: 'tests'
})

github.fork.progress = () => github.fork({ repo: 'kigiri/lambda-love-progress'})

github.reset = () => github.loadUpstream()
  .then(us => github.update({ ref: us.ref, sha: us.object.sha }))

github.verifyUser = user => {
  if (!user || !user.login) {
    if (!baseHeaders.Authorization) return Promise.reject(Error('404'))
  } else {
    const id = btoa(user.login +':'+ user.password)
    window.localStorage.__ID__ = id
    baseHeaders.Authorization = 'Basic '+ id
  }
  return github.loadUser().then(config.update)
}

module.exports = github
