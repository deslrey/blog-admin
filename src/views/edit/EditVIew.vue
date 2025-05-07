    <template>
        <MdEditor v-model="text" @onUploadImg="onUploadImg" @onSave="onSave" />
        <el-dialog v-model="dialogVisible" title="填写文章信息" width="500px" @close="onDialogClose">
            <el-form :model="articleData" label-width="100px">
                <el-form-item label="标题">
                    <el-input v-model="articleData.title" />
                </el-form-item>
                <el-form-item label="作者">
                    <el-input v-model="articleData.author" />
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="articleData.description" />
                </el-form-item>
                <el-form-item label="类型">
                    <el-input v-model="articleData.type" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitArticle">提交</el-button>
            </template>
        </el-dialog>
    </template>


<script lang="ts" setup>

import { ref } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { ElMessage } from 'element-plus';
import 'element-plus/dist/index.css';
import request from '@/utils/Request';

const api = {
    onUploadImg: '/api/upload/img',
};

const text = ref<string>('# Hello Editor');
const dialogVisible = ref<boolean>(false);
let pendingMarkdown = '';
let pendingHtml: Promise<string> | null = null


interface ArticleData {
    title: string;
    author: string;
    description: string;
    update: string;
    readTime: string;
    type: string;
}

const articleData = ref<ArticleData>({
    title: '',
    author: '',
    description: '',
    update: '',
    readTime: '',
    type: ''
});

const onSave = (markdown: string, htmlPromise: Promise<string>): void => {
    pendingMarkdown = markdown;
    pendingHtml = htmlPromise;
    dialogVisible.value = true;
    console.log('开启表单 ======> ', dialogVisible.value);

};

const submitArticle = () => {
    if (!pendingHtml) return;

    const model =
        `---
        title: ${articleData.value.title}
        author: ${articleData.value.author}
        description: ${articleData.value.description}
        update: ${articleData.value.update}
        readTime: ${articleData.value.readTime}
        type: ${articleData.value.type}
        ---`

    console.log('最终 Markdown:', model + pendingMarkdown);
    pendingHtml.then((html) => {
        console.log('HTML 内容:', html);
        ElMessage.success('文章已保存');
        dialogVisible.value = false;
    });
};

const onDialogClose = () => {
    pendingMarkdown = '';
    pendingHtml = null;
};


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
</style>
