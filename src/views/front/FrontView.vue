<template>
    <div class="chart-wrapper">
        <!-- 左侧地图 -->
        <div class="left-panel">
            <div id="chinaMapChart" ref="chinaMapRef" class="chart-card map-card"></div>
        </div>

        <!-- 右侧三个图表 -->
        <div class="right-panel">
            <div id="topArticle" ref="chartRef" class="chart-card small-chart"></div>
            <div id="dailyTopChart" ref="dailyChartRef" class="chart-card small-chart"></div>
            <div id="last5daysChart" ref="last5DaysChartRef" class="chart-card small-chart"></div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, shallowRef, nextTick, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import request from '@/utils/Request'
import chinaMap from '@/assets/json/Chinese.json'
import type { ArticleView } from '@/types/Article'
import type { VisitCount } from '@/types/Visitor'

let resizeObserver: ResizeObserver | null = null

const api = {
    findTopByPageViews: '/article/findTopByPageViews',
    topFive: '/visit-log/top5',
    last5Days: '/visit-log/last5days',
    getVisitCountByProvince: '/visit-log/getVisitCountByProvince'
}

// refs for charts
const chartRef = ref<HTMLElement | null>(null)
const chartInstance = shallowRef<echarts.ECharts | null>(null)

const dailyChartRef = ref<HTMLElement | null>(null)
const dailyChartInstance = shallowRef<echarts.ECharts | null>(null)

const last5DaysChartRef = ref<HTMLElement | null>(null)
const last5DaysChartInstance = shallowRef<echarts.ECharts | null>(null)

const chinaMapRef = ref<HTMLElement | null>(null)
const chinaMapInstance = shallowRef<echarts.ECharts | null>(null)

const chartWidth = shallowRef('30%')

// 获取地图配置
const getMapOption = (data: { name: string; value: number }[]) => ({
    title: {
        text: '各省访问人数统计',
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2
    },
    visualMap: {
        min: 0,
        max: Math.max(...data.map(i => i.value)) || 100,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'],
        inRange: {
            color: [
                '#313695', '#4575b4', '#74add1', '#abd9e9',
                '#e0f3f8', '#ffffbf', '#fee090', '#fdae61',
                '#f46d43', '#d73027', '#a50026'
            ]
        },
        calculable: true
    },
    series: [
        {
            name: '访问量',
            type: 'map',
            map: 'china',
            roam: true,
            label: { show: true },
            data: data,
            layoutCenter: ['50%', '50%'],
            layoutSize: '100%' // ⬅️ 调整这里可以改变地图大小
        }
    ]
})


// 1. 文章热榜柱状图
const initData = async () => {
    const res = await request.get(api.findTopByPageViews)
    if (res.code !== 200 || !Array.isArray(res.data)) return
    const titles = res.data.map((item: ArticleView) => item.title)
    const views = res.data.map((item: ArticleView) => item.pageViews)

    await nextTick()
    if (!chartInstance.value && chartRef.value) {
        chartInstance.value = echarts.init(chartRef.value)
    }
    if (chartInstance.value) {
        const isMobile = window.innerWidth <= 768
        chartInstance.value.setOption(getBarOption(titles, views, isMobile, '文章浏览量'))
        chartInstance.value.resize()
    }
}

// 2. 每日热榜柱状图
const initDailyTopChart = async () => {
    const res = await request.get(api.topFive)
    if (res.code !== 200 || !Array.isArray(res.data)) return
    const titles = res.data.map((item: VisitCount) => item.title)
    const views = res.data.map((item: VisitCount) => item.count)

    await nextTick()
    if (!dailyChartInstance.value && dailyChartRef.value) {
        dailyChartInstance.value = echarts.init(dailyChartRef.value)
    }
    if (dailyChartInstance.value) {
        const isMobile = window.innerWidth <= 768
        dailyChartInstance.value.setOption(getBarOption(titles, views, isMobile, '每日热榜'))
        dailyChartInstance.value.resize()
    }
}

// 3. 最近5天访问折线图
const initLast5DaysChart = async () => {
    const res = await request.get(api.last5Days)
    if (res.code !== 200 || !Array.isArray(res.data)) return
    const dates = res.data.map((item: { title: string; count: number }) => item.title)
    const counts = res.data.map((item: { title: string; count: number }) => item.count)

    await nextTick()
    if (!last5DaysChartInstance.value && last5DaysChartRef.value) {
        last5DaysChartInstance.value = echarts.init(last5DaysChartRef.value)
    }
    if (last5DaysChartInstance.value) {
        const isMobile = window.innerWidth <= 768
        last5DaysChartInstance.value.setOption(getLineOption(dates, counts, isMobile))
        last5DaysChartInstance.value.resize()
    }
}

