<template>
    <div>
        <!-- 遮罩层，只有在手机且菜单打开时才显示 -->
        <div v-if="isAsideVisible" class="mask" @click="$emit('close-aside')"></div>

        <!-- 侧边栏 -->
        <aside :class="['aside', { 'aside-mobile': isAsideVisible }]">
            <el-menu v-model:openeds="openMenus" :default-active="route.path" class="el-menu-vertical-demo"
                background-color="#2f3542" text-color="#dcdde1" active-text-color="#ffffff" router unique-opened>
                <template v-for="item in menus" :key="item.path">
                    <MenuItem :item="item" />
                </template>
            </el-menu>
        </aside>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watch, defineProps, defineEmits } from 'vue'
import { MenuItem } from '@/components/Table/TableComponent'
import { menus } from '@/data/RouterData'

const route = useRoute()

const props = defineProps<{
    isAsideVisible: boolean
}>()

const emit = defineEmits<{
    (e: 'close-aside'): void
}>()

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
    { immediate: true }
)
</script>

<style scoped>
.aside {
    width: 220px;
    background-color: #2f3542;
    height: 100%;
    overflow-y: auto;
    z-index: 20;
    /* 侧边栏的z-index要比mask高一点 */
}

.mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 10;
    /* 遮罩层z-index小于aside */
}

/* 小屏时，aside 默认隐藏，弹出时覆盖到页面上 */
@media screen and (max-width: 768px) {
    .aside {
        position: fixed;
        top: 0;
        left: -220px;
        width: 220px;
        height: 100%;
        transition: left 0.3s ease;
        background-color: #2f3542;
        z-index: 20;
    }

    .aside-mobile {
        left: 0;
    }
}
</style>
