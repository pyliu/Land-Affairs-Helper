if (Vue) {
    Vue.component('lah-xap-connection-chart', {
        template: `<b-card border-variant="secondary" class="shadow">
            <lah-chart ref="chart" :label="label" :items="items" :type="type" :bg-color="bg_color" :title="title" title-pos="left" @click="history"></lah-chart>
            <div class="d-flex justify-content-between mt-1">
                <span class="small align-middle my-auto">
                    <lah-fa-icon icon="server" title="AP總連線數" :action="ap_icon_action" :variant="ap_variant"> <b-badge variant="muted" pill>{{ap_count}}</b-badge></lah-fa-icon>
                    <lah-fa-icon icon="database" title="資料庫連線數" :action="db_icon_action" :variant="db_variant"> <b-badge variant="muted" pill>{{db_count}}</b-badge></lah-fa-icon>
                    <lah-fa-icon icon="link" title="跨所AP上所有連線數" variant="info"> <b-badge variant="muted" pill>{{total_count}}</b-badge></lah-fa-icon>
                    <lah-fa-icon icon="clock" prefix="far" title="更新時間" variant="secondary">
                        <b-badge v-if="isOfficeHours() || demo" variant="muted">{{last_update_time}}</b-badge>
                        <b-badge v-else variant="danger" title="非上班時間所以停止更新">已停止更新</b-badge>
                    </lah-fa-icon>
                </span>
                <div :title="ip">
                    <b-button-group size="sm">
                        <lah-button icon="chart-bar" variant="primary" v-if="type != 'bar'" @click="type = 'bar'" title="切換長條圖"></lah-button>
                        <lah-button icon="chart-pie" variant="secondary" v-if="type != 'pie'" @click="type = 'pie'" title="切換圓餅圖"></lah-button>
                        <lah-button icon="chart-line" variant="success" v-if="type != 'line'" @click="type = 'line'" title="切換長線型圖"></lah-button>
                        <lah-button icon="chart-area" variant="warning" v-if="type != 'polarArea'" @click="type = 'polarArea'" title="切換區域圖"></lah-button>
                        <lah-button brand icon="edge" variant="info" v-if="type != 'doughnut'" @click="type = 'doughnut'" title="切換甜甜圈"></lah-button>
                        <lah-button icon="broadcast-tower" variant="dark" v-if="type != 'radar'" @click="type = 'radar'" title="切換雷達圖"></lah-button>
                        <lah-button v-if="popupButton" regular icon="window-maximize" variant="outline-primary" title="放大顯示" @click="popup" action="heartbeat"></lah-button>
                    </b-button-group>
                </div>
            </div>
        </b-card>`,
        props: {
            ip: { type: String, default: CONFIG.AP_SVR || '220.1.35.123' },
            type: { type: String, default: 'doughnut' },
            demo: { type: Boolean, default: false},
            popupButton: { type: Boolean, default: true }
        },
        data: () => ({
            items: [],
            db_count: 0,
            total_count: 0,
            ap_count: 0,
            last_update_time: ''
        }),
        watch: {
            ap_count(val) {
                if (val > 400) {
                    this.notify({
                        title: '跨所AP連線數警示',
                        type: 'warning',
                        message: `<i class="fas fa-exclamation-triangle"></i> 目前連線數達 <strong>${val}</strong>，須注意!`
                    })
                }
            },
            db_count(val) {
                if (val > 2500) {
                    if (val > 3000) {
                        this.alert({
                            title: '跨所AP資料庫連線數超標警示',
                            type: 'danger',
                            message: `<i class="fas fa-exclamation-circle"></i> 目前占用資料庫連線數已超過 3000 (<strong>${val}</strong>)，請立即處理！` 
                        });
                    } else {
                        this.notify({
                            title: '跨所AP資料庫連線數過高通知',
                            type: 'warning',
                            message: `<i class="fas fa-exclamation-circle"></i> 目前占用資料庫連線數已達 <strong>${val}</strong>，須注意!` 
                        });
                    }
                }
            }
        },
        computed: {
            label() { return `跨所AP連線數` },
            title() { return (this.type == 'line' || this.type == 'bar' || this.type == 'radar') ? '' : this.label },
            ap_variant() {
                if (this.ap_count > 500) return 'dark';
                if (this.ap_count > 400) return 'danger';
                if (this.ap_count > 300) return 'warning';
                return 'success';
            },
            ap_icon_action() { return this.icon_action_by_variant(this.ap_variant) },
            db_variant() {
                if (this.db_count > 3000) return 'dark';
                if (this.db_count > 1800) return 'danger';
                if (this.db_count > 1000) return 'warning';
                return 'success';
            },
            db_icon_action() { return this.icon_action_by_variant(this.db_variant) },
        },
        methods: {
            icon_action_by_variant(variant) {
                switch(variant) {
                    case 'dark': return 'tremble';
                    case 'danger': return 'shiver';
                    case 'warning': return 'beat';
                }
                return 'breath';
            },
            bg_color(dataset_item, opacity) {
                switch(dataset_item[0]) {
                    case '地政局': return `rgb(207, 207, 207, ${opacity})`;    // H0
                    case '桃園所': return `rgb(254, 185, 180, ${opacity})`;    // HA
                    case '中壢所': return `rgb(125, 199, 80, ${opacity})`;     // HB
                    case '大溪所': return `rgb(255, 251, 185, ${opacity})`;    // HC
                    case '楊梅所': return `rgb(0, 157, 122, ${opacity})`;      // HD
                    case '蘆竹所': return `rgb(33, 137, 227, ${opacity})`;     // HE
                    case '八德所': return `rgb(181, 92, 66, ${opacity})`;      // HF
                    case '平鎮所': return `rgb(195, 42, 84, ${opacity})`;    // HG
                    case '龜山所': return `rgb(136, 72, 152, ${opacity})`;     // HH
                    default: `rgb(${this.rand(255)}, ${this.rand(255)}, ${this.rand(255)}, ${opacity})`;
                }
            },
            get_site_tw(site_code) {
                switch(site_code) {
                    case 'H0': return '地政局';
                    case 'HA': return '桃園所';
                    case 'HB': return '中壢所';
                    case 'HC': return '大溪所';
                    case 'HD': return '楊梅所';
                    case 'HE': return '蘆竹所';
                    case 'HF': return '八德所';
                    case 'HG': return '平鎮所';
                    case 'HH': return '龜山所';
                    default: return '未知';
                }
            },
            reload(force = false) {
                if (force || this.isOfficeHours() || this.demo) {
                    //this.isBusy = true;
                    this.$http.post(CONFIG.API.JSON.STATS, {
                        type: "stats_xap_conn_latest",
                        count: 11   // why 11? => H0 HA-H DB TOTAL
                    }).then(res => {
                        console.assert(res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL, `取得AP連線數回傳狀態碼有問題【${res.data.status}】`);
                        if (res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL) {
                            if (res.data.data_count == 0) {
                                this.notify({title: 'AP連線數', message: '無資料，無法繪製圖形', type: 'warning'});
                            } else {
                                this.ap_count = 0;
                                res.data.raw.reverse().forEach((item, raw_idx, array) => {
                                    let text = this.get_site_tw(item.site);
                                    // e.g. item => { count: 911, ip: "220.1.35.123", log_time: "20200904175957", site: "HB" }
                                    if (item.site == 'TOTAL') { this.total_count = this.demo ? this.rand(5000) : item.count; }
                                    else if (item.site == 'DB') { this.db_count = this.demo ? this.rand(4000) : item.count; }
                                    else {
                                        let value = this.demo ? this.rand(300) : item.count;
                                        if (this.items.length == 9) {
                                            let found = this.items.find((oitem, idx, array) => {
                                                return oitem[0] == text;
                                            });
                                            if (found) {
                                                // the dataset item format is ['text', 123]
                                                found[1] = value;
                                                // not reactively ... manual set chartData
                                                this.$refs.chart.changeValue(text, value);
                                            } else {
                                                this.$warn(`RAW IDX: ${raw_idx}`, 'RAW ITEM: ', item, `FOUND IDX: ${found_idx}`, 'FOUND ITEM: ',  this.items[found_idx], `NOW items: `, this.items);
                                            }
                                        } else {
                                            this.items.push([text, value]);
                                        }
                                        this.ap_count += parseInt(value);
                                    }
                                });
                                this.last_update_time = this.now().split(' ')[1];
                            }
                        } else {
                            this.alert({title: `取得${this.ip}連線數`, message: `取得AP連線數回傳狀態碼有問題【${res.data.status}】`, variant: "warning"});
                        }
                    }).catch(err => {
                        this.error = err;
                    }).finally(() => {
                        //this.isBusy = false;
                        // reload every 15s
                        this.delay(this.reload, this.demo ? 5000 : 15000);
                        Vue.nextTick(() => {
                            this.$refs.chart.update();
                        });
                    });
                } else {
                    // check after an hour
                    this.delay(this.reload, 3600000);
                }
            },
            history(e, payload) {
                if (this.empty(payload['label'])) return;
                /**
                 * payload example
                 * payload['point'] => index, value
                 * payload['label'] => '中壢所'
                 * payload['value'] => 20
                 */
                let site = '';
                switch(payload['label']) {
                    case '地政局': site = 'H0'; break;
                    case '桃園所': site = 'HA'; break;
                    case '中壢所': site = 'HB'; break;
                    case '大溪所': site = 'HC'; break;
                    case '楊梅所': site = 'HD'; break;
                    case '蘆竹所': site = 'HE'; break;
                    case '八德所': site = 'HF'; break;
                    case '平鎮所': site = 'HG'; break;
                    case '龜山所': site = 'HH'; break;
                    default: site = 'HB';
                }
                this.msgbox({
                    title: `跨所AP${payload['label']}連線`,
                    message: this.$createElement('lah-xap-history-chart', { props: { site: site, mins: 60, demo: this.demo, popupButton: false, type: 'bar' } }),
                    size: "xl"
                });
            },
            popup() {
                this.msgbox({
                    title: `跨所AP各所連線數`,
                    message: this.$createElement('lah-xap-connection-chart', { props: { type: 'line', popupButton: false } }),
                    size: "xl"
                });
            }
        },
        created() {
            this.reload(true);
        },
        mounted() {}
    });
} else {
    console.error("vue.js not ready ... lah-xap-connection-chart component can not be loaded.");
}