// 4. 中国地图图表
const initChinaMapChart = async () => {
    echarts.registerMap('china', chinaMap as any)
    const res = await request.get(api.getVisitCountByProvince)
    if (res.code !== 200 || !Array.isArray(res.data)) return

    const mapData = res.data.map((item: { title: string; count: number }) => ({
        name: item.title,
        value: item.count
    }))

    await nextTick()
    if (!chinaMapInstance.value && chinaMapRef.value) {
        chinaMapInstance.value = echarts.init(chinaMapRef.value)
    }
    if (chinaMapInstance.value) {
        chinaMapInstance.value.setOption(getMapOption(mapData))
        chinaMapInstance.value.resize()
    }
}

// 公共方法
const getBarOption = (titles: string[], views: number[], isMobile: boolean, titleText: string) => ({
    title: { text: titleText, textStyle: { fontSize: isMobile ? 14 : 18 } },
    tooltip: { trigger: 'axis' },
    xAxis: {
        type: 'category',
        data: titles,
        axisLabel: {
            fontSize: isMobile ? 10 : 12,
            rotate: isMobile ? 15 : 30,
            interval: 0,
            formatter: (val: string) => val.length > (isMobile ? 5 : 8) ? val.slice(0, isMobile ? 5 : 8) + '...' : val
        }
    },
    yAxis: { type: 'value' },
    grid: { left: isMobile ? '10%' : '15%', right: isMobile ? '10%' : '15%', bottom: isMobile ? '20%' : '25%' },
    series: [{ name: '浏览量', type: 'bar', data: views, barMaxWidth: isMobile ? 20 : 40 }]
})

const getLineOption = (dates: string[], counts: number[], isMobile: boolean) => ({
    title: { text: '最近5天访问量', textStyle: { fontSize: isMobile ? 14 : 18 } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: dates, axisLabel: { fontSize: isMobile ? 10 : 12, rotate: isMobile ? 15 : 30 } },
    yAxis: { type: 'value' },
    grid: { left: isMobile ? '10%' : '15%', right: isMobile ? '10%' : '15%', bottom: isMobile ? '20%' : '25%' },
    series: [{ name: '访问量', type: 'line', data: counts, smooth: true, lineStyle: { width: 3 }, itemStyle: { color: '#5470C6' } }]
})

const handleResize = () => {
    const isMobile = window.innerWidth <= 768
    chartWidth.value = isMobile ? '100%' : '30%'
    chartInstance.value?.resize()
    dailyChartInstance.value?.resize()
    last5DaysChartInstance.value?.resize()
    chinaMapInstance.value?.resize()
}

onMounted(() => {
    initData()
    initDailyTopChart()
    initLast5DaysChart()
    initChinaMapChart()
    handleResize()

    window.addEventListener('resize', handleResize)

    const observers = [
        [chartRef, chartInstance],
        [dailyChartRef, dailyChartInstance],
        [last5DaysChartRef, last5DaysChartInstance],
        [chinaMapRef, chinaMapInstance]
    ]

    for (const [refEl, instance] of observers) {
        if (refEl.value) {
            resizeObserver = new ResizeObserver(() => instance.value?.resize())
            resizeObserver.observe(refEl.value)
        }
    }
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    const refs = [chartRef, dailyChartRef, last5DaysChartRef, chinaMapRef]
    for (const r of refs) {
        if (resizeObserver && r.value) resizeObserver.unobserve(r.value)
    }
})
</script>

<style scoped>
.chart-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}

.left-panel {
    flex: 1;
    min-width: 400px;
}

.right-panel {
    flex: 1;
    min-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.map-card {
    width: 100%;
    height: 800px;
}

.small-chart {
    width: 100%;
    height: 250px;
}

.chart-card {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    padding: 12px;
    box-sizing: border-box;
    transition: box-shadow 0.3s ease;
}

.chart-card:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

@media (max-width: 1000px) {
    .chart-wrapper {
        flex-direction: column;
        align-items: center;
        padding: 0 5px;
    }

    .left-panel,
    .right-panel {
        width: 100%;
        min-width: unset;
        /* ✅ 关键 */
    }

    .map-card {
        height: 600px;
    }

    .small-chart {
        height: 250px;
    }
}
</style>
