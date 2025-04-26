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
