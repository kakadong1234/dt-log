const fs = require('fs')
const log4js = require('log4js')
const moment = require('moment')
const config = require('../config')

const appenders = [{
    type: 'dateFile',
    category: 'SITE',
    filename: `${config.API_LOG_PATH}`,
    pattern: 'yyyyMMdd.log',
    alwaysIncludePattern: true,
    layout: {
        type: 'pattern',
        pattern: '%x{time} : [%c] - %m',
        tokens: {
            time() {
                return moment().format('YYYY-MM-DD HH:mm:ss')
            }
        }
    }
}]

// no prod logs also output to onsole
config.DEBUG && appenders.push({ type: 'console' })

// create the log path if it doesn't exist
fs.existsSync(config.API_LOG_PATH) || fs.mkdirSync(config.API_LOG_PATH)

log4js.configure({ appenders })
const logger = log4js.getLogger('SITE')
logger.setLevel('INFO')

module.exports = logger