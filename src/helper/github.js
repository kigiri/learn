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

const not404 = err => !err || !err.res || err.res.status !== 404
const skip404 = err => {
  if (not404(err)) throw err
  return ''
}

const buildDlUrl = args => state.editorMode()
  ? args.join('/') +`?${Date.now()}` // invalidate caching
  : args.join('/')

const rawDl = (repo, branch, path) => get(buildDlUrl([
  'https://raw.githubusercontent.com',
  repo,
  branch,
  path,
])).then(get.text)

const dl = path => rawDl(_.config.repo, 'master', path)
dl.src = path => rawDl(_.config.srcRepo, _.config.branch, path)

const createBody = {
  path: String,
  message: String,
  content: content => btoa(String(content)),
  branch: branch => branch || 'master',
}

const github = Object.assign(api(_, {}, {
  browse: `${API}/repos/:repo/contents/:path?ref`,
}), api(_, baseHeaders, {
  fork: { method: 'POST', url: `${API}/repos/:repo/forks` },
  loadUser: `${API}/user`,
  _update: {
    method: 'PUT',
    url: `${API}/repos/:repo/contents/:path`,
    body: Object.assign({ sha: String }, createBody)
  },
  create: {
    method: 'PUT',
    url: `${API}/repos/:repo/contents/:path`,
    body: createBody,
  },
}))

github.not404 = not404
github.skip404 = skip404

github.update = args => args.sha ? github._update(args) : github.create(args)

// force get, will create file if missing
github.fget = args => github.browse(args).catch(err => {
  if (not404(err)) throw err
  return github.create({
    message: 'init file '+ args.path,
    content: '',
    branch: args.ref,
    path: args.path,
  })
})

github.dl = dl

const getProgressPath = name => `${_.config.branch}-${
  _.config.srcRepo.replace('/', '-')
}/${name || ''}`

github.dl.test = name => dl.src(`tests/${name}`)
github.dl.exemple = name => dl.src(`exemples/${name}`)
github.dl.progress = name => is.undef(_.config.repo)
  ? dl.src(`exemples/${name}`)
  : dl(getProgressPath(name))
    .catch(err => dl.src(`exemples/${name}`))

github.dl.progress.current = () => github.dl.progress(state.exercise())

github.create.progress = (filename, content) => github.create({
  path: getProgressPath(filename),
  repo: _.config.repo,
  message: 'Init progress for ex '+ filename,
  content: content || '',
})

github.create.progress.current = () => github.create
  .progress(state.exercise(), state.progress.current())

const update = (key, opts) => {
  const { ref, repo } = opts
  const exercise = state.exercise()
  const content = (state[key] || state.progress).current()
  const msg = opts.msg ? ` - ${opts.msg}` : ''
  const path = key === 'progress'
    ? getProgressPath(exercise)
    : `${key}s/${exercise}`
  const reqBody = {
    path,
    repo,
    content,
    branch: ref,
    message: `Saving ${key} of ${path.replace('/', ' ')}${msg}`,
  }

  return github.dl[key](exercise).then(value => (value === content)
    ? console.log('no changes to commit')
    : github.browse({ path, ref, repo })
      .then(({ sha }) => github.update(Object.assign({ sha }, reqBody))))
    .catch(err => {
      if (not404(err)) throw err
      return github.create(reqBody)
    }).then(() => console.log(reqBody.message))
}

github.update.progress = msg => update('progress', {
  msg,
  ref: 'master',
  repo: _.config.repo,
})

github.update.test = msg => update('test', {
  msg,
  ref: _.config.branch,
  repo: _.config.srcRepo,
})

github.update.exemple = msg => update('exemple', {
  msg,
  ref: _.config.branch,
  repo: _.config.srcRepo,
})

// shorthands for known repositories :
github.browse.progress = () => github.browse({
  repo: _.config.repo,
  ref: 'master',
  path: getProgressPath(),
})

github.browse.progress.current = () => github.browse({
  repo: _.config.repo,
  ref: 'master',
  path: getProgressPath(state.exercise()),
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

github.fork.progress = () => github.fork({
  repo: state.editorMode()
    ? 'kigiri/lambda-love-progress-editor'
    : 'kigiri/lambda-love-progress'
})

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
