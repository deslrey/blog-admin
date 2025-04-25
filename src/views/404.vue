<template>
    <div class="not-found">
        <h1>404</h1>
        <p class="message">页面不存在</p>
        <p class="sub-message">你访问的页面可能已经被删除或不存在。</p>
        <img src="../assets/images/0.webp" alt="图片加载失败" width="500" height="400" />
        <button class="home-button" @click="goHome">返回首页</button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => {
    router.push('/')
}
</script>

<style scoped>
.not-found {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: #f8f8f8;
    color: #333;
    padding: 20px;
}

.not-found h1 {
    font-size: 6rem;
    margin: 0;
    color: #ff4c4c;
}

.message {
    font-size: 1.5rem;
    margin-top: 10px;
}

.sub-message {
    font-size: 1rem;
    color: #666;
    margin-top: 5px;
}

.home-button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 1rem;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.home-button:hover {
    background-color: #66b1ff;
}
</style>