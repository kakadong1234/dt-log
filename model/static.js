const mongoose = require('mongoose')

/**
 * 直播日志
 */
const Static = new mongoose.Schema({
    //
    date: {
        type: String,
        required: [true, 'dateEmpty']
    },

    createdAt: {
        type: Number,
        default: Date.now,
    },

    updatedAt: {
        type: Number,
        default: Date.now,
    },
    //详细数据
    data: String,

}, {
    strict: false,
    versionKey: false
});

Static.index({ createdAt: -1});
mongoose.model('Static', Static);