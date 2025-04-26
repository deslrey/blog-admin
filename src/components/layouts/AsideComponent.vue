<template>
    <div>
        <div v-if="isAsideVisible" class="mask" @click="$emit('close-aside')"></div>
        <aside :class="['aside', { 'aside-mobile': isAsideVisible }]">
            <el-menu v-model:openeds="openMenus" :default-active="route.path" class="el-menu-vertical-demo"
                background-color="#ffffff" text-color="#333" active-text-color="#4e54c8" router unique-opened>
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
const props = defineProps<{ isAsideVisible: boolean }>()
const emit = defineEmits<{ (e: 'close-aside'): void }>()
const openMenus = ref<string[]>([])

watch(() => route.path, (newPath) => {
    const segments = newPath.split('/').filter(Boolean)
    const openPaths: string[] = []
    if (segments.length > 1) {
        openPaths.push('/' + segments[0])
        openPaths.push('/' + segments.slice(0, 2).join('/'))
    } else if (segments.length === 1) {
        openPaths.push('/' + segments[0])
    }
    openMenus.value = openPaths

    if (window.innerWidth <= 768 && props.isAsideVisible) {
        emit('close-aside')
    }
}, { immediate: true })
</script>

<style scoped>
.aside {
    width: 220px;
    background: #ffffff;
    height: 100%;
    overflow-y: auto;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
    border-right: 1px solid #e0e0e0;
    z-index: 20;
    transition: left 0.3s ease;
}

.mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 10;
}

@media screen and (max-width: 768px) {
    .aside {
        position: fixed;
        top: 0;
        left: -220px;
    }

    .aside-mobile {
        left: 0;
    }
}
</style>
