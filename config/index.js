let config

if (!config) {
    try {
        config = require('./base')
        const customConfig = require(`./${process.env.NODE_ENV || 'dev'}`)
        // const customConfig = require(`./${process.argv[2]|| 'dev'}`)
        Object.assign(config, customConfig)
    } catch (e) {
        console.log('Please make sure if config variable NODE_ENV is set.')
        process.exit()
    }
}

module.exports = config