const co = require('co')

module.exports = schema => {
    schema.statics.pagedFind = function ({
        filters = {},
        keys = '',
        limit = 20,
        page = 1,
        sort = {}
    }) {
        const thisSchema = this

        const output = {
            array: null,
            pages: {
                current: page,
                prev: 0,
                hasPrev: false,
                next: 0,
                hasNext: false,
                total: 0,
                limit: limit
            },
            items: {
                begin: ((page - 1) * limit) + 1,
                end: page * limit,
                total: 0
            }
        }

        const countResults = function (callback) {
            thisSchema.count(filters, (err, count) => {
                if (err) {
                    return callback(err)
                }
                output.items.total = count
                callback(null)
            })
        }

        const getResults = function (callback) {
            thisSchema.find(filters, keys)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort(sort)
                .lean()
                .exec((err, results) => {
                    if (err) {
                        return callback(err)
                    }

                    output.array = results.map(global.FormatMongoRes)
                    callback(null)
                })
        }

        return new Promise((resolve, reject) => {
            co(function* () {
                yield [
                    countResults,
                    getResults
                ]

                // final paging math
                const current = output.pages.current
                output.pages.total = Math.ceil(output.items.total / limit)
                output.pages.hasNext = current < output.pages.total
                output.pages.next = output.pages.hasNext ? current + 1 : (output.pages.total || 1)
                output.pages.hasPrev = current > 1
                output.pages.prev = output.pages.hasPrev ? current - 1 : 1
                if (output.items.end > output.items.total) {
                    output.items.end = output.items.total || 1
                }

                resolve(output)
            }).catch(reject)
        })
    }
}