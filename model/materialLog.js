const mongoose = require('mongoose')

/**
 * 直播日志
 */
const MaterialLog = new mongoose.Schema({
    // 直播日志类型
    type: {
        type: String,
        required: [true, 'typeEmpty']
    },
    // 直播日志创建时间
    createdAt: {
        type: Number,
        required: [true, 'createdAtEmpty']
    },
    //详细数据
    data: String,

}, {
    strict: false,
    versionKey: false
});

MaterialLog.index({ createdAt: -1});
mongoose.model('MaterialLog', MaterialLog);