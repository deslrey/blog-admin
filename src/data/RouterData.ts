export const menus = [
    { name: '首页', path: '/' },
    { name: '用户管理', path: '/user' },
    { name: '测试界面', path: '/test' },
    {
        name: '表格',
        path: '/table',
        children: [
            {
                name: 'table1',
                path: '/table/table1',
                children: [
                    { name: '表格1-1', path: '/table/table1/table1-1' },
                    { name: '表格1-2', path: '/table/table1/table1-2' }
                ]
            },
            {
                name: 'table2',
                path: '/table/table2',
                children: [
                    { name: '表格2-1', path: '/table/table2/table2-1' },
                    { name: '表格2-2', path: '/table/table2/table2-2' }
                ]
            }
        ]
    }
]