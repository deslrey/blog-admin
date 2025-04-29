<template>
    <header class="header">
        <div class="left">
            <button class="menu-btn" @click="$emit('toggle-aside')">☰</button>
        </div>
        <div class="center">
            <h1 class="title">你的系统名字</h1>
        </div>
        <div class="right">
            <el-button class="logout-btn" type="primary" link size="small" @click="logout">
                退出登录
            </el-button>

        </div>
    </header>
</template>

<script setup lang="ts">
import { removeToken } from '@/utils/Token'
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
    removeToken()
    router.push('/login')
}
</script>

<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    background-color: #fff;
    border-bottom: 1px solid #e0e0e0;
    padding: 0 16px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    position: relative;
}

.left,
.right {
    width: 80px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.center {
    flex: 1;
    text-align: center;
}

.title {
    font-size: 20px;
    font-weight: bold;
    color: #303133;
    margin: 0;
}

/* 仅移动端显示菜单按钮 */
.menu-btn {
    display: none;
    background: none;
    border: none;
    font-size: 22px;
    color: #303133;
    cursor: pointer;
    padding: 4px;
}

@media screen and (max-width: 768px) {
    .menu-btn {
        display: inline-block;
    }

    .title {
        font-size: 18px;
    }

    .logout-btn {
        font-size: 12px;
        padding: 4px 10px;
    }
}

.logout-btn {
    font-weight: 500;
    color: #606266;
    padding: 4px 12px;
    transition: color 0.3s ease;
}

.logout-btn:hover {
    color: #409eff;
    background-color: transparent;
}
</style>