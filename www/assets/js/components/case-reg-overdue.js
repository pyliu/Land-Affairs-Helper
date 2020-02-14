if (Vue) {
    Vue.component("case-reg-overdue", {
        components: {
            "my-transition": VueTransition,
            "countdown": VueCountdown
        },
        template: `<div>
            <div style="right: 2.5rem; position:absolute; top: 0.5rem;" v-if="!inSearch">
                <b-form-checkbox inline v-model="overdueMode" size="sm" switch>
                    <span :class="overdueMode ? 'bg-danger text-white p-1' : 'bg-warning text-black p-1'">{{overdueMode ? "逾期模式" : "即將逾期模式(4小時內)"}}</span>
                </b-form-checkbox>
                <b-button v-show="empty(reviewerId)" variant="secondary" size="sm" @click="switchMode()">{{listMode ? "統計圖表" : "回列表模式"}}</b-button>
                <b-button id="reload" variant="primary" size="sm" @click="load">
                    刷新
                    <b-badge variant="light">
                        <countdown ref="countdown" :time="milliseconds" :auto-start="false">
                            <template slot-scope="props">{{ props.minutes.toString().padStart(2, '0') }}:{{ props.seconds.toString().padStart(2, '0') }}</template>
                        </countdown>
                        <span class="sr-only">倒數</span>
                    </b-badge>
                </b-button>
            </div>
            <my-transition @after-leave="afterTableLeave">
                <b-table
                    striped
                    hover
                    responsive
                    bordered
                    head-variant="dark"
                    caption-top
                    no-border-collapse
                    :small="small"
                    :caption="caption"
                    :sticky-header="height"
                    :items="inSearch ? case_list_by_id[reviewerId] : case_list"
                    :fields="fields"
                    :busy="busy"
                    v-show="listMode"
                    class="text-center"
                >
                    <template v-slot:table-busy>
                        <div class="text-center text-danger my-5">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>查詢中 ...</strong>
                        </div>
                    </template>
                    <template v-slot:cell(序號)="data">
                        {{data.index + 1}}
                    </template>
                    <template v-slot:cell(初審人員)="data">
                        <b-button v-if="!inSearch && !reviewerId" :variant="overdueMode ? 'outline-danger' : 'warning'" :size="small ? 'sm' : 'md'" @click="searchByReviewer(data.value)" :title="'查詢 '+data.value+' 的'+(overdueMode ? '逾期' : '即將逾期')+'案件'">{{data.value.split(" ")[0]}}</b-button>
                        <span v-else>{{data.value.split(" ")[0]}}</span>
                    </template>
                </b-table>
            </my-transition>
            
            <my-transition @after-leave="afterStatsLeave">
                <div class="mt-5" v-show="statsMode">
                    <div class="mx-auto w-75">
                        <chart-component ref="statsChart"></chart-component>
                    </div>
                    <b-button-group style="margin-left: 12.5%" class="w-75 mt-2">
                        <b-button size="sm" variant="primary" @click="chartType = 'bar'"><i class="fas fa-chart-bar"></i> 長條圖</b-button>
                        <b-button size="sm" variant="secondary" @click="chartType = 'pie'"><i class="fas fa-chart-pie"></i> 圓餅圖</b-button>
                        <b-button size="sm" variant="success" @click="chartType = 'line'"><i class="fas fa-chart-line"></i> 線型圖</b-button>
                        <b-button size="sm" variant="warning" @click="chartType = 'polarArea'"><i class="fas fa-chart-area"></i> 區域圖</b-button>
                        <b-button size="sm" variant="info" @click="chartType = 'doughnut'"><i class="fab fa-edge"></i> 甜甜圈</b-button>
                        <b-button size="sm" variant="dark" @click="chartType = 'radar'"><i class="fas fa-broadcast-tower"></i> 雷達圖</b-button>
                    </b-button-group>
                </div>
            </my-transition>
        </div>`,
        props: ['reviewerId', 'inSearch', 'compact', 'store'],
        data: function () {
            return {
                fields: [
                    '序號',
                    {key: "收件字號", sortable: true},
                    {key: "登記原因", sortable: true},
                    {key: "辦理情形", sortable: true},
                    {key: "初審人員", sortable: true},
                    {key: "作業人員", sortable: true},
                    {key: "收件時間", sortable: true},
                    {key: "限辦期限", sortable: true}
                ],
                height: true,
                caption: "查詢中 ... ",
                busy: true,
                small: false,
                timer_handle: null,
                milliseconds: 15 * 60 * 1000,
                listMode: true,
                statsMode: false,
                overdueMode: true,
                chartType: "bar",
                title: "逾期"
            }
        },
        computed: {
            case_list() {
                let store = this.store || this.$store;
                return store.getters.list;
            },
            case_list_by_id() {
                let store = this.store || this.$store;
                return store.getters.list_by_id;
            }
        },
        watch: {
            chartType: function (val) {
                this.$refs.statsChart.type = val;
            },
            overdueMode: function(isChecked) {
                this.title = isChecked ? "逾期" : "即將逾期";
                this.load();
            }
        },
        methods: {
            switchMode: function() {
                if (this.listMode) {
                    // use afterTableLeave to control this.statsMode
                    this.listMode = false;
                }
                if (this.statsMode) {
                    // use afterStatsLeave to control this.listMode
                    this.statsMode = false;
                }
            },
            afterTableLeave: function () {
                this.statsMode = true;
            },
            afterStatsLeave: function () {
                this.listMode = true;
            },
            setChartData: function() {
                this.$refs.statsChart.items = [];
                for (let id in this.case_list_by_id) {
                    let item = [this.case_list_by_id[id][0]["初審人員"], this.case_list_by_id[id].length];
                    this.$refs.statsChart.items.push(item);
                }
                this.$refs.statsChart.label = `${this.overdueMode ? "" : "即將"}逾期案件統計表`;
            },
            empty: function (variable) {
                if (variable === undefined || $.trim(variable) == "") {
                    return true;
                }
                
                if (typeof variable == "object" && variable.length == 0) {
                    return true;
                }
                return false;
            },
            resetCountdown: function () {
                this.$refs.countdown.totalMilliseconds = this.milliseconds;
            },
            startCountdown: function () {
                this.$refs.countdown.start();
            },
            endCountdown: function () {
                this.$refs.countdown.totalMilliseconds = 0;
            },
            makeCaseIDClickable: function () {
                addAnimatedCSS("table tr td:nth-child(2)", {
                    name: "flash"
                }).off("click").on("click", window.utilApp.fetchRegCase).addClass("reg_case_id");
            },
            load: function() {
                this.busy = true;
                clearTimeout(this.timer_handle);
                if (this.inSearch) {
                    // in-search, by clicked the first reviewer button
                    let case_count = this.case_list_by_id[this.reviewerId].length || 0;
                    this.busy = false;
                    this.caption = `${case_count} 件`;
                    setTimeout(this.makeCaseIDClickable, 800);
                    addNotification({ title: `查詢登記案件(${this.title})`, message: `查詢到 ${case_count} 件案件` });
                } else {
                    this.endCountdown();
                    this.resetCountdown();
                    this.startCountdown();
                    let form_body = new FormData();
                    form_body.append("type", this.overdueMode ? "overdue_reg_cases" : "almost_overdue_reg_cases");
                    if (!isEmpty(this.reviewerId)) {
                        form_body.append("reviewer_id", this.reviewerId);
                    }
                    asyncFetch("query_json_api.php", {
                        method: 'POST',
                        body: form_body
                    }).then(jsonObj => {
                        console.assert(jsonObj.status == XHR_STATUS_CODE.SUCCESS_NORMAL || jsonObj.status == XHR_STATUS_CODE.SUCCESS_WITH_NO_RECORD, `查詢登記案件(${this.title})回傳狀態碼有問題【${jsonObj.status}】`);
                        
                        this.busy = false;

                        // set data to store
                        this.$store.commit("list", jsonObj.items);
                        this.$store.commit("list_by_id", jsonObj.items_by_id);

                        this.caption = `${jsonObj.data_count} 件，更新時間: ${new Date()}`;

                        setTimeout(this.makeCaseIDClickable, 800);
                        addNotification({ title: `查詢登記(${this.title})案件`, message: `查詢到 ${jsonObj.data_count} 件案件`, type: "success" });
                        
                        let now = new Date();
                        if (now.getHours() >= 7 && now.getHours() < 17) {
                            // auto next reload
                            this.timer_handle = setTimeout(this.load, this.milliseconds);
                            // add effect to catch attention
                            addAnimatedCSS("#reload, caption", {name: "flash"});
                        } else {
                            console.warn("非上班時間，停止自動更新。");
                            addNotification({
                                title: "自動更新停止通知",
                                message: "非上班時間，停止自動更新。",
                                type: "warning"
                            });
                            this.endCountdown();
                        }
                        // prepare the chart data for rendering
                        this.setChartData();
                    }).catch(ex => {
                        console.error("case-reg-overdue::created parsing failed", ex);
                        showAlert({message: "case-reg-overdue::created XHR連線查詢有問題!!【" + ex + "】", type: "danger"});
                    });
                }
            },
            searchByReviewer: function(reviewer_data) {
                // reviewer_data, e.g. "曾奕融 HB1184"
                showModal({
                    title: `查詢 ${reviewer_data} 登記(${this.title})案件`,
                    message: this.$createElement('case-reg-overdue', {
                        props: {
                            reviewerId: reviewer_data.split(" ")[1],
                            inSearch: true,
                            store: this.$store
                        }
                    }),
                    size: "xl"
                });
            }
        },
        mounted() {
            this.load();
            if (this.inSearch === true) {
                // in modal dialog
                this.height = $(document).height() - 185 + "px";
                this.small = true;
            } else {
                this.height = $(document).height() - 145 + "px";
            }
        }
    });
} else {
    console.error("vue.js not ready ... case-reg-overdue component can not be loaded.");
}
