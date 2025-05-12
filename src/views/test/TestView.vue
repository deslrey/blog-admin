<template>
    <div>
        <el-table v-if="articleList.length > 0" :data="articleList" style="width: 100%; margin-bottom: 20px" border>
            <el-table-column prop="id" label="ID" width="80" />
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
            <el-table-column prop="readTime" label="阅读时间" width="100" />
        </el-table>

        <div class="pagination-wrapper">
            <el-pagination background layout="total, sizes, prev, pager, next, jumper"
                :current-page="pagination.pageNum" :page-size="pagination.pageSize" :page-sizes="[10, 15, 20, 50]"
                :total="pagination.total" @current-change="handlePageChange" @size-change="handleSizeChange" />
        </div>

    </div>
</template>

<script setup lang="ts">
import type { ArticleVO } from '@/types/Article';
import request from '@/utils/Request';
import { ref, reactive, computed, onMounted } from 'vue';

const api = {
    articleList: '/article/articleList',
};

const allArticles = ref<ArticleVO[]>([]); // 全部数据

const pagination = reactive({
    pageNum: 1,
    pageSize: 50,
    total: 0,
});

// 当前页要展示的数据
const articleList = computed(() => {
    const start = (pagination.pageNum - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return allArticles.value.slice(start, end);
});

const getDate = async () => {
    const result = await request.get(api.articleList);
    console.log('articleList ======> ', result);

    allArticles.value = result.data;
    pagination.total = result.data.length;
};

const handlePageChange = (newPage: number) => {
    pagination.pageNum = newPage;
};

const handleSizeChange = (newSize: number) => {
    pagination.pageSize = newSize;
    pagination.pageNum = 1;
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

.pagination-wrapper {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    justify-content: flex-end;
    z-index: 1000;
}
</style>
