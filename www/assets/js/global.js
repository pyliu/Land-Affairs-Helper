//<![CDATA[
const CONFIG = {
    DISABLE_MSDB_QUERY: false,
    TEST_MODE: false,
    AP_SVR: "220.1.35.123",
    SCREENSAVER: true,
    SCREENSAVER_TIMER: 15 * 60 * 1000,
    JSON_API_EP: "query_json_api.php",
    LOAD_FILE_API_EP: "load_file_api.php",
    EXPORT_FILE_API_EP: "export_file_api.php",
    MOCK_API_EP: "TODO"
}
// the status code must be the same as server side response
const XHR_STATUS_CODE = {
    SUCCESS_WITH_NO_RECORD: 3,
    SUCCESS_WITH_MULTIPLE_RECORDS: 2,
    SUCCESS_NORMAL: 1,
    DEFAULT_FAIL: 0,
    UNSUPPORT_FAIL: -1,
    FAIL_WITH_LOCAL_NO_RECORD: -2,
    FAIL_NOT_VALID_SERVER: -3,
    FAIL_WITH_REMOTE_NO_RECORD: -4,
    FAIL_NO_AUTHORITY: -5
}
const LOADING_PATTERNS = [
    "ld-heartbeat", "ld-beat", "ld-blink", "ld-bounce", "ld-bounceAlt", "ld-breath", "ld-wrench", "ld-surprise",
    "ld-clock", "ld-jump", "ld-hit", "ld-fade", "ld-flip", "ld-float", "ld-move-ltr", "ld-tremble", "ld-tick",
    "ld-move-rtl", "ld-move-ttb", "ld-move-btt", "ld-move-fade-ltr", "ld-move-fade-rtl", "ld-move-fade-ttb",
    "ld-move-fade-btt", "ld-dim", "ld-swing", "ld-wander", "ld-pulse", "ld-cycle", "ld-cycle-alt", "ld-damage",
    "ld-fade", "ld-flip", "ld-flip-h", "ld-flip-v", "ld-float", "ld-jelly", "ld-jelly-alt", "ld-jingle",
    "ld-measure", "ld-metronome", "ld-orbit", "ld-rubber-h", "ld-rubber-v", "ld-rush-btt", "ld-rush-ttb",
    "ld-rush-ltr", "ld-rush-rtl", "ld-shake-h", "ld-shake-v", "ld-shiver", "ld-skew", "ld-skew-alt", "ld-slide-btt",
    "ld-slide-ltr", "ld-slide-rtl", "ld-slide-ttb", "ld-smash", "ld-spin", "ld-spin-fast", "ld-squeeze",
    "ld-swim", "ld-swing", "ld-tick-alt", "ld-vortex", "ld-vortex-alt", "ld-wander-h", "ld-wander-v"
];
const LOADING_PREDEFINED = [
    "fa fa-snowflake ld-swim fa-2x",
    "ld-spinner ld-orbit fa-lg",
    "ld-pie ld-flip fa-2x",
    "fas fa-sync ld-spin fa-lg",
    "fas fa-spinner fa-spin fa-2x",
    "fas fa-radiation-alt ld-cycle fa-2x",
    "fas fa-radiation ld-spin-fast fa-2x",
    "fas fa-asterisk ld-spin fa-lg",
    "fas fa-bolt ld-bounce fa-2x",
    "fas fa-biking ld-move-ltr fa-2x",
    "fas fa-snowboarding ld-rush-ltr fa-2x",
    "fas fa-yin-yang fa-spin fa-2x",
    "fas fa-biohazard ld-metronome fa-2x",
    "fas fa-baseball-ball ld-bounce fa-2x",
    "fas fa-basketball-ball ld-beat fa-2x",
    "fas fa-stroopwafel ld-metronome fa-2x",
    "fas fa-fan ld-spin-fast fa-2x",
    "fas fa-cog ld-swing fa-2x",
    "fas fa-compact-disc ld-spin-fast fa-2x",
    "fas fa-crosshairs ld-swim fa-2x",
    "far fa-compass ld-tick fa-2x",
    "fas fa-compass fa-pulse fa-2x",
    "fas fa-anchor ld-swing fa-2x",
    "fas fa-fingerprint ld-damage fa-2x",
    "fab fa-angellist ld-metronome fa-2x"
]
const LOADING_SHAPES_COLOR = ["text-primary", "text-secondary", "text-danger", "text-info", "text-warning", "text-default", ""];
const ANIMATED_PATTERNS = ["bounce", "flash", "pulse", "rubberBand", "shake", "headShake", "swing", "tada", "wobble", "jello", "hinge"];
const ANIMATED_TRANSITIONS = [
    // rotate
    { in: "animated rotateIn", out: "animated rotateOut" },
    { in: "animated rotateInDownLeft", out: "animated rotateOutDownLeft" },
    { in: "animated rotateInDownRight", out: "animated rotateOutDownRight" },
    { in: "animated rotateInUpLeft", out: "animated rotateOutUpLeft" },
    { in: "animated rotateInUpRight", out: "animated rotateOutUpRight" },
    // bounce
    { in: "animated bounceIn", out: "animated bounceOut" },
    { in: "animated bounceInUp", out: "animated bounceOutDown" },
    { in: "animated bounceInDown", out: "animated bounceOutUp" },
    { in: "animated bounceInRight", out: "animated bounceOutLeft" },
    { in: "animated bounceInLeft", out: "animated bounceOutRight" },
    // fade
    { in: "animated fadeIn", out: "animated fadeOut" },
    { in: "animated fadeInDown", out: "animated fadeOutUp" },
    { in: "animated fadeInDownBig", out: "animated fadeOutUpBig" },
    { in: "animated fadeInLeft", out: "animated fadeOutRight" },
    { in: "animated fadeInLeftBig", out: "animated fadeOutRightBig" },
    { in: "animated fadeInRight", out: "animated fadeOutLeft" },
    { in: "animated fadeInRightBig", out: "animated fadeOutLeftBig" },
    { in: "animated fadeInUp", out: "animated fadeOutDown" },
    { in: "animated fadeInUpBig", out: "animated fadeOutDownBig" },
    // flip
    { in: "animated flipInX", out: "animated flipOutX" },
    { in: "animated flipInY", out: "animated flipOutY" },
    // lightspeed
    { in: "animated lightSpeedIn", out: "animated lightSpeedOut" },
    // roll
    { in: "animated rollIn", out: "animated rollOut" },
    // zoom
    { in: "animated zoomIn", out: "animated zoomOut" },
    { in: "animated zoomInDown", out: "animated zoomOutUp" },
    { in: "animated zoomInLeft", out: "animated zoomOutRight" },
    { in: "animated zoomInRight", out: "animated zoomOutLeft" },
    { in: "animated zoomInUp", out: "animated zoomOutDown" },
    // slide
    { in: "animated slideInDown", out: "animated slideOutUp" },
    { in: "animated slideInUp", out: "animated slideOutDown" },
    { in: "animated slideInLeft", out: "animated slideOutRight" },
    { in: "animated slideInRight", out: "animated slideOutLeft" }
];

