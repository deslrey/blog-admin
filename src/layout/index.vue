<template>
    <div class="layout">
        <div class="main-container">
            <AsideComponent :isAsideVisible="isAsideVisible" @close-aside="isAsideVisible = false" />
            <div class="content-area">
                <HeaderComponent @toggle-aside="toggleAside" />
                <Maincomponent />
            </div>
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
    height: 100vh;
    background: linear-gradient(135deg, #f0f2f5, #ffffff);
}

.main-container {
    display: flex;
    flex: 1;
    overflow: hidden;
}

aside {
    width: 250px;
    flex-shrink: 0;
    background: #2c3e50;
    color: #fff;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    transition: width 0.3s ease;
}

@media screen and (max-width: 768px) {
    aside {
        width: 60px;
    }
}

.content-area {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    background: #f9fafc;
}

header {
    height: 60px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    padding: 0 20px;
    justify-content: space-between;
    z-index: 10;
}

header .toggle-aside-btn {
    background: #2c3e50;
    color: #fff;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
}

.main {
    flex: 1;
    overflow-y: auto;
    background: #f9fafc;
    padding: 20px;
    display: flex;
    flex-direction: column;
}

.content-wrapper {
    background: #fff;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 12px;
    margin: 0 auto;
    width: 98%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    min-height: 0;
}

@media screen and (max-width: 768px) {
    .main-container {
        flex-direction: column;
    }

    aside {
        width: 100%;
        height: auto;
    }

    .content-area {
        flex-direction: column;
    }
}
</style>
