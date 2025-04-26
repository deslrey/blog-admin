<template>
    <header class="header">
        <!-- 小屏才显示 -->
        <button class="menu-btn" @click="$emit('toggle-aside')">
            ☰
        </button>
        <!-- 其他内容 -->
        <h1>你的系统名字</h1>
    </header>
</template>

<style scoped>
.header {
    display: flex;
    align-items: center;
    height: 60px;
    background-color: #2f3542;
    color: white;
    padding: 0 20px;
}

.menu-btn {
    display: none;
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    margin-right: 10px;
}

@media screen and (max-width: 768px) {
    .menu-btn {
        display: block;
    }
}
</style>