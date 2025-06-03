import { getToken } from "@/utils/Token";
import message from "@/utils/Message";
import { createRouter, createWebHistory, type RouteRecordRaw, } from "vue-router";


export const asideRoutes: RouteRecordRaw[] = [
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
        path: '/articlelist',
        name: 'Articlelist',
        component: () => import('@/views/list/ListView.vue'),
        meta: { title: '文章列表', roles: ['admin'] }
    },
    {
        path: 'edit',
        name: 'Edit',
        component: () => import('@/views/edit/EditVIew.vue'),
        meta: { title: '编辑', roles: ['admin'] },
    },
    {
        path: 'articleEdit',
        name: 'ArticleEdit',
        component: () => import('@/views/edit/ArticleEditVIew.vue'),
        meta: { title: '文章编辑', roles: ['admin'] },
    },
    {
        path: 'draft',
        name: 'Draft',
        component: () => import('@/views/draft/DraftView.vue'),
        meta: { title: '草稿', roles: ['admin'] },
    },
    {
        path: 'visitor',
        name: 'Visitor',
        meta: { title: '访客', roles: ['admin'] },
        children: [
            {
                path: 'list',
                name: 'VisitorList',
                component: () => import('@/views/visitor/VisitorListView.vue'),
                meta: { title: '访客列表', roles: ['admin', 'general'] }
            },
            {
                path: 'log',
                name: 'VisitorLog',
                component: () => import('@/views/visitor/VisitorLogView.vue'),
                meta: { title: '访客日志', roles: ['admin'] }
            }
        ]
    },
    {
        path: 'table',
        name: 'Table',
        meta: { title: '表格', roles: ['admin'] },
        children: [
            {
                path: 'table1',
                name: 'Table1',
                meta: { title: '表格1', roles: ['admin'] },
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
                meta: { title: '表格2', roles: ['admin'] },  // 加上title
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

export const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        component: () => import('@/views/login/LoginView.vue'),
    },
    {
        path: '/404',
        name: 'NotFound',
        component: () => import('@/views/404.vue'),
        meta: { title: '404', hidden: true, roles: ['admin', 'general'] }
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
                children: asideRoutes
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