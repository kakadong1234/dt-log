const { mongo } = require('../util')

require('./log')
require('./logDetail')
require('./dic')
require('./liveLog')
require('./static')
require('./userLog')
require('./esnLog')
require('./materialLog')


module.exports = {
    Log: mongo.model('Log'),
    LogDetail: mongo.model('LogDetail'),
    LiveLog : mongo.model('LiveLog'),
    Static: mongo.model('Static'),
    Dic: mongo.model('Dic'),
    UserLog : mongo.model('UserLog'),
    EsnLog:mongo.model('EsnLog'),
    MaterialLog:mongo.model('MaterialLog')
}