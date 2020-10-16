if (Vue) {
    /**
     * Land-Affairs-Helper(lah) Vue components
     */
    Vue.component("lah-transition", {
        template: `<transition
            :enter-active-class="animated_in"
            :leave-active-class="animated_out"
            :duration="duration"
            :mode="mode"
            :appear="appear"
            @enter="enter"
            @leave="leave"
            @after-enter="afterEnter"
            @after-leave="afterLeave"
        >
            <slot>轉場內容會顯示在這邊</slot>
        </transition>`,
        props: {
            appear: Boolean,
            fade: Boolean,
            slide: Boolean,
            slideDown: Boolean,
            slideUp: Boolean,
            zoom: Boolean,
            bounce: Boolean,
            rotate: Boolean
        },
        data: () => ({
            animated_in: "animated fadeIn once-anim-cfg",
            animated_out: "animated fadeOut once-anim-cfg",
            animated_opts: ANIMATED_TRANSITIONS,
            duration: 400, // or {enter: 400, leave: 800}
            mode: "out-in", // out-in, in-out
            cfg_css: "once-anim-cfg"
        }),
        created() {
            if (this.rotate) {
                this.animated_in = `animated rotateIn ${this.cfg_css}`;
                this.animated_out = `animated rotateOut ${this.cfg_css}`;
            } else if (this.bounce) {
                this.animated_in = `animated bounceIn ${this.cfg_css}`;
                this.animated_out = `animated bounceOut ${this.cfg_css}`;
            } else if (this.zoom) {
                this.animated_in = `animated zoomIn ${this.cfg_css}`;
                this.animated_out = `animated zoomOut ${this.cfg_css}`;
            } else if (this.fade) {
                this.animated_in = `animated fadeIn ${this.cfg_css}`;
                this.animated_out = `animated fadeOut ${this.cfg_css}`;
            } else if (this.slideDown || this.slide) {
                this.animated_in = `animated slideInDown ${this.cfg_css}`;
                this.animated_out = `animated slideOutUp ${this.cfg_css}`;
            } else if (this.slideUp) {
                this.animated_in = `animated slideInUp ${this.cfg_css}`;
                this.animated_out = `animated slideOutDown ${this.cfg_css}`;
            } else {
                this.randAnimation();
            }
        },
        methods: {
            enter: function (e) {
                this.$emit("enter", e);
            },
            leave: function (e) {
                this.$emit("leave", e);
            },
            afterEnter: function (e) {
                this.$emit("after-enter", e);
            },
            afterLeave: function (e) {
                this.$emit("after-leave", e);
            },
            rand: (range) => Math.floor(Math.random() * Math.floor(range || 100)),
            randAnimation: function () {
                if (this.animated_opts) {
                    let count = this.animated_opts.length;
                    let this_time = this.animated_opts[this.rand(count)];
                    this.animated_in = `${this_time.in} ${this.cfg_css}`;
                    this.animated_out = `${this_time.out} ${this.cfg_css}`;
                }
            }
        }
    });

    Vue.component("lah-fa-icon", {
        template: `<span class="align-middle my-auto"><i :id="id" :class="className"></i> <slot></slot></span>`,
        props: ["size", 'prefix', 'icon', 'variant', 'action', 'id', 'align'],
        computed: {
            className() {
                let prefix = this.prefix || 'fas';
                let icon = this.icon || 'exclamation-circle';
                let variant = this.variant || '';
                let ld_movement = this.action || '';
                let size = '';
                switch (this.size) {
                    case "xs":
                        size = "fa-xs";
                        break;
                    case "sm":
                        size = "fa-sm";
                        break;
                    case "lg":
                        size = "fa-lg";
                        break;
                    default:
                        if (this.size && this.size[this.size.length - 1] === "x") {
                            size = `fa-${this.size}`;
                        }
                        break;
                }
                return `text-${variant} ${prefix} fa-${icon} ${size} ld ld-${ld_movement}`
            }
        }
    });

    Vue.component("lah-alert", {
        template: `<div id="bs_alert_template">
            <lah-transition
                @enter="enter"
                @leave="leave"
                @after-enter="afterEnter"
                @after-leave="afterLeave"
            >
                <div v-show="seen" class="alert alert-dismissible alert-fixed shadow" :class="type" role="alert" @mouseover="mouseOver" @mouseout="mouseOut">
                    <div v-show="title != '' && typeof title == 'string'" class="d-flex w-100 justify-content-between">
                        <h6 v-html="title"></h6>
                        <span v-if="subtitle != ''" v-html="subtitle" style="font-size: .75rem"></span>
                        <span style="font-size: .75rem">{{remaining_secs}}s</span>
                    </div>
                    <hr v-show="title != '' && typeof title == 'string'" class="mt-0 mb-1">
                    <p v-html="message" style="font-size: .9rem"></p>
                    <button type="button" class="close" @click="seen = false">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <b-progress height="3px" :max="delay_ms" :variant="bar_variant" :value="remaining_delay"></b-progress>
                </div>
            </lah-transition>
        </div>`,
        data: () => ({
            title: "",
            subtitle: "",
            message: 'Hello Alert Vue!',
            type: 'alert-warning',
            seen: false,
            hide_timer_handle: null,
            progress_timer_handle: null,
            progress_counter: 1,
            autohide: true,
            delay_ms: 10000,
            anim_delay: 400,
            remaining_delay: 10000,
            remaining_secs: 10,
            remaining_percent: 100,
            bar_variant: "light"
        }),
        methods: {
            mouseOver: function (e) {
                if (this.hide_timer_handle !== null) {
                    clearTimeout(this.hide_timer_handle);
                }
                this.disableProgress();
            },
            mouseOut: function (e) {
                if (this.autohide) {
                    this.hide_timer_handle = this.timeout(() => {
                        this.seen = false;
                        this.hide_timer_handle = null;
                    }, this.delay_ms);
                    this.enableProgress();
                }
            },
            enableProgress: function () {
                this.disableProgress();
                let total_remaining_secs = this.delay_ms / 1000;
                this.progress_timer_handle = setInterval(() => {
                    this.remaining_delay -= 200;
                    let now_percent = ++this.progress_counter / (this.delay_ms / 200.0);
                    this.remaining_percent = (100 - Math.round(now_percent * 100));
                    if (this.remaining_percent > 50) {} else if (this.remaining_percent > 25) {
                        this.bar_variant = "warning";
                    } else {
                        this.bar_variant = "danger";
                    }
                    this.remaining_secs = total_remaining_secs - Math.floor(total_remaining_secs * now_percent);
                }, 200);
            },
            disableProgress: function () {
                clearTimeout(this.progress_timer_handle);
                this.progress_counter = 1;
                this.remaining_delay = this.delay_ms;
                this.remaining_secs = this.delay_ms / 1000;
                this.remaining_percent = 100;
                this.bar_variant = "light";
            },
            show: function (opts) {
                if (this.seen) {
                    this.seen = false;
                    // the slide up animation is 0.4s
                    this.timeout(() => this.setData(opts), this.anim_delay);
                } else {
                    this.setData(opts);
                }
            },
            setData: function (opts) {
                // normal usage, you want to attach event to the element in the alert window
                if (typeof opts.callback == "function") {
                    this.timeout(opts.callback, this.anim_delay);
                }
                switch (opts.type || opts.variant) {
                    case "danger":
                    case "red":
                        opts.type = "alert-danger";
                        break;
                    case "warning":
                    case "yellow":
                        opts.type = "alert-warning";
                        break;
                    case "success":
                    case "green":
                        opts.type = "alert-success";
                        break;
                    case "dark":
                        opts.type = "alert-dark";
                        break;
                    case "info":
                        opts.type = "alert-info";
                        break;
                    case "primary":
                        opts.type = "alert-primary";
                        break;
                    case "secondary":
                        opts.type = "alert-secondary";
                        break;
                    default:
                        opts.type = "alert-light";
                        break;
                }
                this.title = opts.title || "";
                this.subtitle = opts.subtitle || "";
                this.autohide = opts.autohide || true;
                this.message = opts.message;
                this.delay_ms = opts.delay_ms || opts.delay || opts.timeout || 10000;
                this.type = opts.type;
                this.seen = true;
            },
            randAnimation: function () {
                if (this.animated_opts) {
                    let count = this.animated_opts.length;
                    let this_time = this.animated_opts[rand(count)];
                    this.animated_in = `${this_time.in} once-anim-cfg`;
                    this.animated_out = `${this_time.out} once-anim-cfg`;
                }
            },
            enter: function () {},
            leave: function () {
                /*this.randAnimation();*/ },
            afterEnter: function () {
                // close alert after 15 secs (default)
                if (this.autohide) {
                    if (this.hide_timer_handle !== null) {
                        clearTimeout(this.hide_timer_handle);
                    }
                    this.hide_timer_handle = this.timeout(() => {
                        this.seen = false;
                        this.hide_timer_handle = null;
                    }, this.delay_ms);
                    this.enableProgress();
                }
            },
            afterLeave: function () {
                this.disableProgress();
            }
        },
        created: function () {
            this.randAnimation();
        }
    });

    Vue.component("lah-header", {
        template: `<lah-transition slide-down>
            <b-navbar toggleable="lg" type="dark" variant="dark" class="mb-3" fixed="top" :style="bgStyle">
                <lah-fa-icon size="2x" variant="light" class="mr-2" :icon="icon"></lah-fa-icon>
                <b-navbar-brand :href="location.href" v-html="leading"></b-navbar-brand>
                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
                <b-collapse id="nav-collapse" is-nav>
                    <lah-transition appear>
                        <b-navbar-nav>
                            <b-nav-item
                                v-for="(link, index) in links"
                                v-if="link.need_admin ? isAdmin || false : true"
                                @mouseenter="animate($event)"
                                :href="Array.isArray(link.url) ? link.url[0] : link.url"
                            >
                                <lah-fa-icon :icon="link.icon" :class="activeCss(link)">{{link.text}}</lah-fa-icon>
                                <lah-fa-icon icon="caret-down" :id="'lah-header-nav-'+index" v-if="hasSubMenu(link)" @click="event.preventDefault()"></lah-fa-icon>
                                <b-popover v-if="hasSubMenu(link)" :target="'lah-header-nav-'+index" triggers="hover focus click" placement="bottom" delay="100" offset="-50">
                                    <div v-for="(clink, cindex) in link.children" class="m-2" @mouseenter="animate($event)"><a class="text-decoration-none text-primary" :href="Array.isArray(clink.url) ? clink.url[0] : clink.url"><lah-fa-icon :icon="clink.icon">{{clink.text}}</lah-fa-icon></a></div>
                                    <!--<template v-slot:title><lah-fa-icon icon="angle-double-down"><span class="font-weight-bold s-95 align-top text-muted">其他連結</span></lah-fa-icon></template>-->
                                </b-popover>
                            </b-nav-item>
                        </b-navbar-nav>
                    </lah-transition>
                    <b-navbar-nav @click="location.href='message.html'" class="ml-auto mr-2" style="cursor: pointer;" :title="avatar_badge+'則未讀訊息'">
                        <b-avatar v-if="showBadge" icon="people-fill" variant="light" :badge="avatar_badge" badge-variant="primary" id="header-user-icon" size="2.8rem" :src="avatar_src"></b-avatar>
                        <b-avatar v-else icon="people-fill" variant="light" id="header-user-icon" size="2.8rem" :src="avatar_src"></b-avatar>
                        <b-popover ref="fun" target="header-user-icon" placement="left" :show="fri_noon">
                            <i class="far fa-laugh-wink fa-lg ld ld-swing"></i> 快放假了~離下班只剩 {{left_hours}} 小時
                        </b-popover>
                        <b-popover target="header-user-icon" triggers="hover focus" placement="bottom" delay="350">
                            <lah-user-message-history ref="message" :ip="myip" count=5 title="最新訊息" class="mb-2" :tabs="true" :tabs-end="true"></lah-user-message-history>
                            <lah-user-ext class="mb-2"></lah-user-ext>
                            <lah-user-message-reservation></lah-user-message-reservation>
                            <b-button block @click.stop="clearCache" variant="outline-secondary" size="sm"><lah-fa-icon icon="broom"> 清除快取資料</lah-fa-icon></b-button>
                        </b-popover>
                    </b-navbar-nav>
                </b-collapse>
            </b-navbar>
        </lah-transition>`,
        data: () => ({
            fri_noon: false,
            icon: "question",
            leading: "Unknown",
            active: undefined,
            avatar_badge: false,
            links: [{
                text: `系管看板`,
                url: "dashboard.html",
                icon: "cubes",
                need_admin: true,
                children: [{
                    text: "記錄瀏覽",
                    url: "tasklog.html",
                    icon: "paw",
                    need_admin: true
                }, {
                    text: `測試`,
                    url: "test.html",
                    icon: "tools",
                    need_admin: true
                }, {
                    text: `測試PHP`,
                    url: "debug.php",
                    icon: "tools",
                    need_admin: true
                }]
            }, {
                text: "監控看板",
                url: "monitor.html",
                icon: "diagnoses",
                need_admin: true,
                children: [{
                    text: "跨所AP看板",
                    url: "monitor_cross_ap.html",
                    icon: "server",
                    need_admin: true
                }, {
                    text: "AP連線數看板",
                    url: "monitor_ap_conn.html",
                    icon: "user-friends",
                    need_admin: true
                }, {
                    text: "同步異動監控",
                    url: "monitor_l3hweb.html",
                    icon: "tv",
                    need_admin: true
                }]
            }, {
                text: "今日案件",
                url: ["index.html", "/"],
                icon: "briefcase",
                need_admin: false
            }, {
                text: "逾期案件",
                url: "overdue_reg_cases.html",
                icon: "calendar-alt",
                need_admin: false,
                children: []
            }, {
                text: `統計看板`,
                url: "stats.html",
                icon: "laptop-house",
                need_admin: false
            }, {
                text: `組織圖`,
                url: "org.html",
                icon: "sitemap",
                need_admin: false
            }, {
                text: `小幫手`,
                url: "helper.html",
                icon: "hands-helping",
                need_admin: false,
                children: [{
                    text: "體溫紀錄",
                    url: "temperature.html",
                    icon: "head-side-mask",
                    need_admin: false
                }, {
                    text: "信差訊息",
                    url: "message.html",
                    icon: "comments",
                    need_admin: false
                }, {
                    text: "繼承應繼分",
                    url: "heir_share.html",
                    icon: "chart-pie",
                    need_admin: false
                }, {
                    text: "使用者查詢",
                    url: "user.html",
                    icon: "users",
                    need_admin: false
                }]
            }]
        }),
        computed: {
            showBadge() {
                return this.avatar_badge > 0
            },
            enableUserCardPopover() {
                return !this.empty(this.myip)
            },
            url() {
                let page_url = new URL(location.href).pathname.substring(1);
                if (this.empty(page_url)) {
                    return 'index.html';
                }
                return page_url;
            },
            bgStyle() {
                let day_of_week = new Date().getDay();
                switch (day_of_week) {
                    case 1:
                        return 'background-color: #343a40 !important;'; // dark
                    case 2:
                        return 'background-color: #565658 !important;';
                    case 3:
                        return 'background-color: #646366 !important;';
                    case 4:
                        return 'background-color: #707073 !important;';
                    case 5:
                    default:
                        return 'background-color: #28a745 !important;'; // green
                }
            },
            avatar_src() {
                return this.empty(this.myname) ? 'get_user_img.php?name=not_found' : `get_user_img.php?name=${this.myname}_avatar`
            },
            left_hours() {
                let hours = new Date().getHours();
                return 17 - hours;
            }
        },
        methods: {
            activeCss: function (link) {
                let ret = "";
                if (Array.isArray(link.url)) {
                    for (let i = 0; i < link.url.length; i++) {
                        ret = this.css(link.url[i]);
                        if (!this.empty(ret)) break;
                    }
                } else {
                    ret = this.css(link.url);
                }
                if (this.empty(ret)) {
                    // recursive checking
                    if (Array.isArray(link.children)) {
                        link.children.forEach(child => this.activeCss(child));
                    }
                } else {
                    // store detected active link
                    this.active = link
                }

                return ret;
            },
            css: function (url) {
                if (this.url == url) {
                    return "font-weight-bold text-white";
                }
                return "";
            },
            setLeading: function (link) {
                if (Array.isArray(link.url)) {
                    link.url.forEach((this_url, idx) => {
                        if (this.url == this_url) {
                            this.icon = link.icon;
                            this.leading = link.text;
                        }
                    });
                } else if (this.url == link.url) {
                    this.icon = link.icon;
                    this.leading = link.text;
                } else if (Array.isArray(link.children)) {
                    // recursive down to check children
                    link.children.forEach(child => this.setLeading(child));
                }
            },
            animate(e) {
                // add pulse effect for the links
                this.animated(e.target, this.fri_noon ? {} : {
                    name: "pulse"
                });
            },
            hasSubMenu(link) {
                return !this.empty(link.children)
            },
            userNotFound: function (input) {
                this.$store.commit('myip', null);
                this.$warn(`找不到 ${input} 的使用者資訊，無法顯示目前使用者的卡片。`);
            },
            userFound: function (name) {

            },
            checkAuthority: async function () {
                if (this.isAdmin === undefined) {
                    await this.$store.dispatch('authenticate');
                }
                if (!this.active || (this.active.need_admin && !this.isAdmin)) {
                    $('body').html("<h3 class='text-center m-5 font-weight-bold'><a href='javascript:history.back()' class='text-danger'>限制存取區域，請返回上一頁！</a></h3>");
                }
                $("body section:first-child").removeClass("hide");
            },
            clearCache: function () {
                this.$confirm(`清除全部暫存資料？`, () => {
                    this.$lf.clear().then(() => {
                        this.notify({
                            title: "清除快取",
                            message: "已清除快取紀錄，請重新整理頁面。",
                            type: "success"
                        });
                    });
                });
            },
            setUnreadMessageCount: function () {
                if (!this.disableMSDBQuery) {
                    this.$http.post(CONFIG.API.JSON.MSSQL, {
                        type: 'user_unread_message',
                        ip: this.myip
                    }).then(res => {
                        this.avatar_badge = res.data.data_count || false;
                        this.$root.$emit(CONFIG.LAH_ROOT_EVENT ? CONFIG.LAH_ROOT_EVENT.MESSAGE_UNREAD : 'lah::message::unread', {
                            count: res.data.data_count,
                            ip: this.myip
                        });
                    }).catch(err => {
                        this.error = err;
                    }).finally(() => {

                    });
                }
            },
            clearCache: function () {
                this.$lf.clear().then(() => {
                    this.notify({
                        title: '清除快取',
                        message: '快取資料已清除，請重新整理頁面。',
                        type: "success"
                    })
                })
            }
        },
        created() {
            let day_of_week = new Date().getDay();
            let hours = new Date().getHours();
            this.fri_noon = day_of_week == 5 && hours < 17 && hours > 12;
            // delay 15s to get the unread message
            this.timeout(() => this.setUnreadMessageCount(), 15000);
        },
        mounted() {
            this.links.forEach(this.setLeading);
            this.checkAuthority();
        }
    });

    Vue.component("lah-footer", {
        template: `<lah-transition slide-up appear>
            <p v-if="show" :class="classes">
                <span>
                    <a href="https://github.com/pyliu/Land-Affairs-Helper" target="_blank" title="View project on Github!">
                        <i class="fab fa-github fa-lg text-dark"></i>
                    </a>
                    <strong><i class="far fa-copyright"></i> <a href="mailto:pangyu.liu@gmail.com">LIU, PANG-YU</a> ALL RIGHTS RESERVED.</strong>
                    <a href="https://vuejs.org/" target="_blank" title="Learn Vue JS!">
                        <i class="text-success fab fa-vuejs fa-lg"></i>
                    </a>
                </span>
            </p>
        </lah-transition>`,
        data: () => ({
            show: true,
            leave_time: 10000,
            classes: ['text-muted', 'fixed-bottom', 'my-2', 'mx-3', 'bg-white', 'border', 'rounded', 'text-center', 'p-2', 'small', 'shadow-xl']
        }),
        mounted() {
            this.timeout(() => this.show = false, this.leave_time);
        }
    });

    Vue.component("lah-cache-mgt", {
        template: `<b-card no-body>
            <template v-slot:header>
                <div class="d-flex w-100 justify-content-between mb-0">
                    <h6 class="my-auto"><lah-fa-icon icon="hand-sparkles"></lah-fa-icon> 清除快取資料</h6>
                    <b-form-checkbox inline v-model="enable" switch class="my-auto">顯示細節</b-form-checkbox>
                    <b-button @click="clear" size="sm" variant="danger">清除 <b-badge variant="light" pill>{{count}}</b-badge></b-button>
                </div>
            </template>
            <b-list-group v-if="enable" class="small" style="max-height: 300px; overflow: auto;">
                <transition-group name="list" style="z-index: 0 !important;">
                    <b-list-group-item button v-for="(item, idx) in all" :key="item.key" v-b-popover.focus="JSON.stringify(item.val)">
                        <b-button-close @click="del(item.key, idx)" style="font-size: 1rem; color: red;"></b-button-close>
                        <div class="truncate font-weight-bold">{{item.key}}</div>
                    </b-list-group-item>
                </transition-group>
            </b-list-group>
        </b-card>`,
        data: () => ({
            all: [],
            enable: false
        }),
        watch: {
            enable(val) {
                this.all = [];
                if (val) {
                    this.isBusy = true;
                    this.$lf.keys().then(keys => {
                        keys.forEach(async key => {
                            const val = await this.$lf.getItem(key);
                            this.all.push({
                                key: key,
                                val: val
                            });
                        });
                    }).finally(() => {
                        this.isBusy = false;
                    });
                }
            }
        },
        computed: {
            count() {
                return this.all ? this.all.length : 0
            }
        },
        methods: {
            async get(key) {
                let valObj = await this.$lf.getItem(key);
                return typeof valObj == 'object' ? valObj.value : valObj;
            },
            del(key, idx) {
                this.$confirm(`清除 ${key} 快取紀錄？`, () => {
                    this.$lf.removeItem(key).then(() => {
                        for (let i = 0; i < this.all.length; i++) {
                            if (this.all[i].key == key) {
                                this.all.splice(i, 1);
                                return true;
                            }
                        }
                    });
                });
            },
            clear() {
                this.$confirm(`清除所有快取紀錄？`, () => {
                    this.$lf.clear().then(() => {
                        this.all = [];
                        this.notify({
                            title: '清除快取資料',
                            message: '已完成，請重新整理頁面。',
                            type: 'success'
                        });
                    });
                });
            }
        }
    });

    Vue.component("lah-button", {
        template: `<b-button
            :variant="variant"
            :size="size"
            :pill="pill"
            :pressed="pressed"
            @mouseenter="mouseenter"
            @mouseleave="mouseleave"
            @blur="mouseleave"
            @click="emitClick($event)"
        >
            <lah-fa-icon :id="icon_id" :icon="icon" :prefix="fa_icon_prefix">
                <slot></slot>
                <b-badge v-if="badgeCount > 0" :variant="badgeVariant" :pill="badgePill">{{badgeCount}}</b-badge>
            </lah-fa-icon>
      </b-button>`,
        props: {
            variant: {
                type: String,
                default: 'outline-primary'
            },
            size: {
                type: String,
                default: 'sm'
            },
            icon: {
                type: String,
                default: 'question'
            },
            regular: {
                type: Boolean,
                default: false
            },
            brand: {
                type: Boolean,
                default: false
            },
            action: {
                type: String,
                default: undefined
            },
            click: {
                type: Function,
                default: console.log
            },
            pill: {
                type: Boolean,
                default: false
            },
            pressed: {
                type: Boolean,
                default: false
            },
            badgeCount: { type: Number, default: 0 },
            badgeVariant: { type: String, default: 'light' },
            badgePill: { type: Boolean, default: true }
        },
        data: () => ({
            icon_id: 'xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx'
        }),
        watch: {},
        computed: {
            fa_icon_prefix() {
                return this.brand ? 'fab' : this.regular ? 'far' : 'fas';
            }
        },
        methods: {
            emitClick(evt) {
                this.$emit('click', this.click);
                evt.stopPropagation();
            },
            mouseenter() {
                /**
                 *  Land-Affairs-Helper"ld-heartbeat", "ld-beat", "ld-blink", "ld-bounce", "ld-bounceAlt", "ld-breath", "ld-wrench", "ld-surprise",
                    "ld-clock", "ld-jump", "ld-hit", "ld-fade", "ld-flip", "ld-float", "ld-move-ltr", "ld-tremble", "ld-tick",
                    "ld-move-rtl", "ld-move-ttb", "ld-move-btt", "ld-move-fade-ltr", "ld-move-fade-rtl", "ld-move-fade-ttb",
                    "ld-move-fade-btt", "ld-dim", "ld-swing", "ld-wander", "ld-pulse", "ld-cycle", "ld-cycle-alt", "ld-damage",
                    "ld-fade", "ld-flip", "ld-flip-h", "ld-flip-v", "ld-float", "ld-jelly", "ld-jelly-alt", "ld-jingle",
                    "ld-measure", "ld-metronome", "ld-orbit", "ld-rubber-h", "ld-rubber-v", "ld-rush-btt", "ld-rush-ttb",
                    "ld-rush-ltr", "ld-rush-rtl", "ld-shake-h", "ld-shake-v", "ld-shiver", "ld-skew", "ld-skew-alt", "ld-slide-btt",
                    "ld-slide-ltr", "ld-slide-rtl", "ld-slide-ttb", "ld-smash", "ld-spin", "ld-spin-fast", "ld-squeeze",
                    "ld-swim", "ld-swing", "ld-tick-alt", "ld-vortex", "ld-vortex-alt", "ld-wander-h", "ld-wander-v"
                 */
                let movement = this.action ? `ld-${this.action}` : 'ld-tick';
                // movement is "undefined" will be random effect
                addLDAnimation(`#${this.icon_id}`, movement);
            },
            mouseleave() {
                clearLDAnimation(`#${this.icon_id}`)
            }
        },
        created() {
            this.icon_id = this.uuid()
        }
    });
    
    Vue.component('lah-badge-button', {
        template: `<lah-button>
            <b-badge variant="light" pill>{{count}}</b-badge>
        </lah-button>`,
        data: () => ({
            count: 0
        })
    });

    // need to include chart.min.js (chart.js) first.
    Vue.component("lah-chart", {
        template: `<b-card no-body class="border-0">
            <canvas :id="id">圖形初始化失敗</canvas>
        </b-card>`,
        props: {
            type: {
                type: String,
                default: 'bar'
            },
            label: {
                type: String,
                default: '統計圖表'
            },
            opacity: {
                type: Number,
                default: 0.6
            },
            items: {
                type: Array,
                default: []
            },
            tooltip: {
                type: Function,
                default: function (tooltipItem, data) {
                    // add percent ratio to the label
                    let dataset = data.datasets[tooltipItem.datasetIndex];
                    let sum = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                        return previousValue + currentValue;
                    });
                    let currentValue = dataset.data[tooltipItem.index];
                    let percent = Math.round(((currentValue / sum) * 100));
                    if (isNaN(percent)) return ` ${data.labels[tooltipItem.index]} : ${currentValue}`;
                    return ` ${data.labels[tooltipItem.index]} : ${currentValue} [${percent}%]`;
                }
            },
            bgColor: {
                type: Function,
                default: function (dataset_item, opacity) {
                    return `rgb(${this.rand(255)}, ${this.rand(255)}, ${this.rand(255)}, ${opacity})`;
                }
            },
            borderColor: {
                type: String,
                default: `rgb(22, 22, 22)`
            },
            yAxes: {
                type: Boolean,
                default: true
            },
            xAxes: {
                type: Boolean,
                default: true
            },
            legend: {
                type: Boolean,
                default: true
            },
            beginAtZero: {
                type: Boolean,
                default: true
            },
            title: {
                type: String,
                default: ''
            },
            titlePos: {
                type: String,
                default: 'top'
            },
            aspectRatio: { type: Number, default: 2}
        },
        data: () => ({
            id: null,
            inst: null,
            chartData: null,
            update_timer: null,
            resize_timer: null
        }),
        computed: {
            style() { return `max-height: ${window.innerHeight - 185}px; max-width: ${window.innerWidth * 0.75}px;` }
        },
        watch: {
            type: function (val) {
                this.timeout(this.buildChart, 0)
            },
            chartData: function (newObj) {
                this.timeout(this.buildChart, 0)
            },
            items: function (newItems) {
                this.setData(newItems)
            }
        },
        methods: {
            update: function () {
                clearTimeout(this.update_timer);
                this.update_timer = this.timeout(() => {
                    if (this.inst) this.inst.update();
                }, 100);
            },
            resetData: function () {
                this.chartData = {
                    labels: [],
                    legend: {
                        display: true
                    },
                    datasets: [{
                        label: this.label,
                        backgroundColor: [],
                        data: [],
                        borderColor: this.borderColor,
                        order: 1,
                        opacity: this.opacity,
                        snapGaps: true,
                        borderWidth: 1
                    }]
                };
            },
            setData: function (items) {
                this.resetData();
                let opacity = this.chartData.datasets[0].opacity;
                items.forEach(item => {
                    this.chartData.labels.push(item[0]); // first element is label
                    this.chartData.datasets[0].data.push(item[1]); // second element is data count
                    // randoom color for this item
                    this.chartData.datasets[0].backgroundColor.push(this.bgColor(item, opacity));
                });
                this.timeout(this.buildChart, 0);
            },
            changeValue(label, value) {
                let found_idx = undefined;
                this.chartData.labels.find((olabel, idx, array) => {
                    if (olabel == label) found_idx = idx;
                    return olabel == label;
                })
                if (found_idx !== undefined) {
                    this.chartData.datasets[0].data[found_idx] = value;
                    // also update background color as well
                    this.chartData.datasets[0].backgroundColor[found_idx] = this.bgColor([label, value], 0.6);
                    // redraw the chart
                    Vue.nextTick(this.update);
                } else {
                    this.$warn(`lah-chart: Not found "${label}" in dataset, the ${value} will not be updated.`, this.chartData);
                }
            },
            buildChart: function (opts = {}) {
                if (this.inst) {
                    // reset the chart
                    this.inst.destroy();
                    this.inst = null;
                }
                // keep only one dataset inside
                if (this.chartData.datasets.length > 1) {
                    this.chartData.datasets = this.chartData.datasets.slice(0, 1);
                }
                this.chartData.datasets[0].label = this.label;
                switch (this.type) {
                    case "pie":
                    case "polarArea":
                    case "doughnut":
                        // put legend to the right for some chart type
                        opts.legend = {
                            display: this.legend,
                            position: opts.legend_pos || 'right'
                        };
                        break;
                    case "radar":
                        break;
                    default:
                        opts.scales = {
                            yAxes: {
                                display: this.yAxes,
                                beginAtZero: this.beginAtZero
                            },
                            xAxes: {
                                display: this.xAxes
                            }
                        };
                }
                // use chart.js directly
                // let ctx = this.$el.childNodes[0];
                let ctx = $(`#${this.id}`);
                let that = this;
                this.inst = new Chart(ctx, {
                    type: this.type,
                    data: this.chartData,
                    options: Object.assign({
                        showTooltips: true,
                        responsive: true, 
                        maintainAspectRatio: true,
                        aspectRatio: that.aspectRatio,
                        tooltips: {
                            callbacks: {
                                label: this.tooltip
                            }
                        },
                        title: {
                            display: !this.empty(this.title),
                            text: this.title,
                            position: this.titlePos
                        },
                        onClick: function (e) {
                            let payload = {};
                            payload["point"] = that.inst.getElementAtEvent(e)[0];
                            if (payload["point"]) {
                                // point e.g. {element: i, datasetIndex: 0, index: 14}
                                let idx = payload["point"].index;
                                let dataset_idx = payload["point"].datasetIndex; // in my case it should be always be 0
                                payload["label"] = that.inst.data.labels[idx];
                                payload["value"] = that.inst.data.datasets[dataset_idx].data[idx];
                            }
                            // parent uses a handle function to catch the event, e.g. catchClick(e, payload) { ... }
                            that.$emit("click", e, payload);
                        }
                    }, opts)
                });
                // sometimes the char doesn't show up properly ... so add this fix to update it
                this.timeout(this.update, 400);
            },
            toBase64Image: function () {
                return this.inst.toBase64Image()
            },
            downloadBase64PNG: function (filename = "download.png") {
                const link = document.createElement('a');
                link.href = this.toBase64Image();
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();
                //afterwards we remove the element again
                link.remove();
            }
        },
        created() { this.id = this.uuid() },
        mounted() {
            this.setData(this.items);
            // this.style = `max-height: ${window.innerHeight - 185}px; max-width: ${window.innerWidth - 20}px;`;
            // window.addEventListener("resize", e => {
            //     clearTimeout(this.resize_timer);
            //     this.resize_timer = this.timeout(() => {
            //         this.style = `max-height: ${window.innerHeight - 185}px; max-width: ${window.innerWidth - 20}px;`;
            //     }, 250);
            // });
        }
    });

    Vue.component("lah-user-board", {
        template: `<fieldset>
            <legend>
                <lah-fa-icon icon="users">
                    使用者看板
                </lah-fa-icon>
                <b-button-group size="sm" class="align-middle my-auto">
                    <lah-button class="border-0"  @click="location.href='org.html'" variant="outline-primary" size="sm" icon="sitemap"></lah-button>
                    <lah-button class="border-0"  @click="popup" variant="outline-success" size="sm" icon="question"></lah-button>
                </b-button-group>
            </legend>
            <b-input-group size="sm" prepend="關鍵字">
                <b-form-input
                    placeholder="'HB05' OR '憶如' OR '220.1.35.x'"
                    ref="input"
                    v-model="input"
                    @keyup.enter="query"
                    title="HBXXXX 或 姓名 或 IP"
                    :state="validate"
                    class="no-cache"
                ></b-form-input>
                <template v-slot:append>
                    <lah-button v-if="false" @click="query" variant="outline-primary" size="sm" v-b-tooltip="'搜尋使用者'" icon="search"></lah-button>
                </template>
            </b-input-group>
            <div id="usertag_container" class="clearfix overflow-auto" :style="style">
                <transition-group name="list" mode="out-in">
                    <div
                        v-for="(userinfo, idx) in usernames"
                        class='float-left m-2 usercard'
                        style='font-size: .8rem;'
                        :data-id="userinfo.id"
                        :data-name="userinfo.name"
                        :key="'usertag_'+userinfo.id"
                        @click.stop="popUsercard(userinfo.id)"
                        v-if="usertag_flags[userinfo.id]"
                        v-b-popover="popover(userinfo)"
                    >
                        <b-avatar v-if="avatar" button size="1.5rem" :src="avatar_src(userinfo.name)" variant="light"></b-avatar>
                        {{dogtag(userinfo)}}
                    </div>
                </transition-group>
            </div>
        </fieldset>`,
        props: {
            avatar: {
                type: Boolean,
                default: true
            },
            maxHeight: {
                type: String,
                default: ''
            }
        },
        data: () => ({
            input: '',
            last_hit_ids: [],
            ids: [],
            usertag_flags: {},
            keyup_timer: null,
            delay_ms: 800,
            usernames: []
        }),
        watch: {
            input(nVal, oVal) {
                this.filter()
            },
            myid(val) { this.input = val.replace(/\d{1}$/g, "") },
            usernames(val) {
                this.ids = val.map((item, idx, array) => {
                    // set all flags to false at first
                    Vue.set(this.usertag_flags, item.id, false);
                    return item.id;
                });
                this.ids.sort();
            }
        },
        computed: {
            validate() {
                return this.empty(this.input) ? null : this.length(this.input) > 1
            },
            style() {
                return this.empty($.trim(this.maxHeight)) ? '' : `max-height: ${this.maxHeight}px`
            }
        },
        methods: {
            popover(userinfo) {
                let left = this.left(userinfo) ? `<div>離職：${userinfo.offboard_date} <i class="fa fa-ban text-danger mx-auto"></i></div>` : '';
                let admin = '';
                if (this.isAdmin) {
                    admin = `
                        <div>生日：${userinfo.birthday}</div>
                        <div>學歷：${userinfo.education}</div>
                        <div>考試：${userinfo.exam}</div>
                        <div>手機：${userinfo.cell}</div>
                        <div>到職：${userinfo.onboard_date}</div>    
                    `;
                }
                let html = `<div class="small">
                    <div>職稱：${userinfo.title}</div>
                    <div>分機：${userinfo.ext}</div>
                    <div>單位：${userinfo.unit}</div>
                    <div>工作：${userinfo.work}</div>
                    ${admin}
                    ${left}
                </div>`;
                return {
                    content: html,
                    variant: this.empty(userinfo.offboard_date) ? 'muted' : 'dark',
                    trigger: 'hover',
                    delay: 800,
                    // customClass: 's-80',
                    html: true
                };
            },
            left(userinfo) { return !this.empty(userinfo.offboard_date) },
            length(s) {
                var b = 0,
                    i = 0,
                    c;
                for (; c = s.charCodeAt(i++); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
                return b
            },
            dogtag(userinfo) { return `${userinfo.id}: ${userinfo.name||'XXXXXX'}` },
            avatar_src(name) {
                return `get_user_img.php?name=${name}_avatar`
            },
            filter() {
                if (this.keyup_timer) {
                    clearTimeout(this.keyup_timer);
                    this.keyup_timer = null;
                }
                this.keyup_timer = this.timeout(this.mark, this.delay_ms);
            },
            mark() {
                if (this.validate) {
                    this.last_hit_ids.forEach(id => {
                        this.usertag_flags[id] = false;
                    });
                    // clear last on flags
                    this.last_hit_ids = [];

                    this.input = this.input.replace("?", ""); // prevent out of memory
                    let keyword = new RegExp(this.input, "i");
                    this.ids.forEach(id => {
                        let text = `${id}: ${this.userNames[id]}`;
                        this.usertag_flags[id] = keyword.test(text);
                        if (this.usertag_flags[id]) {
                            this.last_hit_ids.push(id);
                        }
                    });
                    // rendering may take some time so use Vue.nextTick ... 
                    Vue.nextTick(() => {
                        $('#usertag_container').unmark({
                            element: "strong",
                            className: "highlight",
                            done: () => {
                                $('#usertag_container').mark(this.input, {
                                    element: "strong",
                                    className: "highlight"
                                });
                            }
                        });
                    });
                }
            },
            query() {
                let keyword = $.trim(this.input.replace(/\?/g, ""));
                if (this.empty(keyword)) {
                    this.$warn("Keyword field should not be empty.");
                    return;
                }
                this.$http.post(CONFIG.API.JSON.USER, {
                    type: 'search_user',
                    keyword: keyword
                }).then(res => {
                    if (res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL) {
                        let card = this.$createElement("lah-user-card", {
                            props: {
                                inUserRows: res.data.raw
                            }
                        });
                        this.$modal(card, {
                            title: "搜尋使用者資訊"
                        });
                    } else {
                        this.notify({
                            title: "搜尋使用者",
                            message: res.data.message,
                            type: "warning"
                        });
                        this.$warn(res.data.message);
                    }
                }).catch(err => {
                    this.error = err;
                }).finally(() => {

                });
            },
            popup() {
                this.msgbox({
                    title: '<i class="fa fa-search fa-lg"></i> 使用者搜尋說明',
                    message: `輸入下列條件來查找。 <ul><li>使用者代碼(如：HB1184)</li> <li>名稱(如：奕)</li> <li>電腦IP位址(如：192.168.22.7)</li> </ul>`,
                    size: "sm"
                });
            },
            load_usernames() {
                this.getLocalCache('user_names').then(raw => {
                    if (raw === false) {
                        this.busy = true;
                        this.$http.post(CONFIG.API.JSON.USER, {
                            type: 'user_names'
                        }).then(res => {
                            if (res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL) {
                                res.data.raw.forEach(userinfo => {
                                    this.usernames.push({...userinfo});
                                });
                                this.setLocalCache('user_names', res.data.raw);
                            } else {
                                this.notify({
                                    title: "使用者名冊",
                                    message: res.data.message,
                                    type: "warning"
                                });
                                this.$warn(res.data.message);
                            }
                        }).catch(err => {
                            this.error = err;
                        }).finally(() => {
                            this.busy = false;
                        });
                    } else {
                        raw.forEach(userinfo => {
                            this.usernames.push({...userinfo});
                        });
                    }
                });
            }
        },
        created() { this.load_usernames() }
    });

    Vue.component("lah-user-id-input", {
        template: `<b-input-group :size="size">
            <b-input-group-prepend is-text>
                <div v-if="validate" class="my-auto"><b-avatar @click="usercard" button variant="success" size="1.2rem" :src="avatar_src" :data-id="ID" :data-name="name" class="usercard" :title="ID"></b-avatar> {{name}}</div>
                <lah-fa-icon v-else icon="user" prefix="far"> 使用者代碼</la-fa-icon>
            </b-input-group-prepend>
            <b-form-input
                ref="lah_user_id"
                v-model="id"
                placeholder="HBXXXX"
                class="no-cache"
                @input="$emit('input', id)"
                :state="validate"
            ></b-form-input>
        </b-input-group>`,
        props: ['value', 'size', 'validator', 'onlyOnBoard'],
        data: () => ({
            id: undefined,
            onboard_users: undefined
        }),
        watch: {
            value(val) {
                this.id = val
            },
            id(val) {
                this.id = this.empty(val) ? '' : val.toString().replace(/[^a-zA-Z0-9]/g, "")
            }
        },
        computed: {
            userNameMap() {
                return this.only_onboard ? this.onboard_user_names : this.userNames
            },
            ID() {
                return this.id ? this.id.toUpperCase() : null
            },
            name() {
                return this.userNameMap[this.ID] || null
            },
            validate() {
                return this.empty(this.id) ? null : this.validator ? this.validator : this.def_validator
            },
            def_validator() {
                return /*(/^HB\d{4}$/i).test(this.ID) || */ !this.empty(this.name)
            },
            avatar_src() {
                return `get_user_img.php?name=${this.name || 'not_found'}_avatar`
            },
            only_onboard() {
                return this.onlyOnBoard === true
            },
            onboard_user_names() {
                let names = {};
                if (this.onboard_users !== undefined) {
                    this.onboard_users.forEach(user => {
                        names[$.trim(user['id'])] = $.trim(user['name']);
                    });
                }
                return names;
            }
        },
        created() {
            if (this.only_onboard) {
                this.getLocalCache('onboard_users').then(cached => {
                    if (cached === false) {
                        this.isBusy = true;
                        this.$http.post(CONFIG.API.JSON.USER, {
                            type: 'on_board_users'
                        }).then(res => {
                            this.$assert(res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL, `取得在職使用者資料回傳值有誤【${res.data.status}】`)
                            this.onboard_users = res.data.raw;
                            this.setLocalCache('onboard_users', this.onboard_users, 24 * 60 * 60 * 1000); // 1 day
                        }).catch(err => {
                            this.error = err;
                        }).finally(() => {
                            this.isBusy = false;
                        });
                    } else {
                        this.onboard_users = cached;
                    }
                });
            }
        },
        mounted() {
            this.id = this.value;
        }
    });

    Vue.component("lah-user-card", {
        template: `<div>
            <h6 v-show="!empty(title)"><i class="fas fa-user-circle"></i> {{title}}</h6>
            <b-card no-body v-if="found">
                <b-tabs card :end="useEndTabs" :pills="useEndTabs" :small="useEndTabs" fill>
                    <b-tab v-for="(user_data, idx) in user_rows" :title="user_data['id']" :active="idx == 0" class="clearfix">
                        <template v-slot:title>
                            <lah-fa-icon icon="id-card"> {{user_data['id']}}</lah-fa-icon>
                        </template>
                        <b-card-title>
                            <b-avatar button size="3rem" :src="photoUrl(user_data)" variant="light" @click="openPhoto(user_data)" v-if="useAvatar"></b-avatar>
                            {{user_data['name']}}
                        </b-card-title>
                        <b-card-sub-title>{{user_data['title']}}</b-card-sub-title>
                        <b-link @click="openPhoto(user_data)" v-if="!useAvatar">
                            <b-card-img
                                :src="photoUrl(user_data)"
                                :alt="user_data['name']"
                                class="img-thumbnail float-right mx-auto ml-2 shadow-xl"
                                style="max-width: 220px"
                            ></b-card-img>
                        </b-link>
                        <lah-user-description :user_data="user_data"></lah-user-description>
                    </b-tab>
                    <b-tab v-if="foundCount == 1 && !foundLeft && message_ui">
                        <template v-slot:title>
                            <lah-fa-icon icon="comment-dots" prefix="far"> 傳送信差</lah-fa-icon>
                        </template>
                        <lah-user-message-form :ID="ID" :NAME="foundName" no-body></lah-user-message-form>
                    </b-tab>
                </b-tabs>
            </b-card>
            <lah-fa-icon icon="exclamation-circle" size="lg" variant="danger" class="my-2" v-else>找不到使用者「{{name || id || ip}}」！</lah-fa-icon>
        </div>`,
        components: {
            "lah-user-description": {
                template: `<b-card-text class="small">
                    <lah-fa-icon icon="ban" variant="danger" action="breath" v-if="isLeft" class='mx-auto'> 已離職【{{user_data["offboard_date"]}}】</lah-fa-icon>
                    <div>ID：{{user_data["id"]}}</div>
                    <div v-if="isAdmin">電腦：{{user_data["ip"]}}</div>
                    <div>分機：{{user_data["ext"]}}</div>
                    <div v-if="isAdmin">生日：{{user_data["birthday"]}} <b-badge v-show="birthAge !== false" :variant="birthAgeVariant" pill>{{birthAge}}歲</b-badge></div>
                    <div>單位：{{user_data["unit"]}}</div>
                    <div>工作：{{user_data["work"]}}</div>
                    <div v-if="isAdmin">學歷：{{user_data["education"]}}</div>
                    <div v-if="isAdmin">考試：{{user_data["exam"]}}</div>
                    <div v-if="isAdmin">手機：{{user_data["cell"]}}</div>
                    <div v-if="isAdmin">到職：{{user_data["onboard_date"]}} <b-badge v-show="workAge !== false" :variant="workAgeVariant" pill>{{workAge}}年</b-badge></div>
                    <lah-user-ext v-if="me" class="mt-2 w-50"></lah-user-ext>
                </b-card-text>`,
                props: ['user_data'],
                data: () => ({
                    now: new Date(),
                    year: 31536000000
                }),
                computed: {
                    isLeft: function () {
                        return !this.empty(this.user_data['offboard_date']);
                    },
                    birthAgeVariant: function () {
                        let badge_age = this.birthAge;
                        if (badge_age < 30) {
                            return "success";
                        } else if (badge_age < 40) {
                            return "primary";
                        } else if (badge_age < 50) {
                            return "warning";
                        } else if (badge_age < 60) {
                            return "danger";
                        }
                        return "dark";
                    },
                    birthAge: function () {
                        let birth = this.user_data["birthday"];
                        if (birth) {
                            birth = this.toADDate(birth);
                            let temp = Date.parse(birth);
                            if (temp) {
                                let born = new Date(temp);
                                return ((this.now - born) / this.year).toFixed(1);
                            }
                        }
                        return false;
                    },
                    workAge: function () {
                        let AP_ON_DATE = this.user_data["onboard_date"];
                        let AP_OFF_JOB = this.isLeft ? 'Y' : 'N';
                        let AP_OFF_DATE = this.user_data["offboard_date"];

                        if (AP_ON_DATE != undefined && AP_ON_DATE != null) {
                            AP_ON_DATE = AP_ON_DATE.date ? AP_ON_DATE.date.split(" ")[0] : AP_ON_DATE;
                            AP_ON_DATE = this.toADDate(AP_ON_DATE);
                            let temp = Date.parse(AP_ON_DATE);
                            if (temp) {
                                let on = new Date(temp);
                                let now = this.now;
                                if (AP_OFF_JOB == "Y") {
                                    AP_OFF_DATE = this.toADDate(AP_OFF_DATE);
                                    temp = Date.parse(AP_OFF_DATE);
                                    if (temp) {
                                        // replace now Date to off board date
                                        now = new Date(temp);
                                    }
                                }
                                return ((now - on) / this.year).toFixed(1);
                            }
                        }
                        return false;
                    },
                    workAgeVariant: function () {
                        let work_age = this.workAge;
                        if (work_age < 5) {
                            return 'success';
                        } else if (work_age < 10) {
                            return 'primary';
                        } else if (work_age < 20) {
                            return 'warning';
                        }
                        return 'danger';
                    },
                    me() { return this.myinfo ? this.user_data['id'] == this.myinfo['id'] : false }
                },
                methods: {
                    toTWDate: function (ad_date) {
                        tw_date = ad_date.replace('/-/g', "/");
                        // detect if it is AD date
                        if (tw_date.match(/^\d{4}\/\d{2}\/\d{2}$/)) {
                            // to TW date
                            tw_date = (parseInt(tw_date.substring(0, 4)) - 1911) + tw_date.substring(4);
                        }
                        return tw_date;
                    },
                    toADDate: function (tw_date) {
                        let ad_date = tw_date.replace('/-/g', "/");
                        // detect if it is TW date
                        if (ad_date.match(/^\d{3}\/\d{2}\/\d{2}$/)) {
                            // to AD date
                            ad_date = (parseInt(ad_date.substring(0, 3)) + 1911) + ad_date.substring(3);
                        }
                        return ad_date;
                    }
                }
            }
        },
        props: ['id', 'name', 'ip', 'title', 'avatar', 'inUserRows', 'noMessage'],
        data: () => ({
            user_rows: null,
            msg_title: '',
            msg_content: ''
        }),
        computed: {
            found: function () {
                return this.user_rows !== null && this.user_rows !== undefined
            },
            notFound: function () {
                return `找不到使用者 「${this.name || this.id || this.ip || this.myip}」`;
            },
            foundName: function () {
                return this.user_rows[0]["name"]
            },
            foundCount: function () {
                return this.user_rows.length
            },
            foundLeft: function () {
                return this.user_rows[0]["offboard_date"] != ''
            },
            useAvatar: function () {
                return !this.empty(this.avatar)
            },
            ID: function () {
                return this.user_rows ? this.user_rows[0]['id'] : null
            },
            useEndTabs() {
                return this.inUserRows ? this.inUserRows.length > 1 : false
            },
            message_ui() { return this.empty(this.noMessage) }
        },
        methods: {
            photoUrl: function (user_data) {
                if (this.useAvatar) {
                    return `get_user_img.php?name=${user_data['name']}_avatar`;
                }
                return `get_user_img.php?name=${user_data['name']}`;
            },
            openPhoto: function (user_data) {
                // get_user_img.php?name=${user_data['name']}
                //<b-img thumbnail fluid src="https://picsum.photos/250/250/?image=54" alt="Image 1"></b-img>
                this.msgbox({
                    title: `${user_data['name']}照片`,
                    message: this.$createElement("div", {
                        domProps: {
                            className: "text-center"
                        }
                    }, [this.$createElement("b-img", {
                        props: {
                            fluid: true,
                            src: `get_user_img.php?name=${user_data['name']}`,
                            alt: user_data['name'],
                            thumbnail: true
                        }
                    })]),
                    size: "lg",
                    backdrop_close: true
                });
            },
            cacheUserRows: function () {
                let payload = {};
                // basically cache for one day in localforage
                if (!this.empty(this.id)) {
                    payload[this.id] = this.user_rows;
                    this.setLocalCache(this.id, this.user_rows, this.dayMilliseconds);
                }
                if (!this.empty(this.name)) {
                    payload[this.name] = this.user_rows;
                    this.setLocalCache(this.name, this.user_rows, this.dayMilliseconds);
                }
                if (!this.empty(this.ip)) {
                    payload[this.ip] = this.user_rows;
                    this.setLocalCache(this.ip, this.user_rows, this.dayMilliseconds);
                }
                this.$store.commit('cache', payload);
                if (this.user_rows['ip'] == this.myip) {
                    this.$store.commit('myid', this.user_rows['id']);
                }
            },
            restoreUserRows: async function () {
                try {
                    // find in $store(in-memory)
                    let user_rows = this.cache.get(this.id) || this.cache.get(this.name) || this.cache.get(this.ip) || this.inUserRows;
                    if (this.empty(user_rows)) {
                        // find in localforage
                        user_rows = await this.getLocalCache(this.id) || await this.getLocalCache(this.name) || await this.getLocalCache(this.ip);
                        if (this.empty(user_rows)) {
                            return false;
                        } else {
                            // also put back to $store
                            let payload = {};
                            if (!this.empty(this.id)) {
                                payload[this.id] = user_rows;
                            }
                            if (!this.empty(this.name)) {
                                payload[this.name] = user_rows;
                            }
                            if (!this.empty(this.ip)) {
                                payload[this.ip] = user_rows;
                            }
                            this.$store.commit('cache', payload);
                        }
                    }
                    this.user_rows = user_rows || null;
                    if (this.user_rows && this.user_rows['ip'] == this.myip) {
                        this.$store.commit('myid', this.user_rows['id']);
                    }
                    this.$emit('found', this.foundName);
                } catch (err) {
                    console.error(err);
                }
                return this.user_rows !== null;
            }
        },
        async created() {
            const succeed_cached = await this.restoreUserRows();
            if (!succeed_cached) {
                if (!(this.name || this.id || this.ip)) this.ip = this.myip || await this.getLocalCache('myip');
                this.$http.post(CONFIG.API.JSON.USER, {
                    type: "user_info",
                    name: $.trim(this.name),
                    id: $.trim(this.id),
                    ip: $.trim(this.ip)
                }).then(res => {
                    if (res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL) {
                        this.user_rows = res.data.raw;
                        this.cacheUserRows();
                        this.$emit('found', this.foundName);
                    } else {
                        console.warn(`找不到 '${this.name || this.id || this.ip}' 資料`);
                        this.$emit('notFound', this.name || this.id || this.ip);
                    }
                }).catch(err => {
                    this.error = err;
                    this.$emit('error', this.name || this.id || this.ip);
                });
            }
        }
    });

    Vue.component('lah-user-message-form', {
        template: `<b-card :no-body="noBody" :class="border">
            <h5 v-if="showTitle"><lah-fa-icon icon="comment-dots" prefix="far"> {{title}}</lah-fa-icon></h5>
            <lah-user-id-input v-if="showIdInput" v-model="id"></lah-user-id-input>
            <b-form-group
                label-cols-sm="auto"
                label-cols-lg="auto"
                :description="msgTitleCount"
                label="標題"
                label-align="right"
            >
                <b-form-input
                    v-model="msg_title"
                    type="text"
                    placeholder="Hi there!"
                    :state="msgTitleOK"
                ></b-form-input>
            </b-form-group>
            <b-form-group
                label-cols-sm="auto"
                label-cols-lg="auto"
                :description="msgContentCount"
                label="內文"
                label-align="right"
            >
                <b-form-textarea
                    placeholder="Dear xxxx, ..."
                    rows="3"
                    max-rows="5"
                    v-model="msg_content"
                    :state="msgContentOK"
                    style="overflow: hidden"
                ></b-form-textarea>
            </b-form-group>
            <div class="d-flex" :id="btn_grp_id">
                <b-input-group style="margin:auto; width:auto;">
                    <b-input-group-prepend>
                        <b-form-timepicker
                            :reset-value="send_time"
                            v-model="send_time"
                            size="sm"
                            show-seconds
                            now-button
                            label-now-button="現在"
                            label-close-button="完成"
                            label-reset-button="預設值"
                            button-only
                            button-variant="success"
                            v-b-tooltip.left="msgSendTime"
                        ></b-form-timepicker>
                    </b-input-group-prepend>
                    <b-button ref="msgbtn" variant="outline-primary" @click="send" :disabled="!sendMessageOK" size="sm"><lah-fa-icon icon="paper-plane" prefix="far"> 傳送</lah-fa-icon></b-button>
                    <b-input-group-append>
                        <b-form-timepicker
                            reset-value="23:59:59"
                            v-model="end_time"
                            size="sm"
                            show-seconds
                            now-button
                            reset-button
                            label-now-button="現在"
                            label-close-button="完成"
                            label-reset-button="預設值"
                            button-only
                            button-variant="secondary"
                            v-b-tooltip.right="msgEndTime"
                        ></b-form-timepicker>
                    </b-input-group-append>
                </b-input-group>
            </div>
        </b-card>`,
        props: {
            ID: {
                type: String,
                default: ''
            },
            NAME: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: ''
            },
            noBody: {
                type: Boolean,
                default: false
            },
            noConfirm: {
                type: Boolean,
                default: true
            }
        },
        data: () => ({
            msg_title: '',
            msg_content: '',
            id: '',
            send_time: '',
            end_time: '23:59:59',
            btn_grp_id: ''
        }),
        computed: {
            border: function () {
                return this.noBody ? 'border-0' : ''
            },
            showTitle: function () {
                return !this.empty(this.title)
            },
            showIdInput: function () {
                return this.empty(this.ID) && this.empty(this.NAME)
            },
            sendMessageOK: function () {
                return this.msgTitleOK && this.msgContentOK && (!this.empty(this.ID) || !this.empty(this.id))
            },
            msgContentOK: function () {
                return this.empty(this.msg_content) ? null : this.msg_content.length <= 500
            },
            msgTitleOK: function () {
                return this.empty(this.msg_title) ? null : this.msg_title.length <= 20
            },
            msgTitleCount: function () {
                return this.empty(this.msg_title) ? '言簡意賅最多20字中文 ... ' : `${this.msg_title.length} / 20`
            },
            msgContentCount: function () {
                return this.empty(this.msg_content) ? '最多500字中文 ... ' : `${this.msg_content.length} / 500`
            },
            msgSendTime: function () {
                return this.empty(this.send_time) ? '立即傳送' : `預定 ${this.send_time} 送出`
            },
            msgEndTime: function () {
                return this.empty(this.end_time) ? '23:59:59為止' : `預定 ${this.end_time} 忽略`
            }
        },
        methods: {
            send: function (e) {
                if (this.disableMSDBQuery) {
                    this.$warn("CONFIG.DISABLE_MSDB_QUERY is true, skipping lah-user-message-form::send.");
                    return;
                }
                let title = this.msg_title;
                let content = this.msg_content.replace(/\n/g, "\r\n"); // Messenger client is Windows app, so I need to replace \n to \r\n
                let who = this.ID || this.NAME || this.id;

                if (content.length > 1000) {
                    this.alert({
                        message: "<span>內容不能超過1000個字元。</span><p>" + content + "</p>",
                        type: "warning"
                    });
                    return;
                }
                if (this.noConfirm) {
                    this.callback();
                } else {
                    this.$confirm(`"確認要送 「${title}」 給 「${who}」？<p class="mt-2">${content}</p>`, this.callback);
                }
            },
            callback: function () {
                let title = this.msg_title;
                let content = this.msg_content.replace(/\n/g, "\r\n"); // Messenger client is Windows app, so I need to replace \n to \r\n
                let who = this.ID || this.NAME || this.id;
                this.animated(`#${this.btn_grp_id}`, {
                    name: 'lightSpeedOut',
                    duration: 'once-anim-cfg-2x',
                    callback: () => {
                        $(`#${this.btn_grp_id}`).hide();
                        this.isBusy = true;
                        this.$http.post(CONFIG.API.JSON.MSSQL, {
                            type: "send_message",
                            title: title,
                            content: content,
                            who: who,
                            send_time: this.send_time,
                            end_time: this.end_time
                        }).then(res => {
                            this.$assert(res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL, "回傳之json object status異常【" + res.data.message + "】");
                            this.animated(`#${this.btn_grp_id}`, {
                                name: 'slideInUp',
                                callback: () => {
                                    this.msg_content = '';
                                    this.msg_title = '';
                                    this.notify({
                                        title: "傳送訊息",
                                        message: res.data.message
                                    });
                                }
                            });
                        }).catch(err => {
                            this.error = err;
                        }).finally(() => {
                            this.isBusy = false;
                            $(`#${this.btn_grp_id}`).show();
                        });
                    }
                });
            },
            timeState: function (time) {
                return this.empty(time) ? null : /\d{2}:\d{2}:\d{2}/gi.test(time)
            }
        },
        created() {
            this.send_time = this.nowTime;
            this.btn_grp_id = this.uuid();
        }
    });

    Vue.component('lah-user-message-history', {
        template: `<div>
            <h6 v-show="!empty(title)"><lah-fa-icon icon="angle-double-right" variant="dark"></lah-fa-icon> {{title}} <b-form-spinbutton v-if="enable_spinbutton" v-model="count" min="1" size="sm" inline></b-form-spinbutton></h6>
            <b-card-group ref="group" v-if="ready" :columns="columns" :deck="!columns">
                <b-card no-body v-if="useTabs">
                    <b-tabs card :end="endTabs" :pills="endTabs" align="center" small>
                        <b-tab v-for="(message, index) in raws" :title="index+1">
                            <b-card-title title-tag="h6">
                                <lah-fa-icon v-if="message['done'] == 1" icon="eye" variant="muted" title="已看過"></lah-fa-icon>
                                <lah-fa-icon v-else icon="eye-slash" title="還沒看過！"></lah-fa-icon>
                                <strong class="align-middle">{{message['xname']}}</strong>
                            </b-card-title>
                            <b-card-sub-title sub-title-tag="small"><div class="text-right">{{message['sendtime']['date'].substring(0, 19)}}</div></b-card-sub-title>
                            <b-card-text v-html="format(message['xcontent'])" class="small"></b-card-text>
                        </b-tab>
                    </b-tabs>
                </b-card>
                <transition-group name="list" mode="out-in" v-else>
                    <b-card
                        v-for="(message, index) in raws"
                        class="overflow-hidden bg-light"
                        :border-variant="border(index)"
                        :key="'card_'+index"
                    >
                        <b-card-title title-tag="h6">
                            <strong class="align-middle">
                                <lah-fa-icon v-if="raws[index]['done'] != 1" icon="angle-double-right" variant="danger" action="wander"></lah-fa-icon>
                                {{index+1}}. 
                                {{message['xname']}}
                            </strong>
                            <span v-if="showCtlBtn(message['sendtime']['date'].substring(0, 19))">
                                <b-btn v-if="raws[index]['done'] != 1" size="sm" variant="outline-primary" @click.stop="read(message['sn'], index)" title="設為已讀" class="border-0"> <lah-fa-icon icon="eye-slash"></lah-fa-icon> </b-btn>
                                <b-btn v-else size="sm" variant="outline-secondary" @click.stop="unread(message['sn'], index)" title="設為未讀" class="border-0"> <lah-fa-icon :id="message['sn']" icon="eye"></lah-fa-icon> </b-btn>
                            </span>
                            <b-button-close v-if="showDeleteBtn(message)" @click="del(message['sn'])" title="刪除這個訊息"></b-button-close>
                        </b-card-title>
                        <b-card-sub-title sub-title-tag="small">
                            <div class="float-right">
                                <ul>
                                    <li>通知：{{message['sendtime']['date'].substring(0, 19)}}</li>
                                    <li>忽略：{{message['enddate']['date'].substring(0, 19)}}</li>
                                </ul>
                            </div>
                        </b-card-sub-title>
                        <b-card-text v-html="format(message['xcontent'])" class="small mt-2 clearfix"></b-card-text>
                    </b-card>
                </transition-group>
            </b-card-group>
            <lah-fa-icon variant="danger" icon="exclamation-circle" size="lg" v-else>{{notFound}}</lah-fa-icon>
        </div>`,
        props: ['id', 'name', 'ip', 'count', 'title', 'spinbutton', 'tabs', 'tabsEnd', 'noCache'],
        data: () => ({
            raws: undefined,
            urlPattern: /((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/ig
        }),
        watch: {
            count: function (nVal, oVal) {
                this.load()
            }
        },
        computed: {
            ready: function () {
                return !this.empty(this.raws)
            },
            notFound: function () {
                return `「${this.name || this.id || this.ip || this.myip}」找不到信差訊息！`
            },
            columns: function () {
                return !this.useTabs && this.enable_spinbutton
            },
            enable_spinbutton: function () {
                return !this.empty(this.spinbutton)
            },
            useTabs: function () {
                return !this.empty(this.tabs)
            },
            endTabs: function () {
                return !this.empty(this.tabsEnd)
            },
            cache_prefix: function () {
                return this.id || this.name || this.ip || this.myip
            },
            cache_key: function () {
                return `${this.cache_prefix}-messeages`
            }
        },
        methods: {
            format: function (content) {
                return content
                    .replace(this.urlPattern, "<a href='$1' target='_blank' title='點擊前往'>$1</a>")
                    .replace(/\r\n/g, "<br />");
            },
            border: function (index) {
                return this.raws[index]['done'] == 0 ? 'danger' : 'secondary'
            },
            load: async function (force = false) {
                if (!this.disableMSDBQuery) {
                    if (this.isBusy) return;
                    try {
                        if (!this.empty(this.noCache) || force) await this.removeLocalCache(this.cache_key);
                        this.getLocalCache(this.cache_key).then(raws => {
                            if (raws !== false && raws.length == this.count) {
                                this.raws = raws;
                            } else if (raws !== false && raws.length >= this.count) {
                                this.raws = raws.slice(0, this.count);
                            } else {
                                this.isBusy = true;
                                this.$http.post(CONFIG.API.JSON.MSSQL, {
                                    type: "user_message",
                                    id: this.id,
                                    name: this.name,
                                    ip: this.ip || this.myip,
                                    count: this.count
                                }).then(res => {
                                    if (res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL) {
                                        this.raws = res.data.raw
                                        this.setLocalCache(this.cache_key, this.raws, 60000); // 1 min
                                    } else {
                                        this.notify({
                                            title: "查詢信差訊息",
                                            message: res.data.message,
                                            type: "warning"
                                        });
                                    }
                                }).catch(err => {
                                    this.error = err;
                                }).finally(() => this.isBusy = false);
                            }
                        });
                    } catch (err) {
                        this.error = err;
                    }
                }
            },
            read(sn, idx) {
                if (!this.disableMSDBQuery) {
                    this.$http.post(CONFIG.API.JSON.MSSQL, {
                        type: "set_read_user_message",
                        sn: sn
                    }).then(res => {
                        this.notify({
                            title: "設定已讀取",
                            message: res.data.message,
                            type: res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL ? 'success' : 'warning'
                        });
                        this.raws[idx]['done'] = XHR_STATUS_CODE.SUCCESS_NORMAL ? 1 : 0;
                    }).catch(err => {
                        this.error = err;
                    }).finally(() => {

                    });
                }
            },
            unread(sn, idx) {
                if (!this.disableMSDBQuery) {
                    this.$http.post(CONFIG.API.JSON.MSSQL, {
                        type: "set_unread_user_message",
                        sn: sn
                    }).then(res => {
                        this.notify({
                            title: "設定未讀取",
                            message: res.data.message,
                            type: res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL ? 'success' : 'warning'
                        });
                        this.raws[idx]['done'] = XHR_STATUS_CODE.SUCCESS_NORMAL ? 0 : 1;
                    }).catch(err => {
                        this.error = err;
                    }).finally(() => {

                    });
                }
            },
            del(sn) {
                if (!this.disableMSDBQuery) {
                    this.$confirm('此動作無法復原，確定刪除本則訊息？', () => {
                        this.$http.post(CONFIG.API.JSON.MSSQL, {
                            type: "del_user_message",
                            sn: sn
                        }).then(res => {
                            this.notify({
                                title: "刪除訊息",
                                message: res.data.message,
                                type: res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL ? 'success' : 'warning'
                            });
                            if (res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL) {
                                this.load(true);
                            }
                        }).catch(err => {
                            this.error = err;
                        }).finally(() => {

                        });
                    });
                }
            },
            showCtlBtn(snd_time) {
                const date1 = +new Date();
                const date2 = +new Date(snd_time.replace(' ', 'T'));
                return date1 - date2 > 0;
            },
            showDeleteBtn(message) {
                return $.trim(message['sender']) == $.trim(this.myid) && message['done'] == 0
            }
        },
        created() {
            let parsed = parseInt(this.count);
            this.count = isNaN(parsed) ? 3 : parsed;
            this.$root.$on(CONFIG.LAH_ROOT_EVENT.MESSAGE_UNREAD, payload => {
                if (payload.count > 0) {
                    this.notify({
                        message: `您有 ${payload.count} 則未讀訊息。`,
                        type: "warning"
                    })
                }
            });
            this.load();
        }
    });

    Vue.component('lah-user-message-reservation', {
        template: `<div v-if="show">
            <h6 v-if="heading"><lah-fa-icon icon="angle-double-right" variant="dark"></lah-fa-icon> 信差提醒</h6>
            <b-form-group :title="title" label-size="lg">
                <template v-slot:label v-if="!empty(label)">
                    <lah-fa-icon icon="bell" prefix="far"> {{label}}</lah-fa-icon>
                </template>
                <b-input-group size="sm" prepend="訊息" class="mb-1">
                    <b-form-input
                        v-model="message"
                        type="text"
                        placeholder="17:00:00 打卡提醒 ... "
                        :state="!empty(message)"
                        inline
                        @keyup.enter="send"
                        class="no-cache"
                    ></b-form-input>
                </b-input-group>
                <b-button-group size="sm">
                    <b-button size="sm" title="送出" variant="outline-primary" @click.stop="send"><lah-fa-icon icon="paper-plane" prefix="far"></lah-fa-icon></b-button>
                    <b-form-timepicker
                        hide-header
                        reset-value="17:00:00"
                        v-model="sendtime"
                        button-only
                        no-close-button
                        title="預約時間"
                        label-close-button="確定"
                        label-reset-button="預設值"
                        size="sm"
                        dropdown
                        @shown="shown"
                    ></b-format-timepicker>
                </b-button-group>
                <span class="text-muted ml-auto align-middle">預約時間：{{sendtime}}</span>
            </b-form-group>
        </div>`,
        props: {
            heading: {
                type: Boolean,
                default: true
            },
            label: {
                type: String,
                default: ''
            }
        },
        data: () => ({
            title: '',
            message: '',
            sendtime: '17:00:00',
            sendtime_ms: +new Date(),
            buffer_ms: 5 * 60 * 1000,
            now: new Date()
        }),
        watch: {
            sendtime(nVal, oVal) {
                this.sendtime_ms = +new Date(this.ad_date + "T" + nVal);
                this.message = `${nVal} 提醒我`;
                this.title = `預計 ${this.droptime} 忽略本則訊息`;
            }
        },
        computed: {
            show() {
                return !this.empty(this.myid)
            },
            ad_date() {
                return this.now.getFullYear() + "-" + ("0" + (this.now.getMonth() + 1)).slice(-2) + "-" + ("0" + this.now.getDate()).slice(-2)
            },
            droptime() {
                let dropdate = new Date(this.sendtime_ms + this.buffer_ms);
                return ("0" + dropdate.getHours()).slice(-2) + ":" +
                    ("0" + dropdate.getMinutes()).slice(-2) + ":" +
                    ("0" + dropdate.getSeconds()).slice(-2);
            }
        },
        methods: {
            send() {
                if (this.disableMSDBQuery) {
                    this.$warn("CONFIG.DISABLE_MSDB_QUERY is true, skipping lah-user-message-reservation::send.");
                    return;
                }
                if (this.empty(this.title)) {
                    this.notify({
                        message: '請輸入訊息',
                        type: "warning"
                    })
                    return;
                }
                if (this.now.getTime() >= this.sendtime_ms) {
                    this.notify({
                        message: '請選擇現在之後的時間',
                        type: "warning"
                    })
                    return;
                }
                this.isBusy = true;
                this.$http.post(CONFIG.API.JSON.MSSQL, {
                    type: "send_message",
                    title: this.message,
                    content: this.message,
                    who: this.myid,
                    send_time: this.sendtime,
                    end_time: this.droptime
                }).then(res => {
                    this.$assert(res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL, "回傳之json object status異常【" + res.data.message + "】");
                    this.title = '';
                    this.notify({
                        title: "傳送訊息",
                        message: res.data.message
                    });
                }).catch(err => {
                    this.error = err;
                }).finally(() => {
                    this.isBusy = false;
                    this.message = '';
                });
            },
            shown() {
                this.now = new Date();
                let choosed_ms = +new Date(this.ad_date + "T" + this.sendtime);
                let now_ms = this.now.getTime() + this.buffer_ms; // add 5 mins buffer
                if (now_ms >= choosed_ms) {
                    let an_hour_later = new Date(now_ms + 10 * 60 * 1000);
                    this.sendtime = ("0" + an_hour_later.getHours()).slice(-2) + ":" +
                        ("0" + an_hour_later.getMinutes()).slice(-2) + ":" +
                        ("0" + an_hour_later.getSeconds()).slice(-2);
                }
            }
        }
    });

    Vue.component('lah-user-ext', {
        template: `<b-card no-body class="border-0" v-if="myinfo">
            <h6 v-if="heading" class="mb-2"><lah-fa-icon icon="angle-double-right" variant="dark"> 我的分機</lah-fa-icon></h6>
            <b-input-group size="sm" prepend="分機">
                <b-form-input
                    v-model="myinfo['ext']"
                    type="number"
                    @keyup.enter="update"
                    :state="validate"
                    class="no-cache"
                ></b-form-input>
                <template v-slot:append>
                    <lah-button icon="edit" variant="outline-primary" @click="update" title="更新" :disabled="!validate" v-show="need_update"></lah-button>
                </template>
            </b-input-group>
        </b-card>`,
        props: {
            heading: {
                type: Boolean,
                default: true
            }
        },
        data: () => ({
            orig_ext: 503
        }),
        watch: {
            myinfo(val) { this.orig_ext = val['ext'] }
        },
        computed: {
            validate() { return this.myinfo ? (this.myinfo['ext'] > 99 && this.myinfo['ext'] < 700) : false },
            need_update() { return this.orig_ext != this.myinfo['ext'] }
        },
        methods: {
            update() {
                if (this.validate) {
                    this.isBusy = true;
                    this.$http.post(CONFIG.API.JSON.USER, {
                        type: "upd_ext",
                        id: this.myinfo['id'],
                        ext: this.myinfo['ext']
                    }).then(res => {
                        this.$assert(res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL, "回傳之json object status異常【" + res.data.message + "】");
                        this.notify({
                            title: "更新分機號碼",
                            message: res.data.message,
                            type: res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL ? 'success' : 'danger'
                        });
                        // clear local cache after success updated
                        if (res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL) {
                            this.orig_ext = this.myinfo['ext'];
                            // remove frontend cache for refreshing as well
                            this.removeLocalCache('myinfo');
                            this.removeLocalCache('lah-org-chart');
                        }
                    }).catch(err => {
                        this.error = err;
                    }).finally(() => {
                        this.isBusy = false;
                        this.update_doc();
                    });
                }
            },
            update_doc() {
                if (!this.disableMSDBQuery) {
                    this.isBusy = true;
                    // also update old db database
                    this.$http.post(CONFIG.API.JSON.MSSQL, {
                        type: "upd_ext_doc",
                        id: this.myinfo['id'],
                        ext: this.myinfo['ext']
                    }).then(res => {
                        this.$assert(res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL, "回傳之json object status異常【" + res.data.message + "】");
                        this.notify({
                            title: "更新doc資料庫分機號碼",
                            message: res.data.message,
                            type: res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL ? 'success' : 'danger'
                        });
                    }).catch(err => {
                        this.error = err;
                    }).finally(() => {
                        this.isBusy = false;
                    });
                }
            }
        }
    });
    
    Vue.component('lah-report', {
        template: `<fieldset>
            <legend>
                <lah-fa-icon icon="file-excel" prefix="far"></lah-fa-icon>
                報表資料匯出
                <b-btn @click="popup" variant="outline-success" class="border-0 my-auto" size="sm"><lah-fa-icon icon="question"></lah-fa-icon></b-btn>
                {{selected}}
            </legend>
            <b-input-group size="sm">
                <b-input-group-prepend is-text>預載查詢選項</b-input-group-prepend>
                <b-form-select ref="select" v-model="selected" :options="options" @change="change"></b-form-select>
                <lah-button icon="file-export" class="ml-1" @click="output" variant="outline-primary" v-b-tooltip="'匯出'" :disabled="!validate"></lah-button>
            </b-input-group>
            <b-form-textarea
                ref="sql"
                placeholder="SELECT SQL text ..."
                rows="3"
                max-rows="8"
                v-model="sql"
                size="sm"
                class="mt-1 overflow-auto no-cache"
                :state="validate"
            ></b-form-textarea>
        </fieldset>`,
        data: () => ({
            selected: '',
            selected_label: '',
            sql: '',
            options: [
                {
                    label: '==== 所內登記案件統計 ====',
                    options: [{
                            text: '每月案件統計',
                            value: '01_reg_case_monthly.sql'
                        },
                        {
                            text: '每月案件 by 登記原因',
                            value: '11_reg_reason_query_monthly.sql'
                        },
                        {
                            text: '每月遠途先審案件',
                            value: '02_reg_remote_case_monthly.sql'
                        },
                        {
                            text: '每月跨所案件【本所代收】',
                            value: '03_reg_other_office_case_monthly.sql'
                        },
                        {
                            text: '每月跨所案件【非本所收件】',
                            value: '04_reg_other_office_case_2_monthly.sql'
                        },
                        {
                            text: '每月跨所子號案件【本所代收】',
                            value: '09_reg_other_office_case_3_monthly.sql'
                        },
                        {
                            text: '每月跨所各登記原因案件統計 by 收件所',
                            value: '10_reg_reason_stats_monthly.sql'
                        },
                        {
                            text: '每月權利人＆義務人為外國人案件',
                            value: '07_reg_foreign_case_monthly.sql'
                        },
                        {
                            text: '每月外國人地權登記統計',
                            value: '07_regf_foreign_case_monthly.sql'
                        },
                        {
                            text: '每月土地建物登記統計檔',
                            value: '17_rega_case_stats_monthly.sql'
                        },
                        {
                            text: '外站人員謄本核發量',
                            value: '08_reg_workstation_case.sql'
                        }
                    ]
                },
                {
                    label: '==== 所內其他統計 ====',
                    options: [{
                            text: '已結卻延期之複丈案件',
                            value: '16_sur_close_delay_case.sql'
                        },
                        {
                            text: '因雨延期測量案件數',
                            value: '14_sur_rain_delay_case.sql'
                        },
                        {
                            text: '段小段面積統計',
                            value: '05_adm_area_size.sql'
                        },
                        {
                            text: '段小段土地標示部筆數',
                            value: '06_adm_area_blow_count.sql'
                        },
                        {
                            text: '未完成地價收件資料',
                            value: '12_prc_not_F_case.sql'
                        },
                        {
                            text: '法院謄本申請LOG檔查詢 BY 段、地建號',
                            value: '13_log_court_cert.sql'
                        },
                        {
                            text: '某段之土地所有權人清冊資料',
                            value: '15_reg_land_stats.sql'
                        },
                        {
                            text: '全國跨縣市收件資料',
                            value: '18_cross_county_crsms.sql'
                        }
                    ]
                },{
                    label: '==== 地籍資料 ====',
                    options: [{
                            text: 'AI00301 - 土地標示部資料',
                            value: 'txt_AI00301.sql'
                        },
                        {
                            text: 'AI00401 - 土地所有權部資料',
                            value: 'txt_AI00401.sql'
                        },
                        {
                            text: 'AI00601 - 土地管理者資料',
                            value: 'txt_AI00601_B.sql'
                        },
                        {
                            text: 'AI00601 - 建物管理者資料',
                            value: 'txt_AI00601_E.sql'
                        },
                        {
                            text: 'AI00701 - 建物標示部資料',
                            value: 'txt_AI00701.sql'
                        },
                        {
                            text: 'AI00801 - 基地坐落資料',
                            value: 'txt_AI00801.sql'
                        },
                        {
                            text: 'AI00901 - 建物分層及附屬資料',
                            value: 'txt_AI00901.sql'
                        },
                        {
                            text: 'AI01001 - 主建物與共同使用部分資料',
                            value: 'txt_AI01001.sql'
                        },
                        {
                            text: 'AI01101 - 建物所有權部資料',
                            value: 'txt_AI01101.sql'
                        },
                        {
                            text: 'AI02901 - 土地各部別之其他登記事項列印',
                            value: 'txt_AI02901_B.sql'
                        },
                        {
                            text: 'AI02901 - 建物各部別之其他登記事項列印',
                            value: 'txt_AI02901_E.sql'
                        }
                    ]
                }
            ]
        }),
        computed: {
            validate() {
                return this.empty(this.sql) ? null : /^select/gi.test(this.sql)
            },
            cache_key() {
                return `lah-report_sql`
            }
        },
        methods: {
            change(val) {
                let opt = $("select.custom-select optgroup option[value='" + val + "']")[0];
                this.$assert(opt, "找不到選取的 option。", $("select.custom-select optgroup option[value='" + val + "']"));
                this.selected_label = opt.label;
                this.$http.post(CONFIG.API.FILE.LOAD, {
                    type: "load_select_sql",
                    file_name: this.selected
                }).then(res => {
                    this.$assert(res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL, `讀取異常，回傳狀態值為 ${res.data.status}，${res.data.message}`);
                    this.sql = res.data.data;
                    this.setLocalCache(this.cache_key, this.sql, 0); // no expiring
                    // let cache work
                    Vue.nextTick(() => $(this.$refs.sql.$el).trigger("blur"));
                }).catch(err => {
                    this.error = err;
                }).finally(() => {

                });
            },
            output(e) {
                if (this.selected.startsWith("txt_")) {
                    this.download('file_sql_txt');
                } else {
                    this.download('file_sql_csv');
                }
            },
            download(type) {
                if (this.validate) {
                    this.isBusy = true;
                    this.$http.post(CONFIG.API.FILE.EXPORT, {
                        type: type,
                        sql: this.sql,
                        responseType: 'blob'
                    }).then(res => {
                        // BE should not response anything (wrote tmp.txt or tmp.csv)
                        if (res.data.length > 0) {
                            this.$error(typeof res.data, res.data.length);
                            this.notify({
                                title: '下載報表檔案',
                                message: res.data,
                                type: 'danger'
                            });
                        } else {
                            let notify_title = '匯出CSV檔案';
                            let iframe_title = '下載CSV';
                            let api = CONFIG.API.FILE.CSV + '?filename=' + this.selected_label;
                            if (type == "file_sql_txt") {
                                notify_title = '匯出TXT檔案';
                                iframe_title = '下載TXT';
                                api = CONFIG.API.FILE.TXT + '?filename=' + this.selected_label;
                            }
                            this.notify({
                                title: notify_title,
                                message: '<i class="fas fa-cog ld ld-spin"></i> 後端處理中 ... ',
                                type: "warning",
                                duration: 2000
                            });
                            // second param usage => e.target.title to get the title
                            this.open(api, {
                                target: {
                                    title: iframe_title
                                }
                            });
                            this.timeout(() => closeModal(() => this.notify({
                                title: notify_title,
                                message: '<i class="fas fa-check ld ld-pulse"></i> 後端作業完成',
                                type: "success"
                            })), 2000);
                        }
                    }).catch(err => {
                        this.error = err;
                    }).finally(() => {
                        this.isBusy = false;
                    });
                } else {
                    this.notify({
                        title: "匯出SQL檔案報表",
                        message: "SQL內容不能為空的。",
                        type: "warning"
                    });
                }
            },
            popup(e) {
                this.msgbox({
                    title: '報表檔案匯出功能提示',
                    message: `
                        <h5>地政局索取地籍資料備註</h5>
                        <span class="text-danger mt-2">※</span> 系統管理子系統/資料轉入轉出 (共14個txt檔案，地/建號範圍從 00000000 ~ 99999999) <br/>
                        　- <small class="mt-2 mb-2"> 除下面標示為黃色部分須至地政系統產出並下載，其餘皆可於「報表匯出」區塊產出。</small> <br/>
                        　AI001-10 <br/>
                        　　AI00301 - 土地標示部 <br/>
                        　　AI00401 - 土地所有權部 <br/>
                        　　AI00601 - 管理者資料【土地、建物各做一次】 <br/>
                        　　AI00701 - 建物標示部 <br/>
                        　　AI00801 - 基地坐落 <br/>
                        　　AI00901 - 建物分層及附屬 <br/>
                        　　AI01001 - 主建物與共同使用部分 <br/>
                        　AI011-20 <br/>
                        　　AI01101 - 建物所有權部 <br/>
                        　　<span class="text-warning">AI01901 - 土地各部別</span> <br/>
                        　AI021-40 <br/>
                        　　<span class="text-warning">AI02101 - 土地他項權利部</span> <br/>
                        　　<span class="text-warning">AI02201 - 建物他項權利部</span> <br/>
                        　　AI02901 - 各部別之其他登記事項【土地、建物各做一次】 <br/><br/>

                        <span class="text-danger">※</span> 測量子系統/測量資料管理/資料輸出入 【請至地政系統WEB版產出】<br/>
                        　地籍圖轉出(數值地籍) <br/>
                        　　* 輸出DXF圖檔【含控制點】及 NEC重測輸出檔 <br/>
                        　地籍圖轉出(圖解數化) <br/>
                        　　* 同上兩種類皆輸出，並將【分幅管理者先接合】下選項皆勾選 <br/><br/>
                            
                        <span class="text-danger">※</span> 登記子系統/列印/清冊報表/土地建物地籍整理清冊【土地、建物各產一次存PDF，請至地政系統WEB版產出】 <br/>
                    `,
                    size: 'lg'
                });
            }
        },
        mounted() {
            this.getLocalCache(this.cache_key).then(sql => {
                this.sql = sql;
                if (this.sql === false) this.sql = '';
            });
            this.timeout(() => {
                this.selected = this.$refs.select.$el.value;
                if ($("select.custom-select optgroup option[value='" + this.selected + "']").length > 0) {
                    let opt = $("select.custom-select optgroup option[value='" + this.selected + "']")[0];
                    this.$assert(opt, "找不到選取的 option。", $("select.custom-select optgroup option[value='" + this.selected + "']"));
                    this.selected_label = opt.label;
                }
            }, 400);
        }
    });

    Vue.component("lah-section-search", {
        components: {
            "lah-area-search-results": {
                template: `<div>
                    <b-table
                        v-if="count > 0"
                        ref="section_search_tbl"
                        :responsive="'sm'"
                        :striped="true"
                        :hover="true"
                        :bordered="true"
                        :small="true"
                        :no-border-collapse="true"
                        :head-variant="'dark'"

                        :items="json.raw"
                        :fields="fields"
                        :busy="!json"
                        primary-key="段代碼"

                        class="text-center"
                        caption-top
                    >
                        <template v-slot:cell(區代碼)="{ item }">
                            <span v-b-tooltip.d400="item.區代碼">{{section(item.區代碼)}}</span>
                        </template>
                        <template v-slot:cell(面積)="{ item }">
                            <span v-b-tooltip.d400="area(item.面積)">{{areaM2(item.面積)}}</span>
                        </template>
                        <template v-slot:cell(土地標示部筆數)="{ item }">
                            {{format(item.土地標示部筆數)}} 筆
                        </template>
                    </b-table>
                    <lah-fa-icon v-else icon="exclamation-triangle" variant="danger" size="lg"> {{input}} 查無資料</lah-fa-icon>
                </div>`,
                props: {
                    json: {
                        type: Object,
                        default: {}
                    },
                    input: {
                        type: String,
                        default: ''
                    }
                },
                data: () => ({
                    fields: [{
                            key: "區代碼",
                            label: "區域",
                            sortable: true
                        },
                        {
                            key: "段代碼",
                            sortable: true
                        },
                        {
                            key: "段名稱",
                            sortable: true
                        },
                        {
                            key: "面積",
                            sortable: true
                        },
                        {
                            key: "土地標示部筆數",
                            sortable: true
                        },
                    ]
                }),
                computed: {
                    count() {
                        return this.json.data_count || 0
                    }
                },
                methods: {
                    format(val) {
                        return val ? val.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                    },
                    area(val) {
                        return val ? this.format((val * 3025 / 10000).toFixed(2)) + ' 坪' : ''
                    },
                    areaM2(val) {
                        return val ? this.format(val) + ' 平方米' : ''
                    },
                    section(val) {
                        return val ? (val == '03' ? '中壢區' : '觀音區') : ''
                    }
                }
            }
        },
        template: `<fieldset>
            <legend v-b-tooltip="'各段土地標示部筆數＆面積'">
                <i class="far fa-map"></i>
                轄區段別資料
                <b-button class="border-0"  @click="popup" variant="outline-success" size="sm"><i class="fas fa-question"></i></b-button>
            </legend>
            <a href="http://220.1.35.24/%E8%B3%87%E8%A8%8A/webinfo2/%E4%B8%8B%E8%BC%89%E5%8D%80%E9%99%84%E4%BB%B6/%E6%A1%83%E5%9C%92%E5%B8%82%E5%9C%9F%E5%9C%B0%E5%9F%BA%E6%9C%AC%E8%B3%87%E6%96%99%E5%BA%AB%E9%9B%BB%E5%AD%90%E8%B3%87%E6%96%99%E6%94%B6%E8%B2%BB%E6%A8%99%E6%BA%96.pdf" target="_blank">電子資料申請收費標準</a>
            <a href="assets/files/%E5%9C%9F%E5%9C%B0%E5%9F%BA%E6%9C%AC%E8%B3%87%E6%96%99%E5%BA%AB%E9%9B%BB%E5%AD%90%E8%B3%87%E6%96%99%E6%B5%81%E9%80%9A%E7%94%B3%E8%AB%8B%E8%A1%A8.doc" target="_blank">電子資料申請書</a> <br />
            <b-input-group size="sm" prepend="關鍵字/段代碼">
                <b-form-input
                    placeholder="'榮民段' OR '0200'"
                    ref="text"
                    v-model="text"
                    @keyup.enter="query"
                    :state="validate"
                ></b-form-input>
                <template v-slot:append>
                    <b-button @click="query" variant="outline-primary" size="sm" v-b-tooltip="'搜尋段小段'" :disabled="!validate"><i class="fas fa-search"></i></b-button>
                </template>
            </b-input-group>
        </fieldset>`,
        data: () => ({
            text: ''
        }),
        computed: {
            validate() {
                return isNaN(parseInt(this.text)) ? true : (this.text <= 400 && this.text >= 200)
            },
            cache_key() {
                return 'lah-section-search_' + this.text
            }
        },
        methods: {
            query() {
                this.getLocalCache(this.cache_key).then(json => {
                    if (json) {
                        this.result(json);
                    } else {
                        this.isBusy = true;
                        this.$http.post(CONFIG.API.JSON.QUERY, {
                            type: 'ralid',
                            text: this.text
                        }).then(res => {
                            this.result(res.data);
                            this.setLocalCache(this.cache_key, res.data, 24 * 60 * 60 * 1000);
                        }).catch(err => {
                            this.error = err;
                        }).finally(() => {
                            this.isBusy = false;
                        });
                    }
                });
            },
            result(json) {
                this.msgbox({
                    title: "段小段查詢結果",
                    message: this.$createElement("lah-area-search-results", {
                        props: {
                            json: json,
                            input: this.text
                        }
                    }),
                    size: "lg"
                });
            },
            popup() {
                this.msgbox({
                    title: '土地標示部筆數＆面積查詢',
                    message: `-- 段小段筆數＆面積計算 (RALID 登記－土地標示部) <br/>
                  SELECT t.AA48 as "段代碼", <br/>
                  　　m.KCNT as "段名稱", <br/>
                  　　SUM(t.AA10) as "面積", <br/>
                  　　COUNT(t.AA10) as "筆數" <br/>
                  FROM MOICAD.RALID t <br/>
                  LEFT JOIN MOIADM.RKEYN m ON (m.KCDE_1 = '48' and m.KCDE_2 = t.AA48) <br/>
                  --WHERE t.AA48 = '%【輸入數字】'<br/>
                  --WHERE m.KCNT = '%【輸入文字】%'<br/>
                  GROUP BY t.AA48, m.KCNT;`,
                    size: 'lg'
                });
            }
        },
        mounted() {
            this.timeout(() => this.text = this.$refs.text.$el.value, 400);
        }
    });

    let regCaseMixin = {
        props: {
            bakedData: {
                type: Object,
                default: undefined
            },
            id: {
                type: String,
                default: ""
            } // the id format should be '109HB04001234'
        },
        computed: {
            year() {
                return this.bakedData ? this.bakedData["RM01"] : this.id.substring(0, 3)
            },
            code() {
                return this.bakedData ? this.bakedData["RM02"] : this.id.substring(3, 7)
            },
            number() {
                return this.bakedData ? this.bakedData["RM03"] : this.id.substring(7)
            },
            ready() {
                return !this.empty(this.bakedData)
            },
            storeBakedData() {
                return this.storeParams['RegBakedData']
            }
        },
        watch: {
            bakedData: function (nObj, oObj) {
                this.addToStoreParams('RegBakedData', nObj);
            }
        },
        created() {
            if (this.bakedData === undefined) {
                this.isBusy = true;
                this.$http.post(CONFIG.API.JSON.QUERY, {
                    type: "reg_case",
                    id: `${this.year}${this.code}${this.number}`
                }).then(res => {
                    if (res.data.status == XHR_STATUS_CODE.DEFAULT_FAIL || res.data.status == XHR_STATUS_CODE.UNSUPPORT_FAIL) {
                        this.alert({
                            title: "擷取登記案件失敗",
                            message: res.data.message,
                            type: "warning"
                        });
                    } else {
                        this.bakedData = res.data.baked;
                    }
                }).catch(err => {
                    this.error = err;
                }).finally(() => {
                    this.isBusy = false;
                });
            }
        }
    };

    Vue.component('lah-reg-case-state-mgt', {
        mixins: [regCaseMixin],
        template: `<div>
            <div class="form-row mt-1">
                <b-input-group size="sm" class="col">
                    <b-input-group-prepend is-text>案件辦理情形</b-input-group-prepend>
                    <b-form-select v-model="bakedData['RM30']" :options="rm30_map" class="h-100">
                        <template v-slot:first>
                            <b-form-select-option :value="null" disabled>-- 請選擇狀態 --</b-form-select-option>
                        </template>
                    </b-form-select>
                </b-input-group>
                <b-input-group v-if="wip" size="sm" class="col-3">
                    <b-form-checkbox v-model="sync_rm30_1" name="reg_case_RM30_1_checkbox" switch class="my-auto">
                        <small>同步作業人員</small>
                    </b-form-checkbox>
                </b-input-group>
                <div class="filter-btn-group col-auto">
                    <b-button @click="updateRM30" size="sm" variant="outline-primary"><lah-fa-icon icon="edit"> 更新</lah-fa-icon></b-button>
                </div>
            </div>
            <div class="form-row mt-1">
                <b-input-group size="sm" class="col">
                    <b-input-group-prepend is-text>登記處理註記</b-input-group-prepend>
                    <b-form-select v-model="bakedData['RM39']" :options="rm39_map">
                        <template v-slot:first>
                            <b-form-select-option value="">-- 無狀態 --</b-form-select-option>
                        </template>
                    </b-form-select>
                </b-input-group>
                <div class="filter-btn-group col-auto">
                    <b-button @click="updateRM39" size="sm" variant="outline-primary"><lah-fa-icon icon="edit"> 更新</lah-fa-icon></b-button>
                </div>
            </div>
            <div class="form-row mt-1">
                <b-input-group size="sm" class="col">
                    <b-input-group-prepend is-text>地價處理註記</b-input-group-prepend>
                    <b-form-select v-model="bakedData['RM42']" :options="rm42_map">
                        <template v-slot:first>
                            <b-form-select-option value="">-- 無狀態 --</b-form-select-option>
                        </template>
                    </b-form-select>
                </b-input-group>
                <div class="filter-btn-group col-auto">
                    <b-button @click="updateRM42" size="sm" variant="outline-primary"><lah-fa-icon icon="edit"> 更新</lah-fa-icon></b-button>
                </div>
            </div>
            <p v-if="showProgress" class="mt-2"><lah-reg-table type="sm" :bakedData="[bakedData]" :no-caption="true" class="small"></lah-reg-table></p>
        </div>`,
        props: ['progress'],
        data: () => ({
            rm30_orig: "",
            rm39_orig: "",
            rm42_orig: "",
            sync_rm30_1: true,
            rm30_map: [{
                    value: 'A',
                    text: 'A: 初審'
                },
                {
                    value: 'B',
                    text: 'B: 複審'
                },
                {
                    value: 'H',
                    text: 'H: 公告'
                },
                {
                    value: 'I',
                    text: 'I: 補正'
                },
                {
                    value: 'R',
                    text: 'R: 登錄'
                },
                {
                    value: 'C',
                    text: 'C: 校對'
                },
                {
                    value: 'U',
                    text: 'U: 異動完成'
                },
                {
                    value: 'F',
                    text: 'F: 結案'
                },
                {
                    value: 'X',
                    text: 'X: 補正初核'
                },
                {
                    value: 'Y',
                    text: 'Y: 駁回初核'
                },
                {
                    value: 'J',
                    text: 'J: 撤回初核'
                },
                {
                    value: 'K',
                    text: 'K: 撤回'
                },
                {
                    value: 'Z',
                    text: 'Z: 歸檔'
                },
                {
                    value: 'N',
                    text: 'N: 駁回'
                },
                {
                    value: 'L',
                    text: 'L: 公告初核'
                },
                {
                    value: 'E',
                    text: 'E: 請示'
                },
                {
                    value: 'D',
                    text: 'D: 展期'
                },
            ],
            rm39_map: [{
                    value: 'B',
                    text: 'B: 登錄開始'
                },
                {
                    value: 'R',
                    text: 'R: 登錄完成'
                },
                {
                    value: 'C',
                    text: 'C: 校對開始'
                },
                {
                    value: 'D',
                    text: 'D: 校對完成'
                },
                {
                    value: 'S',
                    text: 'S: 異動開始'
                },
                {
                    value: 'F',
                    text: 'F: 異動完成'
                },
                {
                    value: 'G',
                    text: 'G: 異動有誤'
                },
                {
                    value: 'P',
                    text: 'P: 競合暫停'
                },
            ],
            rm42_map: [{
                    value: '0',
                    text: '0: 登記移案'
                },
                {
                    value: 'B',
                    text: 'B: 登錄中'
                },
                {
                    value: 'R',
                    text: 'R: 登錄完成'
                },
                {
                    value: 'C',
                    text: 'C: 校對中'
                },
                {
                    value: 'D',
                    text: 'D: 校對完成'
                },
                {
                    value: 'E',
                    text: 'E: 登錄有誤'
                },
                {
                    value: 'S',
                    text: 'S: 異動開始'
                },
                {
                    value: 'F',
                    text: 'F: 異動完成'
                },
                {
                    value: 'G',
                    text: 'G: 異動有誤'
                }
            ],
            fields: [{
                    key: "收件字號",
                    sortable: true
                },
                {
                    key: "登記原因",
                    sortable: true
                },
                {
                    key: "辦理情形",
                    sortable: true
                },
                {
                    key: "作業人員",
                    sortable: true
                },
                {
                    key: "登記處理註記",
                    label: "登記註記",
                    sortable: true
                },
                {
                    key: "地價處理註記",
                    label: "地價註記",
                    sortable: true
                },
                {
                    key: "預定結案日期",
                    label: "期限",
                    sortable: true
                }
            ]
        }),
        computed: {
            showProgress() {
                return !this.empty(this.progress)
            },
            attachEvent() {
                return this.showProgress
            },
            wip() {
                return this.empty(this.bakedData["RM31"])
            },
            rm30() {
                return this.bakedData["RM30"] || ""
            },
            rm39() {
                return this.bakedData["RM39"] || ""
            },
            rm42() {
                return this.bakedData["RM42"] || ""
            }
        },
        methods: {
            updateRegCaseCol: function (arguments) {
                if ($(arguments.el).length > 0) {
                    // remove the button
                    $(arguments.el).remove();
                }
                this.isBusy = true;
                this.$http.post(CONFIG.API.JSON.QUERY, {
                    type: "reg_upd_col",
                    rm01: arguments.rm01,
                    rm02: arguments.rm02,
                    rm03: arguments.rm03,
                    col: arguments.col,
                    val: arguments.val
                }).then(res => {
                    console.assert(res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL, `更新案件「${arguments.col}」欄位回傳狀態碼有問題【${res.data.status}】`);
                    if (res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL) {
                        this.notify({
                            title: "更新案件欄位",
                            message: `「${arguments.col}」更新完成`,
                            variant: "success"
                        });
                    } else {
                        this.notify({
                            title: "更新案件欄位",
                            message: `「${arguments.col}」更新失敗【${res.data.status}】`,
                            variant: "warning"
                        });
                    }
                }).catch(err => {
                    this.error = err;
                }).finally(() => {
                    this.isBusy = false;
                });
            },
            updateRM30: function (e) {
                if (this.rm30 == this.rm30_orig) {
                    this.notify({
                        title: "更新案件辦理情形",
                        message: "案件辦理情形沒變動",
                        type: "warning"
                    });
                    return;
                }
                window.vueApp.confirm(`您確定要更新辦理情形為「${this.rm30}」?`, {
                    title: '請確認更新案件辦理情形',
                    callback: () => {
                        this.updateRegCaseCol({
                            rm01: this.year,
                            rm02: this.code,
                            rm03: this.number,
                            col: "RM30",
                            val: this.rm30
                        });

                        this.rm30_orig = this.bakedData["RM30"] || "";

                        if (this.sync_rm30_1) {
                            /**
                             * RM45 - 初審 A
                             * RM47 - 複審 B
                             * RM55 - 登錄 R
                             * RM57 - 校對 C
                             * RM59 - 結案 F
                             * RM82 - 請示 E
                             * RM88 - 展期 D
                             * RM93 - 撤回 K
                             * RM91_4 - 歸檔 Z
                             */
                            let rm30_1 = "";
                            switch (this.rm30) {
                                case "A":
                                    rm30_1 = this.bakedData["RM45"];
                                    break;
                                case "B":
                                    rm30_1 = this.bakedData["RM47"];
                                    break;
                                case "R":
                                    rm30_1 = this.bakedData["RM55"];
                                    break;
                                case "C":
                                    rm30_1 = this.bakedData["RM57"];
                                    break;
                                case "F":
                                    rm30_1 = this.bakedData["RM59"];
                                    break;
                                case "E":
                                    rm30_1 = this.bakedData["RM82"];
                                    break;
                                case "D":
                                    rm30_1 = this.bakedData["RM88"];
                                    break;
                                case "K":
                                    rm30_1 = this.bakedData["RM93"];
                                    break;
                                case "Z":
                                    rm30_1 = this.bakedData["RM91_4"];
                                    break;
                                default:
                                    rm30_1 = "XXXXXXXX";
                                    break;
                            }
                            this.updateRegCaseCol({
                                rm01: this.year,
                                rm02: this.code,
                                rm03: this.number,
                                col: "RM30_1",
                                val: this.empty(rm30_1) ? "XXXXXXXX" : rm30_1
                            });
                        }
                    }
                });
            },
            updateRM39: function (e) {
                if (this.rm39 == this.rm39_orig) {
                    this.notify({
                        title: "更新登記處理註記",
                        message: "登記處理註記沒變動",
                        type: "warning"
                    });
                    return;
                }
                window.vueApp.confirm(`您確定要更新登記處理註記為「${this.rm39}」?`, {
                    title: '請確認更新登記處理註記',
                    callback: () => {
                        this.updateRegCaseCol({
                            rm01: this.year,
                            rm02: this.code,
                            rm03: this.number,
                            col: "RM39",
                            val: this.rm39
                        });
                        this.rm39_orig = this.bakedData["RM39"] || "";
                    }
                });
            },
            updateRM42: function (e) {
                if (this.rm42 == this.rm42_orig) {
                    this.notify({
                        title: "更新地價處理註記",
                        message: "地價處理註記沒變動",
                        type: "warning"
                    });
                    return;
                }
                window.vueApp.confirm(`您確定要更新地價處理註記為「${this.rm42}」?`, {
                    title: '請確認更新地價處理註記',
                    callback: () => {
                        this.updateRegCaseCol({
                            rm01: this.year,
                            rm02: this.code,
                            rm03: this.number,
                            col: "RM42",
                            val: this.rm42
                        });
                        this.rm42_orig = this.bakedData["RM42"] || "";
                    }
                });
            }
        },
        created() {
            this.rm30_orig = this.bakedData["RM30"] || "";
            this.rm39_orig = this.bakedData["RM39"] || "";
            this.rm42_orig = this.bakedData["RM42"] || "";
        },
        mounted() {
            if (this.attachEvent) {
                addUserInfoEvent();
                this.animated(".reg_case_id", {
                    name: "flash"
                }).off("click").on("click", window.vueApp.fetchRegCase);
            }
        }
    });

    Vue.component("lah-reg-case-detail", {
        mixins: [regCaseMixin],
        template: `<div>
            <lah-reg-table :bakedData="[bakedData]" type="flow" :mute="true"></lah-reg-table>
            <b-card no-body>
                <b-tabs card :end="tabsAtEnd" :pills="tabsAtEnd">
                    <b-tab>
                        <template v-slot:title>
                            <strong>收件資料</strong>
                            <b-link variant="muted" @click.stop="openNewWindow(case_data_url, $event)" :title="'收件資料 on ' + ap_server"><lah-fa-icon icon="external-link-alt" variant="primary"></lah-fa-icon></b-link>
                        </template>
                        <b-card-body>
                            <b-form-row class="mb-1">
                                <b-col>    
                                    <lah-transition appear>
                                        <div v-show="show_op_card" class="mr-1 float-right" style="width:400px">
                                            <lah-fa-icon icon="user" variant="dark" prefix="far"> 作業人員</lah-fa-icon>
                                            <lah-user-card @not-found="handleNotFound" :id="bakedData.RM30_1"></lah-user-card>
                                        </div>
                                    </lah-transition>
                                    <div v-if="bakedData.跨所 == 'Y'"><span class='bg-info text-white rounded p-1'>跨所案件 ({{bakedData.資料收件所}} => {{bakedData.資料管轄所}})</span></div>
                                    收件字號：
                                    <a :title="'收件資料 on ' + ap_server" href="javascript:void(0)" @click="openNewWindow(case_data_url, $event)">
                                        {{bakedData.收件字號}}
                                    </a> <br/>
                                    收件時間：{{bakedData.收件時間}} <br/>
                                    測量案件：{{bakedData.測量案件}} <br/>
                                    限辦期限：<span v-html="bakedData.限辦期限"></span> <br/>
                                    作業人員：<span class='user_tag'>{{bakedData.作業人員}}</span> <br/>
                                    辦理情形：{{bakedData.辦理情形}} <br/>
                                    登記原因：{{bakedData.登記原因}} <br/>
                                    區域：{{area}}【{{bakedData.RM10}}】 <br/>
                                    段小段：{{bakedData.段小段}}【{{bakedData.段代碼}}】 <br/>
                                    地號：{{bakedData.地號}} <br/>
                                    建號：{{bakedData.建號}} <br/>
                                    件數：{{bakedData.件數}} <br/>
                                    登記處理註記：{{bakedData.登記處理註記}} <br/>
                                    地價處理註記：{{bakedData.地價處理註記}} <br/>
                                    手機號碼：{{bakedData.手機號碼}}
                                </b-col>
                            </b-form-row>
                        </b-card-body>
                    </b-tab>
                    <b-tab>
                        <template v-slot:title>
                            <strong>辦理情形</strong>
                            <b-link variant="muted" @click.stop="openNewWindow(case_status_url, $event)" :title="'案件辦理情形 on ' + ap_server"><lah-fa-icon icon="external-link-alt" variant="primary"></lah-fa-icon></b-link>
                        </template>
                        <b-card-body>
                            <b-list-group flush compact>
                                <b-list-group-item>
                                    <b-form-row>
                                        <b-col :title="bakedData.預定結案日期">預定結案：<span v-html="bakedData.限辦期限"></span></b-col>
                                        <b-col :title="bakedData.結案與否">
                                            結案與否：
                                            <span v-if="is_ongoing" class='text-danger'><strong>尚未結案！</strong></span>
                                            <span v-else class='text-success'><strong>已結案</strong></span>
                                        </b-col>
                                    </b-form-row>
                                </b-list-group-item>
                                <b-list-group-item v-if="!empty(bakedData.代理人統編)">
                                    <b-form-row>
                                        <b-col>代理人統編：{{bakedData.代理人統編}}</b-col>
                                        <b-col>代理人姓名：{{bakedData.代理人姓名}}</b-col>
                                    </b-form-row>
                                </b-list-group-item>
                                <b-list-group-item v-if="!empty(bakedData.權利人統編)">
                                    <b-form-row>
                                        <b-col>權利人統編：{{bakedData.權利人統編}}</b-col>
                                        <b-col>權利人姓名：{{bakedData.權利人姓名}}</b-col>
                                    </b-form-row>
                                </b-list-group-item>
                                <b-list-group-item v-if="!empty(bakedData.義務人統編)">
                                    <b-form-row>
                                        <b-col>義務人統編：{{bakedData.義務人統編}}</b-col>
                                        <b-col>義務人姓名：{{bakedData.義務人姓名}}</b-col>
                                    </b-form-row>
                                </b-list-group-item>
                                <b-list-group-item>
                                    <b-form-row>
                                        <b-col>登記原因：{{bakedData.登記原因}}</b-col>
                                        <b-col>辦理情形：<span :class="bakedData.紅綠燈背景CSS">{{bakedData.辦理情形}}</span></b-col>
                                    </b-form-row>
                                </b-list-group-item>
                                <b-list-group-item>
                                    <b-form-row>
                                        <b-col>收件人員：<span class='user_tag'  :data-id="bakedData.收件人員ID" :data-name="bakedData.收件人員">{{bakedData.收件人員}}</span></b-col>
                                        <b-col>收件時間：{{bakedData.收件時間}}</b-col>
                                    </b-form-row>
                                </b-list-group-item>
                                <b-list-group-item v-if="!empty(bakedData.移轉課長)">
                                    <b-form-row>
                                        <b-col>移轉課長：<span class='user_tag' >{{bakedData.移轉課長}}</span></b-col>
                                        <b-col>移轉課長時間：{{bakedData.移轉課長時間}}</b-col>
                                    </b-form-row>
                                </b-list-group-item>
                                <b-list-group-item v-if="!empty(bakedData.移轉秘書)">
                                    <b-form-row>
                                        <b-col>移轉秘書：<span class='user_tag' >{{bakedData.移轉秘書}}</span></b-col>
                                        <b-col>移轉秘書時間：{{bakedData.移轉秘書時間}}</b-col>
                                    </b-form-row>
                                </b-list-group-item>
                                <b-list-group-item v-if="!empty(bakedData.初審人員)">
                                    <b-form-row>
                                        <b-col>初審人員：<span class='user_tag' >{{bakedData.初審人員}}</span></b-col>
                                        <b-col>初審時間：{{bakedData.初審時間}}</b-col>
                                    </b-form-row>
                                </b-list-group-item>
                                <b-list-group-item v-if="!empty(bakedData.複審人員)">
                                    <b-form-row>
                                        <b-col>複審人員：<span class='user_tag' >{{bakedData.複審人員}}</span></b-col>
                                        <b-col>複審時間：{{bakedData.複審時間}}</b-col>
                                    </b-form-row>
                                </b-list-group-item>
                                <b-list-group-item v-if="!empty(bakedData.駁回日期)">
                                    <b-form-row>
                                        <b-col>駁回日期：{{bakedData.駁回日期}}</b-col>
                                        <b-col></b-col>
                                    </b-form-row>
                                </b-list-group-item>
                                <b-list-group-item v-if="!empty(bakedData.公告日期)">
                                    <b-form-row>
                                        <b-col>公告日期：{{bakedData.公告日期}}</b-col>
                                        <b-col>公告到期：{{bakedData.公告期滿日期}} 天數：{{bakedData.公告天數}}</b-col>
                                    </b-form-row>
                                </b-list-group-item>
                                <b-list-group-item v-if="!empty(bakedData.通知補正日期)">
                                    <b-form-row>
                                        <b-col>通知補正：{{bakedData.通知補正日期}}</b-col>
                                        <b-col>補正期滿：{{bakedData.補正期滿日期}} 天數：{{bakedData.補正期限}}</b-col>
                                    </b-form-row>
                                </b-list-group-item>
                                <b-list-group-item v-if="!empty(bakedData.補正日期)">
                                    <b-form-row>
                                        <b-col>補正日期：{{bakedData.補正日期}}</b-col>
                                        <b-col></b-col>
                                    </b-form-row>
                                </b-list-group-item>
                                <b-list-group-item v-if="!empty(bakedData.請示人員)">
                                    <b-form-row>
                                        <b-col>請示人員：<span class='user_tag' >{{bakedData.請示人員}}</span></b-col>
                                        <b-col>請示時間：{{bakedData.請示時間}}</b-col>
                                    </b-form-row>
                                </b-list-group-item>
                                <b-list-group-item v-if="!empty(bakedData.展期人員)">
                                    <b-form-row>
                                        <b-col>展期人員：<span class='user_tag' >{{bakedData.展期人員}}</span></b-col>
                                        <b-col>展期日期：{{bakedData.展期日期}} 天數：{{bakedData.展期天數}}</b-col>
                                    </b-form-row>
                                </b-list-group-item>
                                <b-list-group-item v-if="!empty(bakedData.准登人員)">
                                    <b-form-row>
                                        <b-col>准登人員：<span class='user_tag' >{{bakedData.准登人員}}</span></b-col>
                                        <b-col>准登日期：{{bakedData.准登日期}}</b-col>
                                    </b-form-row>
                                </b-list-group-item>
                                <b-list-group-item v-if="!empty(bakedData.登錄人員)">
                                    <b-form-row>
                                        <b-col>登錄人員：<span class='user_tag' >{{bakedData.登錄人員}}</span></b-col>
                                        <b-col>登錄日期：{{bakedData.登錄日期}}</b-col>
                                    </b-form-row>
                                </b-list-group-item>
                                <b-list-group-item v-if="!empty(bakedData.校對人員)">
                                    <b-form-row>
                                        <b-col>校對人員：<span class='user_tag' >{{bakedData.校對人員}}</span></b-col>
                                        <b-col>校對日期：{{bakedData.校對日期}}</b-col>
                                    </b-form-row>
                                </b-list-group-item>
                                <b-list-group-item v-if="!empty(bakedData.結案人員)">
                                    <b-form-row>
                                        <b-col>結案人員：<span class='user_tag' >{{bakedData.結案人員}}</span></b-col>
                                        <b-col>結案日期：{{bakedData.結案日期}}</b-col>
                                    </b-form-row>
                                </b-list-group-item>
                            </b-list-group>
                        </b-card-body>
                    </b-tab>
                    <b-tab lazy>
                        <template v-slot:title>
                            <lah-fa-icon icon="chart-line" class="text-success"> <strong>案件時間線</strong></lah-fa-icon>
                        </template>
                        <lah-reg-case-timeline ref="timeline" :baked-data="bakedData"></lah-reg-case-temp-mgt>
                    </b-tab>
                    <b-tab v-if="isAdmin" lazy>
                        <template v-slot:title>
                            <lah-fa-icon icon="database" class="text-secondary"> <strong>狀態管理</strong></lah-fa-icon>
                        </template>
                        <lah-reg-case-state-mgt :baked-data="bakedData"></lah-reg-case-state-mgt>
                    </b-tab>
                    <b-tab v-if="isAdmin" lazy>
                        <template v-slot:title>
                            <lah-fa-icon icon="buffer" prefix="fab" class="text-secondary"> <strong>暫存檔管理</strong></lah-fa-icon>
                        </template>
                        <lah-reg-case-temp-mgt :baked-data="bakedData"></lah-reg-case-temp-mgt>
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>`,
        props: ['tabsEnd'],
        data: () => ({
            area: "",
            rm10: null,
            ap_server: "220.1.35.123",
            show_op_card: true
        }),
        computed: {
            tabsAtEnd() {
                return !this.empty(this.tabsEnd)
            },
            is_ongoing() {
                return this.empty(this.bakedData.結案代碼)
            },
            case_status_url() {
                return `http://${this.ap_server}:9080/LandHB/CAS/CCD02/CCD0202.jsp?year=${this.year}&word=${this.code}&code=${this.number}&sdlyn=N&RM90=`
            },
            case_data_url() {
                return `http://${this.ap_server}:9080/LandHB/CAS/CCD01/CCD0103.jsp?rm01=${this.year}&rm02=${this.code}&rm03=${this.number}`
            }

        },
        methods: {
            handleNotFound: function (input) {
                this.show_op_card = false
            }
        },
        mounted() {
            this.rm10 = this.bakedData.RM10 ? this.bakedData.RM10 : "XX";
            switch (this.rm10) {
                case "03":
                    this.area = "中壢區";
                    break;
                case "12":
                    this.area = "觀音區";
                    break;
                default:
                    this.area = "其他(" + this.bakedData.資料管轄所 + "區)";
                    break;
            }
        },
        mounted() {
            addUserInfoEvent();
        }
    });

    Vue.component('lah-reg-case-temp-mgt', {
        mixins: [regCaseMixin],
        template: `<div>
            <div v-if="found">
                <div v-for="(item, idx) in filtered">
                    <h6 v-if="idx == 0" class="font-weight-bold text-center">請檢查下列暫存檔資訊，必要時請刪除</h6>
                    <b-button @click="showSQL(item)" size="sm" variant="warning">
                        {{item[0]}}表格 <span class="badge badge-light">{{item[1].length}} <span class="sr-only">暫存檔數量</span></span>
                    </b-button>
                    <small>
                        <b-button
                            :id="'backup_temp_btn_' + idx"
                            size="sm"
                            variant="outline-primary"
                            @click="backup(item, idx, $event)"
                        >備份</b-button>
                        <b-button
                            v-if="item[0] != 'MOICAT.RINDX' && item[0] != 'MOIPRT.PHIND'"
                            :title="title(item)"
                            size="sm"
                            variant="outline-danger"
                            @click="clean(item, idx, $event)"
                        >清除</b-button>
                    </small>
                    <br />&emsp;<small>－&emsp;{{item[2]}}</small>
                </div>
                <hr />
                <div class="text-center">
                    <b-button id="backup_temp_btn_all" @click="backupAll" variant="outline-primary" size="sm">全部備份</b-button>
                    <b-button @click="cleanAll" variant="danger" size="sm">全部清除</b-button>
                    <b-button @click="popup" variant="outline-success" size="sm"><lah-fa-icon icon="question"> 說明</lah-fa-icon></b-button>
                </div>
            </div>
            <lah-fa-icon v-if="not_found" icon="exclamation-circle" variant="success" size="lg"> 無暫存檔。</lah-fa-icon>
            <lah-fa-icon v-if="loading" action="spin" icon="spinner" size="lg"> 讀取中</lah-fa-icon>
        </div>`,
        data: () => ({
            filtered: null,
            cleanAllBackupFlag: false,
            backupFlags: []
        }),
        computed: {
            found() {
                return !this.empty(this.filtered)
            },
            not_found() {
                return Array.isArray(this.filtered) && this.empty(this.filtered)
            },
            loading() {
                return this.filtered === null
            },
            prefix() {
                return `${this.year}-${this.code}-${this.number}`
            }
        },
        methods: {
            title: function (item) {
                return item[0] == "MOICAT.RINDX" || item[0] == "MOIPRT.PHIND" ? "重要案件索引，無法刪除！" : "";
            },
            download: function (content, filename) {
                const url = window.URL.createObjectURL(new Blob([content]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                //afterwards we remove the element again
                link.remove();
                // release object in memory
                window.URL.revokeObjectURL(url);
            },
            backupAll: function (e) {
                this.isBusy = true;
                let filename = this.year + "-" + this.code + "-" + this.number + "-TEMP-DATA.sql";
                let all_content = "";
                this.filtered.forEach((item, idx) => {
                    all_content += this.getInsSQL(item);
                });
                this.download(all_content, filename);
                this.cleanAllBackupFlag = true;
                this.isBusy = false;
            },
            cleanAll: function (e) {
                if (this.cleanAllBackupFlag !== true) {
                    this.alert({
                        title: "清除全部暫存資料",
                        subtitle: `${this.year}-${this.code}-${this.number}`,
                        message: "請先備份！",
                        type: "warning"
                    });
                    this.animated("#backup_temp_btn_all", {
                        name: "tada"
                    });
                    return;
                }
                let msg = "<h6><strong class='text-danger'>★警告★</strong>：無法復原請先備份!!</h6>清除案件 " + this.year + "-" + this.code + "-" + this.number + " 全部暫存檔?";
                showConfirm(msg, () => {
                    this.isBusy = true;
                    this.$http.post(CONFIG.API.JSON.QUERY, {
                        type: 'clear_temp_data',
                        year: this.year,
                        code: this.code,
                        number: this.number,
                        table: ''
                    }).then(res => {
                        this.$assert(res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL, "清除暫存資料回傳狀態碼有問題【" + res.data.status + "】");
                        this.notify({
                            title: "清除暫存檔",
                            message: "已清除完成。<p>" + this.year + "-" + this.code + "-" + this.number + "</p>",
                            type: "success"
                        });
                        $(e.target).remove();
                    }).catch(err => {
                        this.error = err;
                    }).finally(() => {
                        this.isBusy = false;
                    });
                });
            },
            backup: function (item, idx, e) {
                this.isBusy = true;
                let filename = `${this.prefix}-${item[0]}-TEMP-DATA.sql`;
                this.download(this.getInsSQL(item), filename);
                this.backupFlags[idx] = true;
                $(e.target).attr("disabled", this.backupFlags[idx]);
                this.isBusy = false;
            },
            clean: function (item, idx, e) {
                let table = item[0];
                if (this.backupFlags[idx] !== true) {
                    this.alert({
                        title: `清除 ${table} 暫存檔`,
                        subtitle: `${this.year}-${this.code}-${this.number}`,
                        message: `請先備份 ${table} ！`,
                        type: "warning"
                    });
                    this.animated(`#backup_temp_btn_${idx}`, {
                        name: "tada"
                    });
                    return;
                }
                let msg = "<h6><strong class='text-danger'>★警告★</strong>：無法復原請先備份!!</h6>清除案件 " + this.year + "-" + this.code + "-" + this.number + " " + table + " 暫存檔?";
                showConfirm(msg, () => {
                    this.isBusy = true;
                    this.$http.post(CONFIG.API.JSON.QUERY, {
                        type: 'clear_temp_data',
                        year: this.year,
                        code: this.code,
                        number: this.number,
                        table: table
                    }).then(res => {
                        this.$assert(res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL, "清除暫存資料回傳狀態碼有問題【" + res.data.status + "】");
                        this.notify({
                            title: `清除 ${table} 暫存檔`,
                            subtitle: this.year + "-" + this.code + "-" + this.number,
                            message: "已清除完成。",
                            type: "success"
                        });
                        $(e.target).remove();
                    }).catch(err => {
                        this.error = err;
                    }).finally(() => {
                        this.isBusy = false;
                    });
                });
            },
            showSQL: function (item) {
                this.msgbox({
                    title: `INSERT SQL of ${item[0]}`,
                    message: this.getInsSQL(item).replace(/\n/g, "<br /><br />"),
                    size: "xl"
                });
            },
            getInsSQL: function (item) {
                let INS_SQL = "";
                for (let y = 0; y < item[1].length; y++) {
                    let this_row = item[1][y];
                    let fields = [];
                    let values = [];
                    for (let key in this_row) {
                        fields.push(key);
                        values.push(this.empty(this_row[key]) ? "null" : `'${this_row[key]}'`);
                    }
                    INS_SQL += `insert into ${item[0]} (${fields.join(",")})`;
                    INS_SQL += ` values (${values.join(",")});\n`;
                }
                return INS_SQL;
            },
            popup: function () {
                this.msgbox({
                    title: "案件暫存檔清除 小幫手提示",
                    body: `<h6 class="text-info">檢查下列的表格</h6>
                    <ul>
                      <!-- // 登記 -->
                      <li>"MOICAT.RALID" => "A"   // 土地標示部</li>
                      <li>"MOICAT.RBLOW" => "B"   // 土地所有權部</li>
                      <li>"MOICAT.RCLOR" => "C"   // 他項權利部</li>
                      <li>"MOICAT.RDBID" => "D"   // 建物標示部</li>
                      <li>"MOICAT.REBOW" => "E"   // 建物所有權部</li>
                      <li>"MOICAT.RLNID" => "L"   // 人檔</li>
                      <li>"MOICAT.RRLSQ" => "R"   // 權利標的</li>
                      <li>"MOICAT.RGALL" => "G"   // 其他登記事項</li>
                      <li>"MOICAT.RMNGR" => "M"   // 管理者</li>
                      <li>"MOICAT.RTOGH" => "T"   // 他項權利檔</li>
                      <li>"MOICAT.RHD10" => "H"   // 基地坐落／地上建物</li>
                      <li class="text-danger">"MOICAT.RINDX" => "II"  // 案件異動索引【不會清除】</li>
                      <li>"MOICAT.RINXD" => "ID"</li>
                      <li>"MOICAT.RINXR" => "IR"</li>
                      <li>"MOICAT.RINXR_EN" => "IRE"</li>
                      <li>"MOICAT.RJD14" => "J"</li>
                      <li>"MOICAT.ROD31" => "O"</li>
                      <li>"MOICAT.RPARK" => "P"</li>
                      <li>"MOICAT.RPRCE" => "PB"</li>
                      <li>"MOICAT.RSCNR" => "SR"</li>
                      <li>"MOICAT.RSCNR_EN" => "SRE"</li>
                      <li>"MOICAT.RVBLOW" => "VB"</li>
                      <li>"MOICAT.RVCLOR" => "VC"</li>
                      <li>"MOICAT.RVGALL" => "VG"</li>
                      <li>"MOICAT.RVMNGR" => "VM"</li>
                      <li>"MOICAT.RVPON" => "VP"  // 重測/重劃暫存</li>
                      <li>"MOICAT.RVRLSQ" => "VR"</li>
                      <li>"MOICAT.RXIDD04" => "ID"</li>
                      <li>"MOICAT.RXLND" => "XL"</li>
                      <li>"MOICAT.RXPRI" => "XP"</li>
                      <li>"MOICAT.RXSEQ" => "XS"</li>
                      <li>"MOICAT.B2104" => "BR"</li>
                      <li>"MOICAT.B2118" => "BR"</li>
                      <li>"MOICAT.BGALL" => "G"</li>
                      <li>"MOICAT.BHD10" => "H"</li>
                      <li>"MOICAT.BJD14" => "J"</li>
                      <li>"MOICAT.BMNGR" => "M"</li>
                      <li>"MOICAT.BOD31" => "O"</li>
                      <li>"MOICAT.BPARK" => "P"</li>
                      <li>"MOICAT.BRA26" => "C"</li>
                      <li>"MOICAT.BRLSQ" => "R"</li>
                      <li>"MOICAT.BXPRI" => "XP"</li>
                      <li>"MOICAT.DGALL" => "G"</li>
                      <!-- // 地價 -->
                      <li>"MOIPRT.PPRCE" => "MA"</li>
                      <li>"MOIPRT.PGALL" => "GG"</li>
                      <li>"MOIPRT.PBLOW" => "LA"</li>
                      <li>"MOIPRT.PALID" => "KA"</li>
                      <li>"MOIPRT.PNLPO" => "NA"</li>
                      <li>"MOIPRT.PBLNV" => "BA"</li>
                      <li>"MOIPRT.PCLPR" => "CA"</li>
                      <li>"MOIPRT.PFOLP" => "FA"</li>
                      <li>"MOIPRT.PGOBP" => "GA"</li>
                      <li>"MOIPRT.PAPRC" => "AA"</li>
                      <li>"MOIPRT.PEOPR" => "EA"</li>
                      <li>"MOIPRT.POA11" => "OA"</li>
                      <li>"MOIPRT.PGOBPN" => "GA"</li>
                      <!--<li>"MOIPRC.PKCLS" => "KK"</li>-->
                      <li>"MOIPRT.PPRCE" => "MA"</li>
                      <li>"MOIPRT.P76SCRN" => "SS"</li>
                      <li>"MOIPRT.P21T01" => "TA"</li>
                      <li>"MOIPRT.P76ALID" => "AS"</li>
                      <li>"MOIPRT.P76BLOW" => "BS"</li>
                      <li>"MOIPRT.P76CRED" => "BS"</li>
                      <li>"MOIPRT.P76INDX" => "II"</li>
                      <li>"MOIPRT.P76PRCE" => "UP"</li>
                      <li>"MOIPRT.P76SCRN" => "SS"</li>
                      <li>"MOIPRT.PAE0301" => "MA"</li>
                      <li>"MOIPRT.PB010" => "TP"</li>
                      <li>"MOIPRT.PB014" => "TB"</li>
                      <li>"MOIPRT.PB015" => "TB"</li>
                      <li>"MOIPRT.PB016" => "TB"</li>
                      <li class="text-danger">"MOIPRT.PHIND" => "II"  // 案件異動索引【不會清除】</li>
                      <li>"MOIPRT.PNLPO" => "NA"</li>
                      <li>"MOIPRT.POA11" => "OA"</li>
                    </ul>`,
                    size: "lg"
                });
            }
        },
        created() {
            this.busyIconSize = "1x";
            this.isBusy = true;
            this.$http.post(CONFIG.API.JSON.QUERY, {
                type: "query_temp_data",
                year: this.year,
                code: this.code,
                number: this.number
            }).then(res => {

                this.$assert(res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL, `查詢暫存資料回傳狀態碼有問題【${res.data.status}】`);

                this.filtered = [];
                // res.data.raw structure: 0 - Table, 1 - all raw data, 2 - SQL
                this.filtered = res.data.raw.filter((item, index, array) => {
                    return item[1].length > 0;
                });

                // initialize backup flag array for backup detection
                this.backupFlags = Array(this.filtered.length).fill(false);
            }).catch(err => {
                this.error = err;
            }).finally(() => {
                this.isBusy = false;
            });
        }
    });

    Vue.component('lah-reg-case-timeline', {
        mixins: [regCaseMixin],
        template: `<div class="clearfix">
            <div class="text-justify">
                <span>{{title}}</span>
                <b-button-group size="sm" class="float-right">
                    <lah-button variant="primary" @click="chartType = 'bar'" icon="chart-bar"></lah-button>
                    <lah-button variant="secondary" @click="chartType = 'pie'" icon="chart-pie"></lah-button>
                    <lah-button variant="success" @click="chartType = 'line'" icon="chart-line"></lah-button>
                    <lah-button variant="warning" @click="chartType = 'polarArea'" icon="chart-area"></lah-button>
                    <lah-button variant="info" @click="chartType = 'doughnut'" icon="edge" brand></lah-button>
                    <lah-button variant="dark" @click="chartType = 'radar'" icon="broadcast-tower"></lah-button>
                </b-button-group>
            </div>
            <lah-chart :type="chartType" label="案件時間線" :items="items" :tooltip="tooltip"></lah-chart>
        </div>`,
        data: () => ({
            items: [],
            chartType: 'line'
        }),
        computed: {
            border() {
                return this.ready ? '' : 'danger'
            },
            title() {
                return this.ready ? this.bakedData.收件字號 : ''
            }
        },
        watch: {
            bakedData: function (nData, oData) {
                this.prepareItems()
            }
        },
        methods: {
            prepareItems: function () {
                if (this.ready) {
                    let items = [];
                    Object.keys(this.bakedData.ELAPSED_TIME).forEach(key => {
                        let mins = parseFloat(this.bakedData.ELAPSED_TIME[key] / 60).toFixed(2);
                        items.push([key, mins]);
                    });
                    this.items = items;
                } else {
                    this.$warn("lah-reg-case-timeline: backedData is not ready ... retry after 200ms later");
                    this.timeout(this.prepareItems, 200);
                }
            },
            tooltip: function (tooltipItem, data) {
                let dataset = data.datasets[tooltipItem.datasetIndex];
                let currentValue = dataset.data[tooltipItem.index];
                //this.$log(` ${data.labels[tooltipItem.index]} : ${currentValue} 分鐘`);
                return ` ${data.labels[tooltipItem.index]} : ${currentValue} 分鐘`;
            }
        },
        mounted() {
            this.prepareItems()
        }
    });

    Vue.component('lah-reg-table', {
        template: `<lah-transition appear slide-down>
            <b-table
                ref="reg_case_tbl"
                :responsive="'sm'"
                :striped="true"
                :hover="true"
                :bordered="true"
                :borderless="false"
                :outlined="false"
                :small="true"
                :dark="false"
                :fixed="false"
                :foot-clone="false"
                :no-border-collapse="true"
                :head-variant="'dark'"
                :table-variant="false"

                :sticky-header="sticky"
                :caption="caption"
                :items="bakedData"
                :fields="tblFields"
                :style="style"
                :busy="busy"
                :tbody-tr-class="trClass"
                :tbody-transition-props="transProps"
                primary-key="收件字號"

                class="text-center"
                caption-top
            >
                <template v-slot:table-busy>
                    <b-spinner class="align-middle" variant="danger" type="grow" small label="讀取中..."></b-spinner>
                </template>

                <template v-slot:cell(RM01)="row">
                    <div class="text-left" v-b-popover.hover.focus.d400="{content: row.item['結案狀態'], variant: row.item['燈號']}">
                        <lah-fa-icon :icon="icon" :variant="iconVariant" v-if="showIcon"></lah-fa-icon>
                        <span v-if="mute">{{bakedContent(row)}}</span>
                        <a v-else href="javascript:void(0)" @click="fetch(row.item)">{{bakedContent(row)}}</a>
                    </div>
                </template>
                <template v-slot:cell(收件字號)="row">
                    <div class="text-left" v-b-popover.hover.focus.d400="{content: row.item['結案狀態'], variant: row.item['燈號']}">
                        <lah-fa-icon :icon="icon" :variant="iconVariant" v-if="showIcon"></lah-fa-icon>
                        <span v-if="mute">{{bakedContent(row)}}</span>
                        <a v-else href="javascript:void(0)" @click="fetch(row.item)">{{row.item['收件字號']}}</a>
                    </div>
                </template>

                <template v-slot:cell(序號)="row">
                    {{row.index + 1}}
                </template>

                <template v-slot:cell(燈號)="row">
                    <lah-fa-icon icon="circle" :variant="row.item['燈號']"></lah-fa-icon>
                </template>

                <template v-slot:cell(限辦時間)="row">
                    <lah-fa-icon icon="circle" :variant="row.item['燈號']" v-b-popover.hover.focus.d400="{content: row.item['預定結案日期'], variant: row.item['燈號']}" class="text-nowrap"> {{row.value}}</lah-fa-icon>
                </template>

                <template v-slot:cell(RM07_1)="row">
                    <span v-b-popover.hover.focus.d400="row.item['收件時間']">{{row.item["RM07_1"]}}</span>
                </template>
                
                <template v-slot:cell(登記原因)="row">
                    {{reason(row)}}
                </template>
                <template v-slot:cell(RM09)="row">
                    {{reason(row)}}
                </template>

                <template v-slot:cell(初審人員)="{ item }">
                    <a href="javascript:void(0)" @click="userinfo(item['初審人員'], item['RM45'])" v-b-popover.top.hover.focus.html="passedTime(item, item.ELAPSED_TIME['初審'])">{{item["初審人員"]}}</a>
                </template>
                <template v-slot:cell(複審人員)="{ item }">
                    <a href="javascript:void(0)" @click="userinfo(item['複審人員'], item['RM47'])" v-b-popover.top.hover.focus.html="passedTime(item, item.ELAPSED_TIME['複審'])">{{item["複審人員"]}}</a>
                </template>
                <template v-slot:cell(收件人員)="{ item }">
                    <a href="javascript:void(0)" @click="userinfo(item['收件人員'], item['RM96'])">{{item["收件人員"]}}</a>
                </template>
                <template v-slot:cell(作業人員)="{ item }">
                    <a href="javascript:void(0)" @click="userinfo(item['作業人員'], item['RM30_1'])">{{item["作業人員"]}}</a>
                </template>
                <template v-slot:cell(准登人員)="{ item }">
                    <a href="javascript:void(0)" @click="userinfo(item['准登人員'], item['RM63'])" v-b-popover.top.hover.focus.html="passedTime(item, item.ELAPSED_TIME['准登'])">{{item["准登人員"]}}</a>
                </template>
                <template v-slot:cell(登錄人員)="{ item }">
                    <a href="javascript:void(0)" @click="userinfo(item['登錄人員'], item['RM55'])" v-b-popover.top.hover.focus.html="passedTime(item, item.ELAPSED_TIME['登簿'])">{{item["登錄人員"]}}</a>
                </template>
                <template v-slot:cell(校對人員)="{ item }">
                    <a href="javascript:void(0)" @click="userinfo(item['校對人員'], item['RM57'])" v-b-popover.top.hover.focus.html="passedTime(item, item.ELAPSED_TIME['校對'])">{{item["校對人員"]}}</a>
                </template>
                <template v-slot:cell(結案人員)="{ item }">
                    <a href="javascript:void(0)" @click="userinfo(item['結案人員'], item['RM59'])" v-b-popover.top.hover.focus.html="passedTime(item, item.ELAPSED_TIME['結案'])">{{item["結案人員"]}}</a>
                </template>
            </b-table>
        </lah-transition>`,
        props: ['bakedData', 'maxHeight', 'type', 'fields', 'mute', 'noCaption', 'color', 'icon', 'iconVariant', 'busy'],
        data: () => ({
            transProps: {
                name: 'rollIn'
            }
        }),
        computed: {
            tblFields: function () {
                if (!this.empty(this.fields)) return this.fields;
                switch (this.type) {
                    case "md":
                        return [{
                                key: "收件字號",
                                sortable: this.sort
                            },
                            {
                                key: "登記原因",
                                sortable: this.sort
                            },
                            {
                                key: "辦理情形",
                                sortable: this.sort
                            },
                            {
                                key: "初審人員",
                                sortable: this.sort
                            },
                            {
                                key: "作業人員",
                                sortable: this.sort
                            },
                            {
                                key: "收件時間",
                                sortable: this.sort
                            },
                            {
                                key: "限辦時間",
                                sortable: this.sort
                            }
                            //{key: "預定結案日期", label:"限辦期限", sortable: this.sort}
                        ];
                    case "lg":
                        return [{
                                key: "收件字號",
                                sortable: this.sort
                            },
                            {
                                key: "收件日期",
                                sortable: this.sort
                            },
                            {
                                key: "登記原因",
                                sortable: this.sort
                            },
                            {
                                key: "辦理情形",
                                sortable: this.sort
                            },
                            {
                                key: "收件人員",
                                label: "收件",
                                sortable: this.sort
                            },
                            {
                                key: "作業人員",
                                label: "作業",
                                sortable: this.sort
                            },
                            {
                                key: "初審人員",
                                label: "初審",
                                sortable: this.sort
                            },
                            {
                                key: "複審人員",
                                label: "複審",
                                sortable: this.sort
                            },
                            {
                                key: "准登人員",
                                label: "准登",
                                sortable: this.sort
                            },
                            {
                                key: "登錄人員",
                                label: "登簿",
                                sortable: this.sort
                            },
                            {
                                key: "校對人員",
                                label: "校對",
                                sortable: this.sort
                            },
                            {
                                key: "結案人員",
                                label: "結案",
                                sortable: this.sort
                            }
                        ];
                    case "xl":
                        return [
                            //{key: "燈號", sortable: this.sort},
                            {
                                key: "序號",
                                sortable: !this.sort
                            },
                            {
                                key: "收件字號",
                                sortable: this.sort
                            },
                            {
                                key: "收件時間",
                                sortable: this.sort
                            },
                            {
                                key: "限辦時間",
                                label: "限辦",
                                sortable: this.sort
                            },
                            {
                                key: "登記原因",
                                sortable: this.sort
                            },
                            {
                                key: "辦理情形",
                                sortable: this.sort
                            },
                            {
                                key: "收件人員",
                                label: "收件",
                                sortable: this.sort
                            },
                            {
                                key: "作業人員",
                                label: "作業",
                                sortable: this.sort
                            },
                            {
                                key: "初審人員",
                                label: "初審",
                                sortable: this.sort
                            },
                            {
                                key: "複審人員",
                                label: "複審",
                                sortable: this.sort
                            },
                            {
                                key: "准登人員",
                                label: "准登",
                                sortable: this.sort
                            },
                            {
                                key: "登錄人員",
                                label: "登簿",
                                sortable: this.sort
                            },
                            {
                                key: "校對人員",
                                label: "校對",
                                sortable: this.sort
                            },
                            {
                                key: "結案人員",
                                label: "結案",
                                sortable: this.sort
                            }
                            //{key: "結案狀態", label: "狀態", sortable: this.sort}
                        ];
                    case "flow":
                        return [{
                                key: "辦理情形",
                                sortable: this.sort
                            },
                            {
                                key: "收件人員",
                                label: "收件",
                                sortable: this.sort
                            },
                            {
                                key: "作業人員",
                                label: "作業",
                                sortable: this.sort
                            },
                            {
                                key: "初審人員",
                                label: "初審",
                                sortable: this.sort
                            },
                            {
                                key: "複審人員",
                                label: "複審",
                                sortable: this.sort
                            },
                            {
                                key: "准登人員",
                                label: "准登",
                                sortable: this.sort
                            },
                            {
                                key: "登錄人員",
                                label: "登簿",
                                sortable: this.sort
                            },
                            {
                                key: "校對人員",
                                label: "校對",
                                sortable: this.sort
                            },
                            {
                                key: "結案人員",
                                label: "結案",
                                sortable: this.sort
                            }
                        ];
                    default:
                        return [{
                                key: "RM01",
                                label: "收件字號",
                                sortable: this.sort
                            },
                            {
                                key: "RM07_1",
                                label: "收件日期",
                                sortable: this.sort
                            },
                            {
                                key: "RM09",
                                label: "登記原因",
                                sortable: this.sort
                            },
                            {
                                key: "辦理情形",
                                sortable: this.sort
                            },
                        ];
                }
            },
            count() {
                return this.bakedData ? this.bakedData.length : 0
            },
            caption() {
                if (this.mute || this.noCaption) return false;
                return this.busy ? '讀取中' : '登記案件找到 ' + this.count + '件';

            },
            sticky() {
                return this.maxHeight ? this.count > 0 ? true : false : false
            },
            style() {
                const parsed = parseInt(this.maxHeight);
                return isNaN(parsed) ? '' : `max-height: ${parsed}px`;
            },
            showIcon() {
                return !this.empty(this.icon)
            },
            sort() {
                return this.empty(this.mute)
            }
        },
        methods: {
            fetch(data) {
                let id = `${data["RM01"]}${data["RM02"]}${data["RM03"]}`;
                this.$http.post(CONFIG.API.JSON.QUERY, {
                    type: "reg_case",
                    id: id
                }).then(res => {
                    if (res.data.status == XHR_STATUS_CODE.DEFAULT_FAIL || res.data.status == XHR_STATUS_CODE.UNSUPPORT_FAIL) {
                        this.alert({
                            title: "顯示登記案件詳情",
                            message: res.data.message,
                            type: "warning"
                        });
                    } else {
                        this.msgbox({
                            message: this.$createElement("lah-reg-case-detail", {
                                props: {
                                    bakedData: res.data.baked
                                }
                            }),
                            title: `登記案件詳情 ${data["RM01"]}-${data["RM02"]}-${data["RM03"]}`,
                            size: "lg"
                        });
                    }
                }).catch(err => {
                    this.error = err;
                });
            },
            userinfo(name, id = '') {
                if (name == 'XXXXXXXX') return;
                this.msgbox({
                    title: `${name} 使用者資訊${this.empty(id) ? '' : ` (${id})`}`,
                    message: this.$createElement('lah-user-card', {
                        props: {
                            id: id,
                            name: name
                        }
                    })
                });
            },
            bakedContent(row) {
                return row.item[row.field.label];
            },
            reason(row) {
                return row.item["RM09"] + " : " + (this.empty(row.item["登記原因"]) ? row.item["RM09_CHT"] : row.item["登記原因"]);
            },
            trClass(item, type) {
                if (item && type == 'row') return this.color ? item["紅綠燈背景CSS"] : `filter-${item["燈號"]}`;
            },
            passedTime(item, time_duration_secs) {
                if (isNaN(time_duration_secs) || this.empty(time_duration_secs)) return false;
                if (time_duration_secs == '0' && this.empty(item['結案代碼'])) {
                    return '<i class="fa fa-tools ld ld-clock"></i> 作業中';
                }
                if (time_duration_secs < 60) return "耗時 " + time_duration_secs + " 秒";
                if (time_duration_secs < 3600) return "耗時 " + Number.parseFloat(time_duration_secs / 60).toFixed(2) + " 分鐘";
                return "耗時 " + Number.parseFloat(time_duration_secs / 60 / 60).toFixed(2) + " 小時";
            }
        },
        created() {
            this.type = this.type || ''
        }
    });

    let temperatureMixin = {
        methods: {
            thermoIcon(degree) {
                let fd = parseFloat(degree);
                if (isNaN(fd)) return 'temperature-low';
                if (fd < 36.0) return 'thermometer-empty';
                if (fd < 36.5) return 'thermometer-quarter';
                if (fd < 37.0) return 'thermometer-half';
                if (fd < 37.5) return 'thermometer-three-quarters';
                return 'thermometer-full';
            },
            thermoColor(degree) {
                let fd = parseFloat(degree);
                if (isNaN(fd) || fd < 35) return 'secondary';
                if (fd < 35.5) return 'dark';
                if (fd < 36) return 'info';
                if (fd < 36.5) return 'primary';
                if (fd < 37.0) return 'success';
                if (fd < 37.5) return 'warning';
                return 'danger';
            }
        }
    };

    Vue.component("lah-temperature", {
        mixins: [temperatureMixin],
        template: `<b-card>
            <template v-slot:header>
                <h6 class="d-flex justify-content-between mb-0">
                    <span class="my-auto">體溫紀錄 {{today}}</span>
                    <b-button v-if="isChief" @click="overview" variant="primary" size="sm">全所登錄一覽</b-button>
                </h6>
            </template>
            <b-form-row>
                <b-col>
                    <lah-user-id-input v-model="id" :only-on-board="true" ref="userid"></lah-user-id-input>
                </b-col>
                <b-col cols="auto">
                    <b-input-group class="mb-1">
                        <b-input-group-prepend is-text><lah-fa-icon :icon="thermoIcon(temperature)" :variant="thermoColor(temperature)"> 體溫</la-fa-icon></b-input-group-prepend>
                        <b-form-input
                            type="number"
                            v-model="temperature"
                            min="34"
                            max="41"
                            step="0.1"
                            class="no-cache"
                            @keyup.enter="register"
                        >
                        </b-form-input>
                    </b-input-group>
                </b-col>
                <b-col cols="auto">
                    <b-button variant="outline-primary" @click="register" :disabled="disabled">登錄</b-button>
                </b-col>
            </b-form-row>
            <div v-if="seen">
                <h6 class="my-2">今日紀錄</h6>
                <b-list-group class="small">
                    <b-list-group-item v-for="item in list" :primary-key="item['datetime']" v-if="onlyToday(item)" >
                        <a href="javascript:void(0)" @click="doDeletion(item)" v-if="allowDeletion(item)"><lah-fa-icon class="times-circle float-right" icon="times-circle" prefix="far" variant="danger"></lah-fa-icon></a>
                        {{item['datetime']}} - {{item['id']}}:{{userNames[item['id']]}} - 
                        <lah-fa-icon :icon="thermoIcon(item['value'])" :variant="thermoColor(item['value'])"> {{item['value']}} &#8451;</lah-fa-icon>
                    </b-list-group-item>
                </b-list-group>
            </div>
            <template v-if="seen" v-slot:footer>
                <div class="my-2">
                    <b-button-group size="sm" class="float-right">
                        <b-button variant="primary" @click="chart_type = 'bar'"><i class="fas fa-chart-bar"></i></b-button>
                        <b-button variant="success" @click="chart_type = 'line'"><i class="fas fa-chart-line"></i></b-button>
                    </b-button-group>
                    <lah-chart
                        ref="chart"
                        :items="chart_items"
                        :type="chart_type"
                        :begin-at-zero="false"
                        :bg-color="chartBgColor"
                        label="歷史紀錄" 
                        class="clearfix"
                    >
                    </lah-chart>
                </div>
            </template>
        </b-card>`,
        data: () => ({
            today: undefined,
            ad_today: undefined,
            id: undefined,
            temperature: '',
            chart_items: undefined,
            chart_type: 'line',
            list: undefined
        }),
        computed: {
            ID() {
                return this.id ? this.id.toUpperCase() : null
            },
            name() {
                return this.userNames[this.ID] || ''
            },
            validateID() {
                return (/^HB\d{4}$/i).test(this.ID)
            },
            validateTemperature() {
                let fn = parseFloat(this.temperature);
                return !isNaN(fn) && fn >= 34 && fn <= 41;
            },
            disabled() {
                return !this.validateID || !this.validateTemperature
            },
            seen() {
                return this.chart_items !== undefined && this.chart_items.length != 0
            }
        },
        watch: {
            name(val) {
                if (this.empty(val)) this.chart_items = undefined
            },
            id(val) {
                if (this.validateID) this.history()
            },
            myid(val) {
                this.id = val
            }
        },
        methods: {
            onlyToday(item) {
                return item['datetime'].split(' ')[0].replace(/\-/gi, '') == this.ad_today
            },
            allowDeletion(item) {
                // control deletion by AM/PM
                let now = parseInt(this.nowTime.replace(/\:/gi, ''));
                let AMPM = (now - 120000) > 0 ? 'PM' : 'AM';
                let time = parseInt(item['datetime'].split(' ')[1].replace(/\:/gi, ''));
                if (AMPM == 'AM') {
                    return time - 120000 < 0;
                }
                return time - 120000 >= 0;
            },
            doDeletion(item) {
                this.$confirm(`刪除 ${this.userNames[item['id']]} ${item['value']} &#8451;紀錄？`, () => {
                    this.isBusy = true;
                    this.$http.post(CONFIG.API.JSON.QUERY, {
                        type: 'remove_temperature',
                        id: item['id'],
                        datetime: item['datetime']
                    }).then(res => {
                        this.$assert(res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL, "刪除體溫資料回傳狀態碼有問題【" + res.data.status + "】");
                        this.notify({
                            title: "刪除體溫紀錄",
                            subtitle: `${item['id']}:${this.userNames[item['id'].toUpperCase()]}-${item['value']}`,
                            message: "刪除成功。",
                            type: "success"
                        });
                        this.history();
                    }).catch(err => {
                        this.error = err;
                    }).finally(() => {
                        this.isBusy = false;
                    });
                });
            },
            register() {
                if (this.disabled) {
                    this.$warn('輸入資料未齊全，跳過登錄。')
                    return;
                }
                if (this.empty(this.name)) {
                    this.notify({
                        message: `無法找到使用者 ${this.ID}，無法登錄。`,
                        type: "warning"
                    });
                    return;
                }
                this.isBusy = true;
                this.$http.post(CONFIG.API.JSON.QUERY, {
                    type: 'add_temperature',
                    id: this.ID,
                    temperature: this.temperature
                }).then(res => {
                    this.$assert(res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL, "設定體溫資料回傳狀態碼有問題【" + res.data.status + "】");
                    if (res.data.status != XHR_STATUS_CODE.SUCCESS_NORMAL) {
                        this.notify({
                            title: "新增體溫紀錄",
                            message: res.data.message,
                            type: "warning",
                            pos: 'tc'
                        });
                    } else {
                        this.notify({
                            title: "新增體溫紀錄",
                            message: "已設定完成。<p>" + this.ID + "-" + this.name + "-" + this.temperature + "</p>",
                            type: "success"
                        });
                        this.history();
                    }
                }).catch(err => {
                    this.error = err;
                }).finally(() => {
                    this.isBusy = false;
                });
            },
            history(all = false) {
                this.isBusy = true;
                if (all) this.chart_items = undefined;
                this.$http.post(CONFIG.API.JSON.QUERY, {
                    type: 'temperatures',
                    id: all ? '' : this.ID
                }).then(res => {
                    this.$assert(res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL, "取得體溫資料回傳狀態碼有問題【" + res.data.status + "】");
                    this.list = res.data.raw;
                    this.prepareChartData();
                    Vue.nextTick(() => $(".times-circle i.far").on("mouseenter", e => {
                        this.animated(e.target, {
                            name: "tada"
                        });
                    }));
                }).catch(err => {
                    this.error = err;
                }).finally(() => {
                    this.isBusy = false;
                });
            },
            chartBgColor(data, opacity) {
                let degree = data[1]; // data[0] - text, data[1] - value
                let fd = parseFloat(degree);
                //if (isNaN(fd) || fd < 35) return `rgb(91, 93, 94, ${opacity})`;
                // if (fd < 35.5) return `rgb(41, 43, 44, ${opacity})`;
                // if (fd < 36) return `rgb(91, 192, 222, ${opacity})`;
                // if (fd < 36.5) return `rgb(2, 117, 216, ${opacity})`;
                if (fd < 37.0) return `rgb(92, 184, 92, ${opacity})`;
                if (fd < 37.5) return `rgb(240, 173, 78, ${opacity})`;
                return `rgb(217, 83, 79, ${opacity})`;
            },
            prepareChartData() {
                let chart_items = [];
                let count = 0;
                this.list.forEach((item) => {
                    if (count < 10) {
                        let date = item['datetime'].substring(5, 10); // remove year
                        let hour = item['datetime'].substring(11, 13);
                        let AMPM = parseInt(hour) < 12 ? 'AM' : 'PM';
                        chart_items.push([
                            `${date} ${AMPM}`,
                            item['value']
                        ]);
                        count++;
                    }
                });
                this.chart_items = chart_items.reverse();
            },
            overview() {
                this.isBusy = true;
                this.$http.post(CONFIG.API.JSON.USER, {
                    type: 'on_board_users'
                }).then(res => {
                    let vn = this.$createElement('lah-temperature-list', {
                        props: {
                            userList: res.data.raw
                        }
                    });
                    this.msgbox({
                        title: `<i class="fa fa-temperature-low fa-lg"></i> 全所體溫一覽表 ${this.today}`,
                        message: vn,
                        size: "xl"
                    });
                }).catch(err => {
                    this.error = err;
                }).finally(() => {
                    this.isBusy = false;
                });
            }
        },
        created() {
            let now = new Date();
            let mon = ("0" + (now.getMonth() + 1)).slice(-2);
            let day = ("0" + now.getDate()).slice(-2);
            this.today = now.getFullYear() - 1911 + mon + day;
            this.ad_today = now.getFullYear() + mon + day;
            this.id = this.getUrlParameter('id');
        }
    });

    Vue.component('lah-temperature-list', {
        template: `<div>
            <b-button-group size="sm" class="float-right">
                <b-button variant="light" @click="selectBtn('all')" class="border"><i class="fas fa-list"></i> 全部</b-button>
                <b-button variant="success" @click="selectBtn('.all-done')"><i class="fas fa-check"></i> 已完成</b-button>
                <b-button variant="primary" @click="selectBtn('.half-done')"><i class="fas fa-temperature-low"></i> 登錄中</b-button>
                <b-button variant="secondary" @click="selectBtn('.not-done')"><i class="fas fa-exclamation-circle"></i> 未登錄</b-button>
            </b-button-group>
            <div v-for="item in filtered" class="clearfix my-2">
                <h5><lah-fa-icon icon="address-book" prefix="far"> {{item['UNIT']}}</lah-fa-icon></h5>
                <div>
                    <lah-user-temperature
                        v-for="user in item['LIST']"
                        :raw-user-data="user"
                        class="float-left ml-1 mb-1"
                    ></lah-user-temperature>
                </div>
            </div>
        </div>`,
        props: {
            userList: {
                type: Object,
                default: null
            },
            date: {
                type: String,
                default: this.today
            }
        },
        data: () => ({
            filtered: null
        }),
        computed: {
            today() {
                return this.nowDate
            }
        },
        methods: {
            filter() {
                let hr = this.userList.filter(this_record => this_record["unit"] == "人事室");
                let accounting = this.userList.filter(this_record => this_record["unit"] == "會計室");
                let director = this.userList.filter(this_record => this_record["unit"] == "主任室");
                let secretary = this.userList.filter(this_record => this_record["unit"] == "秘書室");
                let adm = this.userList.filter(this_record => this_record["unit"] == "行政課");
                let reg = this.userList.filter(this_record => this_record["unit"] == "登記課");
                let val = this.userList.filter(this_record => this_record["unit"] == "地價課");
                let sur = this.userList.filter(this_record => this_record["unit"] == "測量課");
                let inf = this.userList.filter(this_record => this_record["unit"] == "資訊課");
                this.filtered = [{
                        UNIT: '主任室',
                        LIST: director
                    },
                    {
                        UNIT: '秘書室',
                        LIST: secretary
                    },
                    {
                        UNIT: '人事室',
                        LIST: hr
                    },
                    {
                        UNIT: '會計室',
                        LIST: accounting
                    },
                    {
                        UNIT: '行政課',
                        LIST: adm
                    },
                    {
                        UNIT: '登記課',
                        LIST: reg
                    },
                    {
                        UNIT: '地價課',
                        LIST: val
                    },
                    {
                        UNIT: '測量課',
                        LIST: sur
                    },
                    {
                        UNIT: '資訊課',
                        LIST: inf
                    }
                ];
            },
            prepareTodayTemperatures() {
                this.isBusy = true;
                this.$http.post(CONFIG.API.JSON.QUERY, {
                    type: 'temperatures_by_date',
                    date: this.today
                }).then(res => {
                    this.$assert(res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL, `取得 ${this.today} 體溫資料回傳狀態碼有問題【${res.data.status}】`);
                    this.addToStoreParams('todayTemperatures', res.data.raw);
                }).catch(err => {
                    this.error = err;
                }).finally(() => {
                    this.isBusy = false;
                });
            },
            selectBtn(selector) {
                $(`button.temperature`).hide();
                switch (selector) {
                    case ".all-done":
                    case ".half-done":
                    case ".not-done":
                        $(selector).show();
                        break;
                    default:
                        $(`button.temperature`).show();
                }
            }
        },
        created() {
            this.prepareTodayTemperatures();
        },
        mounted() {
            this.filter();
        }
    });

    Vue.component('lah-user-temperature', {
        mixins: [temperatureMixin],
        template: `<b-button
            :id="btnid"
            :data-id="id"
            :data-name="name"
            :variant="style"
            :class="[selector, 'text-left', 'mr-1', 'mb-1', 'temperature', 'lah-user-card', 'position-relative']"
            size="sm"
            @click="usercard"
            v-b-hover="hover"
        >
            <div><b-avatar button variant="light" :size="avatar_size" :src="avatar_src"></b-avatar> {{name}}</div>
            <lah-fa-icon :icon="am_icon" :variant="am_color" class="d-block"> {{temperature['AM']}} &#8451; AM</lah-fa-icon>
            <lah-fa-icon :icon="pm_icon" :variant="pm_color" class="d-block"> {{temperature['PM']}} &#8451; PM</lah-fa-icon>
            <b-popover :target="btnid" triggers="hover focus" placement="top" delay="250">
                {{id}} : {{name}}
                <lah-fa-icon :icon="am_icon" :variant="am_color" class="d-block"> {{temperature['AM']}} &#8451; AM</lah-fa-icon>
                <lah-fa-icon :icon="pm_icon" :variant="pm_color" class="d-block"> {{temperature['PM']}} &#8451; PM</lah-fa-icon>
            </b-popover>
        </b-button>`,
        props: ['rawUserData', 'inId'],
        data: () => ({
            temperature: {
                AM: 0,
                PM: 0
            },
            avatar_size: '1.2rem',
            btnid: '',
        }),
        watch: {
            my_temperature(val) {
                this.empty(val) ? void(0) : this.setMyTemperature()
            }
        },
        computed: {
            id() {
                return this.rawUserData ? $.trim(this.rawUserData['id']) : this.inId
            },
            name() {
                return this.rawUserData ? this.rawUserData['name'] : ''
            },
            today() {
                return this.nowDate
            },
            now_ampm() {
                return (parseInt(this.nowTime.replace(/\:/gi, '')) - 120000) >= 0 ? 'PM' : 'AM'
            },
            not_ready() {
                return this.temperature.AM == 0 || this.temperature.PM == 0
            },
            ready_half() {
                return this.temperature.AM != 0 || this.temperature.PM != 0
            },
            ready() {
                return this.temperature.AM != 0 && this.temperature.PM != 0
            },
            style() {
                if (this.ready) {
                    if (this.temperature.AM >= 37.5 || this.temperature.PM >= 37.5) return 'outline-danger';
                    if (this.temperature.AM >= 37 || this.temperature.PM >= 37) return 'outline-warning';
                    return 'outline-success';
                }
                return this.ready_half ? 'outline-primary' : 'outline-secondary';
            },
            temperatures() {
                return this.storeParams['todayTemperatures']
            },
            my_temperature() {
                return this.temperatures ? this.temperatures.filter(this_record => $.trim(this_record["id"]) == $.trim(this.id)) : []
            },
            store_ready() {
                return this.temperatures == undefined
            },
            avatar_src() {
                return `get_user_img.php?name=${this.name}_avatar`
            },
            am_icon() {
                return this.thermoIcon(this.temperature['AM'])
            },
            am_color() {
                return this.thermoColor(this.temperature['AM'])
            },
            pm_icon() {
                return this.thermoIcon(this.temperature['PM'])
            },
            pm_color() {
                return this.thermoColor(this.temperature['PM'])
            },
            selector() {
                if (this.ready) return 'all-done';
                if (this.ready_half) return 'half-done';
                return 'not-done';
            }
        },
        methods: {
            hover(flag, e) {
                if (flag) {
                    $(e.target).find(".b-avatar").addClass('avatar_scale_center');
                    //$(e.target).find("div:first-child").addClass('pl-3');
                    this.avatar_size = '3.8rem';
                } else {
                    $(e.target).find(".b-avatar").removeClass('avatar_scale_center');
                    //$(e.target).find("div:first-child").removeClass('pl-3');
                    this.avatar_size = '1.2rem';
                }
            },
            setMyTemperature() {
                this.my_temperature.forEach(item => {
                    let time = parseInt(item['datetime'].split(' ')[1].replace(/\:/gi, ''));
                    if (time - 120000 >= 0) {
                        // PM
                        this.temperature.PM = item['value'];
                    } else {
                        // AM
                        this.temperature.AM = item['value'];
                    }
                });
            },
            getMyTemperatures() {
                this.isBusy = true;
                this.$http.post(CONFIG.API.JSON.QUERY, {
                    type: 'temperatures_by_id_date',
                    id: this.id,
                    date: this.today
                }).then(res => {
                    this.$assert(res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL, `取得 ${this.id}:${this.name} 體溫資料回傳狀態碼有問題【${res.data.status}】`);
                    /**
                        datetime: "2020-04-03 16:19:45"
                        id: "HB0541"
                        value: 37.2
                        note: ""
                    */
                    // control deletion by AM/PM
                    if (res.data.data_count > 0) {
                        res.data.raw.forEach(item => {
                            let time = parseInt(item['datetime'].split(' ')[1].replace(/\:/gi, ''));
                            if (time - 120000 >= 0) {
                                // PM
                                this.temperature.PM = item['value'];
                            } else {
                                // AM
                                this.temperature.AM = item['value'];
                            }
                        });
                    }
                }).catch(err => {
                    this.error = err;
                }).finally(() => {
                    this.isBusy = false;
                });
            }
        },
        mounted() {
            if (this.inId) {
                this.getMyTemperatures();
            } else {
                this.timeout(() => this.id = this.getUrlParameter('id'), 400);
            }
            this.btnid = this.uuid();
        }
    });
    /**
     * Stats Relative Components
     */
    Vue.component("lah-stats-range", {
        template: `<fieldset class="mb-2">
            <legend>篩選條件</legend>
            <b-form-row class="mt-2">
                <b-input-group size="sm" :prepend="date" class="col">
                    <b-form-input id="stat_range" v-model="value" type="range" :min="1" :max="max" class="h-100"></b-form-input>
                </b-input-group>
                <b-input-group size="sm" prepend="筆數大於" class="col-2">
                    <b-form-input
                        type="number"
                        v-model="filter"
                        size="sm"
                        min="0"
                        max="1000"
                        class="no-cache h-100"
                    ></b-form-input>
                </b-input-group>
                <b-input-group size="sm" prepend="關鍵字" class="col-2">
                    <b-form-input
                        type="text"
                        v-model="keyword"
                        size="sm"
                        class="no-cache h-100"
                    ></b-form-input>
                    <b-button v-if="button" size="sm" variant="outline-primary" class="ml-2" @click.stop="update">更新</b-button>
                </b-input-group>
                <b-form-checkbox inline v-model="reg_reason" switch class="h-100 my-auto">所有登記原因</b-form-checkbox>
            </b-form-row>
        </fieldset>`,
        props: {
            button: {
                type: Boolean,
                default: false
            }
        },
        data: () => ({
            year: 109,
            month: 5,
            base: 0,
            max: 24,
            value: 23,
            filter: 0,
            keyword: '',
            reg_reason: false,
            value_timer: null,
            filter_timer: null,
            keyword_timer: null,
            reg_reason_timer: null,
            delay_ms: 1000
        }),
        computed: {
            date() {
                return `${this.year}${("0" + this.month).slice(-2)}`
            }
        },
        watch: {
            value(nVal, oVal) {
                let after = this.base - this.max + parseInt(nVal) - 1;
                this.year = parseInt(after / 12);
                this.month = after % 12 + 1;
                if (!this.button) {
                    // delay the reload action 
                    clearTimeout(this.value_timer);
                    this.value_timer = this.timeout(() => {
                        this.storeParams['stats_date'] = this.date;
                    }, this.delay_ms);
                }
            },
            filter(nVal, oVal) {
                if (nVal < 0 || nVal > 1000 || isNaN(nVal)) {
                    this.filter = 0;
                }
                if (!this.button) {
                    // delay the reload action 
                    clearTimeout(this.filter_timer);
                    this.filter_timer = this.timeout(() => {
                        this.storeParams['stats_filter'] = nVal;
                    }, this.delay_ms);
                }
            },
            keyword(nVal, oVal) {
                if (!this.button) {
                    clearTimeout(this.keyword_timer);
                    this.keyword_timer = this.timeout(() => {
                        this.storeParams['stats_keyword'] = nVal;
                    }, this.delay_ms);
                }
            },
            reg_reason(nVal, oVal) {
                if (!this.button) {
                    clearTimeout(this.reg_reason_timer);
                    this.reg_reason_timer = this.timeout(() => {
                        this.storeParams['stats_reg_reason'] = nVal;
                    }, this.delay_ms);
                }
            }
        },
        methods: {
            update() {
                this.storeParams['stats_date'] = this.date;
                this.storeParams['stats_filter'] = this.filter;
                this.storeParams['stats_keyword'] = this.keyword;
            }
        },
        mounted() {
            let now = new Date();
            this.year = now.getFullYear() - 1911;
            this.month = now.getMonth(); // set last month as default
            this.value = this.max - 1;
            this.base = this.year * 12 + now.getMonth() + 1;
            this.addToStoreParams('stats_date', this.date);
            this.addToStoreParams('stats_filter', this.filter);
            this.addToStoreParams('stats_keyword', this.keyword);
            this.addToStoreParams('stats_reg_reason', this.reg_reason);
        }
    });

    Vue.component("lah-stats-dashboard", {
        template: `<div>
            <b-card-group v-if="all" columns>
                <transition-group name="list">
                    <b-card no-body v-for="(item, idx) in items" :key="'stats_'+idx" :border-variant="border_var(item)">
                        <b-list-group-item button class="d-flex justify-content-between align-items-center" @click.stop="query(item)" title="按我取得詳細資料">
                            <div>
                                <lah-button pill icon="file-excel" variant="outline-success" action="move-fade-ltr" title="匯出EXCEL" @click="xlsx(item)"></lah-button>
                                {{empty(item.id) ? '' : item.id+'：'}}{{item.text}}
                            </div>
                            <b-badge :variant="badge_var(item.count)" pill>{{item.count}}</b-badge>
                        </b-list-group-item>
                    </b-card>
                </transition-group>
                <lah-fa-icon v-if="!ok" icon="exclamation-triangle" variant="danger"> 查詢後端資料失敗</lah-fa-icon>
            </b-card-group>
            <b-list-group v-else :title="header">
                <transition-group name="list">
                    <b-list-group-item flush button v-if="ok" v-for="(item, idx) in items" :key="'stats_'+idx" class="d-flex justify-content-between align-items-center" @click.stop="query(item)">
                        <div>
                            <lah-button pill icon="file-excel" variant="outline-success" action="move-fade-ltr" @click="xlsx(item)"></lah-button>
                            {{empty(item.id) ? '' : item.id+'：'}}{{item.text}}
                        </div>
                        <b-badge variant="primary" pill>{{item.count}}</b-badge>
                    </b-list-group-item>
                </transition-group>
                <b-list-group-item v-if="!ok" class="d-flex justify-content-between align-items-center">
                    <lah-fa-icon icon="exclamation-triangle" variant="danger"> 執行查詢失敗 {{category}}</lah-fa-icon>
                </b-list-group-item>
            </b-list-group>
        </div>`,
        props: {
            category: {
                type: String,
                default: 'all'
            },
        },
        data: () => ({
            items: [],
            ok: false,
            default_date: '',
            queue: []
        }),
        computed: {
            date() {
                return this.storeParams['stats_date'] || this.default_date
            },
            keyword() {
                return this.storeParams['stats_keyword'] || ''
            },
            filter() {
                return parseInt(this.storeParams['stats_filter'] || 0)
            },
            all_reg_reason() {
                return this.storeParams['stats_reg_reason'] || false
            },
            header() {
                switch (this.category) {
                    case "stats_court":
                        return `法院囑託案件 (${this.date})`;
                    case "stats_refund":
                        return `主動申請退費案件 (${this.date})`;
                    case "stats_sur_rain":
                        return `因雨延期測量案件 (${this.date})`;
                    case "stats_reg_reason":
                        return `各項登記(特定)原因案件 (${this.date})`;
                    case "stats_reg_reject":
                        return `登記駁回案件 (${this.date})`;
                    case "stats_reg_fix":
                        return `登記補正案件 (${this.date})`;
                    case "stats_reg_all":
                        return `各項登記原因案件 (${this.date})`;
                    case "stats_reg_remote":
                        return `遠途先審案件 (${this.date})`;
                    case "stats_reg_subcase":
                        return `本所處理跨所子號案件 (${this.date})`;
                    case "stats_regf":
                        return `外國人地權登記統計 (${this.date})`;
                    case "all":
                        return `所有支援的統計資料 (${this.date})`;
                    default:
                        return `不支援的類型-${this.category}`;
                }
            },
            all() {
                return this.category == 'all'
            }
        },
        watch: {
            date(nVal, oVal) {
                this.reload()
            },
            filter(nVal, oVal) {
                this.reload()
            },
            keyword(nVal, oVal) {
                this.reload()
            },
            all_reg_reason(nVal, oVal) {
                this.reload()
            }
        },
        methods: {
            border_var(item) {
                switch (item.category) {
                    case "stats_court":
                    case "stats_refund":
                    case "stats_reg_reject":
                    case "stats_reg_fix":
                    case "stats_reg_remote":
                    case "stats_reg_subcase":
                    case "stats_regf":
                        return 'info';
                    case "stats_reg_reason":
                        return 'primary';
                    case "stats_sur_rain":
                        return 'warning';
                    default:
                        return 'white';
                }
            },
            badge_var(count) {
                if (count < 10) {
                    return 'secondary';
                } else if (count < 50) {
                    return 'dark';
                } else if (count < 100) {
                    return 'info';
                } else if (count < 200) {
                    return 'primary';
                } else if (count < 400) {
                    return 'success';
                } else if (count < 750) {
                    return 'warning';
                }
                return 'danger';
            },
            get_stats(type) {
                if (this.isBusy) {
                    this.queue.push(this.get_stats.bind(this, type));
                    return;
                }
                this.isBusy = true;
                this.$http.post(CONFIG.API.JSON.STATS, {
                    type: type,
                    date: this.date
                }).then(res => {
                    this.ok = res.data.status > 0;
                    if (this.ok) {
                        this.$assert(res.data.data_count > 0, "response data count is not correct.", res.data.data_count);
                        for (let i = 0; i < res.data.data_count; i++) {
                            if (res.data.raw[i].count >= this.filter) {
                                // prevent duplication
                                let existed = this.items.find((item, index, array) => {
                                    return item.text == res.data.raw[i].text;
                                });
                                if (existed !== undefined) continue;

                                if (this.empty(this.keyword)) {
                                    this.items.push({
                                        id: res.data.raw[i].id || '',
                                        text: res.data.raw[i].text,
                                        count: res.data.raw[i].count,
                                        category: type
                                    });
                                } else {
                                    let txt = this.keyword.replace("?", ""); // prevent out of memory
                                    let keyword = new RegExp(txt, "i");
                                    if (keyword.test(res.data.raw[i].id) || keyword.test(res.data.raw[i].text)) {
                                        this.items.push({
                                            id: res.data.raw[i].id || '',
                                            text: res.data.raw[i].text,
                                            count: res.data.raw[i].count,
                                            category: type
                                        });
                                    }
                                }
                            }
                        }
                    } else {
                        this.notify({
                            message: res.data.message + " " + this.responseMessage(res.data.status),
                            type: "warning"
                        });
                        this.$warn(type + " " + this.responseMessage(res.data.status) + " " + res.data.status);
                    }
                }).catch(err => {
                    this.error = err;
                }).finally(() => {
                    this.isBusy = false;
                    let callback = this.queue.pop();
                    if (callback) {
                        callback();
                    }
                });
            },
            reload_stats_cache(type) {
                this.isBusy = true;
                this.$http.post(CONFIG.API.JSON.STATS, {
                    type: type,
                    date: this.date,
                    reload: true
                }).then(res => {
                    this.ok = res.data.status > 0;
                    if (this.ok) {
                        this.notify({
                            message: type + " (" + this.date + ") 已成功更新" + this.responseMessage(res.data.status),
                            type: "success"
                        });
                    } else {
                        this.notify({
                            message: res.data.message + " " + this.responseMessage(res.data.status),
                            type: "warning"
                        });
                        this.$warn(type + " " + this.responseMessage(res.data.status));
                    }
                }).catch(err => {
                    this.error = err;
                }).finally(() => {
                    this.isBusy = false;
                });
            },
            reload() {
                this.items = [];
                switch (this.category) {
                    case "stats_court":
                    case "stats_refund":
                    case "stats_sur_rain":
                    case "stats_reg_reason":
                    case "stats_reg_reject":
                    case "stats_reg_fix":
                    case "stats_reg_all":
                    case "stats_reg_remote":
                    case "stats_reg_subcase":
                    case "stats_regf":
                        this.get_stats(this.category);
                        break;
                    case "all":
                        this.get_stats('stats_reg_subcase');
                        this.get_stats('stats_reg_remote');
                        this.get_stats('stats_court');
                        this.get_stats('stats_refund');
                        this.get_stats('stats_sur_rain');
                        this.get_stats('stats_reg_reject');
                        this.get_stats('stats_reg_fix');
                        this.get_stats('stats_regf');
                        this.timeout(() => this.all_reg_reason ? this.get_stats('stats_reg_all') : this.get_stats('stats_reg_reason'), 1000);
                        break;
                    default:
                        this.$warn("Not supported category.", this.category);
                        this.alert({
                            message: "lah-stats-item: Not supported category.【" + this.category + "】",
                            type: "warning"
                        });
                }
            },
            showRegCases(title, data) {
                this.msgbox({
                    title: title,
                    message: this.$createElement('lah-reg-table', {
                        props: {
                            bakedData: data,
                            iconVariant: "success",
                            icon: "chevron-circle-right",
                            type: 'md'
                        }
                    }),
                    size: 'xl'
                });
            },
            showRegularCases(title, data) {
                this.msgbox({
                    title: title,
                    message: this.$createElement('b-table', {
                        props: {
                            striped: true,
                            hover: true,
                            headVariant: 'dark',
                            bordered: true,
                            captionTop: true,
                            caption: `找到 ${data.length} 件`,
                            items: data
                        }
                    }),
                    size: 'xl'
                });
            },
            xhr(type, title, reason_code = undefined) {
                this.isBusy = true;
                this.$http.post(CONFIG.API.JSON.QUERY, {
                    type: type,
                    query_month: this.date,
                    reason_code: reason_code
                }).then(res => {
                    if (
                        res.data.status == XHR_STATUS_CODE.SUCCESS_WITH_MULTIPLE_RECORDS ||
                        res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL
                    ) {
                        if (title == "主動退費案件" || title == "測量因雨延期案件" || title == "遠途先審案件" || title == "本所處理跨所子號案件" || title == "外國人地權登記統計") {
                            this.showRegularCases(title, res.data.raw);
                            // e.g. stats_regf may need to reload the stats count since it will have data after 1st day of month ... 
                            this.sync_data_count(title, res.data.raw);
                        } else {
                            this.showRegCases(title, res.data.baked);
                        }
                    } else {
                        let err = this.responseMessage(res.data.status);
                        this.$warn(err);
                        this.notify({
                            message: err,
                            type: "warning"
                        });
                    }
                }).catch(err => {
                    this.error = err;
                }).finally(() => {
                    this.isBusy = false;
                });
            },
            query(item) {
                if (this.empty(item.id)) {
                    switch (item.category) {
                        case "stats_court":
                            this.xhr('reg_court_cases_by_month', '法院囑託案件');
                            break;
                        case "stats_reg_fix":
                            this.xhr('reg_fix_cases_by_month', '登記補正案件');
                            break;
                        case "stats_reg_reject":
                            this.xhr('reg_reject_cases_by_month', '登記駁回案件');
                            break;
                        case "stats_refund":
                            this.xhr('expba_refund_cases_by_month', '主動退費案件');
                            break;
                        case "stats_sur_rain":
                            this.xhr('sur_rain_cases_by_month', '測量因雨延期案件');
                            break;
                        case "stats_reg_remote":
                            this.xhr('reg_remote_cases_by_month', '遠途先審案件');
                            break;
                        case "stats_reg_subcase":
                            this.xhr('reg_subcases_by_month', '本所處理跨所子號案件');
                            break;
                        case "stats_regf":
                            this.xhr('regf_by_month', '外國人地權登記統計');
                            break;
                        default:
                            this.$warn("無登記原因代碼，無法查詢案件。");
                            this.notify({
                                message: '本項目未支援取得詳細列表功能',
                                type: "warning"
                            })
                    }
                } else {
                    this.$log(item.category);
                    this.xhr('reg_reason_cases_by_month', item.text, item.id);
                }
            },
            xlsx_export(item) {
                this.isBusy = true;
                this.$http.post(CONFIG.API.JSON.QUERY, {
                    type: 'xlsx_params',
                    xlsx_type: 'stats_export',
                    xlsx_item: Object.assign({
                        query_month: this.date
                    }, item)
                }).then(res => {
                    if (res.data.status == XHR_STATUS_CODE.SUCCESS_NORMAL) {
                        this.notify({
                            title: '匯出EXCEL檔案',
                            message: '<i class="fas fa-cog ld ld-spin"></i> 後端處理中 ... ',
                            type: "warning",
                            duration: 2000
                        });
                        // second param usage => e.target.title to get the title
                        this.open(CONFIG.API.FILE.XLSX, {
                            target: {
                                title: '下載XLSX'
                            }
                        });
                        this.timeout(() => closeModal(() => this.notify({
                            title: '匯出EXCEL檔案',
                            message: '<i class="fas fa-check ld ld-pulse"></i> 後端作業完成',
                            type: "success"
                        })), 2000);
                    } else {
                        let err = this.responseMessage(res.data.status);
                        let message = `${err} - ${res.data.status}`;
                        this.$warn(`紀錄 XLSX 參數失敗: ${message}`);
                        this.alert({
                            title: '紀錄 XLSX 參數',
                            message: message,
                            type: "danger"
                        });
                    }
                }).catch(err => {
                    this.error = err;
                }).finally(() => {
                    this.isBusy = false;
                });
            },
            xlsx(item) {
                // item.id is reg reason code
                switch (item.category) {
                    case "stats_court":
                    case "stats_reg_fix":
                    case "stats_reg_reject":
                    case "stats_refund":
                    case "stats_sur_rain":
                    case "stats_reg_remote":
                    case "stats_reg_subcase":
                    case "stats_regf":
                    case "stats_reg_reason":
                        this.xlsx_export(item);
                        break;
                    default:
                        this.$warn("無分類代碼，無法匯出資料。", item);
                        this.notify({
                            message: '本項目未支援匯出XLSX功能',
                            type: "warning"
                        })
                }
            },
            sync_data_count(title, qry_data) {
                // NOTE: use title to check the count sync
                let need_to_sync = this.items.filter((item, index, array) => {
                    return qry_data.length != item.count && item.text == title;
                });
                if (need_to_sync) {
                    need_to_sync.forEach(element => {
                        this.reload_stats_cache(element.category);
                    });
                }
            }
        },
        mounted() {
            // set default to the last month, e.g. 10904
            let now = new Date();
            this.default_date = now.getFullYear() - 1911 + ("0" + (now.getMonth())).slice(-2);
        }
    });
    /**
     * Vuex switches
     */
    Vue.component("lah-vuex-switch", {
        template: `<b-card>
            <template v-slot:header>
                <div class="d-flex w-100 justify-content-between mb-0">
                    <h6 class="my-auto font-weight-bolder"><lah-fa-icon icon="cogs"> 系統設定</lah-fa-icon></h6>
                    <lah-button icon="question" @click="popup" size="sm" variant="outline-success" class="border-0"></lah-button>
                </div>
            </template>
            <b-form-checkbox v-model="enable_msdb_query" switch><span title="是否停用MSSQL資料庫連結">{{enable_msdb_query_desc}}</span></b-form-checkbox>
            <b-form-checkbox v-model="enable_office_hours" switch><span title="是否啟用工作天時檢查">{{enable_office_hours_desc}}</span></b-form-checkbox>
            <b-form-checkbox v-if="show_mock_mode_switch" v-model="enable_mock_mode" switch><span title="是否處於模擬模式">{{enable_mock_mode_desc}}</span></b-form-checkbox>
        </b-card>`,
        props: {
            heading: { type: Boolean, default: true }
        },
        data: () => ({
            enable_msdb_query: true,
            enable_office_hours: true,
            enable_mock_mode: false
        }),
        computed: {
            enable_msdb_query_desc() { return this.enable_msdb_query ? '啟用外部MSSQL連線功能' : '停用外部MSSQL連線功能' },
            enable_office_hours_desc() { return this.enable_office_hours ? '啟用工作天檢查' : '停用工作天檢查' },
            enable_mock_mode_desc() { return this.enable_mock_mode ? '啟用模擬模式' : '停用模擬模式' },
            show_mock_mode_switch() { return this.myip != '127.0.0.1' }
        },
        watch: {
            disableMSDBQuery(flag) {
                this.enable_msdb_query = !flag;
            },
            enable_msdb_query(flag) {
                this.isBusy = true;
                this.$http.post(CONFIG.API.JSON.SWITCH, {
                    type: 'switch_set_mssql_mode',
                    flag: flag
                }).then(res => {
                    this.$warn(res.data.message);
                }).catch(err => {
                    this.$error(err);
                }).finally(() => {
                    this.isBusy = false;
                });
            },
            disableOfficeHours(flag) {
                this.enable_office_hours = !flag;
            },
            enable_office_hours(flag) {
                this.isBusy = true;
                this.$http.post(CONFIG.API.JSON.SWITCH, {
                    type: 'switch_set_office_hours_mode',
                    flag: flag
                }).then(res => {
                    this.$warn(res.data.message);
                }).catch(err => {
                    this.$error(err);
                }).finally(() => {
                    this.isBusy = false;
                });
            },
            disableMockMode(flag) {
                this.enable_mock_mode = !flag;
            },
            enable_mock_mode(flag) {
                this.isBusy = true;
                this.$http.post(CONFIG.API.JSON.SWITCH, {
                    type: flag ? 'switch_enable_mock' : 'switch_disable_mock'
                }).then(res => {
                    this.$warn(res.data.message);
                }).catch(err => {
                    this.$error(err);
                }).finally(() => {
                    this.isBusy = false;
                });
            }
        },
        methods: {
            popup() {
                this.msgbox({
                    title: "系統設定 相關設定說明",
                    body: `
                        <ul>
                            <li>${this.enable_msdb_query_desc} - 有關外部MSSQL查詢都會影響。</li>
                            <li>${this.enable_office_hours_desc} - 是否受工作天檢查影響。</li>
                            <li>${this.enable_mock_mode_desc} - 伺服器是否只會傳回快取的資料。</li>
                        </ul>
                    `,
                    size: "lg"
                });
            }
        }
    });
} else {
    console.error("vue.js not ready ... lah-* relative components can not be loaded.");
}