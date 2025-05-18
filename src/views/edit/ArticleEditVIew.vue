<template>
    <div class="page-container">
        <div class="form-header">
            <div class="form-left">
                <div class="input-row">
                    <el-input v-model="articleData.title" placeholder="请输入文章标题" class="input-item" />
                    <el-input v-model="articleData.author" placeholder="请输入作者" class="input-item" />
                </div>
                <div class="input-row">
                    <el-input v-model="articleData.tags" placeholder="请输入标签(、号分隔)" class="input-half" />
                    <el-select v-model="articleData.category" placeholder="请选择分类或输入" class="input-half" filterable
                        allow-create>
                        <el-option label="前端" value="frontend" />
                        <el-option label="后端" value="backend" />
                        <el-option label="移动端" value="mobile" />
                        <el-option label="其他" value="other" />
                    </el-select>
                </div>

                <el-input v-model="articleData.description" placeholder="请输入文章简介" type="textarea" :rows="2"
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
        <MdEditor v-model="articleData.content" @onUploadImg="onUploadImg" @onSave="onSave" :toolbars="toolbars" />
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { Plus } from '@element-plus/icons-vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import request from '@/utils/Request';
import type { ArticleVO, ArticleDraftVO } from '@/types/Article';
import { toolbars } from '@/data/ToolBars';
import message from '@/utils/Message';
import { ElMessageBox, genFileId } from 'element-plus'
import type { UploadInstance, UploadRawFile } from 'element-plus'
import { useArticleStore } from '@/stores/ArticleStore';
import dayjs from 'dayjs';

const api = {
    onUploadImg: '/upload/image',
    saveArticle: '/article/saveArticle',
    getArticleData: '/article/getArticleData',
    saveArticleDraft: '/articleDraft/saveArticleDraft',
    deleteArticleDraft: '/articleDraft/deleteArticleDraft'
};

const coverUrl = ref<string>('');
const uploadRef = ref<UploadInstance>()
const coverFile = ref<File | null>(null);

const articleData = reactive<ArticleDraftVO>({
    id: null,
    articleId: null,
    title: '',
    author: '',
    imagePath: '',
    description: '',
    storagePath: '',
    tags: '',
    category: '',
    createTime: null,
    updateTime: null,
    wordCount: 0,
    readTime: 0,
    content: '',
    exist: false
})


const onSave = async (markdown: string, htmlPromise: Promise<string>) => {

    const formData = new FormData()
    if (coverFile.value) {
        formData.append('file', coverFile.value)
    }

    articleData.updateTime = dayjs().toDate()
    articleData.wordCount = markdown.length
    articleData.readTime = Math.ceil(markdown.length / 400)

    console.log('文章数据 ======> ', articleData);


    const appendChildToBtns = () => {
        let btns: any = document.querySelector(".el-message-box__btns");
        let btn = document.createElement("button");
        btn.className = "el-button el-button--success";
        btn.textContent = "保存";
        btns.appendChild(btn);
        btn.onclick = async () => {
            console.log('保存 ======> ');
            formData.append('ArticleVO', new Blob([JSON.stringify(articleData)], {
                type: 'application/json'
            }))
            const result = await request.post(api.saveArticle, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            if (result.code !== 200) {
                message.error(result.message)
            } else {
                message.success(result.message)
                console.log('articleId ======> ', articleData.articleId);

                request.post(api.deleteArticleDraft, { id: articleData.articleId }, {}, 'form')
            }
            clearData()
            ElMessageBox.close();
        };
    }
    setTimeout(() => {
        appendChildToBtns();
    }, 100);


    ElMessageBox.confirm('你确定要离开吗?未保存的内容将会丢失', '提示', {
        confirmButtonText: '保存草稿',
        cancelButtonText: '取消',
        type: 'info',
    }).then(async () => {
        console.log('保存草稿======> ');
        formData.append('articleDraft', new Blob([JSON.stringify(articleData)], {
            type: 'application/json'
        }))
        const result = await request.post(api.saveArticleDraft, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        if (result.code !== 200) {
            message.error(result.message)
            return
        }
        message.success(result.message)
        clearData()
    }).catch(() => {
        message.info('保存取消')
    });
};


const handleCoverChange = (file: any) => {
    const rawFile = file.raw;
    coverFile.value = rawFile;
    coverUrl.value = URL.createObjectURL(rawFile);
    message.info('修改成功')
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

const clearData = () => {
    articleData.id = null
    articleData.articleId = null
    articleData.title = ''
    articleData.author = ''
    articleData.imagePath = ''
    articleData.description = ''
    articleData.storagePath = ''
    articleData.tags = ''
    articleData.category = ''
    articleData.createTime = null
    articleData.updateTime = null
    articleData.wordCount = 0
    articleData.readTime = 0
    articleData.content = ''
    articleData.exist = false
    articleId.value = null
    coverUrl.value = ''
    coverFile.value = null
    articleStore.clearArticleId()
    articleStore.clearContent()
}


const articleStore = useArticleStore()
const articleId = ref<number | null>()

onMounted(async () => {

    articleId.value = articleStore.getArticleId()
    console.log('articleId ======> ', articleId.value);

    if (articleId.value === null) {
        return
    }
    const result = await request.post<ArticleVO>(api.getArticleData, { id: articleId.value }, {}, 'form')
    console.log('result ======> ', result);
    if (result.code !== 200) {
        message.error(`编辑失败: ${result.message}`)
    }

    const data = result.data
    coverUrl.value = data.imagePath
    articleStore.setContent(data.content)
    Object.assign(articleData, data)
    articleData.articleId = data.id
    console.log('articleData ======> ', articleData);
})

onBeforeRouteLeave((to, from, next) => {
    if (articleStore.getContent() === articleData.content) {
        clearData()
        next()
        return
    }
    if (articleId.value === null && articleStore.getContent() === articleData.content) {
        clearData()
        next()
        return
    }

    const appendChildToBtns = () => {
        let btns: any = document.querySelector(".el-message-box__btns");
        let btn = document.createElement("button");
        btn.className = "el-button el-button--success";
        btn.textContent = "保存";
        btns.appendChild(btn);
        btn.onclick = () => {
            console.log('保存成功');
            ElMessageBox.close();
            clearData()
            next()
        };
    }
    setTimeout(() => {
        appendChildToBtns();
    }, 100);

    ElMessageBox.confirm('你确定要离开吗？未保存的内容将会丢失', '提示', {
        confirmButtonText: '离开',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        clearData()
        next();
    }).catch(() => {
        next(false);
    });
});

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

    @media screen and (max-width: 1000px) {
        width: 100%;
        justify-content: center;
    }
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
