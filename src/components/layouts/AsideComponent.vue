<template>
    <aside class="aside">
        <el-menu :default-active="route.path" class="el-menu-vertical-demo" background-color="#2f3542"
            text-color="#dcdde1" active-text-color="#ffffff" router>
            <el-menu-item v-for="item in menus" :key="item.path" :index="item.path">
                {{ item.name }}
            </el-menu-item>
        </el-menu>
    </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const menus = [
    { name: '首页', path: '/' },
    { name: '用户管理', path: '/user' },
    { name: '测试管理', path: '/test' },
]
</script>

<style scoped>
.aside {
    width: 220px;
    height: 100%;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}
</style>