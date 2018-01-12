import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueLazyload from 'vue-lazyload'
import router from './router'
import store from './store'
import '../model/enum'
import './config'

Vue.use(ElementUI)
Vue.use(VueLazyload, {
    preLoad: 1.3,
    loading: require('./asset/img/loading.gif'),
    attempt: 1,
    listenEvents: ['scroll']
})

new Vue({
    el: '#app',
    router,
    store,
    ...App
})