let asyncFetch = async function(url, opts) {
    if (!window.vueApp) {
        initVueApp();
    }
    return window.vueApp.fetch(url, opts);
}

let trim = text => {
    if (isEmpty(text)) {
        return "";
    }
    return text.replace(/[^a-zA-Z0-9]/g, "");
}

let isEmpty = variable => {
    if (variable === undefined || $.trim(variable) == "") {
        return true;
    }
    
    if (typeof variable == "object" && variable.length == 0) {
        return true;
    }
    return false;
}

let toTWDate = d => {
    return (d.getFullYear() - 1911) + ("0" + (d.getMonth()+1)).slice(-2) + ("0" + d.getDate()).slice(-2);
}

let addUserInfoEvent = () => {
    $(".user_tag").off("click");
    $(".user_tag").on("click", window.vueApp.fetchUserInfo);
}

let showPopper = (selector, content, timeout) => {
    if (!isEmpty(content)) {
        $(selector).attr("data-content", content);
    }
    $(selector).popover('show');
    setTimeout(function() {
        $(selector).popover('hide');
    }, isEmpty(timeout) || isNaN(timeout) ? 2000 : timeout);
    scrollToElement(selector);
}

let addNotification = (msg, opts) => {
    // previous only use one object param
    if (typeof msg == "object") {
        let message = msg.body || msg.message;
        msg.variant = msg.type || "default";
        window.vueApp.makeToast(message, msg);
    } else if (typeof msg == "string") {
        window.vueApp.makeToast(msg, opts);
    } else {
        showAlert({message: "addNotification 傳入參數有誤(請查看console)", type: "danger"});
        console.error(msg, opts);
    }
}

