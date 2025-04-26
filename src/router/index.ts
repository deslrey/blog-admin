import { getToken } from "@/utils/getToken";
import message from "@/utils/Message";
import { createRouter, createWebHistory, type RouteRecordRaw, } from "vue-router";


const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        component: () => import('@/views/login/LoginView.vue'),
    },
    {
        path: '/',
        name: 'deslre',
        redirect: '/',
        // component: () => import('@/layout/index.vue'),
        children: [
            {
                path: '/',
                name: 'home',
                component: () => import('@/views/home/HomeView.vue'),
                meta: { title: '首页', roles: ['admin', 'general'] },
                children: [
                    {
                        path: 'user',
                        name: 'User',
                        component: () => import('@/views/user/UserView.vue'),
                        meta: { title: '用户管理', roles: ['admin', 'general'] },
                    },
                    {
                        path: 'test',
                        name: 'Test',
                        component: () => import('@/views/test/TestView.vue'),
                        meta: { title: '测试界面', roles: ['admin'] },
                    },
                    {
                        path: '/404',
                        name: 'NotFound',
                        component: () => import('@/views/404.vue'),
                        meta: { title: '404', hidden: true, roles: ['admin', 'general'] }
                    }
                ]
            },
        ]
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
    strict: true,
    scrollBehavior: () => ({ left: 0, top: 0 }),
})

export const asyncRouterMap: RouteRecordRaw[] = [
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/HomeView.vue'),
    },
    {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/UserView.vue'),
        meta: { title: '用户管理', roles: ['general'] },
    },
    {
        path: 'test',
        name: 'Test',
        component: () => import('@/views/test/TestView.vue'),
        meta: { title: '测试界面', roles: ['admin'] },
    },
    {
        path: '/404',
        name: 'NotFound',
        component: () => import('@/views/404.vue'),
        meta: { title: '404', hidden: true }
    }

]
router.beforeEach((to, from, next) => {
    const hasToken = getToken()
    if (hasToken) {
        next()
    } else {
        if (to.path === '/login') {
            next()
        } else {
            next({ path: '/login' })
        }
    }
})

export default router