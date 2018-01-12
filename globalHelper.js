const moment = require('moment')
const messages = require('./message')

/**
 * message related helpers
 */
global.Message = key => messages.get(key)
global.MessageErr = (key, param) => {
    let { code, msg } = global.Message(key)
    if (param) {
        msg = msg.replace('@param', param)
    }
    const err = new Error(msg)
    err.code = code
    return err
}
global.ExtractErr = body => {
    const err = new Error(body.msg)
    err.code = body.code
    return err
}

/**
 * mongo related helpers
 */
global.FormatMongoRes = item => {
    if (item.createdAt) item.createdAt = moment(item.createdAt).valueOf()
    if (item.updatedAt) item.updatedAt = moment(item.updatedAt).valueOf()

    item.id = item._id
    delete item._id
    return item
}
global.FormatToStamp = val => moment(val)
global.ExtractSchemaErr = err => {
    const field = Object.keys(err.errors)[0]
    return global.MessageErr(err.errors[field].message)
}