if (Vue) {
    Vue.component("lah-easycard-payment-check", {
        template: `<fieldset>
            <legend class="bg-light text-dark">
                <b-icon icon="credit-card"></b-icon>
                悠遊卡檢測
                <b-button class="border-0" @click="popup" size="sm" variant="outline-success"><i class="fas fa-question"></i></b-button>
            </legend>
            <div class="form-row d-none">
                <div class="input-group input-group-sm col small">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroup-easycard_query_day">日期</span>
                    </div>
                    <b-form-input
                        id="easycard_query_day"
                        type="date"
                        v-model="ad_date"
                        size="sm"
                        :class="['no-cache']"
                        :formatter="convertTWDate"
                    ></b-form-input>
                </div>
            </div>
            <b-form-row>
                <b-col><b-button pill block @click="query" size="sm" variant="outline-primary"><i class="fas fa-cogs"></i> 檢測</b-button></b-col>
            </b-form-row>
        </fieldset>`,
        data: () => ({
            date: "",
            ad_date: "2020-01-08"
        }),
        methods: {
            convertTWDate: function(val) {
                let d = new Date(val);
                this.date = (d.getFullYear() - 1911) + ("0" + (d.getMonth()+1)).slice(-2) + ("0" + d.getDate()).slice(-2);
                return val;
            },
            query: function(e) {
                // basic checking for tw date input
                let regex = /^\d{7}$/;
                if (!this.empty(this.date) && this.date.match(regex) == null) {
                    showPopper("#easycard_query_day");
                    return;
                }

                this.isBusy = true;
                const h = this.$createElement;

                this.$http.post(CONFIG.API.JSON.QUERY, {
                    type: "easycard",
                    qday: this.date
                }).then(res => {
                    if (res.data.status == XHR_STATUS_CODE.DEFAULT_FAIL) {
                        this.notify({
                            title: "檢測悠遊卡自動加值付款失敗",
                            message: `<i class='fas fa-circle text-success mr-1'></i>${res.data.message}`,
                            type: "success"
                        });
                    } else {
                        this.msgbox({
                            title: "<i class='fas fa-circle text-warning mr-1'></i><strong class='text-danger'>找到下列資料</strong>",
                            body: h("lah-easycard-payment-check-item", { props: { data: res.data.raw } }),
                            size: "md"
                        });
                    }
                }).catch(err => {
                    this.error = err;
                }).finally(() => {
                    this.isBusy = false;
                });
            },
            popup: function() {
                this.msgbox({
                    title: "悠遊卡自動加值付款失敗回復 小幫手提示",
                    body: `
                        <ol>
                            <li>櫃台來電通知悠遊卡扣款成功但地政系統卻顯示扣款失敗，需跟櫃台要【電腦給號】</li>
                            <li>管理師處理方法：AA106為'2' OR '8'將AA106更正為'1'即可【AA01:事發日期、AA04:電腦給號】。<br />
                            UPDATE MOIEXP.EXPAA SET AA106 = '1' WHERE AA01='1070720' AND AA04='0043405'
                            </li>
                        </ol>
                        <img src="assets/img/easycard_screenshot.jpg" class="img-responsive img-thumbnail" />
                    `,
                    size: "lg"
                });
            }
        },
        created: function() {
            let d = new Date();
            this.date = (d.getFullYear() - 1911) + ("0" + (d.getMonth()+1)).slice(-2) + ("0" + d.getDate()).slice(-2);
            this.ad_date = d.getFullYear() + "-" + ("0" + (d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
        },
        components: {
            "lah-easycard-payment-check-item": {
                template: `<ul style="font-size: 0.9rem">
                    <li v-for="(item, index) in data" class='easycard_item'>
                        日期: {{item["AA01"]}}, 電腦給號: {{item["AA04"]}}, 實收金額: {{item["AA28"]}}<b-badge v-if="!empty(item['AA104'])" variant="danger">, 作廢原因: {{item["AA104"]}}</b-badge>, 目前狀態: {{status(item["AA106"])}}
                        <button v-if="empty(item['AA104'])" @click="fix($event, item)" class="btn btn-sm btn-outline-success">修正</button>
                    </li>
                </ul>`,
                props: ["data"],
                methods: {
                    fix: function(e, item) {
                        let el = $(e.target);
                        let qday = item["AA01"], pc_number = item["AA04"], amount = item["AA28"];
                        let message = "確定要修正 日期: " + qday + ", 電腦給號: " + pc_number + ", 金額: " + amount + " 悠遊卡付款資料?";
                        showConfirm(message, () => {
                            this.isBusy = true;
                            this.$http.post(CONFIG.API.JSON.QUERY, {
                                type: "fix_easycard",
                                qday: qday,
                                pc_num: pc_number
                            }).then(res => {
                                if (res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL) {
                                    el.closest("li").html("修正 日期: " + qday + ", 電腦給號: " + pc_number + " <strong class='text-success'>成功</strong>!");
                                } else {
                                    throw new Error("回傳狀態碼不正確!【" + res.data.message + "】");
                                }
                                el.remove();
                            }).catch(err => {
                                this.error = err;
                            }).finally(() => {
                                this.isBusy = false;
                            });
                        });
                    },
                    status: function(AA106) {
                        let status = "未知的狀態碼【" + AA106 + "】";
                        /*
                            1：扣款成功
                            2：扣款失敗
                            3：取消扣款
                            8：扣款異常交易
                            9：取消扣款異常交易
                        */
                        switch(AA106) {
                            case "1":
                                status = "扣款成功";
                                break;
                            case "2":
                                status = "扣款失敗";
                                break;
                            case "3":
                                status = "取消扣款";
                                break;
                            case "8":
                                status = "扣款異常交易";
                                break;
                            case "9":
                                status = "取消扣款異常交易";
                                break;
                            default:
                                break;
                        }
                        return status;
                    }
                }
            }
        }
    });
} else {
    console.error("vue.js not ready ... lah-easycard-payment-check component can not be loaded.");
}