<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.task_name" placeholder="任务名" style="width: 220px; margin-right: 60px" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-select v-model="listQuery.task_status" placeholder="状态" clearable class="filter-item" style="width: 180px; margin-right: 60px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-if="role_name ==='管理员' || role_name ==='项目负责人' || !role_name " class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
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
      <el-table-column label="子任务ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="父任务ID" align="center" width="80" >
        <template slot-scope="{row}">
          <span>{{ row.parent_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始日期" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.start_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="截止日期" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.end_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务名称" min-width="100px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.task_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务执行者" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.exect_person }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务创建者" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务进度" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <span>{{ row.task_process_list }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.task_status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="role_name ==='管理员' || role_name ==='项目负责人' || !role_name" type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="success" @click="handleDetail(row)">
            详情
          </el-button>
          <el-button v-if="role_name ==='管理员' || role_name ==='项目负责人' || !role_name" size="mini" type="danger" @click="handleDelete(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="任务名称" prop="task_name">
          <el-input v-model="temp.task_name" />
        </el-form-item>
        <el-form-item label="任务状态" prop="task_status">
          <el-select v-model="temp.task_status" class="filter-item" placeholder="请选择">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="start_at">
          <el-date-picker v-model="temp.start_at" type="datetime" placeholder="请选择开始日期" />
        </el-form-item>
        <el-form-item label="截止日期" prop="end_at">
          <el-date-picker v-model="temp.end_at" type="datetime" placeholder="请选择截止日期" />
        </el-form-item>
        <el-form-item label="任务进度" prop="task_process" placeholder="0-100">
          <el-input v-model="temp.task_process" />
        </el-form-item>
        <el-form-item label="父任务">
          <el-select v-model="temp.parent_id" class="filter-item" placeholder="请选择">
            <el-option v-for="item in parentlist" :key="item.id" :label="item.task_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="指派给">
          <el-select v-model="temp.user_id" class="filter-item" placeholder="请选择">
            <el-option v-for="item in users" :key="item.id" :label="item.username" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务内容" prop="task_info" >
          <el-input v-model="temp.task_info" placeholder="这里是简要内容" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus !== 'detail'" @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button v-if="dialogStatus !== 'detail'" type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="取消" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">提交</el-button>
      </span>
    </el-dialog>

    <el-dialog title="删除数据" :visible.sync="dialogDeVisible">
      <span>确定要删除吗?</span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogDeVisible = false">取 消</el-button>
      <el-button type="primary" @click=deleteData()>确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, detailTask, createTask, updateTask, parentTask, deleteTask } from '@/api/task'
import { getUser } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 0, display_name: '未开始' },
  { key: 1, display_name: '进行中' },
  { key: 2, display_name: '已完成' },
  { key: 3, display_name: '已取消' },
  { key: 4, display_name: '已关闭' }

]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  inject: ['reload'],
  name: 'TaskTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '0': '未开始',
        '1': '进行中',
        '2': '已完成',
        '3': '已取消',
        '4': '已关闭'
      }
      return statusMap[status]
    }
    // statusFilter(status) {
    //   return calendarTypeKeyValue[status]
    // }
  },
  data() {
    return {
      dialogDeVisible: false,
      delid: null,
      users: null,
      parentlist: null,
      parent_id__isnull: { parent_id__isnull: true },
      role_name: this.$store.state.user.role,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        task_name: undefined,
        task_status: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        start_at: new Date(),
        end_at: new Date(),
        task_name: '',
        task_status: 0,
        parent_id: undefined,
        user_id: undefined,
        task_info: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        create_at: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        task_name: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList() // 进入页面直接获取数据
    this.getTask() // 获取父类的信息
    this.getUser() // 获取Users
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.results
        this.total = response.data.paging.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getTask() {
      parentTask(this.parent_id__isnull).then(response => {
        this.parentlist = response.data.results
      })
    },
    getUser() {
      if (this.role_name === '管理员' || this.role_name === '项目负责人' || !this.role_name) {
        getUser().then(response => {
          this.users = response.data.results
        })
      } else {
        this.users = []
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDetail(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          createTask(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '新增',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.reload() // 重新刷新
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData.id)
          // 更新
          updateTask(tempData, tempData.id).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 1000
            })
          })
          this.reload() // 重新刷新
        }
      })
    },
    handleDelete(id) {
      this.delid = id
      this.dialogDeVisible = true
    },
    deleteData() {
      // 删除
      deleteTask(this.delid).then(() => {
        const index = this.list.findIndex(v => v.id === this.delid)
        this.list.splice(index, 1)
        this.dialogDeVisible = false
        this.$notify({
          title: '删除数据',
          message: '删除成功',
          type: 'success',
          duration: 1000
        })
      })
      this.reload() // 重新刷新

    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
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
