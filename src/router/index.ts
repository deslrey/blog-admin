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
                    },
                    {
                        path: 'table',
                        name: 'Table',
                        meta: { title: '表格', roles: ['admin'] },
                        children: [
                            {
                                path: 'table1',
                                name: 'Table1',
                                children: [
                                    {
                                        path: 'table1-1',
                                        name: 'Table1-1',
                                        component: () => import('@/views/table/table-1/TableView1.vue'),
                                        meta: { title: '表格1-1', roles: ['admin'] },
                                    },
                                    {
                                        path: 'table1-2',
                                        name: 'Table1-2',
                                        component: () => import('@/views/table/table-1/TableView2.vue'),
                                        meta: { title: '表格1-2', roles: ['admin'] },
                                    }
                                ]
                            },
                            {
                                path: 'table2',
                                name: 'Table2',
                                children: [
                                    {
                                        path: 'table2-1',
                                        name: 'Table2-1',
                                        component: () => import('@/views/table/table-2/TableView1.vue'),
                                        meta: { title: '表格2-1', roles: ['admin'] },
                                    },
                                    {
                                        path: 'table2-2',
                                        name: 'Table2-2',
                                        component: () => import('@/views/table/table-2/TableView2.vue'),
                                        meta: { title: '表格2-2', roles: ['admin'] },
                                    }
                                ]
                            }
                        ]
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