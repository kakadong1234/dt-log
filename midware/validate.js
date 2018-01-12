const config = require('../config')
const { validhelper: validate } = require('../util')
module.exports = {

    /**
     * validate common params which exist in every api method
     */
    common(req, res, next) {
        // no auth files or paths
        const queryIndex = req.url.indexOf('?')
        if (config.NO_AUTH_PATHS.includes(req.url.substring(0, queryIndex)) || config.NO_AUTH_REG.test(req.url)) {
            return next()
        }

        validate.assertEmptyFromHeader(req, ['ts', 'token'])
        handleValidationResult(req, next)
    },

    /**
     * validate api: addLog
     */
    addLog(req, res, next) {
        validate.assertEmptyOne(req, 'esn', global.Message('ESNEmpty').code)
        validate.assertEmptyOne(req, 'type', global.Message('TypeEmpty').code)
        validate.assertEmptyOne(req, 'created', global.Message('CreatedEmpty').code)
        validate.assertEmptyOne(req, 'content', global.Message('ContentEmpty').code)
        handleValidationResult(req, next)
    },

    /**
     * validate api: addUserLog
     */
    addUserLog(req, res, next){
        validate.assertEmptyOne(req, 'type', global.Message('TypeEmpty').code)
        validate.assertEmptyOne(req, 'createdAt', global.Message('CreatedEmpty').code) //
        validate.assertEmptyOne(req, 'data', global.Message('DataEmpty').code) //
        if(req.body.data) { //TODO
            validate.assertUserLogData(req, 'data', global.Message('UserLogDataInvalid'))
        }
        handleValidationResult(req, next)
    },

    /**
     * validate api: addUserLog
     */
    addEsnLog(req, res, next){
        validate.assertEmptyOne(req, 'type', global.Message('TypeEmpty').code)
        validate.assertEmptyOne(req, 'createdAt', global.Message('CreatedEmpty').code) //
        //TODO: data -- JSON
        handleValidationResult(req, next)
    },

    /**
     * validate api: addLiveLog
     */
    addLiveLog(req, res, next){
        validate.assertEmptyOne(req, 'type', global.Message('TypeEmpty').code)
        validate.assertEmptyOne(req, 'createdAt', global.Message('CreatedEmpty').code)
        //TODO: data -- JSON
        handleValidationResult(req, next)
    },

    /**
     * validate api: addMaterialLog
     */
    addMaterialLog(req, res, next){
        validate.assertEmptyOne(req, 'type', global.Message('TypeEmpty').code)
        validate.assertEmptyOne(req, 'createdAt', global.Message('CreatedEmpty').code)
        //TODO: data -- JSON
        handleValidationResult(req, next)
    },
    /**
     * validate api: generateStatisticsInfo
     */
    generateStatisticsInfo(req, res, next){
        validate.assertEmptyOne(req, 'date', global.Message('DateEmpty').code)
        handleValidationResult(req, next)
    },
}

function handleValidationResult(req, next) {
    req.getValidationResult().then(result => {
        if (!result.isEmpty()) {
            const arr = result.array()[0].msg.split('@@')
            const err = new Error(arr[1])
            err.code = parseInt(arr[0])
            return next(err)
        }
        next()
    })
}