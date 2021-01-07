<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名" style="width: 220px; margin-right: 60px" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 180px; margin-right: 60px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-if="role_name ==='管理员' || role_name ==='项目负责人' || !role_name " class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
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
      <el-table-column label="添加时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.create_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.role_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后登录时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.last_login }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="330" class-name="small-padding fixed-width">
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="temp.role" class="filter-item" placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password" placeholder="请输入密码">
          <el-input v-model="temp.password" :type="passwordType" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone" placeholder="请输入手机号">
          <el-input v-model="temp.phone" type='number' maxlength=11 oninput="value=value.replace(/[^\d]/g,'')" />
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
import { getUser, createUser, updateUser, deleteUser, roleList } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { Message } from 'element-ui' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 0, display_name: '禁用' },
  { key: 1, display_name: '启用' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  inject: ['reload'],
  name: 'UserTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '0': '禁用',
        '1': '启用'
      }
      return statusMap[status]
    }
    // statusFilter(status) {
    //   return calendarTypeKeyValue[status]
    // }
  },
  data() {
    return {
      passwordType: 'password',
      dialogDeVisible: false,
      delid: null,
      users: null,
      roleList: null,
      parent_id__isnull: { parent_id__isnull: true },
      role_name: this.$store.state.user.role,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        username: undefined,
        status: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        create_at: new Date(),
        last_login: new Date(),
        username: '',
        role_name: '',
        password: '',
        phone: ''
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
        password: [{ required: true, message: '密码必填', trigger: 'change' }],
        username: [{ required: true, message: '姓名必填', trigger: 'blur' }],
        role: [{ required: true, message: '角色必填', trigger: 'blur' }]

      },
      downloadLoading: false
    }
  },
  created() {
    this.getList() // 进入页面直接获取数据
    this.getroleList() // 获取角色列表
  },
  methods: {
    getList() {
      this.listLoading = true
      getUser(this.listQuery).then(response => {
        this.list = response.data.results
        this.total = response.data.paging.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getroleList() {
      roleList(this.parent_id__isnull).then(response => {
        this.roleList = response.data.results
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
        create_at: new Date(),
        last_login: new Date(),
        username: '',
        role_name: '',
        password: '',
        phone: '',
        role: undefined
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
          createUser(this.temp).then(response => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '新增',
              message: '创建成功',
              type: 'success',
              duration: 1000
            })
            this.reload() // 重新刷新
          }).catch(error => {
            Message({ message: error.response.data['detail'], type: 'error', duration: 1000 })
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
          updateUser(tempData, tempData.id).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 1000
            })
          }).catch(error => {
            Message({ message: error.response.data['detail'], type: 'error', duration: 2000 })
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
      deleteUser(this.delid).then(() => {
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
    handleCreateRole() {
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
