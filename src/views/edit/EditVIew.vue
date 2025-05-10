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
                <el-form-item label="封面">
                    <el-upload class="cover-uploader" :file-list="fileList" :auto-upload="false" :limit="1" :drag='true'
                        :on-change="handleChange" :http-request="() => { console.log('空请求提交'); }" list-type="picture">
                        <img v-if="articleDetail.cover" :src="articleDetail.cover" class="cover-preview" />
                        <el-icon v-else>
                            <Plus />
                        </el-icon>
                    </el-upload>

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

import { ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import 'element-plus/dist/index.css';
import request from '@/utils/Request';
import message from '@/utils/Message';
import dayjs from 'dayjs';

const api = {
    onUploadImg: '/upload/image',
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
    cover: string;
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
    cover: '',
    type: 'a',
    content: '',
});

const fileList = ref<any[]>([]);


const handleChange = (file: any, fileListVal: any[]) => {
    fileList.value = fileListVal;
};

const onSave = (markdown: string, htmlPromise: Promise<string>): void => {
    pendingMarkdown = markdown;
    dialogVisible.value = true;
};

const submitArticle = async () => {

    if (!pendingMarkdown) {
        message.error('文章内容不能为空');
        return;
    }

    message.info('正在保存文章...');

    articleDetail.value.createDate = dayjs().toDate();
    articleDetail.value.updateDate = dayjs().toDate();
    articleDetail.value.wordCount = pendingMarkdown.length
    articleDetail.value.readTime = Math.ceil(pendingMarkdown.length / 400)

    const model = [
        '---',
        `title: ${articleDetail.value.title}`,
        `author: ${articleDetail.value.author}`,
        `description: ${articleDetail.value.description}`,
        `createTime: ${dayjs(articleDetail.value.createDate).format('YYYY-MM-DD HH:mm:ss')}`,
        `updateTime: ${dayjs(articleDetail.value.updateDate).format('YYYY-MM-DD HH:mm:ss')}`,
        `wordCount: ${articleDetail.value.wordCount}`,
        `readTime: ${articleDetail.value.readTime}`,
        `type: ${articleDetail.value.type}`,
        '---',
        ''
    ].join('\n');

    articleDetail.value.content = model + '\n\n' + pendingMarkdown;

    const formData = new FormData();
    formData.append(
        'articleDetail',
        new Blob([JSON.stringify(articleDetail.value)], {
            type: 'application/json'
        })
    );

    if (fileList.value.length > 0) {
        formData.append('file', fileList.value[0].raw);
    }

    try {
        const result = await request.post(api.saveArticle, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (result.code === 200) {
            message.success(result.message);
            dialogVisible.value = false;
        } else {
            message.error(result.message);
        }
    } catch (e) {
        console.error(e);
        clearData();
        message.error('请求失败');
    }
    clearData();
};


const onDialogClose = () => {
    pendingMarkdown = '';
    dialogVisible.value = false;
    clearData();
};

const clearData = () => {
    console.log('清除数据');

    articleDetail.value.title = '';
    articleDetail.value.author = '';
    articleDetail.value.description = '';
    articleDetail.value.createDate = null;
    articleDetail.value.updateDate = null;
    articleDetail.value.wordCount = 0;
    articleDetail.value.readTime = 1;
    articleDetail.value.type = '';
    articleDetail.value.content = '';
    articleDetail.value.cover = '';
    fileList.value = [];
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

.cover-uploader {
    display: block;
    width: 100%;

    .el-icon {
        font-size: 28px;
        color: #999;
        border: 1px dashed #d9d9d9;
        padding: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .cover-preview {
        width: 100%;
        height: auto;
        border-radius: 4px;
    }
}
</style>
