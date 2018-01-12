/**
 * Created by zy8 on 2017/5/26.
 */
const fs = require('mz/fs');
const co = require('co');
const schedule = require('node-schedule');
const moment = require('moment');
const {actionCtrl} = require('./ctrl');
const {Dic} = require('./model')
const {STATIC_RESULT_SEND_MAIL_TIME} = require('./config');
const {getYesterday} = require('./util');

//   *   *   *   *   *   *
//  秒   分  时  天  月  星期
//每天00:10发送
const cycle = `${STATIC_RESULT_SEND_MAIL_TIME.MINUTE} ${STATIC_RESULT_SEND_MAIL_TIME.HOUR} * * *`;
console.log(cycle);
const ipFilePath = 'ip.log';

const main = function () {
    co(function *() {
        const ipData = yield getIPFromDB(); //唯一性资源,只能有一台机器启动,防止多台机器启动 -- store ip
        const machineIp = getClientIP();
        console.log(' -- machine ip is ' + machineIp);
        if (!ipData) {
            console.log('-- start');
            yield startScheduleJob(cycle);
            yield setIPToDB(machineIp);
        }
        else {
            console.log('-- restart');
            if (ipData.value === machineIp) { //没有存储ip(第一次启动)，获取ip === 本机ip(相同机器重启)
                yield startScheduleJob(cycle);
                yield setIPToDB(machineIp);
            }
            else {
                console.log(' -- can not start ScheduleJob: ip in db is ' + ipData.value + ', machine ip is ' + machineIp);
            }
        }
    }).catch(error);
    function error(err) {
        console.log(err.message);
    }
};

const deleteIp = function () {
    co(function *() {
        yield delIp();
        const ipData = yield getIPFromDB(); //唯一性资源,只能有一台机器启动,防止多台机器启动 -- store ip
        if (!ipData) {
            console.log('-- del success');
        }
    }).catch(error);
    function error(err) {
        console.log(err.message);
    }
};

// 必须用db,不能用文件
const getIPFromDB = function *() {
    return yield Dic.findOne({key: 'ip'});
};

const setIPToDB = function *(machineIp) {
    const dic = new Dic({key: 'ip', value: machineIp});
    yield dic.save();
};

const delIp =  function *() {
    return yield Dic.remove({key: 'ip'});
};
const startScheduleJob = function *(cycle) {
    console.log(`start schedule job, cycle: ` + cycle);
    schedule.scheduleJob(cycle, function () {
        console.log(`开始数据统计:${new Date()}`);
        const yDate = getYesterday(new Date());
        console.log(yDate);
        actionCtrl.cronStatic(yDate);
        //TODO: 周报
        co(function *() {
        }).catch(error);
        function error(err) {
            console.log(err.message);
            next(err);
        }
    });
}
const getClientIP = function () {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
};
main();
//deleteIp();


// 每天00:10 统计数据并发送邮件
// schedule.scheduleJob('10 0 * * *', function(){
//     console.log('The answer to life, the universe, and everything!');
// });

// const getYesterday = function(date){
//     const timeStamp = date.setDate(date.getDate() - 1);
//     console.log(timeStamp);
//     const allYesterDay = new Date(timeStamp);
//     return `${allYesterDay.getFullYear()}-${allYesterDay.getMonth()+1 < 10 ? '0'+(allYesterDay.getMonth()+1) : allYesterDay.getMonth()+1}-${allYesterDay.getDate()}`
// };

// console.log('The answer to life, the universe, and everything!');
// const yDate = getYesterday(new Date());
// console.log(yDate);
// actionCtrl.cronStatic(yDate);

// const dateString = '2016-01-01';
// const date = new Date(dateString);
// console.log(date);
// console.log(date.getTime());
// const date = new Date();
// console.log(getYesterday(date));