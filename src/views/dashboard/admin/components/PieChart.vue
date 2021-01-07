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
    worksall: {
      type: Object
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
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: '总工时',
          top: 'bottom',
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: '',
            color: '#dfcdaa'
          }
        },
        legend: {
          orient: 'vertical',
          left: 'right'
        },
        series: [{
          type: 'pie',
          data: [{
            value: this.worksall.pending,
            name: '待审批'
          }, {
            value: this.worksall.approve,
            name: '已审批'
          }, {
            value: this.worksall.not_pass,
            name: '审批未通过'
          }]
        }]
      })
    }
  }
}
</script>
