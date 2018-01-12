module.exports = {

    // secret
    REQUEST_TOKEN: '!e10g',
    HASH_SECRET: '!h@sh~$ECRET',

    // redis
    REDIS_HOST: '127.0.0.1',
    REDIS_PORT: 6379,

    // log
    API_LOG_PATH: `${__dirname}/../log/`,
    TASK_LOG_PATH: `${__dirname}/../log/task/`,

    // no auth stuffs
    NO_AUTH_REG: /\.log$|\.ico$/,
    NO_AUTH_PATHS: [
        '/',
        '/api/downLog',
        '/monitor'
    ],

    // http auth on logs
    HTTP_AUTH: {
        USERNAME: 'viewer',
        PASSWORD: '1234Abcd',
        ITEMS_REG: /\.log$/,
    },

    // map between msg types and db fields
    MSG_MAP: new Map([
        [1, 'liveID'],
        [2, 'liveName'],
        [3, 'roomID'],
        [4, 'userID'],
        [5, 'pushUrl'],
    ]),

    STATIC_RESULT_SEND_MAIL_TIME:{ // 每天00:10发送统计数据
        HOUR: 0,
        MINUTE: 10
    },

    LE_JU_LIVE_COUNT: 25691,
    START_STATIC_DATA: '2017-06-03'
}