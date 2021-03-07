<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="cateList" row-key="cat_id" border
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <!--<el-table-column type="index" label="#"/>-->
        <el-table-column prop="cat_name" label="分类名称"/>
        <el-table-column prop="name" label="是否有效">
          <template v-slot="scope">
            <i style="color: lightgreen" class="el-icon-success" v-if="scope.row.cat_deleted === false"/>
            <i style="color: red" class="el-icon-error" v-else/>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="排序">
          <template v-slot="scope">
            <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag size="mini" v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
            <el-tag size="mini" v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row.cat_id)">编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.cat_id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      <tree-table-->
      <!--              :data="cateList" :columns="columns"-->
      <!--              index-text="#" :show-row-hover="false" border-->
      <!--              :show-index="true" :selection-type="false" :expand-type="false">-->
      <!--        &lt;!&ndash; 是否有效 &ndash;&gt;-->
      <!--              <template v-slot:isok="scope">-->
      <!--                <i style="color: lightgreen" class="el-icon-success" v-if="scope.row.cat_deleted === false"/>-->
      <!--                <i style="color: red" class="el-icon-error" v-else/>-->
      <!--              </template>-->
      <!--        &lt;!&ndash; 排序 &ndash;&gt;-->
      <!--              <template v-slot:order="scope">-->
      <!--                <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>-->
      <!--                <el-tag size="mini" v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>-->
      <!--                <el-tag size="mini" v-else type="warning">三级</el-tag>-->
      <!--              </template>-->
      <!--        &lt;!&ndash; 操作 &ndash;&gt;-->
      <!--              <template v-slot:opt="scope">-->
      <!--                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>-->
      <!--                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>-->
      <!--              </template>-->
      <!--      </tree-table>-->

      <!-- 分页 -->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[1, 2, 5, 10]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total" background>
      </el-pagination>

      <!-- 添加分类对话框 -->
      <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
        <!-- 添加分类表单 -->
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"/>
          </el-form-item>
          <el-form-item label="父级分类:">
            <el-cascader
                    v-model="selectdKeys"
                    :options="parentCateList"
                    :props="cascaderProps"
                    @change="parentChange" clearable/>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑分类对话框 -->
      <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="50%">
        <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Cate",
    data() {
      return {
        // 查询条件
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        // 商品分类数据
        cateList: [],
        // 总数据条数
        total: 0,

        // 为table指定列的定义
        columns: [
          {label: '分类名称', prop: 'cat_name'},
          {label: '是否有效', type: 'template', template: 'isok'},
          {label: '排序', type: 'template', template: 'order'},
          {label: '操作', type: 'template', template: 'opt'},
        ],

        // 控制添加分类对话框的显示隐藏
        addCateDialogVisible: false,

        // 添加分类表单数据对象
        addCateForm: {
          // 将要添加的分类名称
          cat_name: '',
          // 父级分类id
          cat_pid: 0,
          // 分类等级
          cat_level: 0
        },
        // 添加表单的验证规则
        addCateFormRules: {
          cat_name: [
            {required: true, message: '请输入分类名称', trigger: ['blur', 'change']},
          ]
        },

        // 父级分类数据列表
        parentCateList: [],
        // 指定级联选择器的配置对象
        cascaderProps: {
          expandTrigger: 'hover',
          checkStrictly: "true",
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        // 选中的父级分类的id数组
        selectdKeys: [],

        // 控制编辑分类对话框的显示隐藏
        editCateDialogVisible: false,
        // 编辑表单
        editCateForm: '',
        // 编辑分类表单验证
        editCateFormRules: {
          cat_name: [
            {required: true, message: '请输入分类名称', trigger: ['blur', 'change']}
          ]
        },
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      // 获取商品分类数据
      async getCateList() {
        const {data: res} = await this.$http.get('categories', {params: this.queryInfo})
        if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
        // 把数据列表, 赋值给 cateList
        this.cateList = res.data.result
        // 为总数据条数赋值
        this.total = res.data.total
      },

      // 监听 pagesize 改变
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getCateList()
      },
      // 监听 pagenum 改变
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getCateList()
      },

      // 点击按钮显示添加分类对话框
      showAddCateDialog() {
        // 先获取父级分类数据
        this.getParentCateList()
        this.addCateDialogVisible = true
      },

      // 获取父级分类数据列表
      async getParentCateList() {
        const {data: res} = await this.$http.get('categories', {params: {type: 2}})
        if (res.meta.status !== 200) return this.$message.error('获取父级分类数据失败')
        this.parentCateList = res.data
      },
      // 选择项发生变化
      parentChange() {
        // 如果 selectdKeys 数组中的 length > 0 证明选中父级分类
        if (this.selectdKeys.length > 0) {
          // 父级分类id
          this.addCateForm.cat_pid = this.selectdKeys[this.selectdKeys.length - 1]
          // 当前分类等级
          this.addCateForm.cat_level = this.selectdKeys.length
        } else {
          // 父级分类id
          this.addCateForm.cat_pid = 0
          // 当前分类等级
          this.addCateForm.cat_level = 0
        }
      },

      // 点击按钮添加新分类
      addCate() {
        this.$refs.addCateFormRef.validate(async valid => {
          if (!valid) return

          const {data: res} = await this.$http.post('categories', this.addCateForm)
          if (res.meta.status !== 201) return this.$message.error('添加分类失败')
          this.$message.success('添加分类成功')

          await this.getCateList()
          this.addCateDialogVisible = false
        })
      },

      // 监听对话框关闭事件 重置表单
      addCateDialogClosed() {
        this.$refs.addCateFormRef.resetFields()
        this.selectdKeys = []
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      },

      // 显示编辑对话框
      async showEditCateDialog(id) {
        const {data: res} = await this.$http.get('categories/' + id)
        if (res.meta.status !== 200) return this.$message.error('获取分类失败')
        this.editCateForm = res.data
        this.editCateDialogVisible = true
      },
      // 编辑分类
      editCate() {
        this.$refs.editCateFormRef.validate(async valid => {
          if (!valid) return

          const {data: res} = await this.$http.put('categories/' + this.editCateForm.cat_id,
              {
                cat_name: this.editCateForm.cat_name
              })
          if (res.meta.status !== 200) return this.$message.error('更新分类名失败')
          this.$message.success('更新分类名成功')
          await this.getCateList()
          this.editCateDialogVisible = false
        })
      },

      // 删除分类
      removeCate(id) {
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('categories/' + id).then(res => {
            const data = res.data
            if (data.meta.status !== 200) return this.$message.error('删除分类失败')
            this.$message.success('删除分类成功')
            this.getCateList()
          })
        }).catch(() => {
          this.$message.info('已取消删除！')
        })

      }
    }
  }
</script>

<style scoped>

</style>