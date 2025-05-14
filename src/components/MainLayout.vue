<template>
  <div class="login-popup-centered" v-if="showPopup">
    <LoginPopup @close="closeLoginPopup" @loginSuccess="handleLoginSuccess" :redirectPath="loginTargetPath">
    </LoginPopup>
  </div>

  <div class="bilibili-home">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="nav-container">

        <div class="logo-area">
          <img src="https://www.bilibili.com/favicon.ico" alt="Bilibili Logo" class="logo">
        </div>

        <nav class="main-nav">
          <a href="#" class="nav-item active">首页</a>
          <a href="#" class="nav-item">番剧</a>
          <a href="#" class="nav-item">直播</a>
          <a href="#" class="nav-item">游戏中心</a>
          <a href="#" class="nav-item">会员购</a>
          <a href="#" class="nav-item">漫画</a>
          <a href="#" class="nav-item">赛事</a>
          <a href="#" class="nav-item download-btn">
            下载客户端
            <span class="new-badge">NEW</span>
          </a>
        </nav>



        <div class="search-area">
          <input type="text" placeholder="搜索" class="search-input">
          <button class="search-btn">
            <svg viewBox="0 0 24 24" class="search-icon">
              <path
                d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>
        </div>

        <div class="user-area">

          <div v-if="userStore.isLoggedIn" class="user-avatar" @click="goToProfile">
            <img :src="userStore.userAvatar" style="width: 42px;">

          </div>

          <button v-else class="login-btn" ref="loginBtn" @click="showLoginPopup">
            登录
          </button>
        </div>

        <div class="upload" @click="toUpload">
          <img src="@/assets/上传.png" class="upload-icon" />
          <span class="upload-text">上传</span>
        </div>

        <div class="logout" @click="logout" v-if="userStore.isLoggedIn">
          <img src="@/assets/退出登录.png" class="logout-icon" />
          <span class="logout-text">退出登录</span>
        </div>
      </div>
    </header>
  </div>

  
  <!-- 二级导航 -->
  <!-- <div class="sub-nav">
    <div class="sub-nav-container">
      <a href="#" class="sub-nav-item">动态</a>
      <a href="#" class="sub-nav-item active">热门</a>
      <a href="#" class="sub-nav-item">电影</a>
      <a href="#" class="sub-nav-item">电视剧</a>
      <a href="#" class="sub-nav-item">纪录片</a>
      <a href="#" class="sub-nav-item">游戏</a>
      <a href="#" class="sub-nav-item">音乐</a>
      <a href="#" class="sub-nav-item">影视</a>
      <a href="#" class="sub-nav-item">知识</a>
      <a href="#" class="sub-nav-item">资讯</a>
      <a href="#" class="sub-nav-item">更多</a>
    </div>
  </div> -->


</template>

<script lang="ts" setup>

import { useUserStore } from '@/stores/user'
import { useRouter, onBeforeRouteLeave, useRoute } from 'vue-router'
import axios from '@/utils/axiosInstance'
import {ref} from 'vue'
import LoginPopup from './LoginPopup.vue'

const router = useRouter()
const userStore = useUserStore()
const showPopup = ref(false);
const loginTargetPath = ref('/home')

function showLoginPopup() {
  showPopup.value = true
    console.log("XXXXXXXXX")
}


function closeLoginPopup() {
  showPopup.value = false

}

async function logout() {

  const response = await axios.post('http://localhost:8888/api/user/logout')
  userStore.logout()
}


function handleLoginSuccess({ avatar, redirectPath, userId }) {
  userStore.login(avatar, userId)
  router.push({ path: redirectPath })
}

function toUpload() {
  // 检查用户是否已登录
  if (!userStore.isLoggedIn) {
    // 未登录，跳转到登录页面
    loginTargetPath.value = "/upload"
    showPopup.value = true
  } else {
    // 已登录，跳转到上传页面
    router.push({ path: '/upload' })
  }
}

