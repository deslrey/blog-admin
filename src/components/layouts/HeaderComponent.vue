<template>
    <header class="header">
        <div class="logo">ERP系统</div>
        <div class="user-info">
            <!-- <span>欢迎你,{{ userInfo.nickname }}</span> -->
            <!-- 可以加下拉菜单、头像、退出按钮等 -->
        </div>
    </header>
</template>

<script setup lang="ts">


// const useUser = useUserStore()

// const userInfo: UserState = useUser.getUserInfo()
</script>

<style scoped>
.header {
    height: 60px;
    background-color: #2c3e50;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}
</style>