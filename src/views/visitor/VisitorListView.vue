<template>
    <div class="article-container">
        <div class="table-card">
            <el-table :data="visitorList" style="width: 100%; margin-bottom: 20px" v-loading="loading">
                <el-table-column prop="id" label="ID" width="80" align="center" sortable />
                <el-table-column prop="ip" label="IP" align="center" sortable />
                <el-table-column prop="visitCount" label="访问次数" align="center" sortable />
                <el-table-column prop="firstVisit" label="首次访问日期" align="center" sortable>
                    <template #default="{ row }">
                        <!-- {{ formatDate(row.createTime) }} -->
                        {{ dayjs(row.firstVisit).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                </el-table-column>
                <el-table-column prop="lastVisit" label="最后访问日期" align="center" sortable>
                    <template #default="{ row }">
                        <!-- {{ formatDate(row.lastVisit) }} -->
                        {{ dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                </el-table-column>
                <el-table-column prop="visitorToken" label="token" align="center" sortable />
                <el-table-column label="操作" width="200" align="center">
                    <template #default="{ row }">
                        <div class="action-buttons">
                            <el-button :type="row.isBlock ? 'danger' : 'success'" size="small"
                                @click="handleToggle(row)">
                                {{ row.isBlock ? '拉黑' : '解除拉黑' }}
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
    </div>
</template>

<script setup lang="ts">
import type { Visitor } from '@/types/Visitor';
import message from '@/utils/Message';
import request from '@/utils/Request';
import dayjs from 'dayjs';
import { ref, reactive, computed, onMounted } from 'vue';

const api = {
    visitorList: '/visitor/visitorList',
    blockVisitor: '/visitor/blockVisitor'
};

const visitors = ref<Visitor[]>([]);

const pagination = reactive({
    pageNum: 1,
    pageSize: 10,
    total: 0,
});

// 当前页要展示的数据
const visitorList = computed(() => {
    const start = (pagination.pageNum - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return visitors.value.slice(start, end);
});

const loading = ref(true);

const getDate = async () => {
    loading.value = true;
    const result = await request.get(api.visitorList);
    visitors.value = result.data;
    pagination.total = result.data.length;
    loading.value = false;
};


const handlePageChange = (newPage: number) => {
    pagination.pageNum = newPage;
};

const handleSizeChange = (newSize: number) => {
    pagination.pageSize = newSize;
    pagination.pageNum = 1;
};

// 修改访客状态
const handleToggle = async (row: Visitor) => {
    const result = await request.post(api.blockVisitor, { visitorId: row.id, isBlock: row.isBlock }, {}, 'form');
    if (result.code !== 200) {
        message.error(result.message)
        return
    }

    visitors.value.map((item) => {
        if (item.id === row.id) {
            item.isBlock = !item.isBlock
        }
    })
    message.success(result.message)

};

onMounted(() => {
    getDate();
});

</script>

<style lang="less" scoped>
.el-button {
    margin-bottom: 20px;
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 8px;
}

.pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    bottom: 20px;
    right: 20px;
}

.article-container {
    padding: 10px;
    background-color: #f5f7fa;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.table-card {
    background-color: #fff;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    width: 100%;
    transition: all 0.3s ease;
}

::deep(.el-table__header th) {
    text-align: center !important;
}

@media screen and (max-width: 1000px) {
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
