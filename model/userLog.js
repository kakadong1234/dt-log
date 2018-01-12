const mongoose = require('mongoose')

/**
 * 用户日志
 */
const UserLog = new mongoose.Schema({
    // 用户日志类型
    type: {
        type: String,
        required: [true, 'typeEmpty']
    },
    // 用户日志创建时间
    createdAt: {
        type: Number,
        required: [true, 'createAtEmpty']
    },
    //详细数据
    data: String,

}, {
    strict: false,
    versionKey: false
});

UserLog.index({ createdAt: -1});
mongoose.model('UserLog', UserLog);