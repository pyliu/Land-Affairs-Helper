if (Vue) {
  Vue.component('lah-l3hweb-traffic-light', {
    template: `<b-card>
      <template v-slot:header>
        <div class="d-flex w-100 justify-content-between mb-0">
          <h6 class="my-auto font-weight-bolder"><lah-fa-icon icon="traffic-light" size="lg" :variant="headerLight"> L3HWEB 資料庫更新監控 </lah-fa-icon></h6>
          <b-button-group>
            <lah-button icon="sync" variant='outline-primary' class="border-0" @click="reload" action="cycle"></lah-button>
            <lah-button icon="question" variant="outline-success" class="border-0" @click="popup"></lah-button>
          </b-button-group>
        </div>
      </template>
      <div v-if="!fullHeight" :id="container_id" class="grids">
        <div v-for="entry in list" class="grid">
          <lah-fa-icon icon="circle" :variant="light(entry)" :action="action(entry)" v-b-popover.hover.focus.top="'最後更新時間: '+entry.UPDATE_DATETIME">{{name(entry)}}</lah-fa-icon>
        </div>
      </div>
      <div v-else :id="container_id">
        <lah-chart ref="chart" :label="chartLabel" :items="chartItems" :type="charType" :aspect-ratio="viewportRatio" :bg-color="chartItemColor"></lah-chart>
      </div>
    </b-card>`,
    props: {
      fullHeight: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      container_id: 'grids-container',
      list: [{
          SITE: 'HA',
          UPDATE_DATETIME: '2020-10-10 20:47:00'
        },
        {
          SITE: 'HB',
          UPDATE_DATETIME: '2020-10-10 21:47:00'
        },
        {
          SITE: 'HC',
          UPDATE_DATETIME: '2020-10-10 22:47:00'
        },
        {
          SITE: 'HD',
          UPDATE_DATETIME: '2020-10-10 23:47:00'
        },
        {
          SITE: 'HE',
          UPDATE_DATETIME: '2020-10-11 00:47:00'
        },
        {
          SITE: 'HF',
          UPDATE_DATETIME: '2020-10-11 01:47:00'
        },
        {
          SITE: 'HG',
          UPDATE_DATETIME: '2020-10-11 02:47:00'
        },
        {
          SITE: 'HH',
          UPDATE_DATETIME: '2020-10-10 03:47:00'
        }
      ],
      chartLabel: '未更新時間',
      charType: 'bar',
      chartItems: [
        ['桃園所', 330 / 60],
        ['中壢所', 260 / 60],
        ['大溪所', 334 / 60],
        ['楊梅所', 910 / 60],
        ['蘆竹所', 111 / 60],
        ['八德所', 150 / 60],
        ['平鎮所', 699 / 60],
        ['龜山所', 1801 / 60]
      ]
    }),
    computed: {
      headerLight() {
        for (let i = 0; i < this.list.length; i++) {
          let site_light = this.light(this.list[i]);
          if (site_light == 'danger' || site_light == 'warning') return site_light;
        }
        return 'success';
      }
    },
    watch: {},
    methods: {
      chartItemColor(dataset_item, opacity) {
        let rgb, value = dataset_item[1];
        if (value > 30) {
          rgb = `rgb(243, 0, 19, ${opacity})`
        } // red
        else if (value > 15) {
          rgb = `rgb(238, 182, 1, ${opacity})`;
        } // yellow
        else {
          rgb = `rgb(0, 200, 0, ${opacity})`
        }
        return rgb;
      },
      action(entry) {
        let light = this.light(entry);
        switch (light) {
          case 'danger':
            return 'tremble';
          case 'warning':
            return 'beat';
          default:
            return '';
        }
      },
      name(entry) {
        for (var value of this.xapMap.values()) {
          if (value.code == entry.SITE) {
            return value.name;
          }
        }
      },
      light(entry) {
        const now = +new Date(); // in ms
        const last_update = +new Date(entry.UPDATE_DATETIME.replace(' ', 'T'));
        let offset = now - last_update;
        if (offset > 30 * 60 * 1000) return 'danger';
        else if (offset > 15 * 60 * 1000) return 'warning';
        return 'success';
      },
      popup() {
        this.msgbox({
          title: '同步異動資料庫監控說明',
          message: `
                <h6 class="my-2"><i class="fa fa-circle text-danger fa-lg"></i> 已超過半小時未更新</h6>
                <h6 class="my-2"><i class="fa fa-circle text-warning fa-lg"></i> 已超過15分鐘未更新</h6>
                <h6 class="my-2"><i class="fa fa-circle text-success fa-lg"></i> 15分鐘內更新</h6>
            `,
          size: 'lg'
        });
      },
      reload() {},
      updChartData(data) {
        data.forEach((item, raw_idx, array) => {
          // item = { SITE: 'HB', UPDATE_DATETIME: '2020-10-10 19:58:01' }
          let name = this.name(item);
          if (this.empty(name)) {
            this.$warn(`${item.SITE} can not find the mapping name.`);
          } else {
            const now = +new Date(); // in ms
            const last_update = +new Date(item.UPDATE_DATETIME.replace(' ', 'T'));
            let value = ((now - last_update) / 3600000).toFixed(1); // 60 * 60 * 1000 => 3600000 ms
            let found = this.chartItems.find((oitem, idx, array) => {
              return oitem[0] == name;
            });
            if (found) {
              // the dataset item format is ['text', 123]
              found[1] = value;
              // not reactively ... manual set chartData
              if (this.$refs.chart) {
                this.$refs.chart.changeValue(name, value);
              }
            } else {
              this.$warn(`Can not find ${name} in chartItems.`);
            }
          }
        });
      }
    },
    created() {
      // this.isBusy = true;
      // this.$http.post(CONFIG.API.JSON.QUERY, {
      //   type: "l3hweb_update_time"
      // }).then(res => {
      //   if (this.empty(res.data.data_count)) {
      //     this.notify({
      //       title: "同步異動主機狀態檢視",
      //       message: `${this.nowDate} ${this.nowTime} 查無資料`,
      //       type: "warning"
      //     });
      //   } else {
      //     // array of {SITE: 'HB', UPDATE_DATETIME: '2020-10-08 21:47:00'}
      //     this.list = res.data.raw;
      //   }
      // }).catch(err => {
      //   this.error = err;
      // }).finally(() => {
      //   this.isBusy = false;
      // });
    },
    mounted() {
      if (this.fullHeight) $(`#${this.container_id}`).css('height', `${window.innerHeight-195}px`);
      this.updChartData(this.list);
    }
  });
} else {
  console.error("vue.js not ready ... lah-l3hweb-traffic-light component can not be loaded.");
}