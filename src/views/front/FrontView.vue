<template>
    <div>
        <div id="topArticle" ref="chartRef" :style="{ width: chartWidth, height: '400px' }" class="chart-card"></div>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import request from '@/utils/Request'
import type { ArticleView } from '@/types/Article'


let resizeObserver: ResizeObserver | null = null

const api = {
    findTopByPageViews: '/article/findTopByPageViews'
}

const chartRef = ref<HTMLElement | null>(null)
const chartInstance = ref<echarts.ECharts | null>(null)
const chartWidth = ref('30%')
const getOption = (titles: string[], views: number[], isMobile: boolean) => ({
    title: {
        text: '文章浏览量',
        textStyle: {
            fontSize: isMobile ? 14 : 18
        }
    },
    tooltip: {},
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

const handleResize = () => {
    const isMobile = window.innerWidth <= 768
    chartWidth.value = isMobile ? '100%' : '30%'
    if (chartInstance.value) {
        chartInstance.value.resize()
    }
}

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
        const option = getOption(titles, views, isMobile)
        chartInstance.value.setOption(option)
        chartInstance.value.resize()
    }
}


onMounted(() => {
    initData()
    handleResize()

    window.addEventListener('resize', handleResize)

    if (chartRef.value) {
        resizeObserver = new ResizeObserver(() => {
            if (chartInstance.value) {
                chartInstance.value.resize()
            }
        })
        resizeObserver.observe(chartRef.value)
    }
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    if (resizeObserver && chartRef.value) {
        resizeObserver.unobserve(chartRef.value)
    }
})


onMounted(() => {
    initData()
    handleResize()
    window.addEventListener('resize', handleResize)
})
</script>

<style scoped>
.chart-card {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 16px;
    box-sizing: border-box;
    transition: box-shadow 0.3s ease;
}

.chart-card:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}
</style>
