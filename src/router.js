import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

//noinspection JSUnusedGlobalSymbols
export default new VueRouter({
    routes: [
        {
            path: '/',
            component: resolve => require(['./com/Log.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})