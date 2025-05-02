<template>
    <MdEditor v-model="text" @onUploadImg="onUploadImg" @onSave="onSave" />
</template>

<script setup>
import { ref } from 'vue';
import { MdEditor } from 'md-editor-v3';
import request from '@/utils/Request'
import 'md-editor-v3/lib/style.css';

const text = ref('# Hello Editor');

// 保存内容
const onSave = (v, h) => {
    console.log(v);
    h.then((html) => {
        console.log(html);
    });
};



const onUploadImg = async (files, callback) => {
    try {
        const res = await Promise.all(
            files.map((file) => {
                const formData = new FormData();
                formData.append('file', file);

                // 注意这里第三个参数用于传 headers
                return request.post(
                    '/api/upload',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
            })
        );

        console.log('图片上传成功', res);


        // 提取上传返回的 URL 列表
        const urls = res.map((item) => item.data.url);
        callback(urls);
    } catch (err) {
        console.error('图片上传失败', err);
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