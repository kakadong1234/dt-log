const mongoose = require('mongoose')

/**
 * 日志
 */
const Log = new mongoose.Schema({
    // 名称
    esn: Number,

    // 直播ID
    liveID: String,

    // 直播间ID
    roomID: String,

    // 直播名称
    liveName: String,

    // 用户名
    userID: String,

    // 推流地址
    pushUrl: String,
}, {
    strict: false,
    versionKey: false
})

Log.index({ esn: 1 }, { unique: true })
Log.plugin(require('./plugin/pagedFind'))

mongoose.model('Log', Log)