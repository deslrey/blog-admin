<template>
    <div class="article-container">
        <div class="table-card">
            <el-table :data="articleList" style="width: 100%; margin-bottom: 20px" v-loading="loading">
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
                            <el-button type="danger" size="small" @click="handleToggle(row)">
                                删除
                            </el-button>
                            <el-button type="primary" size="small" @click="handleEdit(row)">
                                编辑
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination-wrapper">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :current-page="pagination.pageNum"
                    :page-size="pagination.pageSize" :page-sizes="[10, 15, 20, 50]" :total="pagination.total"
                    @current-change="handlePageChange" @size-change="handleSizeChange" />
            </div>
        </div>

        <el-dialog v-model="centerDialogVisible" title="编辑文章" width="500" align-center>
            <span>是否前往文章编辑器修改 <strong>《{{ currentEditTitle }}》</strong>相关信息?</span>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="editArticlePage">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>

</template>

<script setup lang="ts">
import { useArticleStore } from '@/stores/ArticleStore';
import type { ArticleDraftVO } from '@/types/Article';
import message from '@/utils/Message';
import request from '@/utils/Request';
import dayjs from 'dayjs';
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const api = {
    getArticleDraftList: '/articleDraft/getArticleDraftList',
    deleteDraft: '/articleDraft/deleteDraft'
};

const allArticles = ref<ArticleDraftVO[]>([]);

const pagination = reactive({
    pageNum: 1,
    pageSize: 10,
    total: 0,
});

const articleList = computed(() => {
    const start = (pagination.pageNum - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return allArticles.value.slice(start, end);
});

const loading = ref(true);

const handlePageChange = (newPage: number) => {
    pagination.pageNum = newPage;
};

const handleSizeChange = (newSize: number) => {
    pagination.pageSize = newSize;
    pagination.pageNum = 1;
};

const handleToggle = async (row: ArticleDraftVO) => {
    const result = await request.post(api.deleteDraft, { id: row.id }, {}, 'form');
    if (result.code !== 200) {
        message.error(result.message);
        return;
    }

    allArticles.value = articleList.value.filter((item) => item.id !== row.id);

    message.success(result.message);
};


const articleId = ref<number | null>(null)
const articleDraftId = ref<number | null>(null)
const currentEditTitle = ref('')
const centerDialogVisible = ref(false)
const router = useRouter()
const articleStore = useArticleStore()

const handleEdit = (row: ArticleDraftVO) => {
    articleDraftId.value = row.id
    articleId.value = row.articleId
    currentEditTitle.value = row.title
    centerDialogVisible.value = true
};

const editArticlePage = () => {
    if (articleDraftId.value !== null) {
        articleStore.setArticleDraftId(articleDraftId.value)
        if (articleId.value !== null) {
            articleStore.setArticleId(articleId.value)
        }
        articleStore.setIsDraft(true)
        router.push('/articleEdit');
    }
    centerDialogVisible.value = false;
}

onMounted(async () => {
    loading.value = true;
    const result = await request.get(api.getArticleDraftList);
    if (result.code !== 200) {
        message.error(result.message)
        loading.value = false
        return
    }
    console.log('数据======> ', result.data);

    allArticles.value = result.data;
    pagination.total = result.data.length;
    loading.value = false;
});

</script>

<style lang="less" scoped>
.article-container {
    padding: 10px;
    // background-color: #f2f4f8;
    display: flex;
    flex-direction: column;
    align-items: center;

    .table-card {
        background-color: #fff;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        width: 100%;
        transition: all 0.3s ease;

        .el-button {
            margin-bottom: 12px;
        }

        .action-buttons {
            display: flex;
            justify-content: center;
            gap: 12px;

            .el-button {
                padding: 6px 12px;
                font-size: 13px;
            }
        }

        .pagination-wrapper {
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
        }
    }
}

::deep(.el-table__header th) {
    text-align: center !important;
}

@media (max-width: 1000px) {
    .pagination-wrapper {
        justify-content: center;
        margin-top: 16px;
    }

    ::v-deep(.el-pagination) {
        font-size: 12px;

        button,
        .el-pagination__editor,
        .el-pagination__sizes,
        .el-pagination__jump {
            transform: scale(0.85);
        }

        .el-pagination__total {
            font-size: 12px;
            margin-bottom: 6px;
        }

        .el-pagination__sizes,
        .el-pagination__jump {
            display: none;
        }
    }
}
</style>
