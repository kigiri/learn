const window = require('global/window')
// const blob = require('lib/blob')
// const is = require('lib/is')
const { createObjectURL } = window.URL || window.webkitURL

// const toBlob = code => createObjectURL(blob(code, 'application/javascript'))
// const buildWorker = code => new Worker(is.str(code) ? toBlob(code) : code)

// buildWorker.toBlob = toBlob

// module.exports = buildWorker

/*global Worker, Blob*/

/* https://github.com/zevero/worker-create 
 * Create a worker without using a seperate worker.js file either from function or from string
 */

const createUrl = code => createObjectURL(new Blob([`\'use strict\';
self.onmessage = ${code.toString()}`], { type: 'text/javascript' }))

const workerBuilder = str => new Worker(createUrl(str))
workerBuilder.createUrl = createUrl


module.exports = workerBuilder
