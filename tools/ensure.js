const path = require('path')
const fs = require('fs')
const _0777 = parseInt('0777', 8)

function mkdirP(p, opts, f, made) {
    if (typeof opts === 'function') {
        f = opts
        opts = {}
    }
    else if (!opts || typeof opts !== 'object') {
        opts = { mode: opts }
    }
    
    const mode = opts.mode
    const xfs = opts.fs || fs
    
    if (mode === undefined) {
        mode = _0777 & (~process.umask())
    }
    
    const cb = f || function () {}
    p = path.resolve(p)
    
    xfs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p
            return cb(null, made)
        }
        switch (er.code) {
            case 'ENOENT':
                mkdirP(path.dirname(p), opts, function (er, made) {
                    if (er) return cb(er, made)
                    mkdirP(p, opts, cb, made)
                })
                break

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                xfs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) return cb(er, made)
                    cb(null, made)
                })
                break
        }
    })
}

module.exports = (dir, opts) => new Promise((resolve, reject) =>
    mkdirP(dir, opts, (err, res) => err ? reject(err) : resolve(res)))