function goToProfile() {
  router.push('/profile')
}

</script>



<style  scoped>

/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}


.bilibili-home {
  max-width: 100%;
  overflow-x: visible;
  margin-bottom: 45px;

}

/* 顶部导航栏样式 */
.header {
  position: fixed;

  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  top: 0;
  width: 100%;
  z-index: 100;
}


.nav-container {
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 56px;
}

.logo-area {
  margin-right: 30px;
}


.logo {
  height: 30px;
}


.main-nav {
  display: flex;
  flex-grow: 1;
}


.nav-item {
  padding: 0 12px;
  height: 56px;
  line-height: 56px;
  color: #222;
  text-decoration: none;
  font-size: 14px;
  position: relative;
  display: flex;
  align-items: center;
}

.nav-item.active {
  color: #00a1d6;
}

.nav-item.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 12px;
  right: 12px;
  height: 3px;
  background-color: #00a1d6;
}


.download-btn {
  position: relative;
}

.new-badge {
  position: absolute;
  top: 8px;
  right: -8px;
  background-color: #fb7299;
  color: white;
  font-size: 10px;
  padding: 0 4px;
  border-radius: 4px;
  line-height: 16px;
}

.search-area {
  display: flex;
}

.search-input {
  width: 200px;
  height: 32px;
  border: 1px solid #e7e7e7;
  border-radius: 4px 0 0 4px;
  padding: 0 12px;
  outline: none;
}

.search-input:focus {
  border-color: #00a1d6;
}

.search-btn {
  width: 40px;
  height: 32px;
  background-color: #f4f4f4;
  border: 1px solid #e7e7e7;
  border-left: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-icon {
  width: 16px;
  height: 16px;
  fill: #999;
}

.user-area {
  margin-left: 20px;
}

.login-btn {
  height: 32px;
  padding: 0 12px;
  background-color: rgb(3, 192, 254);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}


/* 上传按钮样式 */
.upload {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-icon {
  width: 40px;
  margin-right: 10px;
  /* 图标与文字之间的间距 */
  transition: transform 0.3s ease;
}

.upload-text {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.upload:hover .upload-icon {
  transform: scale(1.1);
  /* 悬停时图标放大 */
}

.upload:hover .upload-text {
  color: #007bff;
  /* 悬停时文字变色 */
}

/* 退出登录按钮样式 */
.logout {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-icon {
  width: 40px;
  margin-right: 10px;
  /* 图标与文字之间的间距 */
  transition: transform 0.3s ease;
}

.logout-text {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.logout:hover .logout-icon {
  transform: scale(1.1);
  /* 悬停时图标放大 */
}

.logout:hover .logout-text {
  color: #d9534f;
  /* 悬停时文字变色 */
}


/* 二级导航样式 */
.sub-nav {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 56px;
  z-index: 90;

}

.sub-nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  /* Firefox */
}

.sub-nav-container::-webkit-scrollbar {
  display: none;
  /* Chrome/Safari */
}

.sub-nav-item {
  padding: 0 16px;
  height: 40px;
  line-height: 40px;
  color: #505050;
  text-decoration: none;
  font-size: 14px;
  white-space: nowrap;
}

.sub-nav-item.active {
  color: #00a1d6;
}
.login-popup-centered {
  cursor: pointer;
  position: fixed;
  /* 固定定位，悬浮在视口上 */
  top: 50%;
  /* 垂直居中 */
  left: 50%;
  /* 水平居中 */
  transform: translate(-50%, -50%);
  /* 偏移调整以确保完全居中 */
  z-index: 1000;
  /* 确保在其他内容之上 */
  background: white;
  /* 背景色，防止透明 */
  padding: 10px;
  /* 内边距，美化 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* 添加阴影，增强悬浮感 */
  border-radius: 8px;
  /* 可选：圆角 */
  background-color: skyblue;
}

</style>