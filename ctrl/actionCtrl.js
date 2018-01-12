/**
 * Created by zy8 on 2017/5/18.
 */
const co = require('co')
const iconv = require('iconv-lite');
const _ = require('underscore');
const {LiveLog, UserLog, LogDetail, Static, EsnLog, MaterialLog} = require('../model')
const {MAILER, STATIC_RESULT_SEND_MAIL_TIME, START_STATIC_DATA, LE_JU_LIVE_COUNT} = require('../config');
const {getYesterday, getDay} = require('../util');
const {mailer} = require('../util');
const {userService} = require('../service')
module.exports = {
    /*
     * 获取用户总数和直播总数
     * */
    getUserCountAndLiveCount(req, res, next) {
        co(function *() {
            // 获取总用户数
            const userCountData = yield userService.getUserCount();
            const userCount = userCountData.data.userCount;
            //易-Live直播总数
            const createAtRange = getCreateAtRange(getDay(new Date()));
            console.log(createAtRange);
            //当天的eLiveLiveCount
            const {eLiveLiveCount} = yield generateStaticELiveLiveData({
                created: {
                    $gte: createAtRange.min,
                    $lt: createAtRange.max
                }
            });
            console.log(eLiveLiveCount);
            //之前的eliveLiveCount
            const allDateList = getAllDateList(START_STATIC_DATA, getYesterday(new Date()))
            console.log(allDateList);
            const staticAllLiveCountList = yield Static.find({date: {$in: allDateList}});
            //liveCount = 历史数据 + 之前的eliveLiveCount + 当天的eLiveLiveCount
            const liveCount = LE_JU_LIVE_COUNT
                + _.reduceRight(_.map(staticAllLiveCountList, function (liveData) {
                    return JSON.parse(liveData.data).eLive.eLiveLiveCount;
                }), function (preLiveCount, currentLiveCount) {
                    return currentLiveCount + preLiveCount;
                })
                + eLiveLiveCount;
            res.json({
                code: 1,
                msg: '服务运转正常',
                data: {
                    userCount,
                    liveCount
                }
            })
        }).catch(error);
        function error(err) {
            console.log(err.message);
            next(err);
        }
    },
    /**
     *  monitor
     */
    monitor(req, res, next) {
        co(function *() {
            const yesterday = getYesterday(new Date());
            const staticData = yield Static.findOne({date: yesterday});
            console.log(staticData);
            const now = Date.now();
            const todayTimeStamp = new Date(`${getDay(new Date())} '00:00:00`).getTime();
            const time_different = (STATIC_RESULT_SEND_MAIL_TIME.HOUR * 3600 + STATIC_RESULT_SEND_MAIL_TIME.MINUTE * 60) * 1000;
            console.log(`now:${now},todayTimeStamp:${todayTimeStamp}, time_different:${time_different}`);
            if (!staticData && now - todayTimeStamp > time_different) {
                return res.json({code: -1, msg: 'error for send static mail'})
            }
            res.json({code: 1, msg: '服务运转正常'})
        }).catch(error);
        function error(err) {
            console.log(err.message);
            next(err);
        }
    },
    /**
     * addUserLog
     */
    addUserLog(req, res, next) {
        co(function *() {
            //将数据写入db
            const {type, createdAt, data} = req.body;
            if (data) {
                req.body.data = JSON.stringify(data);
            }
            const userLog = new UserLog(req.body);
            yield userLog.save();
            res.json({
                code: 1,
                msg: '执行成功'
            })
        }).catch(error);
        function error(err) {
            console.log(err.message);
            next(err);
        }
    },
    /**
     * addMaterialLog
     */
    addMaterialLog(req, res, next) {
        co(function *() {
            //将数据写入db
            const {type, createdAt, data} = req.body;
            if (data) {
                req.body.data = JSON.stringify(data);
            }
            const materialLog = new MaterialLog(req.body);
            yield materialLog.save();
            res.json({
                code: 1,
                msg: '执行成功'
            })
        }).catch(error);
        function error(err) {
            console.log(err.message);
            next(err);
        }
    },
    /**
     * addLiveLog
     */
    addLiveLog(req, res, next) {
        co(function *() {
            //将数据写入db
            const {type, createdAt, data} = req.body;
            if (data) {
                req.body.data = JSON.stringify(data);
            }
            const liveLog = new LiveLog(req.body);
            yield liveLog.save();
            res.json({
                code: 1,
                msg: '执行成功'
            })
        }).catch(error);
        function error(err) {
            console.log(err.message);
            next(err);
        }
    },
    /**
     * addEsnLog
     */
    addEsnLog(req, res, next) {
        co(function *() {
            //将数据写入db
            const {type, createdAt, data} = req.body;
            if (data) {
                req.body.data = JSON.stringify(data);
            }
            const esnLog = new EsnLog(req.body);
            yield esnLog.save();
            res.json({
                code: 1,
                msg: '执行成功'
            })
        }).catch(error);
        function error(err) {
            console.log(err.message);
            next(err);
        }
    },

    /**
     * getStatisticsInfo
     */
    // getStatisticsInfo(req, res, next) {
    //     co(function *() {
    //         const unit = req.query.unit ?req.query.unit: 'd' ; // 1 d 表示天， w表示周,  m表示月， y表示年 //默认为d
    //         const goal = req.query.goal ?req.query.goal: moment().format('YYYYMMDD HH:mm:ss');
    //         //1 从文件日志中得到实时的数据
    //         //1 注册用户数
    //         //2 用户登录数
    //         //2 直播数
    //         //3 观看数？ TODO:先不做
    //         //4 easyLive活跃数
    //         //5 easyLive直播数
    //         //2 得到要查询的具体日期数组
    //
    //         //3 从db中获取历史统计数据
    //
    //         //4 相加
    //
    //         res.json({
    //             code: 1,
    //             msg: '执行成功',
    //             // data:{
    //             //     unit,
    //             //     goal
    //             // }
    //         })
    //     }).catch(error);
    //     function error(err) {
    //         console.log(err.message);
    //         next(err);
    //     }
    // },

    /**
     * generateAndSendStatisticsInfo
     * 生成date的统计结果，并发送邮件
     */
    generateStatisticsInfo(req, res, next) {
        co(function *() {
            const date = req.body.date; //must have
            const isForce = req.body.isForce ? req.body.isForce : false; // 默认不重新生成数据
            const isSendMail = req.body.isSendMail ? req.body.isSendMail : false; // 默认不发送邮件
            if (!isForce) {
                //不强制重新生成数据
                //1 从db做获取统计数据
                const staticData = yield Static.findOne({date: date});
                console.log(staticData);
                if (staticData) {
                    //有数据 -- 返回
                    return res.json(yield returnStaticData(staticData, isSendMail));
                }
            }
            //强制重新生成数据或者没有staticData
            const updateData = yield updateStaticData(date);
            // 3 返回
            res.json(yield returnStaticData(updateData, isSendMail));
        }).catch(error);
        function error(err) {
            console.log(err.message);
            next(err);
        }
    },

    /**
     * cronStatic
     */
    cronStatic(date){
        co(function *() {
            const updateData = yield updateStaticData(date);
            yield returnStaticData(updateData, true);
        }).catch(error);
        function error(err) {
            console.log(err.message);
            next(err);
        }
    }
};


