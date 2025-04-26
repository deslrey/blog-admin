<template>
    <div class="layout">
        <HeaderComponent @toggle-aside="toggleAside" />
        <div class="main-container">
            <AsideComponent :isAsideVisible="isAsideVisible" @close-aside="isAsideVisible = false" />
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
    background: linear-gradient(135deg, #f0f2f5, #ffffff);
}

.main-container {
    display: flex;
    flex: 1;
    overflow: hidden;
    background: #f9fafc;
    border-top: 1px solid #e0e0e0;
}

@media screen and (max-width: 768px) {
    .main-container {
        flex-direction: column;
    }
}
</style>