let showAlert = opts => {
    let message = opts.body || opts.message;
    let merged = Object.assign({
        title: "警示",
        variant: opts.type || "default",
        autoHideDelay: opts.delay || 10 * 1000,
        pos: "tf"
    }, opts);
    window.vueApp.makeToast(message, merged);
}

let showModal = opts => {
    let body = opts.body || opts.message;
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

    window.vueApp.modal(body, {
        title: title,
        size: size,
        html: true,
        callback: callback,
        noCloseOnBackdrop: !opts.backdrop_close
    });
}

let showConfirm = (message, callback) => {
    window.vueApp.confirm(message, {
        callback: callback
    });
}

let closeModal = callback => {
    window.vueApp.hideModal();
    if (typeof callback == "function") {
        setTimeout(callback, 500);
    }
}

let rand = (range) => Math.floor(Math.random() * Math.floor(range || 100));

let randRGB = (opacity = 1.0) => {
    return `rgba(${rand(255)}, ${rand(255)}, ${rand(255)}, ${opacity})`;
}

let addLDAnimation = (selector, which) => {
    let el = clearLDAnimation(selector);
    if (el) {
        el.addClass("ld");
        if (!which) {
            el.each(function (idx, el) {
                if (!$(el).is("body")) {
                    $(el).addClass(LOADING_PATTERNS[rand(LOADING_PATTERNS.length)]);
                }
            });
        } else {
            el.addClass(which);
        }
    }
    return el;
}

let clearLDAnimation = (selector) => {
    return $(selector || "*").removeClass("ld").attr('class', function(i, c){
        return c ? c.replace(/(^|\s+)ld-\S+/g, '') : "";
    });
}

let addAnimatedCSS = function(selector, opts) {
    const node = $(selector);
    if (node) {
        opts = Object.assign({
            name: ANIMATED_PATTERNS[rand(ANIMATED_PATTERNS.length)],
            duration: "once-anim-cfg"    // a css class to control speed
        }, opts);
        node.addClass(`animated ${opts.name} ${opts.duration}`);
        function handleAnimationEnd() {
            node.removeClass(`animated ${opts.name} ${opts.duration}`);
            node.off('animationend');
            // clear ld animation also
            clearLDAnimation(selector);
            if (typeof opts.callback === 'function') opts.callback.apply(this, arguments);
        }
        node.on('animationend', handleAnimationEnd);
    }
    return node;
}

let toggle = selector => {
    var el = $(selector);
    el.attr("disabled") ? el.attr("disabled", false) : el.attr("disabled", true);
    // also find cover container
    let container = el.closest("fieldset, .modal-content");
    if (container.length == 0) {
        if (el.is("button")) {
            toggleInsideSpinner(el);
        }
    } else {
        window.vueApp.toggleBusy({selector: container});
    }
}

let toggleInsideSpinner = (selector, size = "sm") => {
    let el = $(selector);
    if (el.length > 0) {
        // add bootstrap spinner
        let spans = el.find(".spinner-border,.sr-only");
        if (spans.length > 0) {
            spans.remove();
        } else {
            spans = jQuery.parseHTML('<span class="spinner-border spinner-border-' + size + '" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>&ensp;');
            el.prepend(spans);
        }
        /*
        // loading.io spinner, https://loading.io element
        // ex: <button class="ld-ext-left"><span class="ld ld-ring ld-cycle small"></span> 查詢</button>
        // position opts: ld-ext-top, ld-ext-bottom, ld-ext-left, ld-ext-right
        if (el.hasClass("ld-ext-left")) {
            el.removeClass("ld-ext-left");
            el.find(".auto-add-spinner").remove();
            el.removeClass("running");
        } else {
            el.addClass("ld-ext-left");
            el.prepend(jQuery.parseHTML('<span class="ld ld-ring ld-cycle small auto-add-spinner"></span>'));
            el.addClass("running");
        }
        */
    }
}

