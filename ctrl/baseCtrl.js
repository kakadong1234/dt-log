const { MSG_MAP } = require('../config')

module.exports = {

    /**
     * get frequently used search fields
     */
    getSearchFields(req, res, next) {
        const fields = ['esn', ...MSG_MAP.values()]

        res.json({
            code: 1,
            data: fields,
            msg: '执行成功'
        })
    },
}