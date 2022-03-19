<template>
  <div>
    <el-dialog title="修改用户信息"
            :visible.sync="dialogFormVisible">
      <el-form v-model="selectedUser" style="text-align: left" ref="dataForm">
        <el-form-item label="用户名" label-width="120px" prop="username">
          <label>{{selectedUser.name}}</label>
        </el-form-item>
        <el-form-item label="手机号" label-width="120px" prop="phone">
          <el-input v-model="selectedUser.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" prop="email">
          <el-input v-model="selectedUser.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px" prop="password">
          <el-button type="warning" @click="resetPassword(selectedUser.name)">重置密码</el-button>
        </el-form-item>
        <el-form-item label="角色分配" label-width="120px" prop="roles">
          <el-checkbox-group v-model="selectedRolesIds">
            <el-checkbox v-for="(role,i) in roles" :key="i" :label="role.id">{{role.name_zh}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit(selectedUser)">确 定</el-button>
      </div>
    </el-dialog>
    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">管理中心</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <bulk-registration @onSubmit="listUsers()"></bulk-registration>
    <el-card style="margin: 18px 2%;width: 95%">
      <el-table
              ref="multipleTable"
              :data="tempUsers"
              stripe
              :default-sort = "{prop: 'id', order: 'ascending'}"
              style="width: 100%"
              @selection-change="addBoxIds">
        :max-height="tableHeight">
        <el-table-column
                type="selection"
                width="55">
        </el-table-column>
        <el-table-column
                prop="id"
                label="id"
                sortable
                width="100">
        </el-table-column>
        <el-table-column
                prop="name"
                label="用户名"
                fit>
        </el-table-column>
        <el-table-column
                prop="phone"
                label="手机号"
                fit>
        </el-table-column>
        <el-table-column
                prop="email"
                label="邮箱"
                show-overflow-tooltip
                fit>
        </el-table-column>
        <el-table-column
                label="状态"
                sortable
                width="100">
          <template slot-scope="scope">
            <el-switch
                    v-model="scope.row.enabled"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                    @change="(value) => commitStatusChange(value, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
                label="操作"
                width="120">
          <template slot-scope="scope">
            <el-button
                    @click="editUser(scope.row)"
                    type="text"
                    size="small">
              编辑
            </el-button>
            <el-button
                    @click="deleteUser(scope.row)"
                    type="text"
                    size="small">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin: 20px 0 20px 0;float: left">
        <el-button @click="toggleSelection()">取消选择</el-button>
        <el-button @click="deleteAll()">批量删除</el-button>
      </div>
      <div class="block" style="margin: 30px 0 20px 0; float:right">
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage1"
                :page-sizes="[5, 10, 30, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="users.length">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  import BulkRegistration from './BulkRegistration'
    export default {
      name: 'UserProfile',
      components: {BulkRegistration},
      data () {
          return {
            users: [],
            roles: [],
            dialogFormVisible: false,
            selectedUser: [],
            selectedRolesIds: [],
            selectBoxIds:[],
            tempUsers:[],
            pageSize: 5,
            currentPage1:1,
          }
      },
      mounted () {
        this.listUsers()
        this.listRoles()
      },
      computed: {
        tableHeight () {
          return window.innerHeight - 320
        }
      },
      methods: {
        listUsers () {
          let _this = this
          this.$axios.get('/admin/user/getAlluser').then(resp => {
            if (resp && resp.data.code === 200) {
              _this.users = resp.data.data
              this.currentChangePage(this.users, this.currentPage1)
              console.log(_this.users)
            }
          })
        },
        listRoles () {
          let _this = this
          this.$axios.get('/admin/role').then(resp => {
            if (resp && resp.data.code === 200) {
              _this.roles = resp.data.data
            }
          })
        },
        commitStatusChange (value, user) {
          if (user.name !== 'admin') {
            let t1 = 1
            console.log("asd:"+user.enabled)
            if(value){
                t1 = 1
            }else {
              t1 = 0
            }
            this.$axios.put('/admin/user/status', {
              enabled: t1,
              name: user.name,
              id: user.id,
              password: user.password,
              email: user.email,
              phone: user.phone
            }).then(resp => {
              console.log(value)
              if (resp && resp.data.code === 200) {

                if (value) {
                  this.$message('用户 [' + user.name + '] 已启用')
                } else {
                  this.$message('用户 [' + user.name + '] 已禁用')
                }
              }
            })
          } else {
            user.enabled = true
            this.$alert('不能禁用管理员账户')
          }
        },
        onSubmit (user) {
          let _this = this
          // 根据视图绑定的角色 id 向后端传送角色信息
          let roles = []
          for (let i = 0; i < _this.selectedRolesIds.length; i++) {
            for (let j = 0; j < _this.roles.length; j++) {
              if (_this.selectedRolesIds[i] === _this.roles[j].id) {
                roles.push(_this.roles[j])
              }
            }
          }
          this.$axios.put('/admin/user', {
            name: user.name,
            phone: user.phone,
            email: user.email,
            roles: roles
          }).then(resp => {
            if (resp && resp.data.code === 200) {
              this.$alert('用户信息修改成功')
              this.dialogFormVisible = false
              // 修改角色后重新请求用户信息，实现视图更新
              this.listUsers()
            } else {
              this.$alert(resp.data.message)
            }
          })
        },
        editUser (user) {
          this.dialogFormVisible = true
          this.selectedUser = user
          let roleIds = []
          if(user.roles.id !== 0 ){
            for (let i = 0; i < user.roles.length; i++) {
              roleIds.push(user.roles[i].id)
            }
          }else {
             roleIds = []
          }
          this.selectedRolesIds = roleIds
        },
        resetPassword (username) {
          this.$axios.put('/admin/user/password', {
            username: username
          }).then(resp => {
            if (resp && resp.data.code === 200) {
              this.$alert('密码已重置为 123')
          }
          })
        },
        deleteUser(user){
          this.$axios.post('/admin/user/deleteUser',{
            id:user.id
          }).then(resp => {
            if(resp && resp.data.code === 200){
              this.$alert('该用户已删除')
              this.listUsers()
            }
          })
        },
        toggleSelection(rows) {
          if (rows) {
            rows.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row);
            });
          } else {
            this.$refs.multipleTable.clearSelection();
          }
        },
        addBoxIds(val){
          this.selectBoxIds=val
        },
        deleteAll(){
          console.log(this.selectBoxIds)
          let _this=this
          this.$axios.put('/admin/user/deleteAll',_this.selectBoxIds
          ).then(resp => {
            console.log(this.selectBoxIds)
            if(resp && resp.data.code === 200){
              this.$alert('选中用户已全部删除')
              this.listUsers()
            }
          })
        },
        handleSizeChange(pageSize){
          this.pageSize = pageSize
          this.handleCurrentChange(this.currentPage1)

        },
        handleCurrentChange(currentPage){
          this.currentPage1=currentPage
          this.currentChangePage(this.users,currentPage)
        },
        currentChangePage(list,currentPage){
            let from  = (currentPage-1) * this.pageSize
            let to = currentPage * this.pageSize
            this.tempUsers=[]
            for(;from<to;from++){
              if(list[from]){
                this.tempUsers.push(list[from])
              }

            }
        }
      }
    }
</script>

<style scoped>

</style>
