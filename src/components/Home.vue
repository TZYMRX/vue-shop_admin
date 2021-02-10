<template>
  <el-container class="home-container">
    <!-- 顶部区域 -->
    <el-header>
      <div><i class="el-icon-s-tools" style="margin-right: 4px;"/><span>后台管理系统</span></div>
      <el-dropdown>
        <i class="el-icon-user-solid" style="margin-right: 4px;"/>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
        <span>admin</span>
      </el-dropdown>
    </el-header>
    <!-- 主体区域-->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleClick"><i class="el-icon-more"/></div>
        <!-- 侧边栏菜单 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff"
                 unique-opened :collapse-transition="false"
                 :collapse="isCollapse" router :default-active="this.$route.path">
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children"
                          :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Home",
    data() {
      return {
        // 左侧菜单数据
        menuList: [],
        iconObj: {
          '125': 'iconfont icon-user',
          '103': 'iconfont icon-tijikongjian',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju',
          '145': 'iconfont icon-baobiao'
        },
        // 是否折叠
        isCollapse: false,
        // 被激活的链接地址
        activePath: '',
      }
    },
    created() {
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
      logout() {
        window.sessionStorage.clear()
        this.$router.replace('/login')
      },
      // 获取所有菜单
      getMenuList() {
        this.$http.get('menus').then(res => {
          const data = res.data
          if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
          this.menuList = data.data
        })
      },
      // 切换菜单折叠
      toggleClick() {
        this.isCollapse = !this.isCollapse
      },
      // 保存链接激活状态
      saveNavState(activePath) {
        window.sessionStorage.setItem('activePath', activePath)
        this.activePath = activePath
      }
    },
    // computed: {
    //   saveNavState() {
    //     return this.$route.path
    //   }
    // }
  }
</script>

<style Lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #ffffff;
    font-size: 18px;
  }

  .el-dropdown i {
    color: #969896;
  }

  .el-dropdown span {
    color: #ffffff;
  }

  .el-aside {
    background-color: #333744;
    transition: 0.4s;
  }

  .el-menu {
    border-right: 0;
  }

  .el-main {
    background-color: #eaedf1;
  }

  .iconfont {
    margin-right: 7px;
  }

  .toggle-button {
    background-color: #4a5064;
    color: #ffffff;
    font-size: 18px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>