module.exports = {

    DEBUG: false,

    // api
    PORT: 8400,

    // mongo
    MONGO_DB: {
        PRIMARY: '10.165.99.41:27017',      // mongo --host 120.26.65.169 -u liuxiaozhong -p 3GcvCBDmtQ9FTH83Z8AN --authenticationDatabase elog
        SECONDARY: '10.117.15.219:27017',   // mongo --host 120.55.182.237 -u liuxiaozhong -p 3GcvCBDmtQ9FTH83Z8AN --authenticationDatabase elog
        ARBITER: '10.51.8.119:27017',
        REPLSET: 'repset',
        USER: 'elog',
        PASS: '3GcvCBDmtQ9FTH83Z8AN',
    },

    // nas
    NAS_PATH: '/data/elog/',

    MAILER: {
        HOST: 'smtp.qq.com',
        PORT: 25,
        USER: '2407112055@qq.com',
        PASS: 'sxw000393',
        NICK_NAME: '播播侠日志统计',
        RECEIVERS: [
            'songxiaowei@ehousechina.com',
            'heliang@ehousechina.com',
            'liulvhua@ehousechina.com',
            'makangwei@ehousechina.com',
            'sunjiawei@ehousechina.com',
        ],
    },
    E_LOG_SERVICE: {
        TOKEN_CHECK_PRIVATE_KEY: '!e10g',
        PROTOCOL: 'https',
        HOST: 'elog-live.ejudata.com',
        LOG_ESN_URL_PATH: '/log/esn'
    },
    USER_SYSTEM: {
        TOKEN_CHECK_PRIVATE_KEY: 'HUDONG',
        PROTOCOL: 'https',
        HOST: 'user-system-live.ejudata.com',
        GET_USER_COUNT_PATH: '/api/userCount',
    },
}