/**
 *
 * @param date
 * @returns {json}
 */
const updateStaticData = function*(date) {
    // 1 生成数据
    const staticInfo = yield generateStaticData(date);
    console.log(staticInfo);
    const updateData = {
        date: date,
        data: JSON.stringify(staticInfo)
    };
    console.log(updateData);
    // // 2 将数据存入db
    yield Static.update({date: date}, updateData, {upsert: true});
    return updateData;
};

/**
 *
 * @param date
 * @returns {json}
 */
const generateStaticData = function*(date) {
    const createAtRange = getCreateAtRange(date);
    const query = {createdAt: {$gte: createAtRange.min, $lt: createAtRange.max}};
    // 用户相关
    const staticUserInfo = yield generateStaticUserInfo(query);
    // 直播相关
    const staticLiveInfo = yield generateStaticLiveInfo(query);
    // 素材相关
    const staticMaterialInfo = yield generateStaticMaterialInfo(query);
    //eLive 相关
    const eLiveStartUpCount = yield generateStaticELiveStartUpCount(query);
    const {eLiveLiveCount, liveUrlList} = yield generateStaticELiveLiveData({
        created: {
            $gte: createAtRange.min,
            $lt: createAtRange.max
        }
    });
    return {
        user: staticUserInfo,
        live: staticLiveInfo,
        material: staticMaterialInfo,
        eLive: {
            eLiveStartUpCount,
            eLiveLiveCount
        },
        liveUrlList
    }
};