let scrollToElement = element => {
    var pos = $(element).offset().top - 120;
    if (pos < 0) return;
    $("html, body").animate({
        scrollTop: pos
    }, 1000);
}

let bindPressEnterEvent = (selector, callback_func) => {
    $(selector).on("keypress", function(e) {
        var keynum = (e.keyCode ? e.keyCode : e.which);
        if (keynum == '13') {
            callback_func.call(e.target, e);
        }
    });
}

let initDatepicker = () => {
    // for any field that needs date picking purpose (add .date_picker to its class)
    /**
     * <script src="assets/js/bootstrap-datepicker.min.js"></script>
         * <script src="assets/js/bootstrap-datepicker.zh-TW.min.js"></script>
     */
    if ($(".date_picker").datepicker) {
        $(".date_picker").datepicker({
            daysOfWeekDisabled: "",
            language: "zh-TW",
            daysOfWeekHighlighted: "1,2,3,4,5",
            //todayBtn: true,
            todayHighlight: true,
            autoclose: true,
            format: {
                /*
                * Say our UI should display a week ahead,
                * but textbox should store the actual date.
                * This is useful if we need UI to select local dates,
                * but store in UTC
                */
                toDisplay: (date, format, language) => toTWDate(new Date(date)),
                toValue: (date, format, language) => new Date()
            }
        });
    }
}

let initBlockquoteModal = () => {
    // add responsive and thumbnail style to blockquote img
    $("blockquote img").addClass("img-responsive img-thumbnail");
    // control blockquote block for *_quote_button
    $("button[id*='_quote_button']").on("click", function(e) {
        let el = $(e.target);
        let quote = el.next("blockquote"); // find DIRECT next element by selector
        // fallback to get the one under fieldset 
        if (quote.length == 0) {
            let fs = $(el.closest("fieldset"));
            quote = fs.find("blockquote");
        }
        if (quote.length > 0) {
            //quote.hasClass("hide") ? quote.removeClass("hide") : quote.addClass("hide");
            showModal({
                title: quote.data("title") + " 小幫手提示",
                body: quote.html(),
                size: "lg"
            });
        }
    });
}

