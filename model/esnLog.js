const mongoose = require('mongoose')

/**
 * esn日志
 */
const EsnLog = new mongoose.Schema({
    type: {
        type: String,
        required: [true, 'typeEmpty']
    },
    // 日志创建时间
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

EsnLog.index({ createdAt: -1});
mongoose.model('EsnLog', EsnLog );