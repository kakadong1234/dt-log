const co = require('co')
const { Log, LogDetail, Dic } = require('../model')
const { MSG_MAP } = require('../config')
const { logService } = require('../service')
const nonCriteriaFields = ['clientHost', 'limit', 'page', 'sort']

module.exports = {

    /**
     * get searched log list
     */
    getLogList(req, res, next) {
        co(function* () {
            const options = {
                limit: req.query.limit ? parseInt(req.query.limit, null) : 20,
                page: req.query.page ? parseInt(req.query.page, null) : 1,
                sort: req.query.sort ? { [req.query.sort]: -1 } : { esn: -1 },
                keys: 'id esn'
            }

            // extract criteria from query string
            const criteria = req.query
            nonCriteriaFields.forEach(field => delete criteria[field])
            Object.keys(criteria).forEach(key => {
                if (key === 'esn') return
                criteria[key] = new RegExp(criteria[key])
            })
            options.filters = criteria

            // search from db
            const logs = yield Log.pagedFind(options)

            res.json({
                code: 1,
                data: logs,
                msg: '执行成功'
            })
        }).catch(next)
    },

    /**
     * download log without auth
     */
    downLog(req, res, next) {
        co(function* () {
            const { esn } = req.query
            const details = yield LogDetail.find({ esn }, { _id: 0 })

            res.setHeader('Content-Type', 'octet-stream')
            res.setHeader('Content-Disposition', `attachment; filename="${esn}.txt"`)
            res.setHeader('Cache-Control', 'no-cache')
            details.forEach(detail => {
                res.write(`${esn}\t${detail.type}\t${detail.created}\t${detail.content}\r\n`)
                res.flush()
            })

            res.end()
        }).catch(next)
    },

    getLog(req, res, next) {
        co(function* () {
            const { esn, lastDetailID = '000000000000000000000000' } = req.query

            const details = yield LogDetail.find({
                esn,
                _id: { $gt: lastDetailID },
            }, {
                esn: 0
            }).limit(100)

            res.json({
                code: 1,
                data: details.map(item => {
                    delete item._id
                    return item
                }),
                lastDetailID: details.length ? details[details.length - 1]._id : null,
                msg: '执行成功'
            })
        }).catch(next)
    },

    /**
     * append log
     */
    addLog(req, res, next) {
        co(function* () {
            // replace \r\n in content to space
            req.body.content = req.body.content.replace(/[\r\n]/g, ' ')

            const { esn, type, content } = req.body

            // write to log collection
            let needToSave = false
            let log = yield Log.findOne({ esn })
            if (!log || type < 100) {
                needToSave = true
            }
            if (!log) {
                log = new Log({ esn })
            }
            // type < 99: predefined column, get column name directly from config
            // type = 99: custom column, parse column name and its value from content
            // all columns can have multiple values joined with semicolons, join the new value if it doesn't exist yet
            if (type < 99) {
                const column = MSG_MAP.get(Number(type))
                const oldValue = log[column]
                if (!oldValue) {
                    log[column] = content
                } else if (!oldValue.split('; ').includes(content)) {
                    log[column] = `${oldValue}; ${content}`
                }
            } else if (type == 99) {
                const colonIndex = content.indexOf(':')
                if (colonIndex == -1) {
                    return next(global.MessageErr('MsgContentInvalid'))
                }
                const column = content.substr(0, colonIndex)
                const oldValue = log.toJSON()[column]
                const value = content.substr(colonIndex + 1)
                if (!oldValue) {
                    log.set(column, value)
                } else if (!oldValue.split('; ').includes(value)) {
                    log.set(column, `${oldValue}; ${value}`)
                }
            }
            if (needToSave) {
                try {
                    yield log.save()
                } catch (e) {
                    // suppress esn duplication err: mongo err 11000
                    if (e.code !== 11000) {
                        return next(e)
                    }
                }
            }

            // write to log detail collection
            if ([99, 2000].includes(type)) {
                req.body.content = `"${req.body.content}"`
            }
            const logDetail = new LogDetail(req.body)
            yield logDetail.save()

            res.json({
                code: 1,
                msg: '执行成功'
            })
        }).catch(next)
    },

    /**
     * generate unique ESN
     */
    getESN(req, res, next) {
        co(function* () {
            let newESN = 1
            let esn = yield Dic.findOne({
                type: 'config',
                key: 'ESN_CURRENT'
            })
            if (esn) {
                newESN = Number(esn.value) + 1
            } else {
                esn = new Dic({
                    type: 'config',
                    key: 'ESN_CURRENT'
                })
            }
            esn.value = newESN
            esn.save()

            res.json({
                code: 1,
                data: { esn: newESN },
                msg: '执行成功'
            })

            // 创建esn打点
            const createdAt = Date.now()
            yield logService.sendEsnLog('createEsn', createdAt, {
                esn: newESN,
                createdAt: createdAt
            })
        }).catch(next)
    },
}