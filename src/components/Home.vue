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
  <div class="sub-nav">
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
  </div>

  <!-- 主要内容区域 -->
  <main class="main-content">
    <div class="video-list">
      <VideoCard v-for="video in videos" :id="video.videoId" :key="video.videoId" :cover="video.videoCover"
        :views="formatNumber(video.viewCount)" :likes="formatNumber(video.commentCount)"
        :duration="formatDuration(video.videoDuration)" :title="video.title" :author="video.author"
        :upload-time="formatDate(video.publishDate)" @click="goToDetail(video.videoId)" />
    </div>
  </main>


</template>

<script lang="ts" setup>
import VideoCard from '@/components/VideoCard.vue'
import { onMounted, ref, onBeforeUnmount, onUnmounted, watch } from 'vue'
import LoginPopup from '@/components/LoginPopup.vue'
import { useRouter, onBeforeRouteLeave, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import axios from '@/utils/axiosInstance'
import { nextTick } from 'vue'


interface Video {
  videoId: number;
  videoCover: string;
  viewCount: number;
  commentCount: number;
  videoDuration: number;
  author: string;
  publishDate: string; // ISO格式字符串，例如"2024-05-01T14:22:00"
  title: string
}


const videos = ref<Video[]>([]);


const userStore = useUserStore()


const loginTargetPath = ref('/home')


const showPopup = ref(false);


// 登录表单的模型
const phone = ref('');
const code = ref('');

const router = useRouter()
const route = useRoute()

let page = ref(1)
const pageSize = 8

const loading = ref(false); //防止重复请求
const finished = ref(false); // 是否加载完所有数据


function goToDetail(id: number) {
  router.push(`/video/${id}`);
}


function goToProfile() {
  router.push('/profile')
}


//请求首页视频
async function fetchVideos() {

  if (loading.value || finished.value) return;
  loading.value = true;


  try {
    const response = await axios.get("http://localhost:8888/api/video/recommend", {
      params: {
        page: page.value,
        pageSize: pageSize
      }
    });

    const data = response.data.data;

    //如果返回的数据数量小于分页大小,表明没有更多的查询结果了
    if (data.length < pageSize) {
      finished.value = true;
    }

    videos.value.push(...data)

    page.value += 1

  } catch (error) {
    console.log("获取视频失败:", error);
  } finally {
    loading.value = false;
  }
}

// 检查是否需要继续加载（页面高度不足）
async function checkNeedLoadMore() {
  // 等待 DOM 更新完成（确保 scrollHeight 是最新的）
  await nextTick()

  if (
    document.documentElement.scrollHeight <= window.innerHeight &&
    !finished.value
  ) {
    await fetchVideos()
    await checkNeedLoadMore()
  }
}


onMounted(async () => {
  console.log("组件被创建")
  userStore.restore() // 尝试从 localStorage 恢复状态
  await fetchVideos();
  await checkNeedLoadMore();
  // restoreScrollPosition() // ✅ 恢复滚动位置
  window.addEventListener('scroll', handleScroll); // 注册滚动监听
})


watch(
  () => route.path,
  (newPath, oldPath) => {
    if (oldPath === '/profile') {
      userStore.userAvatar = localStorage.getItem('userAvatar')
    }
  }
)


onUnmounted(() => {

})

function handleScroll() {
  const scrollY = window.scrollY; // 当前滚动高度
  const visibleHeight = window.innerHeight; // 视口高度
  const pageHeight = document.documentElement.scrollHeight; // 页面总高度

  if (scrollY + visibleHeight >= pageHeight - 100 && !loading.value && !finished.value) {
    fetchVideos();
  }
}


onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll); // 页面卸载时移除监听
});



function showLoginPopup() {
  showPopup.value = true

}

function closeLoginPopup() {
  showPopup.value = false

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


async function logout() {

  const response = await axios.post('http://localhost:8888/api/user/logout')
  userStore.logout()
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "今天";
  if (diff === 1) return "昨天";
  if (diff < 7) return `${diff}天前`;
  return date.toLocaleDateString();
}

function formatNumber(num: number): string {
  if (num >= 1e8) return (num / 1e8).toFixed(1) + '亿';
  if (num >= 1e4) return (num / 1e4).toFixed(1) + '万';
  return num.toString();
}



</script>

<style scoped>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}

body {
  background-color: #f4f4f4;
  /* margin: 0;
  padding: 0; */
}

.bilibili-home {
  max-width: 100%;
  overflow-x: visible;

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

/* 主要内容区域 */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 24px;
  min-height: 100%;
}

.video-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 20px;
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