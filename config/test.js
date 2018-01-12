module.exports = {

    DEBUG: true,

    // api
    PORT: 8400,

    // mongo
    MONGO_DB: '10.0.60.95:27017',

    // nas
    NAS_PATH: '/data/elog/test/',

    MAILER: {
        HOST: 'smtp.qq.com',
        PORT: 25,
        USER: '2407112055@qq.com',   // QQ: 469731821 PASS: 1234Abcd Available from May-5
        PASS: 'sxw000393',
        NICK_NAME: '播播侠日志统计',
        RECEIVERS: [
            'songxiaowei@ehousechina.com',
            // 'caozhumin@ehousechina.com'
        ],
    },
    E_LOG_SERVICE: {
        TOKEN_CHECK_PRIVATE_KEY: '!e10g',
        PROTOCOL: 'http',
        HOST: '10.0.60.95:8400',
        LOG_ESN_URL_PATH: '/log/esn'
    },
    USER_SYSTEM: {
        TOKEN_CHECK_PRIVATE_KEY: 'HUDONG',
        PROTOCOL: 'http',
        HOST: '10.0.60.95:8200',
        GET_USER_COUNT_PATH: '/api/userCount',
    },
}