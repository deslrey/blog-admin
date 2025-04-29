<template>
    <div>
        <h1>测试页面</h1>
        <el-button @click="addLocalStorege">添加localStorage</el-button>
        <el-button @click="getLocalStorege">获取localStorage</el-button>
        <el-button @click="removeLocalStorege">删除localStorage</el-button>
    </div>
</template>

<script setup lang="ts">
import { getToken, removeToken, setToken } from '@/utils/Token';


const addLocalStorege = () => {
    setToken('111111');
}

const getLocalStorege = () => {
    const token: string = getToken();
    console.log('token ====== > ', token);

}

const removeLocalStorege = () => {
    removeToken();
}

</script>

<style scoped></style>