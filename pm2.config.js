const cpuCount = require('os').cpus().length
console.log('CPU count is ' + cpuCount)
const MAX_INS = cpuCount > 4 ? 4 : cpuCount

// process.argv[5] contains the value of --env or undefined
console.log('Environment is ' + process.argv[5])
const isProd = process.argv[5] === 'prod'

module.exports = {
    apps: [{
        name: 'elog',
        script: './app.js',
        instances: isProd ? MAX_INS : 1,
        exec_mode: 'cluster',
        out_file: './log/pm2/out.log',
        error_file: './log/pm2/error.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss ',
        combine_logs: true,
        env_prod: {
            NODE_ENV: 'prod'
        },
        env_test: {
            NODE_ENV: 'test'
        }
    },
    // {
    //     name: 'sendStaticResultJob',
    //     script: './cronJob.js',
    //     instances: 1,
    //     exec_mode: 'cluster',
    //     out_file: './log/pm2/sendStaticResultJob/out.log',
    //     error_file: './log/pm2/sendStaticResultJob/error.log',
    //     log_date_format: 'YYYY-MM-DD HH:mm:ss ',
    //     combine_logs: true,
    //     env_prod: {
    //         NODE_ENV: 'prod'
    //     },
    //     env_test: {
    //         NODE_ENV: 'test'
    //     }
    // }
]
}
