<template>
  <div class="login">
    <div class="login_box">
      <div class="avatar_box">
        <!-- 头像区域 -->
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm" class="login_info">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
                  v-model="loginForm.username"
                  prefix-icon="el-icon-user-solid"
          />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
                  v-model="loginForm.password"
                  prefix-icon="el-icon-lock"
                  type="password"
          />
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="login_btns">
          <el-button type="primary" @click="loginClick">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {Login} from "../network/login";

  export default {
    name: "Login",
    data() {
      return {
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        loginFormRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 20, message: '密码至少6位', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 重置登录表单
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields()
      },
      loginClick() {
        this.$refs.loginFormRef.validate(async valid => {
          if (!valid) return

          const {data: res} = await this.$http.post('login', this.loginForm)
          if (res.meta.status !== 200) return this.$message.error('登陆失败')
          this.$message.success('登陆成功')

          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        });
      }
    }
  }
</script>

<style Lang="less" scoped>
  .login {
    height: 100%;
    background-color: #2b4b5b;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;

    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eeeeee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;

    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .avatar_box img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eeeeee;
  }

  .login_info {
    position: absolute;
    bottom: 10px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .login_btns {
    display: flex;
    justify-content: center;
  }
</style>