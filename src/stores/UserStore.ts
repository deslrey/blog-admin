import { defineStore } from 'pinia'

interface UserState {
    nickname: string | null    //  昵称
    roles: string[]     //  角色
    accessibleRoutes: string[]      //  可访问的路由
}

const useUserStore = defineStore('user', {
    state: (): UserState => ({
        nickname: null,
        roles: [],
        accessibleRoutes: []
    }),

    getters: {
        isAdmin: (state) => state.roles.includes('admin'),
        hasAccess: (state) => (route: string) => state.accessibleRoutes.includes(route)
    },

    actions: {
        setUserInfo(nickname: string, roles: string[], routes: string[]) {
            this.nickname = nickname
            this.roles = roles
            this.accessibleRoutes = routes
        },

        getUserInfo() {
            return {
                nickname: this.nickname,
                roles: this.roles,
                accessibleRoutes: this.accessibleRoutes
            }
        },

        clearUserInfo() {
            this.nickname = ''
            this.roles = []
            this.accessibleRoutes = []
        }
    }
})

export default useUserStore
