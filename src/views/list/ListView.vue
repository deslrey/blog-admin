<template>
    <div>
        <el-table v-if="articleList.length > 0" :data="articleList" style="width: 100%; margin-top: 20px" border>
            <el-table-column prop="id" label="编号" width="80" />
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="author" label="作者" />
            <el-table-column prop="tags" label="标签" />
            <el-table-column prop="category" label="分类" />
            <el-table-column prop="createTime" label="创建时间">
                <template #default="{ row }">
                    {{ formatDate(row.createTime) }}
                </template>
            </el-table-column>
            <el-table-column prop="wordCount" label="字数" width="80" />
            <el-table-column prop="readTime" label="阅读时间" width="100">
                <template #default="{ row }">
                    {{ row.readTime }}min
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup lang="ts">
import type { ArticleVO } from '@/types/Article';
import request from '@/utils/Request';
import { ref, onMounted } from 'vue';

const api = {
    articleList: '/article/articleList',
};

const articleList = ref<ArticleVO[]>([]);

const getDate = async () => {
    const result = await request.get(api.articleList);
    console.log('articleList ======> ', result);
    articleList.value = result.data;
};

onMounted(() => {
    getDate();
});

const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
    ).padStart(2, '0')}`;
};

</script>

<style scoped>
.el-button {
    margin-bottom: 20px;
}
</style>
