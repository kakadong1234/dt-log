const crypto = require('crypto')
const request = require('request')

module.exports = {

    getYesterday(date){
        const timeStamp = date.setDate(date.getDate() - 1);
        console.log(timeStamp);
        const allYesterDay = new Date(timeStamp);
        return `${allYesterDay.getFullYear()}-${allYesterDay.getMonth() + 1 < 10 ? '0' + (allYesterDay.getMonth() + 1) : allYesterDay.getMonth() + 1}-${allYesterDay.getDate() < 10 ? '0' + allYesterDay.getDate() : allYesterDay.getDate()}`
    },

    getDay(day){
        return `${day.getFullYear()}-${day.getMonth() + 1 < 10 ? '0' + (day.getMonth() + 1) : day.getMonth() + 1}-${day.getDate() < 10 ? '0' + day.getDate() : day.getDate()}`
    },

    /**
     * 生成接口验证所需ts和token
     * @param privateKey
     * @returns {*}
     */
    getTSAndToken(privateKey) {
        const ts = Date.now()
        const token = this.hash(`${this.hash(privateKey)}${ts}`)
        return {ts, token}
    },

    /**
     * md5 hash
     * @param   {string} target - original string
     * @returns {string}
     */
    hash(target) {
        const md5 = crypto.createHash('md5')
        md5.update(target)
        return md5.digest('hex')
    },

    /**
     * hmac sign
     * @param   {string} target - original string
     * @param   {string} key - encryption secret
     * @returns {string}
     */
    sign(target, key) {
        const hmac = crypto.createHmac('sha1', key)
        return hmac.update(target).digest().toString('base64')
    },

    /**
     * Post 请求方法
     * @param url request url
     * @param headers  request headers
     *  @param data post的数据
     * @param outPutErrMsg http 请求错误时对于的错误返回
     * @param retryCount http重试次数
     * @returns string
     */
    fetchPlayDataFromWebByPost(url, headers, data, outPutErrMsg, retryCount) {
        const startTimeInterval = Date.now()
        return new Promise((resolve, reject) => {
            const options = {
                url: url,
                method: 'POST',
                headers: headers,
                json: true,
                body: data
            };
            request(options, callback)
            function callback(error, response, data) {
                console.log('err is ' + error);
                console.log('response is ' + response);
                console.log('body is ' + data);
                if (error || response.statusCode !== 200) {
                    const errMsg = response || 'response is null';
                    console.log(errMsg);
                    console.log('request --> ' + url + ', cost: ' + (Date.now() - startTimeInterval));
                    return reject(new Error(outPutErrMsg))
                }
                console.log('request --> ' + url + ', cost: ' + (Date.now() - startTimeInterval));
                return resolve(data)
            }
        })

    },

    /**
     * Get 请求方法
     * @param url request url
     * @param headers  request headers
     * @param outPutErrMsg http 请求错误时对于的错误返回
     * @param retryCount http重试次数
     * @returns string
     */
    fetchPlayDataFromWebByGET(url, headers, outPutErrMsg, retryCount) { // TODO:
        const startTimeInterval = Date.now()
        return new Promise((resolve, reject) => {
            request.get({
                url: url,
                headers: headers
            }, function (error, response, body) {
                console.log('err is ' + error)
                console.log('response is ' + response)
                console.log('body is ' + body)
                if (error || response.statusCode !== 200) {
                    const errMsg = response || 'response is null'
                    console.log(errMsg)
                    console.log('request --> ' + url + ', cost: ' + (Date.now() - startTimeInterval))
                    return reject(new Error(outPutErrMsg))
                }
                console.log('request --> ' + url + ', cost: ' + (Date.now() - startTimeInterval))
                return resolve(body)
            })
        })
    },
}