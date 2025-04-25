const TokenKey = 'x-auth-token-deslre';

export function getToken(): string {
    return localStorage.getItem(TokenKey) || '';
}

export function setToken(token: string) {
    localStorage.setItem(TokenKey, token);
}

export function removeToken() {
    localStorage.removeItem(TokenKey);
}

// utils/auth.ts 或 services/user.ts
export const getUserInfoFromBackend = async () => {
    // 模拟异步接口（你也可以用 axios 请求）
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                nickname: '小明',
                roles: ['admin'],
                accessibleRoutes: ['/home/user', '/home/test']
            })
        }, 300)
    })
}
