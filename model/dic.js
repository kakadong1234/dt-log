const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * 字典
 */
const Dic = new Schema({
    // 类型
    type: String,

    // 键名
    key: String,

    // 键值
    value: String,

    // 描述
    desc: String,

    // 直播间ID
    seq: String,
}, { versionKey: false })

Dic.index({ type: 1 })
Dic.plugin(require('./plugin/pagedFind'))

mongoose.model('Dic', Dic)