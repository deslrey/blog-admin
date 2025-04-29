<template>
    <div class="login-container">
        <el-card class="login-card">
            <div class="login-header">
                <el-icon class="login-icon">
                    <User />
                </el-icon>
                <h2 class="login-title">欢迎登录</h2>
            </div>
            <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="账号" prefix-icon="el-icon-user" clearable />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" placeholder="密码" prefix-icon="el-icon-lock"
                        show-password clearable />
                </el-form-item>
                <el-form-item class="login-button-wrap">
                    <el-button type="primary" @click="handleLogin" class="login-button">登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { User } from '@element-plus/icons-vue'
import request from '@/utils/Request'
import message from '@/utils/Message'
import { setToken } from '@/utils/Token'
import { useRouter } from 'vue-router'

const api = {
    login: '/user/login'
}

const loginForm = reactive({
    username: '',
    password: ''
})

const rules = {
    username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const router = useRouter()

const handleLogin = () => {
    setToken(loginForm.username)
    message.success('登录成功')
    router.push('/')
}

// const handleLogin = async () => {

//     try {
//         const result = await request.post(api.login, loginForm, {}, 'form')
//         console.log('result ======> ', result);
//     } catch (error: any) {
//         message.error(error.message)
//     }

// }
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #f0f2f5, #d6e4ff);
}

.login-card {
    width: 400px;
    padding: 30px 40px;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    background: #fff;
}

.login-header {
    text-align: center;
    margin-bottom: 25px;
}

.login-icon {
    font-size: 32px;
    color: #409EFF;
}

.login-title {
    font-size: 22px;
    font-weight: 600;
    color: #333;
    margin-top: 10px;
}

.login-button-wrap {
    display: flex;
    justify-content: center;
}

.login-button {
    width: 100%;
    font-size: 16px;
    padding: 12px 0;
    border-radius: 8px;
}
</style>