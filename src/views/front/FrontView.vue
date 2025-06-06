<template>
    <div class="chart-container">
        <div id="topArticle" ref="chartRef" :style="{ width: chartWidth, height: '400px' }" class="chart-card"></div>

        <div id="dailyTopChart" ref="dailyChartRef" :style="{ width: chartWidth, height: '400px' }" class="chart-card">
        </div>

        <div id="last5daysChart" ref="last5DaysChartRef" :style="{ width: chartWidth, height: '400px' }"
            class="chart-card"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef, nextTick, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import request from '@/utils/Request'
import type { ArticleView } from '@/types/Article'

let resizeObserver: ResizeObserver | null = null

const api = {
    findTopByPageViews: '/article/findTopByPageViews',
    topFive: '/visit-log/top5',
    last5Days: '/visit-log/last5days'
}

const chartRef = ref<HTMLElement | null>(null)
const chartInstance = shallowRef<echarts.ECharts | null>(null)

const dailyChartRef = ref<HTMLElement | null>(null)
const dailyChartInstance = shallowRef<echarts.ECharts | null>(null)

const last5DaysChartRef = ref<HTMLElement | null>(null)
const last5DaysChartInstance = shallowRef<echarts.ECharts | null>(null)

const chartWidth = shallowRef('30%')

const getBarOption = (titles: string[], views: number[], isMobile: boolean, titleText: string) => ({
    title: {
        text: titleText,
        textStyle: {
            fontSize: isMobile ? 14 : 18
        }
    },
    tooltip: {
        triggerRef: 'axis',
    },
    xAxis: {
        type: 'category',
        data: titles,
        axisLabel: {
            fontSize: isMobile ? 10 : 12,
            rotate: isMobile ? 15 : 30,
            interval: 0,
            formatter: (value: string) => {
                const maxLength = isMobile ? 5 : 8
                return value.length > maxLength ? value.slice(0, maxLength) + '...' : value
            }
        }
    },
    yAxis: {
        type: 'value'
    },
    grid: {
        left: isMobile ? '10%' : '15%',
        right: isMobile ? '10%' : '15%',
        bottom: isMobile ? '20%' : '25%'
    },
    series: [
        {
            name: '浏览量',
            type: 'bar',
            data: views,
            barMaxWidth: isMobile ? 20 : 40
        }
    ]
})

// 折线图配置函数
const getLineOption = (dates: string[], counts: number[], isMobile: boolean) => ({
    title: {
        text: '最近5天访问量',
        textStyle: {
            fontSize: isMobile ? 14 : 18
        }
    },
    tooltip: {
        trigger: 'axis'
    },
    xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
            fontSize: isMobile ? 10 : 12,
            rotate: isMobile ? 15 : 30,
            interval: 0
        }
    },
    yAxis: {
        type: 'value'
    },
    grid: {
        left: isMobile ? '10%' : '15%',
        right: isMobile ? '10%' : '15%',
        bottom: isMobile ? '20%' : '25%'
    },
    series: [
        {
            name: '访问量',
            type: 'line',
            data: counts,
            smooth: true,
            lineStyle: {
                width: 3
            },
            itemStyle: {
                color: '#5470C6'
            }
        }
    ]
})

// 初始化第一个柱状图
const initData = async () => {
    const res = await request.get(api.findTopByPageViews)
    if (res.code !== 200 || !Array.isArray(res.data)) {
        console.error('数据获取失败')
        return
    }
    const rawData = res.data
    const titles = rawData.map((item: ArticleView) => item.title)
    const views = rawData.map((item: ArticleView) => item.pageViews)

    await nextTick()

    if (!chartInstance.value && chartRef.value) {
        chartInstance.value = echarts.init(chartRef.value)
    }

    if (chartInstance.value) {
        const isMobile = window.innerWidth <= 768
        const option = getBarOption(titles, views, isMobile, '文章浏览量')
        chartInstance.value.setOption(option)
        chartInstance.value.resize()
    }
}

// 初始化每日热榜柱状图
const initDailyTopChart = async () => {
    const res = await request.get(api.topFive)
    if (res.code !== 200 || !Array.isArray(res.data)) {
        console.error('每日热榜获取失败')
        return
    }
    const rawData = res.data
    const titles = rawData.map((item: ArticleView) => item.title)
    const views = rawData.map((item: ArticleView) => item.pageViews)

    await nextTick()

    if (!dailyChartInstance.value && dailyChartRef.value) {
        dailyChartInstance.value = echarts.init(dailyChartRef.value)
    }

    if (dailyChartInstance.value) {
        const isMobile = window.innerWidth <= 768
        const option = getBarOption(titles, views, isMobile, '每日热榜')
        dailyChartInstance.value.setOption(option)
        dailyChartInstance.value.resize()
    }
}

// 初始化最近5天折线图
const initLast5DaysChart = async () => {
    const res = await request.get(api.last5Days)
    if (res.code !== 200 || !Array.isArray(res.data)) {
        console.error('最近5天访问量获取失败')
        return
    }
    const rawData = res.data

    // 假设接口返回格式：
    // data: [{ date: '2025-06-01', count: 10 }, { date: '2025-06-02', count: 20 }, ...]

    const dates = rawData.map((item: { date: string; count: number }) => item.date)
    const counts = rawData.map((item: { date: string; count: number }) => item.count)

    await nextTick()

    if (!last5DaysChartInstance.value && last5DaysChartRef.value) {
        last5DaysChartInstance.value = echarts.init(last5DaysChartRef.value)
    }

    if (last5DaysChartInstance.value) {
        const isMobile = window.innerWidth <= 768
        const option = getLineOption(dates, counts, isMobile)
        last5DaysChartInstance.value.setOption(option)
        last5DaysChartInstance.value.resize()
    }
}

const handleResize = () => {
    const isMobile = window.innerWidth <= 768
    chartWidth.value = isMobile ? '100%' : '30%'
    chartInstance.value?.resize()
    dailyChartInstance.value?.resize()
    last5DaysChartInstance.value?.resize()
}

onMounted(() => {
    initData()
    initDailyTopChart()
    initLast5DaysChart()
    handleResize()

    window.addEventListener('resize', handleResize)

    if (chartRef.value) {
        resizeObserver = new ResizeObserver(() => {
            chartInstance.value?.resize()
        })
        resizeObserver.observe(chartRef.value)
    }

    if (dailyChartRef.value) {
        resizeObserver = new ResizeObserver(() => {
            dailyChartInstance.value?.resize()
        })
        resizeObserver.observe(dailyChartRef.value)
    }

    if (last5DaysChartRef.value) {
        resizeObserver = new ResizeObserver(() => {
            last5DaysChartInstance.value?.resize()
        })
        resizeObserver.observe(last5DaysChartRef.value)
    }
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    if (resizeObserver) {
        if (chartRef.value) resizeObserver.unobserve(chartRef.value)
        if (dailyChartRef.value) resizeObserver.unobserve(dailyChartRef.value)
        if (last5DaysChartRef.value) resizeObserver.unobserve(last5DaysChartRef.value)
    }
})


</script>

<style scoped>
.chart-card {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    padding: 16px;
    box-sizing: border-box;
    transition: box-shadow 0.3s ease;
}

.chart-card:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.chart-container {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
}

@media (max-width: 1000px) {
    .chart-container {
        flex-direction: column;
        align-items: center;
    }

    .chart-card {
        width: 100% !important;
    }
}
</style>
