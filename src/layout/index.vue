<template>
    <div class="layout">
        <!-- 顶部导航 -->
        <HeaderComponent />

        <div class="main-container">
            <!-- 左侧菜单栏 -->
            <AsideComponent />

            <!-- 主体内容区域 -->
            <Maincomponent />
        </div>
    </div>
</template>

<script setup lang="ts">
import AsideComponent from '@/components/layouts/AsideComponent.vue'
import HeaderComponent from '@/components/layouts/HeaderComponent.vue'
import Maincomponent from '@/components/layouts/Maincomponent.vue'


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
</style>