<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="AddRoleDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row :class="['vcenter','bdbottom',i1 === 0 ? 'bdtop':'']"
                    v-for="(item1 ,i1) in scope.row.children" :key="item1.id">
              <el-col :span="5">
                <!-- 渲染一级权限 -->
                <el-tag closable @close="removeRightById(scope.row,item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"/>
              </el-col>
              <!-- 渲染二三级权限 -->
              <el-col :span="19">
                <el-row :class="[i2 === 0 ? '' : 'bdtop','vcenter']"
                        v-for="(item2,i2) in item1.children"
                        :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"/>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="(item3,i3) in item2.children" :key="item3.id"
                            type="warning" closable
                            @close="removeRightById(scope.row,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"/>
        <el-table-column label="角色名称" prop="roleName"/>
        <el-table-column label="角色描述" prop="roleDesc"/>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">
              编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">
              删除
            </el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="AddRoleDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"/>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="40%" @close="addRoleDialogClosed">
      <el-form :model="editRoleForm" ref="editRoleFormRef" :rules="editRoleFormRules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"/>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <el-tree :data="rightslist" :props="treeProps"
               show-checkbox node-key="id"
               default-expand-all
               :default-checked-keys="defKeys" ref="treeRef"/>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Roles",
    data() {
      return {
        // 所有角色列表数据
        rolelist: [],

        // 添加角色信息
        AddRoleDialogVisible: false,
        addRoleForm: {},
        addRoleFormRules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'}
          ],
          roleDesc: [
            {required: true, message: '请输入角色描述', trigger: 'blur'}
          ]
        },

        // 编辑角色信息
        editRoleDialogVisible: false,
        editRoleForm: {},
        editRoleFormRules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'}
          ],
          roleDesc: [
            {required: true, message: '请输入角色描述', trigger: 'blur'}
          ]
        },

        // 分配权限对话框显示隐藏
        setRightDialogVisible: false,

        // 所有权限数据
        rightslist: [],

        // 树形控件属性绑定对象
        treeProps: {
          label: 'authName',
          children: 'children'
        },
        // 默认选中的节点id值数组
        defKeys: [],

        // 当前即将分配权限的角色id
        roleId: ''
      }
    },
    created() {
      this.getRoleList()
    },
    methods: {
      // 获取所有角色列表
      async getRoleList() {
        const {data: res} = await this.$http.get('roles')
        if (res.meta.status !== 200) {
          return this.$message.error('获取角色列表失败')
        }
        this.rolelist = res.data
      },
      // 监听添加角色对话框关闭
      addDialogClosed() {
        this.$refs.addRoleRef.resetFields()
      },

      // 添加角色
      addRoles() {
        this.$refs.addRoleRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.post('roles', this.addRoleForm)
          if (res.meta.status !== 201) {
            return this.$message.error('添加角色失败')
          }
          this.$message.success('添加角色成功')
          this.AddRoleDialogVisible = false
          this.getRoleList()
        })
      },

      // 监听修改角色对话框关闭
      addRoleDialogClosed() {
        this.$refs.editRoleFormRef.resetFields()
      },

      // 修改角色
      async showEditDialog(id) {
        const {data: res} = await this.$http.get('roles/' + id)
        if (res.meta.status !== 200) return this.$message.error('查询角色信息失败')
        this.editRoleForm = res.data
        this.editRoleDialogVisible = true
      },
      editRoles() {
        this.$refs.editRoleFormRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.put('roles/' + this.editRoleForm.roleId, {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          })
          if (res.meta.status !== 200) {
            return this.$message.error('更新角色信息失败')
          }
          this.editRoleDialogVisible = false
          this.$message.success('更新角色信息成功')
          this.getRoleList()
        })
      },

      // 删除角色
      removeRoleById(id) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('roles/' + id).then(res => {
            const data = res.data
            if (data.meta.status !== 200) return this.$message.error('删除角色失败')
            this.$message.success('删除角色成功')
            this.getRoleList()
          })
        }).catch(() => {
          this.$message.info('取消删除')
        })
      },
      // 根据id删除权限
      removeRightById(role, rigthId) {
        this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`roles/${role.id}/rights/${rigthId}`).then(res => {
            const data = res.data
            if (data.meta.status !== 200) return this.$message.error('删除权限失败')
            this.$message.success('删除权限成功')
            // this.getRoleList()
            role.children = data.data
          })
        }).catch(() => {
          this.$message.error('取消删除')
        })
      },

      // 显示分配权限对话框
      showSetRightDialog(role) {
        this.roleId = role.id
        this.$http.get('rights/tree').then(res => {
          if (res.data.meta.status !== 200) return this.$message.error('获取权限数据失败')
          this.rightslist = res.data.data
        })
        // 递归获取3级节点的id
        this.getLeafKeys(role, this.defKeys)
        this.setRightDialogVisible = true
      },

      // 通过递归获取角色下所有3级权限的id 并保存到defKeys数组中
      getLeafKeys(node, arr) {
        // 如果当前 node 节点不包含 children 属性 则是3级节点
        if (!node.children) return arr.push(node.id)

        node.children.forEach(item => this.getLeafKeys(item, arr))

      },

      // 监听分配权限对话框关闭
      setRightDialogClosed() {
        this.defKeys = []
      },

      // 分配权限
      async allotRights() {
        // 获得当前选中和半选中的Id
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        // join() 方法用于把数组中的所有元素放入一个字符串
        const idStr = keys.join(',')

        const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
        if (res.meta.status !== 200) return this.$message.error('分配权限失败')
        this.$message.success('分配权限成功')

        this.getRoleList()
        this.setRightDialogVisible = false
      }
    }
  }
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eeeeee;
  }

  .bdbottom {
    border-bottom: 1px solid #eeeeee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>