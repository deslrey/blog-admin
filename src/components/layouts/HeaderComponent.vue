<template>
    <header class="header">
        <button class="menu-btn" @click="$emit('toggle-aside')">☰</button>
        <h1 class="title">你的系统名字</h1>
        <button @click="logout">退出</button>
    </header>
</template>

<script setup lang="ts">
import { removeToken } from '@/utils/Token'
import { useRouter } from 'vue-router'
// 你可以根据需要引入你的登录状态管理（比如 Pinia）

const router = useRouter()

const logout = () => {
    // 清除登录状态
    removeToken()
    // 跳转到登录页
    router.push('/login')
}
</script>

<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    background: linear-gradient(90deg, #4e54c8, #8f94fb);
    color: #fff;
    padding: 0 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.menu-btn {
    display: none;
    background: none;
    border: none;
    color: #fff;
    font-size: 26px;
    cursor: pointer;
}

.title {
    font-size: 20px;
    font-weight: bold;
}

@media screen and (max-width: 768px) {
    .menu-btn {
        display: block;
    }
}
</style>
