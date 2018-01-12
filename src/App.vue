<template>
    <div class="app">
        <el-menu theme="dark" mode="horizontal" class="el-menu-demo" :default-active="activeMenuIndex">
            <el-menu-item index="1">
                <router-link to="/">日志查询</router-link>
            </el-menu-item>
            <el-menu-item index="2">
                <router-link to="/crawler">字典管理</router-link>
            </el-menu-item>
            <el-submenu index="3">
                <template slot="title">其他页面</template>
                <el-menu-item index="3-1">选项1</el-menu-item>
                <el-menu-item index="3-2">选项2</el-menu-item>
                <el-menu-item index="3-3">选项3</el-menu-item>
            </el-submenu>
        </el-menu>
        <div class="main">
            <transition name="slide-fade">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    computed: mapGetters([
        'activeMenuIndex'
    ])
}
</script>

<style lang="scss">
@import './asset/reset.scss';
@import './asset/global.scss';

.app {
    margin-bottom: 12px;
    overflow: auto;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    -webkit-font-smoothing: antialiased;
    font-weight: 400
}

.el-menu {
    z-index: 100
}

.el-table .cell {
    max-height: 92px;
    line-height: normal !important
}

.main {
    height: calc(100% - 90px);
    margin: 15px
}

.is-leaf {
    .cell {
        padding: 0 !important;
        text-align: center
    }
}

.slide-fade-enter-active {
    transition: all .5s cubic-bezier(1, 0, 1, 1)
}

.slide-fade-leave-active {
    transition: all .3s ease
}

.slide-fade-enter,
.slide-fade-leave-active {
    transform: translateX(10px);
    opacity: 0
}
</style>