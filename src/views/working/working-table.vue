<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.task_name" placeholder="任务类别" style="width: 220px; margin-right: 60px" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-select v-model="listQuery.approve_status" placeholder="审批状态" clearable class="filter-item" style="width: 180px; margin-right: 60px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
<!--      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
<!--        导出-->
<!--      </el-button>-->
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
      <el-table-column label="工时ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始日期" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.work_start }}</span>
        </template>
      </el-table-column>
      <el-table-column label="截止日期" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.work_end }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" min-width="100px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职位" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.role_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工时" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <span>{{ row.work_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务类别" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <span>{{ row.task_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作内容" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <span>{{ row.work_info }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.create_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" :content=" row.reasons " placement="top-start">
            <el-button v-if="row.approve_status !== 2" style="border: none; background-color: #ecf5ff; color: #409eff">{{ row.approve_status | statusFilter }}</el-button>
            <el-button v-else style="border: none; background-color: #f56c6c; color: #ecf5ff">{{ row.approve_status | statusFilter }}</el-button>

          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="role_name ==='管理员' || role_name ==='项目负责人' || !role_name" size="mini" @click="handleApprove(row.id)" style="background-color: orange; color: whitesmoke">
            审批
          </el-button>
          <el-button v-if="(role_name ==='管理员' || role_name ==='项目负责人' || !role_name) || ((role_name !=='管理员' || role_name !=='项目负责人') && row.approve_status !==1 )" type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="success" @click="handleDetail(row)">
            详情
          </el-button>
          <el-button v-if="(role_name ==='管理员' || role_name ==='项目负责人' || !role_name) || ((role_name !=='管理员' || role_name !=='项目负责人') && row.approve_status !==1 )" size="mini" type="danger" @click="handleDelete(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="工时类别">
          <el-select v-model="temp.taskpro_id" class="filter-item" placeholder="请选择">
            <el-option v-for="item in parentlist" :key="item.id" :label="item.task_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="start_at">
          <el-date-picker v-model="temp.work_start" type="datetime" placeholder="请选择开始日期" />
        </el-form-item>
        <el-form-item label="截止日期" prop="end_at">
          <el-date-picker v-model="temp.work_end" type="datetime" placeholder="请选择截止日期" />
        </el-form-item>
        <el-form-item label="工作时长" prop="task_process" placeholder="0-100">
          <el-input v-model="temp.work_time" />
        </el-form-item>
        <el-form-item label="工作内容" prop="task_info" >
          <el-input v-model="temp.work_info" placeholder="这里是简要内容" type="textarea" />
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogApproveVisible">
      <el-form ref="dataForms" :rules="rules" :model="approvetemp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="审批状态" prop="approve_status">
          <el-select v-model="approvetemp.approve_status" class="filter-item" placeholder="请选择">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="建议" prop="reasons" >
          <el-input v-model="approvetemp.reasons" placeholder="一些issue" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus === 'approve'" @click="dialogApproveVisible = false">
          取消
        </el-button>
        <el-button v-if="dialogStatus === 'approve'" type="primary" @click=ApproveData()>
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, detailWork, createWork, updateWork, parentTask, deleteWork, approveWork } from '@/api/working'
import { getUser } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 0, display_name: '待审批' },
  { key: 1, display_name: '已审批' },
  { key: 2, display_name: '未通过' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  inject: ['reload'],
  name: 'WorkingTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '0': '待审批',
        '1': '已审批',
        '2': '未通过',
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      approvetemp: {
        approve_status: 0,
        reasons: ''
      },
      approveid: null,
      dialogApproveVisible: false,
      dialogDeVisible: false,
      delid: null,
      users: null,
      parentlist: null,
      parent_id__isnull: { parent_id__isnull: false },
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
        approve_status: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        username: '',
        role_name: '',
        work_time: '',
        taskpro: '',
        work_info: '',
        create_at: '',
        approve_status: 0,
        reasons: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        work_time: [{ required: true, message: '工作时间', trigger: 'change' }],
        // work_start: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        work_info: [{ required: true, message: '内容必填', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList() // 进入页面直接获取数据
    this.getTask() // 获取当前用户任务子类的信息
    // this.getUser() // 获取Users
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
      // 任务  只能在子任务下面创建工时
      parentTask(this.parent_id__isnull).then(response => {
        this.parentlist = response.data.results
      })
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
          createWork(this.temp).then(() => {
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
          updateWork(tempData, tempData.id).then(() => {
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
      deleteWork(this.delid).then(() => {
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
    handleApprove(id) {
      this.approveid = id
      this.dialogApproveVisible = true
      this.dialogStatus = 'approve'
      this.$nextTick(() => {
        this.$refs['dataForms'].clearValidate()
      })
    },
    ApproveData() {
      this.$refs['dataForms'].validate((valid) => {
        if (valid) {
          // 审批
          approveWork(this.approvetemp, this.approveid).then(() => {
            this.dialogApproveVisible = false
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
