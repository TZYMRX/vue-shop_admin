<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon/>
      <!-- 选择商品分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
                  v-model="selectCateKeys" :options="cateList"
                  :props="cateProps" clearable
                  @change="handleChange" :checkStrictly="false"
          />
        </el-col>
      </el-row>

      <!-- tab页签 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">
            添加参数
          </el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClosed(i,scope.row)">
                  {{item}}
                </el-tag>
                <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"/>
            <el-table-column label="参数名称" prop="attr_name"/>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">
            添加属性
          </el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClosed(i,scope.row)">
                  {{item}}
                </el-tag>
                <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"/>
            <el-table-column label="属性名称" prop="attr_name"/>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Params",
    data() {
      return {
        // 商品分类
        cateList: [],

        // 级联选择框配置对象
        cateProps: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        // 级联选择框双向绑定数组
        selectCateKeys: [],

        // 被激活的页签的名称
        activeName: 'many',

        // 动态参数数据
        manyTableData: [],
        // 静态属性数据
        onlyTableData: [],

        // 添加对话框的显示隐藏
        addDialogVisible: false,

        // 添加参数表单
        addForm: {},
        // 添加表单验证规则
        addFormRules: {
          attr_name: [
            {required: true, message: '请输入参数名称', trigger: ['blur', 'change']},
          ]
        },

        // 修改参数对话框显示隐藏
        editDialogVisible: false,
        // 修改表单
        editForm: {},
        // 修改表单验证规则
        editFormRules: {
          attr_name: [
            {required: true, message: '请输入参数名称', trigger: ['blur', 'change']},
          ]
        },

        // // 按钮和输入框显示隐藏
        // inputVisible: false,
        // // 输入框的收入的内容
        // inputValue: ''
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      // 获取所有商品分类列表
      async getCateList() {
        const {data: res} = await this.$http.get('categories')
        if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
        this.cateList = res.data
      },

      // 监听级联选择框选中项变化
      handleChange() {
        this.getParamsData()
      },

      // tab页签点击事件
      handleTabClick() {
        this.getParamsData()
      },

      // 获取参数列表数据
      async getParamsData() {
        // 选中的不是3级分类
        if (this.selectCateKeys.length !== 3) {
          this.selectCateKeys = []
          this.manyTableData = []
          this.onlyTableData = []
          return
        }

        // 选中的是3级分类
        // console.log(this.selectCateKeys)
        // 根据所选分类id 和当前所处的面板 获取对应参数
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {sel: this.activeName}
        })
        if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 控制输入框的显示隐藏
          item.inputVisible = false
          // 输入框输入的内容
          item.inputValue = ''
        })
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      },

      // 添加参数对话框关闭
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      // 添加参数
      addParams() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          })
          if (res.meta.status !== 201) return this.$message.error('添加参数失败')
          this.$message.success('添加参数成功')
          this.addDialogVisible = false
          this.getParamsData()
        })
      },

      // 修改参数对话框
      async showEditDialog(attr_id) {
        // 查询当前参数信息
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {
          params: {
            attr_sel: this.activeName
          }
        })
        if (res.meta.status !== 200) return this.$message.error('获取参数信息失败')
        this.editForm = res.data
        this.editDialogVisible = true
      },

      // 修改参数对话框关闭
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      // 修改参数
      editParams() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          })
          if (res.meta.status !== 200) return this.$message.error('修改参数失败')
          this.$message.success('修改参数成功')
          this.getParamsData()
          this.editDialogVisible = false
        })
      },

      // 根据id删除对应参数项
      removeParams(attr_id) {
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`).then(res => {
            const data = res.data
            if (data.meta.status !== 200) return this.$message.error('删除参数失败')
            this.$message.success('删除参数成功')
            this.getParamsData()
          })
        }).catch(() => {
          this.$message.info('已取消删除！')
        })
      },

      // 输入框失去焦点, 按下enter
      async handleInputConfirm(row) {
        if (row.inputValue.trim().length === 0) {
          row.inputValue = ''
          row.inputVisible = false
          return
        }
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        // 发起网络请求, 保存这次操作
        this.saveAttrVals(row)
      },
      // 对 attr_vals 的操作保存的数据库
      async saveAttrVals(row) {
        const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
        if (res.meta.status !== 200) return this.$message.error('修改参数项失败')
        this.$message.success('修改参数项成功')
      },

      // 点击按钮显示输入框
      showInput(row) {
        row.inputVisible = true
        // 让输入框自动获取焦点
        // $nextTick 当页面上元素被重新渲染后, 才会回调函数中的代码
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      // 删除对应的参数可选项
      handleClosed(i, row) {
        row.attr_vals.splice(i, 1)
        this.saveAttrVals(row)
      }
    },

    computed: {
      // 按钮禁用返回 true 否则返回 false
      isBtnDisabled() {
        return this.selectCateKeys.length !== 3;
        // if (this.selectCateKeys.length !== 3) {
        //   return true
        // } else {
        //   return false
        // }
      },

      // 当前选中的3级分类
      cateId() {
        if (this.selectCateKeys.length === 3) {
          return this.selectCateKeys[2]
        }
        return null
      },

      // 动态计算标题的文本
      titleText() {
        if (this.activeName === 'many') {
          return '动态参数'
        }
        return '静态属性'
      }
    }
  }
</script>

<style scoped>
  .cat_opt {
    margin: 15px 0;
  }

  .el-tag {
    margin: 8px;
  }

  .input-new-tag {
    width: 120px;
  }
</style>