export const menus = [
    { name: '首页', path: '/', icon: 'icon-qq' },
    { name: '用户管理', path: '/user', icon: 'icon-qq' },
    { name: '文章编辑', path: '/edit', icon: 'icon-qq' },
    { name: '测试界面', path: '/test', icon: 'icon-qq' },
    {
        name: '表格',
        path: '/table',
        icon: 'icon-qq',
        children: [
            {
                name: 'table1',
                path: '/table/table1',
                icon: 'icon-qq',
                children: [
                    { name: '表格1-1', path: '/table/table1/table1-1', icon: 'icon-qq' },
                    { name: '表格1-2', path: '/table/table1/table1-2', icon: 'icon-qq' }
                ]
            },
            {
                name: 'table2',
                path: '/table/table2',
                icon: 'icon-qq',
                children: [
                    { name: '表格2-1', path: '/table/table2/table2-1', icon: 'icon-qq' },
                    { name: '表格2-2', path: '/table/table2/table2-2', icon: 'icon-qq' }
                ]
            }
        ]
    }
]