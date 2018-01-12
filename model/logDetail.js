const mongoose = require('mongoose')

/**
 * 日志详情
 */
const LogDetail = new mongoose.Schema({
    // 名称
    esn: Number,

    // 消息类型
    type: Number,

    // 时间戳
    created: Number,

    // 日志内容
    content: String,
}, {
    strict: false,
    versionKey: false
})

LogDetail.index({ esn: 1, created: 1 })
LogDetail.index({ type: 1, created: 1 })
mongoose.model('LogDetail', LogDetail)