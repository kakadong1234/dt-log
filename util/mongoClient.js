const mongoose = require('mongoose')
const { MONGO_DB, DEBUG } = require('../config')

let connStr
const options = {
    server: { poolSize: 20 }
}

// only one mongo svr for dev env
if (!DEBUG) {
    connStr = `mongodb://${MONGO_DB.PRIMARY},${MONGO_DB.SECONDARY},${MONGO_DB.ARBITER}/elog`
    options.replset = { rs_name: MONGO_DB.REPLSET }
    options.user = MONGO_DB.USER
    options.pass = MONGO_DB.PASS
} else {
    connStr = `mongodb://${MONGO_DB}/elog`
}

mongoose.Promise = global.Promise
mongoose.connect(connStr, options, function (err) {
    err && console.log(err)
})

module.exports = mongoose