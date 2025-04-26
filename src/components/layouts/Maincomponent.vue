<template>
    <div class="main">
        <div class="content-wrapper">
            <router-view />
        </div>
    </div>
</template>

<style scoped>
.main {
    flex: 1;
    overflow-y: auto;
    background: #f9fafc;
    padding: 20px;
    display: flex;
    flex-direction: column;
    /* 让main本身是弹性布局 */
}

.content-wrapper {
    background: #fff;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 24px;
    margin: 0 auto;
    width: 100%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    min-height: 0;
}
</style>
