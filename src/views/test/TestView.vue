<template>
    <div>
        <el-table v-if="articleList.length > 0" :data="articleList" style="width: 100%; margin-bottom: 20px">
            <el-table-column prop="id" label="ID" width="80" align="center" sortable />
            <el-table-column prop="title" label="标题" align="center" sortable />
            <el-table-column prop="author" label="作者" align="center" sortable />
            <el-table-column prop="tags" label="标签" align="center" sortable />
            <el-table-column prop="category" label="分类" align="center" sortable />
            <el-table-column prop="createTime" label="创建时间" align="center" sortable>
                <template #default="{ row }">
                    <!-- {{ formatDate(row.createTime) }} -->
                    {{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="修改时间" align="center" sortable>
                <template #default="{ row }">
                    <!-- {{ formatDate(row.createTime) }} -->
                    {{ dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
            </el-table-column>
            <el-table-column prop="wordCount" label="字数" width="80" align="center" sortable />
            <el-table-column prop="readTime" label="阅读时间" width="110" align="center" sortable />

            <el-table-column label="操作" width="200" align="center">
                <template #default="{ row }">
                    <div class="action-buttons">
                        <el-button :type="row.exist ? 'danger' : 'success'" size="small" @click="handleToggle(row)">
                            {{ row.exist ? '禁用' : '启用' }}
                        </el-button>
                        <el-button type="primary" size="small" @click="handleEdit(row)">
                            编辑
                        </el-button>
                    </div>
                </template>
            </el-table-column>
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
import message from '@/utils/Message';
import request from '@/utils/Request';
import dayjs from 'dayjs';
import { ref, reactive, computed, onMounted } from 'vue';

const api = {
    articleList: '/article/articleList',
    updateExist: '/article/updateExist'
};

const allArticles = ref<ArticleVO[]>([]);

const pagination = reactive({
    pageNum: 1,
    pageSize: 10,
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

// 修改文章状态
const handleToggle = async (row: ArticleVO) => {
    const result = await request.post(api.updateExist, { id: row.id, exist: row.exist }, {}, 'form');
    if (result.code !== 200) {
        message.error(result.message)
        return
    }

    articleList.value.map((item) => {
        if (item.id === row.id) {
            item.exist = !item.exist
        }
    })
    message.success(result.message)

};

const handleEdit = (row: ArticleVO) => {
    console.log('编辑文章:', row.id);
};


onMounted(() => {
    getDate();
});

// const formatDate = (date: Date | null): string => {
//     if (!date) return '';
//     const d = new Date(date);
//     return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
//         d.getDate()
//     ).padStart(2, '0')}`;
// };

</script>

<style scoped>
.el-button {
    margin-bottom: 20px;
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 8px;
}

.pagination-wrapper {
    bottom: 20px;
    right: 20px;
    display: flex;
    justify-content: flex-end;
}

/* 表头居中 */
::v-deep .el-table__header th {
    text-align: center !important;
}
</style>
