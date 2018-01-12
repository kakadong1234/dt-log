const fs = require('fs')
const config = require('../config')

/**
 * file descriptor cache
 * idle limit is 1min
 */
const CACHE = {
    map: new Map(),
    get(esn) {
        return this.map.get(esn)
    },
    set(esn, fd) {
        this.map.set(esn, { fd, stamp: new Date().getTime() })
    },
    delete(esn) {
        this.map.delete(esn)
    }
}

/**
 * close file and clear cache task
 * runs every 20s
 */
setInterval(() => {
    for (const [key, value] of CACHE.map.entries()) {
        if (new Date().getTime() - value.stamp > 60000) {
            fs.close(value.fd)
            CACHE.delete(key)
        }
    }
}, 20000)

module.exports = {

    /**
     * generate unique esn
     * @param {number} esn
     */
    get(esn) {
        try {
            return fs.readFileSync(`${config.NAS_PATH}${esn}.txt`, { encoding: 'utf8' }).trim()
        } catch (e) {
            return e
        }
    },

    /**
     * write info into a log file
     * @param {number} esn
     * @param {number} type
     * @param {number} created
     * @param {string} content
     */
    write({ esn, type, created, content }) {
        const path = `${config.NAS_PATH}${esn}.txt`
        let fd

        const cache = CACHE.get(esn)
        if (!cache) {
            fd = fs.openSync(path, 'a')
            CACHE.set(esn, fd)
        } else {
            fd = cache.fd
            cache.stamp = new Date().getTime()
        }

        fs.appendFileSync(fd, `${esn}\t${type}\t${created}\t${content}\r\n`)
    }
}