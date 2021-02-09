<template>
  <div class="home">
    <el-button type="info" @click="logOut">退出</el-button>
  </div>
</template>

<script>
  export default {
    name: "Home",
    methods: {
      logOut() {
       window.sessionStorage.clear()
       this.$router.replace('/login')
      }
    }
  }
</script>

<style scoped>

</style>