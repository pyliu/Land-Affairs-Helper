if (Vue) {
    Vue.component("tasklog", {
        template: `<div>
            <lah-transition>
                <schedule-task
                    v-show="showScheduleTask"
                    class="mb-1"
                    ref="task"
                    @fail-not-valid-server="handleFailed"
                    @succeed-valid-server="handleSucceeded"
                ></schedule-task>
            </lah-transition>
            <log-viewer ref="log"></log-viewer>
        </div>`,
        data: function() {
            return {
                showScheduleTask: false
            }
        },
        methods: {
            handleFailed: function() { this.showScheduleTask = false; },
            handleSucceeded: function() { this.showScheduleTask = true; },
        },
        components: {
            "lah-transition": VueTransition,
            "log-viewer": {
                template: `<b-card bo-body :header="'紀錄儀表版 ' + query_data_count + ' / ' + query_total_count">
                    <div class="d-flex w-100 justify-content-between">
                        <b-input-group size="sm" style="width:135px">
                            <b-input-group-prepend is-text>顯示筆數</b-input-group-prepend>
                            <b-form-input
                                type="number"
                                v-model="count"
                                size="sm"
                                min="1"
                            ></b-form-input>
                        </b-input-group>
                        <a href="javascript:void(0)" @click="download"><i class="fas fa-download"></i> 下載</a>
                        <small class="text-muted text-center">
                            <b-button variant="primary" size="sm" @click="callLogAPI">
                                <i class="fas fa-sync"></i>
                                刷新
                                <b-badge variant="light">
                                    <countdown ref="countdown" :time="milliseconds" :auto-start="false" @end="callLogAPI">
                                        <template slot-scope="props">{{ props.minutes.toString().padStart(2, '0') }}:{{ props.seconds.toString().padStart(2, '0') }}</template>
                                    </countdown>
                                    <span class="sr-only">倒數</span>
                                </b-badge>
                            </b-button>
                        </small>
                    </div>
                    <b-list-group flush class="small">
                        <b-list-group-item v-for="item in log_list">{{item}}</b-list-group-item>
                    </b-list-group>
                </b-card>`,
                components: { "countdown": VueCountdown },
                data: function () {
                    return {
                        log_list: [],
                        milliseconds: 5 * 60 * 1000,
                        count: 50,
                        log_update_time: "10:48:00",
                        query_data_count: 0,
                        query_total_count: 0,
                        log_filename: "",
                        busy: false
                    }
                },
                watch: {
                    busy: function(flag) {
                        if (flag) {
                            vueApp.busyOn(this.$el);
                            addLDAnimation(".fas.fa-sync", "ld-cycle");
                        } else {
                            vueApp.busyOff(this.$el);
                            clearLDAnimation(".fas.fa-sync");
                        }
                    }
                },
                methods: {
                    resetCountdown: function () {
                        this.$refs.countdown.totalMilliseconds = this.milliseconds;
                    },
                    abortCountdown: function () {
                        this.$refs.countdown.abort();
                    },
                    startCountdown: function () {
                        this.$refs.countdown.start();
                    },
                    endCountdown: function () {
                        this.$refs.countdown.end();
                    },
                    callLogAPI: function (e) {
                        this.busy = true;
                        let dt = new Date();
                        this.log_update_time = `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`;
                        this.log_filename = `log-${dt.getFullYear()}-${(dt.getMonth()+1).toString().padStart(2, '0')}-${(dt.getDate().toString().padStart(2, '0'))}.log`
                        this.$http.post(CONFIG.FILE_API_EP, {
                            type: "load_log",
                            log_filename: this.log_filename,
                            slice_offset: this.count * -1   // get lastest # records
                        }).then(res => {
                            // normal success jsonObj.status == XHR_STATUS_CODE.SUCCESS_NORMAL
                            if (res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL) {
                                this.query_data_count = res.data.data_count;
                                this.query_total_count = res.data.total_count;
                                let that = this;
                                res.data.data.forEach(function(item, index, array){
                                    that.addLogList(item);
                                });
                                this.resetCountdown();
                                this.startCountdown();
                            } else {
                                // stop the timer if API tells it is not working
                                this.addLogList(`${this.log_update_time} 錯誤: ${res.data.message}`);
                                console.warn(res.data.message);
                            }
                            this.busy = false;
                        }).catch(ex => {
                            this.abortCountdown();
                            this.addLogList(`${this.log_update_time} 錯誤: ${ex.message}`);
                            showAlert({
                                title: 'watchdog::callLogAPI parsing failed',
                                message: ex.message,
                                type: 'danger'
                            });
                            console.error("watchdog::callLogAPI parsing failed", ex);
                        });
                    },
                    addLogList: function (message) {
                        if (this.log_list.length == this.count) {
                            this.log_list.pop();
                        } else if (this.log_list.length > this.count) {
                            this.log_list = [];
                        }
                        this.log_list.unshift(message);
                    },
                    download: function(e) {
                        let dt = new Date();
                        let date = `${dt.getFullYear()}-${(dt.getMonth()+1).toString().padStart(2, '0')}-${(dt.getDate().toString().padStart(2, '0'))}`;
                        let form_body = new FormData();
                        form_body.append("type", "file_log");
                        form_body.append("date", date);
                        asyncFetch("export_file_api.php", {
                            method: 'POST',
                            body: form_body,
                            blob: true
                        }).then(blob => {
                            let d = new Date();
                            let url = window.URL.createObjectURL(blob);
                            let a = document.createElement('a');
                            a.href = url;
                            a.download = `log-${date}.log`;
                            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                            a.click();    
                            a.remove();  //afterwards we remove the element again
                            // release object in memory
                            window.URL.revokeObjectURL(url);
                        }).catch(ex => {
                            console.error("xhrExportLog parsing failed", ex);
                            showAlert({
                                title: "下載記錄檔",
                                message: "XHR連線查詢有問題!!【" + ex + "】",
                                type: "danger"
                            });
                        });
                    }
                },
                mounted() {
                    this.callLogAPI();
                }
            },
            "schedule-task": {
                template: `<b-card header="排程儀表版">
                    <div class="d-flex w-100 justify-content-between">
                        <b-input-group size="sm" style="width:125px">
                            <b-input-group-prepend is-text>顯示筆數</b-input-group-prepend>
                            <b-form-input
                                type="number"
                                v-model="count"
                                size="sm"
                                min="1"
                            ></b-form-input>
                        </b-input-group>
                        <strong id="schedule-wip-message" class="text-danger">排程執行中，請勿關閉本頁面。</strong>
                        <small class="text-muted text-center">
                            <b-button variant="primary" size="sm" @click="callWatchdogAPI">
                                <i class="fas fa-calendar-check"></i>
                                執行
                                <b-badge variant="light">
                                    <countdown ref="countdown" :time="milliseconds" :auto-start="false" @end="handleCountdownEnd">
                                        <template slot-scope="props">{{ props.minutes.toString().padStart(2, '0') }}:{{ props.seconds.toString().padStart(2, '0') }} </template>
                                    </countdown>
                                    <span class="sr-only">倒數</span></b-badge>
                            </b-button>
                        </small>
                    </div>
                    <small>
                        <b-list-group flush>
                            <b-list-group-item v-for="item in history">{{item}}</b-list-group-item>
                        </b-list-group>
                    </small>
                </b-card>`,
                components: { "countdown": VueCountdown },
                data: function() {
                    return {
                        milliseconds: 15 * 60 * 1000,
                        count: 4,
                        history: [],
                        timer: null,
                        anim_pattern: ["ld-bounceAlt", "ld-breath", "ld-rubber-v", "ld-beat", "ld-float", "ld-dim", "ld-damage"],
                        busy: false
                    }
                },
                watch: {
                    busy: function(flag) {
                        if (flag) {
                            addLDAnimation(".fas.fa-calendar-check", "ld-heartbeat");
                        } else {
                            clearLDAnimation(".fas.fa-calendar-check");
                        }
                    }
                },
                methods: {
                    resetCountdown: function () {
                        this.$refs.countdown.totalMilliseconds = this.milliseconds;
                    },
                    abortCountdown: function () {
                        this.$refs.countdown.abort();
                    },
                    startCountdown: function () {
                        this.$refs.countdown.start();
                    },
                    endCountdown: function () {
                        this.$refs.countdown.end();
                    },
                    handleCountdownEnd: function(e) {
                        // call api endpoint
                        this.callWatchdogAPI();
                        // update the message animation
                        this.changeWIPMessageAnim();
                    },
                    addHistory: function (message) {
                        if (this.history.length == this.count) {
                            this.history.pop();
                        } else if (this.history.length > this.count) {
                            this.history = [];
                        }
                        this.history.unshift(message);
                    },
                    callWatchdogAPI: function() {
                        this.busy = true;
                        // generate current date time string
                        let dt = new Date();
                        let now = `${dt.getFullYear()}-${(dt.getMonth()+1).toString().padStart(2, '0')}-${(dt.getDate().toString().padStart(2, '0'))} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`;
                        
                        let body = new FormData();
                        body.append("type", "watchdog");
                        asyncFetch(CONFIG.JSON_API_EP, {
                            method: "POST",
                            body: body
                        }).then(jsonObj => {
                            // normal success jsonObj.status == XHR_STATUS_CODE.SUCCESS_NORMAL
                            if (jsonObj.status == XHR_STATUS_CODE.FAIL_NOT_VALID_SERVER) {
                                // 此功能僅在伺服器上執行！
                                this.$emit("fail-not-valid-server");
                                addNotification({
                                    title: "伺服器排程停止通知",
                                    message: `${jsonObj.message}`
                                });
                            } else {
                                if (jsonObj.status == XHR_STATUS_CODE.SUCCESS_NORMAL) {
                                    this.addHistory(`${now}：執行結果正常。`);
                                } else {
                                    this.addHistory(`${now}：${jsonObj.message}`);
                                    console.warn(jsonObj.message);
                                }
                                this.resetCountdown();
                                this.startCountdown();
                                this.$emit("succeed-valid-server");
                            }
                            this.busy = false;
                        }).catch(ex => {
                            this.abortCountdown();
                            this.addHistory(`${now} 結果: ${ex.message}`);
                            showAlert({
                                title: 'schedule-task::callWatchdogAPI parsing failed',
                                message: ex.message,
                                type: 'danger'
                            });
                            console.error("schedule-task::callWatchdogAPI parsing failed", ex);
                        });
                    },
                    changeWIPMessageAnim: function() {
                        let len = this.anim_pattern.length;
                        addLDAnimation("#schedule-wip-message", this.anim_pattern[this.rand(len)]);
                    },
                    rand: (range) => Math.floor(Math.random() * Math.floor(range || 100))
                },
                mounted() {
                    this.callWatchdogAPI();
                    this.changeWIPMessageAnim();
                }
            }
        }
    });
} else {
    console.error("vue.js not ready ... watchdog component can not be loaded.");
}
