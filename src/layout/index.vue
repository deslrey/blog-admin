<template>
    <div class="layout">
        <!-- 顶部导航，传入切换菜单的方法 -->
        <HeaderComponent @toggle-aside="toggleAside" />

        <div class="main-container">
            <!-- 左侧菜单栏，控制显示 -->
            <AsideComponent :isAsideVisible="isAsideVisible" @close-aside="isAsideVisible = false" />

            <!-- 主体内容区域 -->
            <Maincomponent />
        </div>
    </div>
</template>


<script setup lang="ts">
import AsideComponent from '@/components/Layouts/AsideComponent.vue'
import HeaderComponent from '@/components/Layouts/HeaderComponent.vue'
import Maincomponent from '@/components/Layouts/Maincomponent.vue'

import { ref } from 'vue'

const isAsideVisible = ref(false)

const toggleAside = () => {
    isAsideVisible.value = !isAsideVisible.value
}
</script>


<style scoped>
.layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.main-container {
    display: flex;
    flex: 1;
    overflow: hidden;
}

.aside {
    width: 220px;
    background-color: #2f3542;
    height: 100%;
    /* 注意：在组件中要用这个让它充满 main-container */
    overflow-y: auto;
}

.main {
    flex: 1;
    background: #f5f6fa;
    overflow-y: auto;
    padding: 20px;
}

@media screen and (max-width: 768px) {
    .main-container {
        flex-direction: column;
    }

    .aside {
        width: 100%;
        height: auto;
        background-color: #2f3542;
    }

    .main {
        flex: none;
        width: 100%;
        padding: 10px;
    }
}
</style>