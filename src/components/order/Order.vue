<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入商品名" v-model="queryInfo.query" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"/>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"/>
        <el-table-column label="订单编号" prop="order_number"/>
        <el-table-column label="订单价格" prop="order_price"/>
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">

        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox(scope.row.attr_id)"/>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox(scope.row.goods_id)"/>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[6, 12, 18, 25]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total" background>
      </el-pagination>

      <!-- 修改地址对话框 -->
      <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
        <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader :options="cityData" v-model="addressForm.address1"/>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 物流进度对话框 -->
      <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
        <el-timeline>
          <el-timeline-item v-for="(activity, i) in this.progressInfo" :key="i" :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import cityData from "./citydata";
  // import wuliuxx from "./wuliuxx";

  export default {
    name: "Order",
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 6
        },

        total: 0,
        orderList: [],

        // 修改地址对话框显示隐藏
        addressVisible: false,
        // 修改地址表单
        addressForm: {
          address1: [],
          address2: ''
        },
        addressFormRules: {
          address1: [
            {required: true, message: '请选择省市区/县', trigger: ['blur', 'change']}
          ],
          address2: [
            {required: true, message: '请输入详细地址', trigger: ['blur', 'change']}
          ],
        },

        cityData,
        // wuliuxx,

        // 物流进度对话框显示隐藏
        progressVisible: false,

        // 物流信息
        progressInfo: []
      }
    },
    created() {
      this.getOrderList()
    },
    methods: {
      async getOrderList() {
        const {data: res} = await this.$http.get('orders', {params: this.queryInfo})
        if (res.meta.status !== 200) return this.$message.error('获取订单列表失败')
        this.total = res.data.total
        this.orderList = res.data.goods
      },

      // pagesize 发生变化
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getOrderList()
      },
      // 页面变化
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getOrderList()
      },

      // 显示修改地址对话框
      showBox() {
        this.addressVisible = true
      },

      // 修改地址对话框关闭
      addressDialogClosed() {
        this.$refs.addressFormRef.resetFields()
      },

      // 显示物流进度对话框
      async showProgressBox() {
        const {data: res} = await this.$http.get(`/kuaidi/1106975712662`)
        if (res.meta.status !== 200) this.$message.error('获取物流失败')
        this.progressInfo = res.data
        this.progressVisible = true
      }
    }
  }
</script>

<style scoped>
  .el-cascader {
    width: 100%;
  }
</style>