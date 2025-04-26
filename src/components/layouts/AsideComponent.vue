<template>
    <aside class="aside">
        <el-menu v-model:openeds="openMenus" :default-active="route.path" class="el-menu-vertical-demo"
            background-color="#2f3542" text-color="#dcdde1" active-text-color="#ffffff" router unique-opened>
            <template v-for="item in menus" :key="item.path">
                <MenuItem :item="item" />
            </template>
        </el-menu>
    </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { MenuItem } from '@/components/Table/TableComponent'

const route = useRoute()

const openMenus = ref<string[]>([])

// 监听路由变化，动态更新 openMenus
watch(
    () => route.path,
    (newPath) => {
        const segments = newPath.split('/').filter(Boolean)
        const openPaths: string[] = []
        if (segments.length > 1) {
            openPaths.push('/' + segments[0])
            openPaths.push('/' + segments.slice(0, 2).join('/'))
        } else if (segments.length === 1) {
            openPaths.push('/' + segments[0])
        }
        openMenus.value = openPaths
    },
    { immediate: true } // 页面第一次加载也触发
)

const menus = [
    { name: '首页', path: '/' },
    { name: '用户管理', path: '/user' },
    { name: '测试界面', path: '/test' },
    {
        name: '表格',
        path: '/table',
        children: [
            {
                name: 'table1',
                path: '/table/table1',
                children: [
                    { name: '表格1-1', path: '/table/table1/table1-1' },
                    { name: '表格1-2', path: '/table/table1/table1-2' }
                ]
            },
            {
                name: 'table2',
                path: '/table/table2',
                children: [
                    { name: '表格2-1', path: '/table/table2/table2-1' },
                    { name: '表格2-2', path: '/table/table2/table2-2' }
                ]
            }
        ]
    }
]
</script>