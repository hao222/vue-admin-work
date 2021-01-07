<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="10">
        <div class="chart-wrapper">
          <pie-chart v-if="flag" :worksall="worksall" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="10">
        <div class="chart-wrapper">
          <bar-chart v-if="flag" :datauser="datauser" :usersname="usersname" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import { dashCount } from '@/api/user'
import { Message } from 'element-ui'
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PieChart,
    BarChart
  },
  data() {
    return {
      flag: false,
      usersname: null,
      datauser: null,
      worksall: null,
      lineChartData: lineChartData.newVisitis
    }
  },
  created() {
    this.getdashcount()
  },
  methods: {
    getdashcount() {
      dashCount().then(response => {
        if (response.status === 200) {
          this.datauser = response.data.works_user
          this.usersname = response.data.users_name
          this.worksall = response.data.works_all
          this.flag = true
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        }
      }).catch(error => {
        Message({ message: error.response.data['detail'], type: 'error', duration: 1000 })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
