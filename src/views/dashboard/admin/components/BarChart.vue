<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    usersname: {
      type: Array,
      default: null
    },
    datauser: {
      type: Array,
      default: null
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  created() {
    this.initChart()

  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      console.log(this.datauser)
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: '用户工时审批情况',
          top: 'bottom',
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: '',
            color: '#fadead'
          }
        },
        tooltip: {},
        legend: {},
        grid: {
          left: '10%',
          right: '4%',
          bottom: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.usersname
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          splitNumber: 2
        },
        series: [{
          name: "待审批",
          type: "bar",
          data: this.datauser.pending
        }, {
          name: "已审批",
          type: "bar",
          data: this.datauser.approve
        }, {
          name: "未通过",
          type: "bar",
          data: this.datauser.not_pass
        }]
      })
    }
  }
}
</script>
