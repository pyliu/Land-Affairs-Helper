function isEmpty(variable) {
    if (variable === undefined || $.trim(variable) == "") {
        return true;
    }
    return false;
}

let showModal = opts => {
	let body = opts.body;
	let title = opts.title;
	let size = opts.size;	// sm, md, lg, xl
	let callback = opts.callback;
	if (isEmpty(title)) {
		title = "... 請輸入指定標題 ...";
	}
	if (isEmpty(body)) {
		body = "... 請輸入指定內文 ...";
	}
	if (isEmpty(size)) {
		size = "md";
	}
	
    let modal_element = $("#bs_modal_template");
    if (modal_element.length == 0) {
        initModalUI();
        modal_element = $("#bs_modal_template");
    }
	
	// Try to use Vue.js
	window.modalApp.title = title;
	window.modalApp.body = body;
	window.modalApp.sizeClass = "modal-" + size;
	window.modalApp.optsClass = opts.class || "";

	if (typeof callback == "function") {
		modal_element.one('shown.bs.modal', callback);
	}

	// backdrop: 'static' => not close by clicking outside dislog
	modal_element.modal({backdrop: 'static'});
}

let closeModal = callback => {
	if (typeof callback == "function") {
		$("#bs_modal_template").one('hidden.bs.modal', callback);
	}
	$("#bs_modal_template").modal("hide");
}

let initModalUI = () => {
	// add modal element to show the popup html message
	if ($("#bs_modal_template").length == 0) {
		$("body").append($.parseHTML(`
			<div class="modal fade" id="bs_modal_template" tabindex="-1" role="dialog" aria-labelledby="bs_modal_template" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" v-bind:class="sizeClass" role="document">
					<div class="modal-content">
						<com-header :in-title="title"></com-header>
						<com-body :in-body="body" :in-opts-class="optsClass"></com-body>
						<com-footer></com-footer>
					</div>
				</div>
			</div>
		`));
		// Try to use Vue.js
		window.modalApp = new Vue({
			el: '#bs_modal_template',
			data: {
				body: 'Hello Vue!',
				title: 'Hello Vue!',
				sizeClass: 'modal-md',
				optsClass: ''
			},
			components: {
				"com-header": {
					props: ["inTitle"],
					template: `<div class="modal-header">
						<h4 class="modal-title"><span v-html="inTitle"></span></h4>
						<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>`
				},
				"com-body": {
					props: ["inOptsClass", "inBody"],
					template: `<div class="modal-body" :class="inOptsClass">
					<p><span v-html="inBody"></span></p>
				</div>`
				},
				"com-footer": {
					template: `<div class="modal-footer">
						<button type="button" class="btn btn-light" data-dismiss="modal">關閉</button>
					</div>`
				}
			}
		});
	}
}

// other custom scripts start here
$(document).ready((e) => {
    window.vueApp = new Vue({
        el: "#app",
        data: {
            wizard: {
                s0: {
                    title: "步驟1，選擇事實發生區間",
                    legend: "被繼承人死亡時間",
                    seen: true,
                    value: ""
                },
                s01: {  // 光復前
                    title: "步驟2，家產 OR 私產？",
                    legend: "被繼承財產種類",
                    seen: false,
                    value: "",
                    public_count: 1
                },
                s02: {   // 光復後
                    title: "步驟2，輸入各項目人數",
                    seen: false,
                    value: ""
                }
            },
            heir_denominator: 1,
            prev_step: {},
            now_step: {},
            VueOK: true,
            debug: ""
        },
        methods: {
            next: function(e) {
                switch(this.now_step) {
                    case this.wizard.s0:
                        console.log("next: Now on S0");
                        break;
                    case this.wizard.s01:
                        console.log("next: Now on S01");
                        break;
                    default:
                        break;
                }
            },
            prev: function(e) {
                this.debug = `PREV Clicked ${e.target.tagName}`;
                if (this.now_step !== this.wizard.s0 && this.prev_step.seen !== undefined) {
                    this.prev_step.seen = true;
                    this.prev_step.value = "";
                    this.now_step.seen = false;
                    this.now_step.value = "";
                    this.now_step = this.prev_step;
                } 
            },
            filter: function(e) {
                let val = e.target.value.replace(/[^0-9]/g, "");
                if (val == "" || val == "0" || val == 0) {
                    val = 1;
                }
                let to = $(e.target).data("filter-to");
                switch(to) {
                    case "heir_denominator":
                        this.heir_denominator = val;
                        break;
                    case "wizard.s01.public_count":
                        this.wizard.s01.public_count = val;
                        break;
                    default:
                        console.log(`to: ${to}??`);
                        showModal({
                            title: "錯誤訊息",
                            body: `to: ${to}, val: ${val}`,
                            size: "sm"
                        });
                }
            },
            s0ValueSelected: function(e) {
                switch(this.wizard.s0.value) {
                    case -1:
                        this.wizard.s0.seen = false;
                        this.wizard.s01.seen = true;
                        this.wizard.s02.seen = false;
                        
                        this.now_step = this.wizard.s01;
                        this.prev_step = this.wizard.s0;

                        this.now_step.legend = "光復前【民國34年10月24日以前】";
                        break;
                    case 0:
                    case 1:
                        this.wizard.s0.seen = false;
                        this.wizard.s01.seen = false;
                        this.wizard.s02.seen = true;
                        
                        this.now_step = this.wizard.s02;
                        this.prev_step = this.wizard.s0;

                        this.now_step.legend = '光復後【民國74年6月' + (this.wizard.s0.value == 1 ? "5日以後】" : "4日以前】");
                        break;
                    default:
                        console.error(`Not supported: ${this.wizard.s0.value}.`);
                }
                this.next.call(this, e);
            },
            s01ValueSelected: function(e) {
                switch(this.wizard.s01.value) {
                    case "public":
                        console.log(`S01: 家產 ${this.wizard.s01.value} selected`);
                        break;
                    case "private":
                        console.log(`S01: 私產 ${this.wizard.s01.value} selected`);
                        break;
                    default:
                        console.error(`Not supported: ${this.wizard.s01.value}.`);
                }
                this.next.call(this, e);
            }
        },
        mounted: function() {  // like jQuery ready
            $("#VueOK").toggleClass("d-none");
            this.now_step = this.wizard.s0;
        }
    });
});
