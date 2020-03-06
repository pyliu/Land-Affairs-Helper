if (Vue) {
    Vue.component("case-reg-detail", {
        template: `<div>
            <p v-html="jsonObj.tr_html"></p>
            <b-form-row>
                <b-col>
                    <div role="tablist">
                        <b-card no-body class="mb-1">
                            <b-card-header header-tag="header" class="p-1" role="tab">
                                <b-button block v-b-toggle.case-detail variant="primary">收件資料</b-button>
                            </b-card-header>
                            <b-collapse id="case-detail" visible accordion="reg-case" role="tabpanel">
                                <b-card-body>
                                    <b-form-row>
                                        <b-col>
                                            <div v-if="jsonObj.跨所 == 'Y'"><span class='bg-info text-white rounded p-1'>跨所案件 ({{jsonObj.資料收件所}} => {{jsonObj.資料管轄所}})</span></div>
                                            收件字號：
                                            <a :title="'收件資料 on ' + ap_server" href="javascript:void(0)" @click="window.vueApp.open(case_data_url, $event)">
                                                {{jsonObj.收件字號}}
                                            </a> <br/>
                                            收件時間：{{jsonObj.收件時間}} <br/>
                                            測量案件：{{jsonObj.測量案件}} <br/>
                                            限辦期限：<span v-html="jsonObj.限辦期限"></span> <br/>
                                            作業人員：<span id='the_incase_operator_span' class='user_tag' :data-container="'#'+user_card_container" :data-id="jsonObj.作業人員ID" :data-name="jsonObj.作業人員" data-title="作業人員">{{jsonObj.作業人員}}</span> <br/>
                                            辦理情形：{{jsonObj.辦理情形}} <br/>
                                            登記原因：{{jsonObj.登記原因}} <br/>
                                            區域：{{area}}【{{jsonObj.raw.RM10}}】 <br/>
                                            段小段：{{jsonObj.段小段}}【{{jsonObj.段代碼}}】 <br/>
                                            地號：{{jsonObj.地號}} <br/>
                                            建號：{{jsonObj.建號}} <br/>
                                            件數：{{jsonObj.件數}} <br/>
                                            登記處理註記：{{jsonObj.登記處理註記}} <br/>
                                            地價處理註記：{{jsonObj.地價處理註記}} <br/>
                                            手機號碼：{{jsonObj.手機號碼}}
                                        </b-col>
                                    </b-form-row>
                                    <b-form-row>
                                        <b-col class="text-center">
                                            <b-button variant="outline-primary" size="sm" @click="window.vueApp.open(case_data_url, $event)" :title="'收件資料 on ' + ap_server"><i class="fas fa-search"></i> 另開視窗查詢</b-button>
                                        </b-col>
                                    </b-form-row>
                                </b-card-body>
                            </b-collapse>
                        </b-card>
                        <b-card no-body class="mb-1">
                            <b-card-header header-tag="header" class="p-1" role="tab">
                                <b-button block v-b-toggle.case-status variant="secondary">辦理情形</b-button>
                            </b-card-header>
                            <b-collapse id="case-status" accordion="reg-case" role="tabpanel">
                                <b-card-body>
                                    <b-list-group flush compact>
                                        <b-list-group-item>
                                            <b-form-row>
                                                <b-col :title="jsonObj.預定結案日期">預定結案：<span v-html="jsonObj.限辦期限"></span></b-col>
                                                <b-col :title="jsonObj.結案與否">
                                                    結案與否：
                                                    <span v-if="is_ongoing" class='text-danger'><strong>尚未結案！</strong></span>
                                                    <span v-else class='text-success'><strong>已結案</strong></span>
                                                </b-col>
                                            </b-form-row>
                                        </b-list-group-item>
                                        <b-list-group-item v-if="!empty(jsonObj.代理人統編)">
                                            <b-form-row>
                                                <b-col>代理人統編：{{jsonObj.代理人統編}}</b-col>
                                                <b-col>代理人姓名：{{jsonObj.代理人姓名}}</b-col>
                                            </b-form-row>
                                        </b-list-group-item>
                                        <b-list-group-item v-if="!empty(jsonObj.權利人統編)">
                                            <b-form-row>
                                                <b-col>權利人統編：{{jsonObj.權利人統編}}</b-col>
                                                <b-col>權利人姓名：{{jsonObj.權利人姓名}}</b-col>
                                            </b-form-row>
                                        </b-list-group-item>
                                        <b-list-group-item v-if="!empty(jsonObj.義務人統編)">
                                            <b-form-row>
                                                <b-col>義務人統編：{{jsonObj.義務人統編}}</b-col>
                                                <b-col>義務人姓名：{{jsonObj.義務人姓名}}</b-col>
                                            </b-form-row>
                                        </b-list-group-item>
                                        <b-list-group-item>
                                            <b-form-row>
                                                <b-col>登記原因：{{jsonObj.登記原因}}</b-col>
                                                <b-col>辦理情形：<span :class="jsonObj.案件紅綠燈CSS">{{jsonObj.辦理情形}}</span></b-col>
                                            </b-form-row>
                                        </b-list-group-item>
                                        <b-list-group-item>
                                            <b-form-row>
                                                <b-col>收件人員：<span class='user_tag'  :data-id="jsonObj.收件人員ID" :data-name="jsonObj.收件人員">{{jsonObj.收件人員}}</span></b-col>
                                                <b-col>收件時間：{{jsonObj.收件時間}}</b-col>
                                            </b-form-row>
                                        </b-list-group-item>
                                        <b-list-group-item v-if="!empty(jsonObj.初審人員)">
                                            <b-form-row>
                                                <b-col>初審人員：<span class='user_tag' >{{jsonObj.初審人員}}</span></b-col>
                                                <b-col>初審時間：{{jsonObj.初審時間}}</b-col>
                                            </b-form-row>
                                        </b-list-group-item>
                                        <b-list-group-item v-if="!empty(jsonObj.複審人員)">
                                            <b-form-row>
                                                <b-col>複審人員：<span class='user_tag' >{{jsonObj.複審人員}}</span></b-col>
                                                <b-col>複審時間：{{jsonObj.複審時間}}</b-col>
                                            </b-form-row>
                                        </b-list-group-item>
                                        <b-list-group-item v-if="!empty(jsonObj.駁回日期)">
                                            <b-form-row>
                                                <b-col>駁回日期：{{jsonObj.駁回日期}}</b-col>
                                                <b-col></b-col>
                                            </b-form-row>
                                        </b-list-group-item>
                                        <b-list-group-item v-if="!empty(jsonObj.公告日期)">
                                            <b-form-row>
                                                <b-col>公告日期：{{jsonObj.公告日期}}</b-col>
                                                <b-col>公告到期：{{jsonObj.公告期滿日期}} 天數：{{jsonObj.公告天數}}</b-col>
                                            </b-form-row>
                                        </b-list-group-item>
                                        <b-list-group-item v-if="!empty(jsonObj.通知補正日期)">
                                            <b-form-row>
                                                <b-col>通知補正：{{jsonObj.通知補正日期}}</b-col>
                                                <b-col>補正期滿：{{jsonObj.補正期滿日期}} 天數：{{jsonObj.補正期限}}</b-col>
                                            </b-form-row>
                                        </b-list-group-item>
                                        <b-list-group-item v-if="!empty(jsonObj.補正日期)">
                                            <b-form-row>
                                                <b-col>補正日期：{{jsonObj.補正日期}}</b-col>
                                                <b-col></b-col>
                                            </b-form-row>
                                        </b-list-group-item>
                                        <b-list-group-item v-if="!empty(jsonObj.請示人員)">
                                            <b-form-row>
                                                <b-col>請示人員：<span class='user_tag' >{{jsonObj.請示人員}}</span></b-col>
                                                <b-col>請示時間：{{jsonObj.請示時間}}</b-col>
                                            </b-form-row>
                                        </b-list-group-item>
                                        <b-list-group-item v-if="!empty(jsonObj.展期人員)">
                                            <b-form-row>
                                                <b-col>展期人員：<span class='user_tag' >{{jsonObj.展期人員}}</span></b-col>
                                                <b-col>展期日期：{{jsonObj.展期日期}} 天數：{{jsonObj.展期天數}}</b-col>
                                            </b-form-row>
                                        </b-list-group-item>
                                        <b-list-group-item v-if="!empty(jsonObj.准登人員)">
                                            <b-form-row>
                                                <b-col>准登人員：<span class='user_tag' >{{jsonObj.准登人員}}</span></b-col>
                                                <b-col>准登日期：{{jsonObj.准登日期}}</b-col>
                                            </b-form-row>
                                        </b-list-group-item>
                                        <b-list-group-item v-if="!empty(jsonObj.登錄人員)">
                                            <b-form-row>
                                                <b-col>登錄人員：<span class='user_tag' >{{jsonObj.登錄人員}}</span></b-col>
                                                <b-col>登錄日期：{{jsonObj.登錄日期}}</b-col>
                                            </b-form-row>
                                        </b-list-group-item>
                                        <b-list-group-item v-if="!empty(jsonObj.校對人員)">
                                            <b-form-row>
                                                <b-col>校對人員：<span class='user_tag' >{{jsonObj.校對人員}}</span></b-col>
                                                <b-col>校對日期：{{jsonObj.校對日期}}</b-col>
                                            </b-form-row>
                                        </b-list-group-item>
                                        <b-list-group-item v-if="!empty(jsonObj.結案人員)">
                                            <b-form-row>
                                                <b-col>結案人員：<span class='user_tag' >{{jsonObj.結案人員}}</span></b-col>
                                                <b-col>結案日期：{{jsonObj.結案日期}}</b-col>
                                            </b-form-row>
                                        </b-list-group-item>
                                    </b-list-group>
                                    <b-form-row class="mt-2">
                                        <b-col class="text-center">
                                            <b-button variant="outline-primary" size="sm" @click="window.vueApp.open(case_status_url, $event)" title="案件辦理情形"><i class="fas fa-search"></i> 另開視窗查詢</b-button>
                                        </b-col>
                                    </b-form-row>
                                </b-card-body>
                            </b-collapse>
                        </b-card>
                    </div>
                </b-col>
                <lah-transition appear>
                    <div v-show="enabled_card" style="max-width: 220px; position: relative;" class="mr-1">
                        {{card_title}}
                        <lah-close-btn @click="closeCard"></lah-close-btn>
                        <div id="user_card_container"></div>
                    </div>
                </lah-transition>
            </b-form-row>
        </div>`,
        props: ["jsonObj"],
        data: () => {
            return {
                area: "",
                rm10: null,
                ap_server: "220.1.35.123",
                case_status_url: "",
                case_data_url: "",
                is_ongoing: false,
                user_card_container: "user_card_container",
                enabled_card: true,
                card_title: "作業人員",
                timer: null
            }
        },
        methods: {
            closeCard() {
                $("#"+this.user_card_container).html("");
                this.enabled_card = false;
            }
        },
        created() {
            this.rm10 = this.jsonObj.raw.RM10 ? this.jsonObj.raw.RM10 : "XX";
            switch (this.rm10) {
                case "03":
                    this.area = "中壢區";
                    break;
                case "12":
                    this.area = "觀音區";
                    break;
                default:
                    this.area = "其他(" + this.jsonObj.資料管轄所 + "區)";
                    break;
            }
            this.case_status_url = `http://${this.ap_server}:9080/LandHB/CAS/CCD02/CCD0202.jsp?year=${this.jsonObj.raw["RM01"]}&word=${this.jsonObj.raw["RM02"]}&code=${this.jsonObj.raw["RM03"]}&sdlyn=N&RM90=`;
            this.case_data_url = `http://${this.ap_server}:9080/LandHB/CAS/CCD01/CCD0103.jsp?rm01=${this.jsonObj.raw["RM01"]}&rm02=${this.jsonObj.raw["RM02"]}&rm03=${this.jsonObj.raw["RM03"]}`
            this.is_ongoing = this.empty(this.jsonObj.結案已否);
        },
        mounted() {
            if (this.enabled_card) {
                addUserInfoEvent();
                //load current operator user info
                $("#the_incase_operator_span").trigger("click");
                // hide the col if user info is not found, wait for xhr loading is finished
                let that = this;
                this.timer = setInterval(() => {
                    that.enabled_card = !that.empty($("#"+that.user_card_container).text());
                }, 800);
            }
        },
        beforeDestroy() {
            clearTimeout(this.timer);
        }
    });
} else {
    console.error("vue.js not ready ... case-reg-detail component can not be loaded.");
}
