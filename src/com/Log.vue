<script>
import { mapGetters, mapActions } from 'vuex'
const isSafari = navigator.userAgent.indexOf('Safari') > -1 &&
                navigator.userAgent.indexOf('Chrome') === -1
const scrollTopSource = isSafari ? document.body : document.documentElement

export default {
    data() {
        return {
            searchField: null,
            searchValue: null,
            debounceTimer: null,
            page: 1,
            limit: window.config.LOG_PAGE_SIZE,
            currentESN: null,
            hasMoreLogDetails: true,
            loading: false
        }
    },
    computed: mapGetters([
        'searchFields',
        'logList',
        'logDetails',
        'lastDetailID'
    ]),
    methods: {
        ...mapActions([
            'getSearchFields',
            'getLogList',
            'getLogDetails'
        ]),
        querySearch(query, cb) {
            cb(this.searchFields.map(item => ({ value: item })))
        },
        debounceSearch() {
            clearTimeout(this.debounceTimer)

            // search when both field and value are non-empty or empty
            if ((!this.searchField && this.searchValue) ||
                (this.searchField && !this.searchValue)) {
                return
            }

            this.debounceTimer = setTimeout(() => {
                this.getLogList(this)
            }, 500)
        },
        search() {
            if (!this.searchField || !this.searchValue) {
                return this.$message({ message: 'KEY 和 VALUE 不能为空', type: 'warning' })
            }
            this.getLogList(this)
        },
        sizeChange(val) {
            this.limit = val
            this.page = 1
            this.getLogList(this)
        },
        currentChange(val) {
            this.page = val
            this.getLogList(this)
            this.logDetails.length = 0
        },
        down(esn) {
            window.open(`${window.config.API_HOST}/api/downLog?esn=${esn}`, '_blank')
        },
        async view(esn) {
            this.currentESN = esn
            this.loading = true
            this.hasMoreLogDetails = true
            this.lastDetailID = null
            const message = await this.getLogDetails({ esn })
            if (message) {
                this.$message({ message, type: 'warning' })
            }
            this.loading = false

            scrollTop()
            const loader = document.body.querySelector('.loader')
            loader.style.height = '100px'
            loader.style.opacity = 0
        },
        getTypeDesc(type) {
            const res = window.Enum.getEnumByValue(window.Enum.MsgType, type)
            if (res) return res.text
            return '消息类型还未定义'
        }
    },
    beforeMount() {
        this.$store.commit('ACTIVATE_MENU', '1')
        this.getLogList(this)
        this.getSearchFields()
    },
    async mounted() {
        /**
         * load more log details when page end is reached
         */
        const body = document.body
        const loader = body.querySelector('.loader')
        let bottomReached = false
        document.onscroll = async () => {
            const hiddenHeight = body.scrollHeight - body.offsetHeight
            const bottomDistance = hiddenHeight - scrollTopSource.scrollTop

            if (!this.hasMoreLogDetails) return
            if (this.logDetails.length < window.config.LOG_DETAILS_PAGE_SIZE) return

            if (!bottomReached && bottomDistance < 200) {
                bottomReached = true
                loader.style.opacity = 1

                const message = await this.getLogDetails({ esn: this.currentESN, lastDetailID: this.lastDetailID, isLoadingMore: true })
                if (message) {
                    this.$message({ message, type: 'warning' })
                    this.hasMoreLogDetails = false
                    loader.style.height = '0px'
                }
            } else if (bottomReached && bottomDistance >= 200) {
                bottomReached = false
                loader.style.opacity = 0
            }
        }
    },
    render() {
        return <div class='log-page' v-loading={this.loading} element-loading-text='日志加载中'>
            <div class='search'>
                <el-input v-model={this.searchValue} onInput={this.debounceSearch} placeholder='输入VALUE'>
                    <el-autocomplete slot='prepend' v-model={this.searchField} fetch-suggestions={this.querySearch} input={this.debounceSearch} placeholder='选择或输入KEY'/>
                    <el-button slot='append' icon='search' onClick={this.search}>搜索</el-button>
                </el-input>
            </div>
            <el-pagination size-change={this.sizeChange}
                onCurrent-change={this.currentChange}
                current-page={this.page}
                total={this.logList.count}
                page-size={this.limit}
                page-sizes={[20, 50, 100, 200]}
                layout='total, sizes, prev, pager, next, jumper'/>

            <div class='content'>
                <aside>
                    <el-table data={this.logList.rows} highlight-current-row stripe border>
                        <el-table-column prop='esn' label='ESN'></el-table-column>
                        <el-table-column label='操作' width='180' scopedSlots={{ default: props => <div>
                            <el-button type='primary' size='small' onClick={this.down.bind(this, props.row.esn)}>
                                下载 <i class='el-icon-caret-bottom el-icon--right'/>
                            </el-button>
                            <el-button type='primary' size='small' onClick={this.view.bind(this, props.row.esn)}>
                                查看 <i class='el-icon-arrow-right el-icon--right'/>
                            </el-button>
                        </div> }}/>
                    </el-table>
                </aside>
                <article>
                    <div class='log'>
                        <table>
                            <thead>
                                <tr>
                                    <th>ESN</th>
                                    <th>TYPE</th>
                                    <th>CREATED</th>
                                    <th>CONTENT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.logDetails.map(detail => <tr>
                                    <td>{this.currentESN}</td>
                                    <td>
                                        <el-tooltip class='item' effect='dark' content={this.getTypeDesc(detail.type)} placement='left'>
                                            <div>{detail.type}</div>
                                        </el-tooltip>
                                    </td>
                                    <td>{detail.created}</td>
                                    <td>{detail.content}</td>
                                </tr>)}
                            </tbody>
                        </table>
                        <div class='loader el-loading-spinner'>
                            <svg viewBox='25 25 50 50' class='circular'>
                                <circle cx='50' cy='50' r='20' fill='none' class='path'></circle>
                            </svg>
                            <p class='el-loading-text'>拼命加载中</p>
                        </div>
                    </div>
                </article>
            </div>

            <el-pagination size-change={this.sizeChange}
                onCurrent-change={this.currentChange}
                current-page={this.page}
                total={this.logList.count}
                page-size={this.limit}
                page-sizes={[20, 50, 100, 200]}
                layout='total, sizes, prev, pager, next, jumper'/>
        </div>
    }
}

