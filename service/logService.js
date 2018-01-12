/**
 * Created by zy8 on 2017/6/1.
 */
const {toolset} = require('../util');
const {E_LOG_SERVICE} = require('../config')
module.exports = {

    /**
     * 发送Esn相关记录
     * @param type
     * @param createdAt
     * @param detailData
     * @returns {json}
     */
    sendEsnLog: function*(type, createdAt, detailData) {
        const url = `${E_LOG_SERVICE.PROTOCOL}://${E_LOG_SERVICE.HOST}${E_LOG_SERVICE.LOG_ESN_URL_PATH}`;
        console.log(url);
        const headersCustomerData = toolset.getTSAndToken(E_LOG_SERVICE.TOKEN_CHECK_PRIVATE_KEY);
        const headers = {
            'User-Agent': 'curl/7.19.7',
            ts: headersCustomerData.ts,
            token: headersCustomerData.token
        };
        const data = {
            type,
            createdAt,
            data: detailData
        };
        console.log(data);
        const errMsg = '发送esn相关记录失败';
        const returnData = yield toolset.fetchPlayDataFromWebByPost(url, headers, data, errMsg);
        if (Number(returnData.code) !== 1) { //TODO: 可以通过配置正确结果来通过统一数据来验证
            throw new Error(errMsg);
        }
        return returnData;
    },
}