<template>

  <MainLayout></MainLayout>

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
import { useRouter, onBeforeRouteLeave, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import axios from '@/utils/axiosInstance'
import { nextTick } from 'vue'
import MainLayout from './MainLayout.vue'

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




const showPopup = ref(false);




const router = useRouter()
const route = useRoute()

let page = ref(1)
const pageSize = 8

const loading = ref(false); //防止重复请求
const finished = ref(false); // 是否加载完所有数据


function goToDetail(id: number) {
  router.push(`/video/${id}`);
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




function closeLoginPopup() {
  showPopup.value = false

}


function handleLoginSuccess({ avatar, redirectPath, userId }) {
  userStore.login(avatar, userId)
  router.push({ path: redirectPath })
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


</style>