let initVueApp = () => {
    if (window.vueApp) { return; }
    // bootstrap-vue will add $bvToast and $bvModal to every vue instance, I will leverage it to show toast and modal window
    // init vueApp for every page's #main_content_section section tag
    window.vueApp = new Vue({
        el: "#main_content_section",
        data: {
            toastCounter: 0,
            openConfirm: false,
            confirmAnswer: false,
            transition: ANIMATED_TRANSITIONS[rand(ANIMATED_TRANSITIONS.length)],
            callbackQueue: []
        },
        created: function(e) {
            this.$root.$on('bv::modal::show', (bvEvent, modalId) => {
                //console.log('Modal is about to be shown', bvEvent, modalId)
            });
            this.$root.$on('bv::modal::shown', (bvEvent, modalId) => {
                //console.log('Modal is shown', bvEvent, modalId)
                if (!this.openConfirm) {
                    this.showModal(modalId);
                }
            });
            this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
                //console.log('Modal is about to hide', bvEvent, modalId)
                // animation will break confirm Promise, so skip it
                if (this.openConfirm) {
                    this.openConfirm = false;
                } else {
                    bvEvent.preventDefault();
                    this.hideModal(modalId);
                }
            });
            this.$root.$on('bv::modal::hidden', (bvEvent, modalId) => {
                //console.log('Modal is hidden', bvEvent, modalId)
            });
        },
        methods: {
            // make simple, short popup notice message
            makeToast: function(message, opts = {}) {
                // for sub-title
                var currentdate = new Date();
                var datetime = ("0" + currentdate.getHours()).slice(-2) + ":" +
                    ("0" + currentdate.getMinutes()).slice(-2) + ":" +
                    ("0" + currentdate.getSeconds()).slice(-2);
                // position adapter
                switch(opts.pos) {
                    case "tr":
                        opts.toaster = "b-toaster-top-right";
                        break;
                    case "tl":
                        opts.toaster = "b-toaster-top-left";
                        break;
                    case "br":
                        opts.toaster = "b-toaster-bottom-right";
                        break;
                    case "bl":
                        opts.toaster = "b-toaster-bottom-left";
                        break;
                    case "tc":
                        opts.toaster = "b-toaster-top-center";
                        break;
                    case "tf":
                        opts.toaster = "b-toaster-top-full";
                        break;
                    case "bc":
                        opts.toaster = "b-toaster-bottom-center";
                        break;
                    case "bf":
                        opts.toaster = "b-toaster-bottom-full";
                        break;
                    default:
                        opts.toaster = "b-toaster-bottom-right";
                }
                // merge default setting
                let merged = Object.assign({
                    title: "通知",
                    subtitle: datetime,
                    href: "",
                    noAutoHide: false,
                    autoHideDelay: 5000,
                    solid: true,
                    toaster: "b-toaster-bottom-right",
                    appendToast: true,
                    variant: "default"
                }, opts);
                // Use a shorter name for this.$createElement
                const h = this.$createElement
                // Create the title
                let vNodesTitle = h(
                    'div',
                    { class: ['d-flex', 'flex-grow-1', 'align-items-baseline', 'mr-2'] },
                    [
                    h('strong', { class: 'mr-2' }, merged.title),
                    h('small', { class: 'ml-auto text-italics' }, merged.subtitle)
                    ]
                );
                // Pass the VNodes as an array for title
                merged.title = [vNodesTitle];
                // use vNode for HTML content
                const msgVNode = h('div', { domProps: { innerHTML: message } });
                this.$bvToast.toast([msgVNode], merged);
    
                if (typeof merged.callback === 'function') {
                    let that = this;
                    setTimeout(() => merged.callback.apply(that, arguments), 100);
                }
                this.toastCounter++;
            },
            showModal: function(id, duration) {
                let modal_content = $(`#${id} .modal-content`);
                modal_content.removeClass("hide");
                addAnimatedCSS(modal_content, {
                    name: this.transition.in,
                    duration: duration || "once-anim-cfg",
                    callback: this.callbackQueue.pop()
                });
            },
            hideModal: function(id) {
                let that = this;
                if (id == "" || id == undefined || id == null) {
                    $('div.modal.show').each(function(idx, el) {
                        that.removeModal(el.id);
                    });
                } else {
                    that.removeModal(id);
                }
            },
            removeModal: function(id, duration) {
                if (!this.openConfirm) {
                    let modal_content = $(`#${id} .modal-content`);
                    addAnimatedCSS(modal_content, {
                        name: this.transition.out,
                        duration: duration || "once-anim-cfg",
                        callback: () => {
                            $(`#${id}___BV_modal_outer_`).remove();
                            $(".popover").remove();
                        }
                    });
                }
            },
            modal: function(message, opts) {
                let merged = Object.assign({
                    title: '訊息',
                    size: 'md',
                    buttonSize: 'sm',
                    okVariant: 'outline-secondary',
                    okTitle: '關閉',
                    hideHeaderClose: false,
                    centered: true,
                    scrollable: true,
                    hideFooter: true,
                    noCloseOnBackdrop: true,
                    contentClass: "shadow hide", // add hide class to .modal-content then use Animated.css for animation show up
                    html: false
                }, opts);
                // use d-none to hide footer
                merged.footerClass = merged.hideFooter ? "d-none" : "p-2";
                if (merged.html) {
                    merged.titleHtml = merged.title;
                    merged.title = undefined;
                    if (typeof message == "object") {
                        // assume the message is VNode
                        this.$bvModal.msgBoxOk([message], merged);
                    } else {
                        const h = this.$createElement;
                        const msgVNode = h('div', { domProps: { innerHTML: message } });
                        this.$bvModal.msgBoxOk([msgVNode], merged);
                    }
                    // to initialize Vue component purpose
                    if (merged.callback && typeof merged.callback == "function") {
                        this.callbackQueue.push(merged.callback);
                    }
                } else {
                    this.$bvModal.msgBoxOk(message, merged);
                }
            },
            confirm: function(message, opts) {
                this.confirmAnswer = false;
                this.openConfirm = true;
                let merged = Object.assign({
                    title: '請確認',
                    size: 'sm',
                    buttonSize: 'sm',
                    okVariant: 'outline-success',
                    okTitle: '確定',
                    cancelVariant: 'secondary',
                    cancelTitle: '取消',
                    footerClass: 'p-2',
                    hideHeaderClose: false,
                    noCloseOnBackdrop: false,
                    centered: true,
                    contentClass: "shadow"
                }, opts);
                // use HTML content
                const h = this.$createElement;
                const msgVNode = h('div', { domProps: { innerHTML: message } });
                this.$bvModal.msgBoxConfirm([msgVNode], merged)
                .then(value => {
                    this.confirmAnswer = value;
                    if (this.confirmAnswer && merged.callback && typeof merged.callback == "function") {
                        merged.callback.apply(this, arguments);
                    }
                }).catch(err => {
                    console.error(err);
                });
            },
            open: function(url, e) {
                let h = window.innerHeight - 160;
                this.modal(`<iframe src="${url}" class="w-100" height="${h}" frameborder="0"></iframe>`, {
                    title: e.target.title || `外部連結`,
                    size: "xl",
                    html: true,
                    noCloseOnBackdrop: false
                });
            },
            download: function(url, data) {
                let params = Object.assign({
                    filename: "you_need_to_specify_filename.xxx"
                }, data || {});
                this.$http.post(url, params, {
                    responseType: 'blob'    // important
                }).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', params.filename);
                    document.body.appendChild(link);
                    link.click();
                    //afterwards we remove the element again
                    link.remove();
                    // release object in memory
                    window.URL.revokeObjectURL(url);
                });                  
            },
            fetch: async function(url, opts) {
                opts = Object.assign({
                    method: "POST",
                    body: new FormData(),
                    blob: false
                }, opts);
                let response = await fetch(url, opts);
                return opts.blob ? await response.blob() : await response.json();
            },
            fetchRegCase: function(e, enabled_userinfo = false) {
                // ajax event binding
                let clicked_element = $(e.target);
                // remove additional characters for querying
                let id = trim(clicked_element.text());
    
                let that = this;
                this.$http.post(CONFIG.JSON_API_EP, {
                    type: "reg_case",
                    id: id
                }).then(res => {
                    that.showRegCase(res.data, enabled_userinfo);
                }).catch(err => {
                    console.error("window.vueApp.fetchRegCase parsing failed", err);
                    showAlert({
                        title: "擷取登記案件",
                        subtitle: id,
                        message: err.message,
                        type: "danger"
                    });
                });
            },
            showRegCase: function(jsonObj, enabled_userinfo = false) {
                if (jsonObj.status == XHR_STATUS_CODE.DEFAULT_FAIL || jsonObj.status == XHR_STATUS_CODE.UNSUPPORT_FAIL) {
                    showAlert({title: "顯示登記案件詳情", message: jsonObj.message, type: "danger"});
                    return;
                } else {
                    showModal({
                        message: this.$createElement("case-reg-detail", {
                            props: {
                                jsonObj: jsonObj,
                                enabled_userinfo: this.$gstore.getters.isAdmin
                            }
                        }),
                        title: "登記案件詳情",
                        size: this.$gstore.getters.isAdmin ? "xl" : "lg"
                    });
                }
            },
            fetchUserInfo: function(e) {
                if (CONFIG.DISABLE_MSDB_QUERY) {
                    console.warn("CONFIG.DISABLE_MSDB_QUERY is true, skipping vueApp.fetchUserInfo.");
                    return;
                }
            
                let clicked_element = $(e.target);
                if (!clicked_element.hasClass("user_tag")) {
                    clicked_element = $(clicked_element.closest(".user_tag"));
                }
                // retrieve name/id from the data-* attributes
                let name = $.trim(clicked_element.data("name"));
                if (name) {
                    name = name.replace(/[\?A-Za-z0-9\+]/g, "");
                }
                let id = trim(clicked_element.data("id"));
                if (isEmpty(name) && isEmpty(id)) {
                    console.warn("Require query params are all empty, skip dynamic user info querying. (add attr to the element => data-id=" + id + ", data-name=" + name + ")");
                    return;
                }
            
                // use data-el HTML attribute to specify the display container, empty will use the modal popup window instead.
                let el_selector = clicked_element.data("display-selector");
            
                // reduce user query traffic
                if (this.cachedUserInfo(id, name, el_selector)) {
                    return;
                }
                
                this.$http.post(CONFIG.JSON_API_EP, {
                    type: "user_info",
                    name: name,
                    id: id
                }).then(res => {
                    if (res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL) {
                        let latest = res.data.data_count - 1;
                        this.showUserInfoFromRAW(res.data.raw[latest], el_selector);
                        // cache to global store
                        let json_str = JSON.stringify(res.data);
                        let payload = {};
                        if (!isEmpty(id)) { payload[id] = json_str; }
                        if (!isEmpty(name)) { payload[name] = json_str; }
                        this.$gstore.commit('cache', payload);
                    } else {
                        addNotification({ message: `找不到 '${name} ${id}' 資料` });
                    }
                }).catch(err => {
                    console.error("window.vueApp.fetchUserInfo parsing failed", err.toJSON());
                    showAlert({ title: "查詢使用者資訊", message: err.message, type: "danger" });
                });
            },
            cachedUserInfo: function (id, name, selector) {
                // reduce user query traffic
                let cache = this.$gstore.getters.cache;
                let json_str = cache[id] || cache[name];
                if (!isEmpty(json_str)) {
                    console.log(`cache hit ${id}:${name} in store.`);
                    let jsonObj = JSON.parse(json_str);
                    let latest = jsonObj.data_count - 1;
                    this.showUserInfoFromRAW(jsonObj.raw[latest], selector);
                    return true;
                }
                return false;
            },
            showUserInfoFromRAW: function(tdoc_raw, selector = undefined) {
                let year = 31536000000;
                let now = new Date();
                let age = "";
                let birth = tdoc_raw["AP_BIRTH"];
                let birth_regex = /^\d{3}\/\d{2}\/\d{2}$/;
                if (birth.match(birth_regex)) {
                    birth = (parseInt(birth.substring(0, 3)) + 1911) + birth.substring(3);
                    let temp = Date.parse(birth);
                    if (temp) {
                        let born = new Date(temp);
                        let badge_age = ((now - born) / year).toFixed(1);
                        if (badge_age < 30) {
                            age += " <b-badge variant='success' pill>";
                        } else if (badge_age < 40) {
                            age += " <b-badge variant='primary' pill>";
                        } else if (badge_age < 50) {
                            age += " <b-badge variant='warning' pill>";
                        } else if (badge_age < 60) {
                            age += " <b-badge variant='danger' pill>";
                        } else {
                            age += " <b-badge variant='dark' pill>";
                        }
                        age += badge_age + "歲</b-badge>"
                    }
                }
    
                let on_board_date = "";
                if(!isEmpty(tdoc_raw["AP_ON_DATE"])) {
                    on_board_date = tdoc_raw["AP_ON_DATE"].date ? tdoc_raw["AP_ON_DATE"].date.split(" ")[0] :　tdoc_raw["AP_ON_DATE"];
                    let temp = Date.parse(on_board_date.replace('/-/g', "/"));
                    if (temp) {
                        let on = new Date(temp);
                        if (tdoc_raw["AP_OFF_JOB"] == "Y") {
                            let off_board_date = tdoc_raw["AP_OFF_DATE"];
                            off_board_date = (parseInt(off_board_date.substring(0, 3)) + 1911) + off_board_date.substring(3);
                            temp = Date.parse(off_board_date.replace('/-/g', "/"));
                            if (temp) {
                                // replace now Date to off board date
                                now = new Date(temp);
                            }
                        }
                        let work_age = ((now - on) / year).toFixed(1);
                        if (work_age < 5) {
                            on_board_date += " <b-badge variant='success'>";
                        } else if (work_age < 10) {
                            on_board_date += " <b-badge variant='primary'>";
                        } else if (work_age < 20) {
                            on_board_date += " <b-badge variant='warning'>";
                        } else {
                            on_board_date += " <b-badge variant='danger'>";
                        }
                        on_board_date +=  work_age + "年</b-badge>";
                    }
                }
                let vue_card_text = tdoc_raw["AP_OFF_JOB"] == "N" ? "" : "<p class='text-danger'>已離職【" + tdoc_raw["AP_OFF_DATE"] + "】</p>";
                vue_card_text += "ID：" + tdoc_raw["DocUserID"] + "<br />"
                    + "電腦：" + tdoc_raw["AP_PCIP"] + "<br />"
                    + "生日：" + tdoc_raw["AP_BIRTH"] + age + "<br />"
                    + "單位：" + tdoc_raw["AP_UNIT_NAME"] + "<br />"
                    + "工作：" + tdoc_raw["AP_WORK"] + "<br />"
                    + "學歷：" + tdoc_raw["AP_HI_SCHOOL"] + "<br />"
                    + "考試：" + tdoc_raw["AP_TEST"] + "<br />"
                    + "手機：" + tdoc_raw["AP_SEL"] + "<br />"
                    + "到職：" + on_board_date + "<br />"
                    ;
                let vue_html = `
                    <div id="user_info_app">
                        <b-card class="overflow-hidden bg-light" style="max-width: 540px; font-size: 0.9rem;" title="${tdoc_raw["AP_USER_NAME"]}" sub-title="${tdoc_raw["AP_JOB"]}">
                            <b-link href="get_pho_img.php?name=${tdoc_raw["AP_USER_NAME"]}" target="_blank">
                                <b-card-img
                                    src="get_pho_img.php?name=${tdoc_raw["AP_USER_NAME"]}"
                                    alt="${tdoc_raw["AP_USER_NAME"]}"
                                    class="img-thumbnail float-right ml-2"
                                    style="max-width: 220px"
                                ></b-card-img>
                            </b-link>
                            <b-card-text>${vue_card_text}</b-card-text>
                        </b-card>
                    </div>
                `;
    
                if ($(selector).length > 0) {
                    $(selector).html(vue_html);
                    Vue.nextTick(() =>
                        new Vue({
                            el: "#user_info_app",
                            components: [ "b-card", "b-link", "b-badge" ],
                            mounted() {
                                addAnimatedCSS(selector, { name: "pulse", duration: "once-anim-cfg" });
                            }
                        })
                    );
                } else {
                    showModal({
                        title: "使用者資訊",
                        body: vue_html,
                        size: "md",
                        callback: () => {
                            Vue.nextTick(() => new Vue({
                                el: "#user_info_app",
                                components: [ "b-card", "b-link", "b-badge" ]
                            }));
                        }
                    });
                }
            },
            checkCaseUIData: function(data) {
                if (isEmpty(data.year)) {
                    addNotification({
                        title: '案件輸入欄位檢測',
                        message: "案件【年】欄位為空白，請重新選擇！",
                        type: "warning",
                        toaster: "b-toaster-top-center"
                    });
                    return false;
                }
                if (isEmpty(data.code)) {
                    addNotification({
                        title: '案件輸入欄位檢測',
                        message: "案件【字】欄位為空白，請重新選擇！",
                        type: "warning",
                        toaster: "b-toaster-top-center"
                    });
                    return false;
                }
                if (isEmpty(data.num) || isNaN(data.num)) {
                    addNotification({
                        title: '案件輸入欄位檢測',
                        message: "案件【號】欄位格式錯誤，請重新輸入！",
                        type: "warning",
                        toaster: "b-toaster-top-center"
                    });
                    return false;
                }
                return true;
            }
        }
    });
}

$(document).ready(e => {
    initVueApp();
    initDatepicker();
    initBlockquoteModal();
});
//]]>
    