/**
 * 用户相关
 * @param query
 * @returns {json}
 */
const generateStaticUserInfo = function*(query) {
    // console.log(query);
    const userList = yield UserLog.find(query);
    // console.log(userList);
    const registerUserList = _.filter(userList, function (user) {
        return user.type === 'register'
    });
    const registerCount = registerUserList.length;
    const loginUserList = _.filter(userList, function (user) {
        return user.type === 'login' && user.data;
    });
    const uniqueLoginUserList = _.uniq(loginUserList, false, function (user) {
        try {
            return JSON.parse(user.data).username
        }
        catch (e) {
            console.log(user);
        }
    })
    const loginCount = uniqueLoginUserList.length;
    console.log('registerCount:' + registerCount + ', loginCount:' + loginCount);
    return {
        registerCount,
        loginCount
    };
};

/**
 * 直播相关
 * @param query
 * @returns {json}
 */
const generateStaticLiveInfo = function*(query) {
    const liveList = yield LiveLog.find(query);
    // console.log(liveList);
    let createLiveCount = 0;
    liveList.forEach(function (live) {
        if (live.type === 'createLive') {
            createLiveCount++;
        }
    });
    console.log('createLiveCount:' + createLiveCount);
    return {
        createLiveCount
    };
};

/**
 * 素材相关
 * @param query
 * @returns {json}
 */
const generateStaticMaterialInfo = function*(query) {
    const materialList = yield MaterialLog.find(query);
    console.log(materialList);
    let createMaterialCount = 0;
    materialList.forEach(function (material) {
        if (material.type === 'createMaterial') {
            createMaterialCount++;
        }
    });
    console.log('createMaterialCount:' + createMaterialCount);
    return {
        createMaterialCount
    };
};
/**
 * eLive 相关
 * @param query
 * @returns {json}
 */
const generateStaticELiveStartUpCount = function*(query) {
    const esnList = yield EsnLog.find(query);
    console.log(esnList);
    let createESNCount = 0;
    esnList.forEach(function (esn) {
        if (esn.type === 'createEsn') {
            createESNCount++;
        }
    });
    console.log('createESNCount:' + createESNCount);
    return createESNCount;
};

/**
 * eLive 相关
 * @param query
 * @returns {json}
 */
const generateStaticELiveLiveData = function*(query) {
    query.type = 5;
    let eLiveList = yield LogDetail.find(query);
    eLiveList = _.uniq(eLiveList, false, function (eLive) {
        return `${eLive.esn}_${eLive.content}`;
    });
    eLiveList = _.map(eLiveList, function (eLive) {
        return {
            esn: eLive.esn,
            pushUrl: eLive.content
        }
    });
    // console.log(`-------------: ${eLiveList}`);
    const eLiveLiveCount = eLiveList.length;
    console.log('eLiveLiveCount:' + eLiveLiveCount);
    return {
        eLiveLiveCount,
        liveUrlList: eLiveList
    };
};
/**
 *
 * @param dateString
 * @returns {json}
 */
const getCreateAtRange = function (dateString) {
    const minTimestamp = new Date(dateString + ' ' + '00:00:00').getTime();
    const maxTimestamp = new Date(dateString + ' ' + '24:00:00').getTime();
    return {
        min: minTimestamp,
        max: maxTimestamp
    }
};

/**
 *
 * @param data
 * @returns {json}
 */
