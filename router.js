const Router = require('express')
const {baseCtrl, logCtrl, actionCtrl} = require('./ctrl')
const {validate} = require('./midware')
const router = Router()

/**
 * monitor
 */
router.get('/', (req, res) => {
    res.json({code: 1, msg: '服务运转正常'})
})

/**
 * page
 */
router.get('/mana', (req, res) => {
    res.render('index.html')
})

/**
 * basic
 */
router.get('/api/searchFields', baseCtrl.getSearchFields)

/**
 * log
 */
router.get('/api/logList', logCtrl.getLogList)
router.get('/api/downLog', logCtrl.downLog)
router.get('/api/log', logCtrl.getLog)
router.post('/api/log', validate.addLog, logCtrl.addLog)
router.get('/api/esn', logCtrl.getESN)

/**
 * monitor
 */
router.get('/monitor', actionCtrl.monitor);

/**
 * action statistics
 */

router.post('/log/user', validate.addUserLog, actionCtrl.addUserLog);

router.post('/log/live', validate.addLiveLog, actionCtrl.addLiveLog);

router.post('/log/esn', validate.addEsnLog, actionCtrl.addEsnLog);

router.post('/log/material', validate.addMaterialLog, actionCtrl.addMaterialLog);

/**
 * statistics
 */
router.post('/statistics', validate.generateStatisticsInfo, actionCtrl.generateStatisticsInfo);


router.get('/userCountAndLiveCount', actionCtrl.getUserCountAndLiveCount);
module.exports = router