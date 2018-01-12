import API from '../api'

export default {

    state: {
        activeMenuIndex: '1',
        searchFields: [],
    },

    getters: {
        activeMenuIndex: state => state.activeMenuIndex,
        searchFields: state => state.searchFields,
    },

    mutations: {
        ACTIVATE_MENU(state, index) {
            state.activeMenuIndex = index
        },

        SEARCH_FIELDS(state, fields) {
            state.searchFields = fields
        },
    },

    actions: {
        async getSearchFields({ commit }) {
            const res = await API.getSearchFields()
            commit('SEARCH_FIELDS', res.data.data)
        }
    }
}