const getMailData = function (data) {
    let liveUrlListHTMLString = `<table border="1">
  <caption>${data.date}易live直播列表数据统计</caption>
  <tr>
    <th>序号</th>
    <th>esn号</th>
	  <th>推流地址</th>
  </tr>`;
    let csvContent = `播播侠PC端数据统计\n日期,注册用户数,登录用户数,直播数\n${data.date},${data.user.registerCount},${data.user.loginCount},${data.live.createLiveCount}\n\n
        易live端数据统计\n日期,app启动数,直播数\n ${data.date},${data.eLive.eLiveStartUpCount},${data.eLive.eLiveLiveCount}\n\n
        ${data.date}易live直播列表数据统计\n序号,esn号,推流地址\n `;
    data.liveUrlList.forEach(function (liveData, index) {
        liveUrlListHTMLString = `${liveUrlListHTMLString}
                                    <tr>
                                        <td>${index + 1}</td>
                                          <td>${liveData.esn}</td>
                                        <td>${liveData.pushUrl}</td>
                                     </tr>`;
        csvContent = `${csvContent}${index + 1},${liveData.esn},${liveData.pushUrl}\n`
    });
    liveUrlListHTMLString = `${liveUrlListHTMLString}</table>`;
    csvContent = `${csvContent}\n`;
    const buffer = new Buffer(csvContent);
    //需要转换字符集
    const attachmentCsvContent = iconv.encode(buffer, 'gb2312');
    const entireBody = `<!DOCTYPE html>
<html>
<head> 
<meta charset="utf-8"> 
<title>table</title> 
</head>
<body>
<table border="1">
  <caption>播播侠PC端数据统计</caption>
  <tr>
    <th>日期</th>
     <th>总用户数</th>
	 <th>新增用户数</th>
    <th>登录用户数</th>
	 <th>新增直播数</th>
	  <th>新增素材数</th>
  </tr>
  <tr>
    <td>${data.date}</td>
       <td>${data.user.userCount}</td>
	  <td>${data.user.registerCount}</td>
    <td>${data.user.loginCount}</td>
	   <td>${data.live.createLiveCount}</td>
	   <td>${data.material.createMaterialCount}</td>
  </tr>
</table>	
<table border="1">
  <caption>易live端数据统计</caption>
  <tr>
    <th>日期</th>
	  <th>app启动数</th>
    <th>直播数</th>
  </tr>
  <tr>
    <td>${data.date}</td>
	  <td>${data.eLive.eLiveStartUpCount}</td>
    <td>${data.eLive.eLiveLiveCount}</td>
  </tr>
</table>
${liveUrlListHTMLString}
</body>
</html>`;
    return {
        attachmentCsvContent,
        entireBody,
    }
};

/**
 *
 * @param staicData
 * @param isSendMail
 * @returns {json}
 */
const returnStaticData = function*(staicData, isSendMail) {
    const data = JSON.parse(staicData.data);
    data.date = staicData.date;
    // 获取总用户数
    const userCountData = yield userService.getUserCount();
    data.user.userCount = userCountData.data.userCount;
    if (isSendMail) {
        console.log('sendEmail');
        const mailData = getMailData(data);
        const mailOptions = {
            from: `"${MAILER.NICK_NAME}" <${MAILER.USER}>`,
            to: MAILER.RECEIVERS.join(','),
            subject: `[${data.date}]播播侠数据统计报告`,
            html: mailData.entireBody,
            attachments: [
                {
                    filename: '播播侠数据统计' + data.date + '.csv',
                    content: mailData.attachmentCsvContent
                }
            ]
        };
        mailer.send(mailOptions);
    }
    return {
        code: 1,
        msg: '执行成功',
        data: data
    }
};

const getAllDateList = function (startData, endDate) {
    let endDateTimestamp = new Date(endDate + ' ' + '00:00:00').getTime();
    const startDateTimestamp = new Date(startData + ' ' + '00:00:00').getTime();
    const allDateList = [];
    while (endDateTimestamp >= startDateTimestamp) {
        endDate = getDay(new Date(endDateTimestamp));
        allDateList.push(endDate);
        endDateTimestamp = endDateTimestamp - 24 * 3600 * 1000;
    }
    return allDateList;
}