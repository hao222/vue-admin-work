<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.operation_name" placeholder="操作人" style="width: 220px; margin-right: 60px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" width="220px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.create_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="功能模块" width="220px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.module }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作内容" width="260px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.operation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.operation_name }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/operate'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { Message } from 'element-ui'

export default {
  inject: ['reload'],
  name: 'OperateTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        operation_name: undefined,
        sort: '+id'
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: {
        id: undefined,
        create_at: new Date(),
        module: '',
        operation: '',
        operation_name: ''
      }
    }
  },
  created() {
    this.getList() // 进入页面直接获取数据
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.status === 200) {
          this.list = response.data.results
          this.total = response.data.paging.total
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        }
      }).catch(error => {
        Message({ message: error.response.data['detail'], type: 'error', duration: 1000 })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        create_at: new Date(),
        module: '',
        operation: '',
        operation_name: ''
      }
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
