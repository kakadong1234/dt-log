import Vue from 'vue'
import Vuex from 'vuex'
import common from './common'
import log from './log'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        common,
        log,
    }
})