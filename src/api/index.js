import axios from 'axios'
import hash from 'blueimp-md5'

export default {

    getSearchFields() {
        return GET('/api/searchFields')
    },

    getLogList(criteria) {
        return GET('/api/logList', criteria)
    },

    getLogDetails(esn, lastDetailID) {
        return GET('/api/log', { esn, lastDetailID })
    },

    redirect: REDIRECT
}

/**
 * request methods encapsulation
 */
axios.interceptors.request.use(config => {
    const ts = new Date().getTime().toString()
    const token = hash('717228ceec0f2817ec692a94b9533ed2' + ts)
    config.headers.ts = ts
    config.headers.token = token
    return config
})
function GET(url, params) {
    return axios.get(getCommonUrl(url), { params })
}
function POST(url, body) {
    return axios.post(getCommonUrl(url), body)
}
function PUT(url, body) {
    return axios.put(getCommonUrl(url), body)
}
function DELETE(url, body) {
    return axios.delete(getCommonUrl(url), { data: body })
}
function REDIRECT(url) {
    location.href = url
}

/**
 * helpers
 */
function getCommonUrl(url) {
    return `${window.config.API_HOST}${url}?clientHost=${location.hostname}`
}