/**
 * scroll to top animation
 */
const threshold = 160
function scrollTop() {
    if (scrollTopSource.scrollTop <= threshold) return

    var steps = (scrollTopSource.scrollTop - threshold) / 5
    const interval = 200 / steps
    const animation = setInterval(() => {
        if (scrollTopSource.scrollTop > (threshold + 5)) {
            scrollTopSource.scrollTop -= 5
        } else {
            scrollTopSource.scrollTop = threshold
            clearInterval(animation)
        }
    }, interval)
}
</script>

<style lang="scss">
.log-page {
    .search {
        width: 380px;
        margin-bottom: 12px;
        .el-input-group {
            .el-autocomplete input {
                border: none
            }
            .el-input-group__prepend {
                width: 40%
            }
            >input {
                height: 38px
            }
        }
    }
    .content {
        display: flex;
        padding: 12px 0;
    }
    aside {
        width: 20%;
        min-width: 260px;
        margin-right: 15px;
        .current-row {
            color: #00f;
            font-weight: bolder;
        }
    }
    article {
        position: relative;
        width: 80%;
        border: 20px solid #555;
        border-radius: 5px;
        background: #555;
        font-family: "Droid Sans Mono", "Courier New", monospace;
        color: #bbb;
        overflow-y: scroll;
        .log {
            bottom: 0;
            min-height: 460px;
            table {
                width: 100%;
                border: 1px solid #bbb;
                th,
                td {
                    padding: 5px
                }
                th:nth-child(1) {
                    width: 70px
                }
                th:nth-child(2) {
                    width: 80px
                }
                th:nth-child(3) {
                    width: 220px
                }
                td:last-child {
                    color: yellow
                }
            }
        }

        .loader {
            display: block;
            position: inherit;
            margin-top: 10px;
            height: 100px;
            opacity: 0;
            overflow: hidden;
        }
    }
}
</style>