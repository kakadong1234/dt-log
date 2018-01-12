import API from '../api'

export default {

    state: {
        logList: { count: 0, rows: [] },
        logDetails: [],
        lastDetailID: null,
    },

    getters: {
        logList: state => state.logList,
        logDetails: state => state.logDetails,
        lastDetailID: state => state.lastDetailID,
    },

    mutations: {
        GET_LOG_LIST(state, { items, array }) {
            state.logList.count = items.total
            state.logList.rows = array
        },

        GET_LOG_DETAILS(state, { data, lastDetailID, toEmptyList }) {
            if (toEmptyList) state.logDetails.length = 0
            const convertedList = data.map(detail => {
                detail.created = new Date(Number(detail.created)).toLocaleString('chinese', { hour12: false })
                return detail
            })
            state.logDetails.push(...convertedList)

            state.lastDetailID = lastDetailID
        },
    },

    actions: {
        async getLogList({ commit }, {
            page = 1,
            limit = window.config.PAGE_SIZE,
            searchField,
            searchValue
        }) {
            const criteria = { page, limit }
            if (searchField && searchValue) {
                criteria[searchField] = searchValue
            }
            const res = await API.getLogList(criteria)
            commit('GET_LOG_LIST', res.data.data)
        },

        async getLogDetails({ commit }, { esn, lastDetailID, isLoadingMore }) {
            const res = (await API.getLogDetails(esn, lastDetailID)).data

            if (res && res.code !== 1) {
                return res.msg
            } else if (!isLoadingMore) {
                res.toEmptyList = true
            } else if (isLoadingMore && res.data.length < window.config.LOG_DETAILS_PAGE_SIZE) {
                commit('GET_LOG_DETAILS', res)
                return '没有更多日志详情了'
            }

            commit('GET_LOG_DETAILS', res)
        },
    }
}