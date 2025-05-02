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