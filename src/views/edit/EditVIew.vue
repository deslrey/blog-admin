    <template>
        <MdEditor v-model="text" @onUploadImg="onUploadImg" @onSave="onSave" />
        <el-dialog v-model="dialogVisible" title="填写文章信息" width="500px" @close="onDialogClose">
            <el-form :model="articleDetail" label-width="100px">
                <el-form-item label="标题">
                    <el-input v-model="articleDetail.title" />
                </el-form-item>
                <el-form-item label="作者">
                    <el-input v-model="articleDetail.author" />
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="articleDetail.description" />
                </el-form-item>
                <el-form-item label="类型">
                    <el-input v-model="articleDetail.type" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitArticle">提交</el-button>
                </div>
            </template>

        </el-dialog>
    </template>


<script lang="ts" setup>

import { ref, toRaw } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import 'element-plus/dist/index.css';
import request from '@/utils/Request';
import message from '@/utils/Message';
import dayjs from 'dayjs';

const api = {
    onUploadImg: '/upload/img',
    saveArticle: '/article/saveArticle',
};

const text = ref<string>("# 111");
const dialogVisible = ref<boolean>(false);
let pendingMarkdown = '';


interface ArticleDetail {
    title: string;
    author: string;
    description: string;
    createDate: Date | null;
    updateDate: Date | null;
    wordCount: number;
    readTime: number;
    type: string;
    content: string;
}

const articleDetail = ref<ArticleDetail>({
    title: 'a',
    author: 'a',
    description: 'a',
    createDate: null,
    updateDate: null,
    wordCount: 0,
    readTime: 1,
    type: 'a',
    content: '',
});

const onSave = (markdown: string, htmlPromise: Promise<string>): void => {
    pendingMarkdown = markdown;
    dialogVisible.value = true;
};

const submitArticle = async () => {


    if (!pendingMarkdown) {
        message.error('请先填写文章内容');
        return
    };

    articleDetail.value.createDate = dayjs().toDate();
    articleDetail.value.updateDate = dayjs().toDate();

    const model =
        `---
        title: ${articleDetail.value.title}
        author: ${articleDetail.value.author}
        description: ${articleDetail.value.description}
        createTime: ${articleDetail.value.createDate ? dayjs(articleDetail.value.createDate).format('YYYY-MM-DD HH:mm:ss') : '暂无日期'}
        updateTime: ${articleDetail.value.updateDate ? dayjs(articleDetail.value.updateDate).format('YYYY-MM-DD HH:mm:ss') : '暂无日期'}}
        wordCount: ${articleDetail.value.wordCount}
        readTime: ${articleDetail.value.readTime}
        type: ${articleDetail.value.type}
        ---

    `

    const content = model + pendingMarkdown;
    articleDetail.value.content = content;
    dialogVisible.value = false;

    const result = await request.post(api.saveArticle, articleDetail.value);

    if (result.code === 200) {
        message.success('文章保存成功');
    } else {
        message.error('文章保存失败');
    }
    clearData();

};

const onDialogClose = () => {
    pendingMarkdown = '';
    dialogVisible.value = false;
    clearData();
};

const clearData = () => {
    articleDetail.value.title = '';
    articleDetail.value.author = '';
    articleDetail.value.description = '';
    articleDetail.value.createDate = null;
    articleDetail.value.updateDate = null;
    articleDetail.value.wordCount = 0;
    articleDetail.value.readTime = 1;
    articleDetail.value.type = '';
    articleDetail.value.content = '';
}

const onUploadImg = async (
    files: File[],
    callback: (urls: string[]) => void
): Promise<void> => {
    try {
        const responses = await Promise.all(
            files.map((file) => {
                const formData = new FormData();
                formData.append('file', file);

                return request.post(api.onUploadImg, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            })
        );

        console.log('图片上传成功', responses);

        const urls = responses.map((res: any) => res.data.url);
        callback(urls);
    } catch (error) {
        console.error('图片上传失败', error);
    }
};
</script>

<style lang="less" scoped>
.css-vars(@isDark) {
    --md-color: if(@isDark, #999, #222);
    --md-hover-color: if(@isDark, #bbb, #000);
    --md-bk-color: if(@isDark, #000, #fff);
    --md-bk-color-outstand: if(@isDark, #333, #f2f2f2);
    --md-bk-hover-color: if(@isDark, #1b1a1a, #f5f7fa);
    --md-border-color: if(@isDark, #2d2d2d, #e6e6e6);
    --md-border-hover-color: if(@isDark, #636262, #b9b9b9);
    --md-border-active-color: if(@isDark, #777, #999);
    --md-modal-mask: #00000073;
    --md-scrollbar-bg-color: if(@isDark, #0f0f0f, #e2e2e2);
    --md-scrollbar-thumb-color: if(@isDark, #2d2d2d, #0000004d);
    --md-scrollbar-thumb-hover-color: if(@isDark, #3a3a3a, #00000059);
    --md-scrollbar-thumb-active-color: if(@isDark, #3a3a3a, #00000061);
    height: 100%;
    width: 100%;
}

.md-editor {
    .css-vars(false);
}

.md-editor-dark {
    .css-vars(true);
}

.dialog-footer {
    text-align: center;

    .el-button {
        margin: 0 10px;
    }
}
</style>
