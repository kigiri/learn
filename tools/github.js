const m = require('moment')
const _ = require('lodash')
const include = require('./include')
const promisify = require('./promisify')
const github = include('github', {
  version: "3.0.0",
  protocol: 'https',
  host: 'api.github.com',
  headers: { 'user-agent': 'Github-Tooling-For-LambdaSauce' },
  // debug: true,
  // timeout: 5000,
})

const bindRepo = baseMsg => {
  const _repo = {}
  _.each([
    'events',
    'issues',
    'authorization',
    'markdown',
    'misc',
    'orgs',
    'pullRequests',
    'releases',
    'repos',
    'search',
    'statuses',
    'user',
  ], group => {
    _repo[group] = {}
    _.each(github[group], (__, method) => _repo[group][method] = msg =>
      new Promise((res, rej) =>
        github[group][method](_.defaults(msg || {}, baseMsg), (err, data) => err
          ? rej(err)
          : res(data))))
  })

  return _repo;
}

const learnRepo = bindRepo({
  user: 'kigiri',
  repo: 'learn',
});

learnRepo.issues.getAllMilestones()
  .then(console.log)
  .catch(err => console.log(err.stack))
