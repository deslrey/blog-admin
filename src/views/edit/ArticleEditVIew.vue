<template>
    <div class="page-container">
        <div class="form-header">
            <div class="form-left">
                <div class="input-row">
                    <el-input v-model="title" placeholder="请输入文章标题" class="input-item" />
                    <el-input v-model="author" placeholder="请输入作者" class="input-item" />
                </div>
                <div class="input-row">
                    <el-input v-model="tagOptions" placeholder="请输入标签" class="input-half" />
                    <el-select v-model="category" placeholder="请选择分类或输入" class="input-half" filterable allow-create>
                        <el-option label="前端" value="frontend" />
                        <el-option label="后端" value="backend" />
                        <el-option label="移动端" value="mobile" />
                        <el-option label="其他" value="other" />
                    </el-select>

                </div>

                <el-input v-model="description" placeholder="请输入文章简介" type="textarea" :rows="2"
                    class="description-area" />
            </div>

            <!-- 封面上传 -->
            <div class="form-right">
                <el-upload ref="uploadRef" :limit="1" :auto-upload="false" :on-change="handleCoverChange"
                    :show-file-list=false :before-upload="beforeCoverUpload" :on-exceed="handleExceed"
                    list-type="picture-card" accept="image/*">
                    <template #trigger>
                        <div class="upload-placeholder" v-if="!coverUrl">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            <div>上传封面</div>
                        </div>
                        <img v-else :src="coverUrl" class="cover-image" />
                    </template>
                </el-upload>
            </div>
        </div>
        <MdEditor v-model="text" @onUploadImg="onUploadImg" @onSave="onSave" :toolbars="toolbars" />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import request from '@/utils/Request';
import type { ArticleDetail } from '@/types/Article';
import { toolbars } from '@/data/ToolBars';
import message from '@/utils/Message';
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

const api = {
    onUploadImg: '/upload/image',
    saveArticle: '/article/saveArticle',
};

const category = ref('');
const tags = ref<string[]>([]);

const tagOptions = ref('');
const text = ref<string>('# 请输入正文内容...');
const title = ref('');
const author = ref('');
const description = ref('');
const coverUrl = ref<string>(''); // 封面图片地址
const uploadRef = ref<UploadInstance>()
const coverFile = ref<File | null>(null);

const onSave = (markdown: string, htmlPromise: Promise<string>) => {
    console.log('标题:', title.value);
    console.log('作者:', author.value);
    console.log('简介:', description.value);
    console.log('封面:', coverUrl.value);
    console.log('markdown 内容:', markdown);
};

const handleCoverChange = (file: any) => {
    const rawFile = file.raw;
    coverFile.value = rawFile;
    coverUrl.value = URL.createObjectURL(rawFile);
};

const handleExceed = (files: UploadRawFile[]) => {
    uploadRef.value?.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    uploadRef.value?.handleStart(file)
}


const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
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

        const urls = responses.map((res: any) => res.data.url);
        callback(urls);
    } catch (error) {
        console.error('图片上传失败', error);
    }
};

const beforeCoverUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage) {
        message.error('只能上传图片格式文件');
    }
    if (!isLt2M) {
        message.error('图片大小不能超过 2MB');
    }

    return isImage && isLt2M;
};

</script>

<style lang="less" scoped>
.page-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    box-sizing: border-box;
}

.form-header {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 16px;
}

.form-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.form-right {
    width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.cover-uploader {
    width: 100%;
    height: 140px;
    border: 1px dashed #d9d9d9;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 6px;
    overflow: hidden;
    background-color: #fafafa;
    text-align: center;
}

.cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.upload-placeholder {
    color: #999;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-size: 14px;
}

.editor-container {
    flex: 1;
    min-height: 0;
    overflow: auto;
}

.input-row {
    display: flex;
    gap: 16px;
    margin-bottom: 12px;
    flex-wrap: wrap;
}

.input-item {
    flex: 1;
    min-width: 200px;
}

.input-half {
    flex: 1;
    min-width: 200px;
}

.description-area {
    width: 100%;
}

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
