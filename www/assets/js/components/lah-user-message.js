if (Vue) {
    Vue.component('lah-user-message', {
        template: `<div>
            <b-card-group v-if="ready" :columns="columns" :deck="!columns">
                <b-card
                    v-for="message in raws"
                    class="overflow-hidden bg-light small"
                    :title="message['xname']"
                    :sub-title="message['sendtime']['date'].substring(0, 19)"
                >
                    <b-card-text v-html="format(message['xcontent'])"></b-card-text>
                </b-card>
            </b-card-group>
            <lah-exclamation v-else>{{not_found}}</lah-exclamation>
        </div>`,
        props: ['id', 'name', 'ip', 'count'],
        data: () => { return {
            raws: undefined
        } },
        computed: {
            ready: function() { return !this.empty(this.raws) },
            not_found: function() { return `「${this.name || this.id || this.ip}」找不到信差訊息！` },
            columns: function() { return this.count > 3 }
        },
        methods: {
            format: function(content) { return content.replace(/\r\n/g,"<br />"); }
        },
        async created() {
            try {
                this.count = this.count || 3;
                this.$http.post(CONFIG.JSON_API_EP, {
                    type: "user_message",
                    id: this.id,
                    name: this.name,
                    ip: this.ip,
                    count: this.count
                }).then(res => {
                    if (res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL) {
                        this.raws = res.data.raw
                    } else {
                        addNotification({
                            title: "查詢信差訊息",
                            message: res.data.message,
                            type: "warning"
                        });
                    }
                }).catch(err => {
                    console.error(err);
                    showAlert({
                        title: "查詢信差訊息",
                        message: err.message,
                        type: "danger"
                    });
                });
            } catch(err) {
                console.error(err);
            }
        },
        mounted() {}
    });
} else {
    console.error("vue.js not ready ... lah-user-message component can not be loaded.");
}
