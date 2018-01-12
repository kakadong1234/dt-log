const { logger } = require('../util')
const config = require('../config')

logger.info(`【 Service starts on http://localhost:${config.PORT} 】\n`)

module.exports = (req, res, next) => {
    if (isNoLogFile(req.url)) return next()

    const start = new Date()

    logger.info('Start ', req.method, req.entireUrl)
    if (req.method !== 'GET') {
        logger.info('Data  ', JSON.stringify(req.body))
    }

    // add a logging aspect to the primary res.json function
    const original = res.json
    res.json = function (json) {
        logger.info('Resp  ', JSON.stringify(json))
        return original.call(this, json)
    }

    res.on('finish', () => {
        const duration = new Date() - start
        logger.info('Done  ', res.statusCode, `(${duration}ms)\n`)
    })

    next()
}

/**
 * no log files or paths
 * @param   {string} url - req url
 * @returns {boolean}
 */
function isNoLogFile(url) {
    return config.NO_AUTH_REG.test(url)
}