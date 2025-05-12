// src/stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    userAvatar: null,
    userId: -1,
    userName: null
  }),
  actions: {
    login(userAvatar,userId) {
      this.isLoggedIn = true
      this.userAvatar = userAvatar
      localStorage.setItem('userAvatar', userAvatar)
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userId',userId);
    },
    logout() {
      this.isLoggedIn = false
      this.userAvatar = null
      this.userId=-1
      localStorage.removeItem('userAvatar')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userId')
    },
    restore() {
      // 页面加载时从 localStorage 恢复状态
      const savedUserAvatar = localStorage.getItem('userAvatar')
      const savedIsLoggedIn = localStorage.getItem('isLoggedIn')
      const savedUserId=localStorage.getItem("userId")

      if (savedUserAvatar && savedIsLoggedIn === 'true') {
        this.userAvatar =savedUserAvatar
        this.isLoggedIn = true
        this.userId=savedUserId
      }
    }
  }
})
