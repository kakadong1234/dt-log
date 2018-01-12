/**
 * Created by zy8 on 2017/2/9.
 */
const {toolset} = require('../util');
const {USER_SYSTEM} = require('../config')
module.exports = {
    /**
     * @returns {json}
     */
    getUserCount: function*() {
        const url = `${USER_SYSTEM.PROTOCOL}://${USER_SYSTEM.HOST}${USER_SYSTEM.GET_USER_COUNT_PATH}`;
        console.log(url);
        const headersCustomerData = toolset.getTSAndToken(USER_SYSTEM.TOKEN_CHECK_PRIVATE_KEY);
        const headers = {
            'User-Agent': 'curl/7.19.7',
            'content-type': 'application/json',
            ts: headersCustomerData.ts,
            token: headersCustomerData.token
        };
        const errMsg = '获取用户总数失败';
        const returnData = JSON.parse(yield toolset.fetchPlayDataFromWebByGET(url, headers, errMsg));
        if (Number(returnData.code) !== 1) {
            throw new Error(returnData.hasOwnProperty('msg') ? returnData.msg : errMsg);
        }
        return returnData;
    },

};
