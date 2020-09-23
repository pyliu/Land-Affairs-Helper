if (Vue) {
    Vue.component('lah-tree', {
        template: `<b-card :id="id" style="min-height: 300px"></b-card>`,
        props: {
            dataNode: {
                type: Object,
                default: {
                    text: {
                        name: { val: `範例`, href: `javascript:(0)` },
                        title: `測試`,
                        contact: `#分機`,
                        desc: ``
                    },
                    image: `assets/img/users/not_found_avatar.jpg`,
                    collapsable: true,
                    collapsed: false,
                    stackChildren: true,
                    pseudo: false
                }
            },
            nodeMargin: { type: Number, default: 15 },
            htmlClass: { type: String, default: 'mynode' },
            orientation: { type: String, default: 'NORTH' }
        },
        data: () => ({
            id: '',
            inst: null,
            rebuild_timer: null
        }),
        computed: {
            config() {
                return {
                    chart: {
                        container: `#${this.id}`,
                        connectors: {
                            type: 'step', // curve, bCurve, step, straight
                            style: {  
                                "stroke-width": 2,  
                                "stroke": "#000"
                            }
                        },
                        node: {
                            HTMLclass: this.htmlClass,
                            // collapsable: true,
                            // stackChildren: true
                        },
                        rootOrientation: this.orientation_switch ? 'NORTH' : 'WEST',
                        // animateOnInit: false,
                        // nodeAlign: 'TOP',
                        siblingSeparation: this.nodeMargin,
                        levelSeparation: this.nodeMargin,
                        subTeeSeparation: this.nodeMargin,
                        scrollbar: 'native'
                    }
                }
            }
        },
        watch: {
            dataNode() { this.build() },
            nodeMargin() { this.build() },
            htmlClass() { this.build() },
            orientation() { this.build() }
        },
        methods: {
            build() {
                if (typeof Treant == "function") {
                    clearTimeout(this.rebuild_timer);
                    this.rebuild_timer = this.timeout(() => {
                        this.isBusy = true;
                        this.config.nodeStructure = this.dataNode;
                        //this.$refs.canvas.style.height = (window.innerHeight - 165 || 600) + 'px';
                        if (this.inst) this.inst.destroy();
                        this.inst = new Treant(Object.assign(this.config, { nodeStructure: this.dataNode }), () => {
                            this.isBusy = false;
                        }, $);
                        // this.$log(this.inst);
                    }, 500);
                } else {
                    this.$error(`Treant not defined. Did you include treant.js?`);
                }
            }
        },
        created() {
            this.id = this.uuid();
            window.addEventListener("resize", e => {
                clearTimeout(this.rebuild_timer);
                this.rebuild_timer = this.timeout(this.build, 500);
            });
        },
        mounted() { this.build() }
    });
} else {
    console.error("vue.js not ready ... lah-tree component can not be loaded.");
}