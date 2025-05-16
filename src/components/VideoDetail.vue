<template>

    <MainLayout></MainLayout>


    <div class="video-detail-container">

        <!--视频详情页左侧区域-->
        <div class="video-detail-left">
            <!-- 视频简介 -->
            <div class="video-info">
                <!--视频标题-->
                <h1 class="video-title">{{ videoInfo.title }}</h1>
                <div class="publish-info">
                    <span>发布时间: {{ formatDate(videoInfo.publishTime) }}</span>
                    <span>播放量: {{ formatNumber(videoInfo.viewCount) }}</span>
                    <span>评论数：{{ formatNumber(videoInfo.commentCount) }}</span>
                </div>
            </div> 



            <!--视频播放区域-->
            <div class="video-player-section">
                <div class="video-player-wrapper">
                    <!-- 使用DPlayer作为视频播放器 -->
                    <div id="dplayer" ref="dplayerRef"></div>
                </div>

                <div class="video-actions">
                    <button class="action-btn" :class="{
                        'liked-in': isLike,
                        'not-liked-in': !isLike
                    }" @click="handleLike">
                        <img class='like-btn' src="@/assets/点赞.png">
                        <span>{{ formatNumber(videoInfo.likeCount) }}</span>
                    </button>

                    <button class="action-btn" :class="{
                        'collect-in': isCollect,
                        'not-collect-in': !isCollect
                    }" @click="handleCollect">
                        <img class='collect-btn' src="@/assets/收藏.png">
                        <span>{{ formatNumber(videoInfo.collectCount) }}</span>
                    </button>

                    <button class="action-btn" @click="handleShare">
                        <img class='share-btn' src="@/assets/分享.png">
                        <span>分享</span>
                    </button>
                </div>
            </div>


            <!--视频标签展示区-->
            <div class="video-tags-container">
                <div class="video-tags">
                    <span v-for="(tag, index) in videoInfo.tags" :key="index" class="video-tag"
                        :class="{ active: activeTag === index }" @click="activeTag = index">
                        {{ tag }}
                    </span>
                </div>
            </div>


            <!--视频评论区-->
            <Comment v-if="videoInfo?.id" :videoId="videoInfo.id"></Comment>

        </div>


        <div class="video-detail-right">
            <!-- UP主信息 -->
            <div class="up-info">

                <div class="up-info-left">
                    <img class="up-avatar" :src="upInfo.avatar" alt="UP主头像">
                </div>

                <div class="up-info-right">

                    <div class="nameAndSend">
                        <div class="up-name">{{ upInfo.name }}</div>
                        <el-button type="link" class="custom-message-btn">
                            <el-icon>
                                <Message />
                            </el-icon>
                            <span style="margin-left: 6px;">发送消息</span>
                        </el-button>
                    </div>

                    <button :class="{
                        'followed-in': upInfo.isFollowed,
                        'not-followed-in': !upInfo.isFollowed
                    }" class="follow-btn" @click="handleFollow">
                        {{ upInfo.isFollowed ? '已关注' : '+ 关注' }}
                    </button>
                </div>
            </div>

            <!--推荐视频列表-->
            <!-- <VideoDetailPageRecommendCard v-for="video in recommendVideos"
            :key="video.id"
            :title="video.title"
            :author="video.author"
            :views="video.views"
            :comments="video.comments"
            :cover="video.cover"
            :id="video.id"
            ></VideoDetailPageRecommendCard> -->

        </div>
    </div>
</template>


<script lang="ts" setup>

import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DPlayer from 'dplayer'
import { useUserStore } from '@/stores/user'
import axios from '@/utils/axiosInstance'
import MainLayout from './MainLayout.vue'
import Comment from './Comment.vue'
import { ElMessage } from 'element-plus'
import VideoDetailPageRecommendCard from './VideoDetailPageRecommendCard.vue'


const route = useRoute()
const router = useRouter()
const userStore = useUserStore()


const videoId = ref(Number(route.params.id));

// 默认头像,用于在用户未登录时显示一个默认头像
const defaultAvatar = ref('src/assets/default.png')

// 视频播放器实例
const dplayerRef = ref<InstanceType<typeof DPlayer> | null>(null)

//是否点赞
const isLike = ref<boolean | null>(null)

//是否收藏
const isCollect = ref<boolean | null>(null)


// 视频信息
const videoInfo = ref({
    id: 0,
    title: '',
    videoUrl: '',
    cover: '',
    viewCount: 0,
    likeCount: 0,
    collectCount: 0,
    commentCount: 0,
    publishTime: '',
    description: '',
    upId: 0,
    tags: []
})


//up主信息
const upInfo = ref({
    id: 0,
    name: '',
    avatar: '',
    fans: 0,
    isFollowed: null as boolean | null
})



interface VideoItem {
  id: number;
  title: string;
  author: string;
  views: number;
  comments: number;
  duration: string;
  cover: string;
  uploadTime: string;
}

const activeTag = ref(0);


// 推荐视频
const recommendVideos = ref<VideoItem[]>([])


// 初始化播放器
const initPlayer = () => {

    dplayerRef.value = new DPlayer({  // 创建DPlayer实例
        container: document.getElementById('dplayer'),  // 绑定DOM容器
        screenshot: true,
        video: {
            url: videoInfo.value.videoUrl,   // 视频地址
        }
    })

}



// 获取视频详情
async function fetchVideoDetail() {
    try {
        const response = await axios.get("http://localhost:8888/api/video/videoDetail", {
            params: {
                videoId: videoId.value
            }
        });

        const data = response.data.data

        // 将后端数据赋值给videoInfo
        videoInfo.value = {
            id: data.id || 0,
            title: data.title || '',
            videoUrl: data.videoUrl || '',
            cover: data.cover || '',
            viewCount: data.viewCount || 0,
            likeCount: data.likeCount || 0,
            collectCount: data.collectCount || 0,
            commentCount: data.commentCount || 0,
            publishTime: data.publishTime || '',
            description: data.description || '',
            upId: data.upId || 0,
            tags: data.tags || []
        };

        isLike.value = data.liked
        isCollect.value = data.collect

    } catch (error) {
        console.log(error);
    }

}


async function getUpInfo() {
    try {
        const response = await axios.get("http://localhost:8888/api/user/up/info", {
            params: {
                upId: videoInfo.value.upId
            }
        });

        const data = response.data.data

        upInfo.value = {
            id: data.upId || 0,
            name: data.name || '',
            avatar: data.avatar || '',
            fans: data.fans || 0,
            isFollowed: data.followed
        }

    } catch (error) {
        console.log(error);
    }
}



// 获取推荐视频
const fetchRecommendVideos = async () => {
    try {
        const response = await axios.get('http://localhost:8888/api/video/recommendList', {
            params: {
                page:0,
                pageSize:20
            }
        })
        recommendVideos.value.push(...response.data.data)

    } catch (error) {
        console.error('获取推荐视频失败:', error)
    }

}


// 点赞视频
async function handleLike() {

    if (userStore.isLoggedIn === false) {
        // 用户还未登录，提示用户登录
        ElMessage.warning("未登录，请先登录后再进行操作");
        return;

    }


    const response = await axios.post('http://localhost:8888/api/video/islike', null, {
        params: {
            videoId: videoInfo.value.id,
            userId: userStore.userId,
            isLike: isLike.value
        }
    })

    isLike.value = !isLike.value

    videoInfo.value.likeCount = response.data.data


}



// 收藏
async function handleCollect() {

    if (userStore.isLoggedIn === false) {
        // 用户还未登录，提示用户登录
        ElMessage.warning("未登录，请先登录后再进行操作");
        return;

    }

    const response = await axios.post('http://localhost:8888/api/user/collect', null, {
        params: {
            videoId: videoInfo.value.id,
            userId: userStore.userId,
            isCollect: isCollect.value
        }
    })


    isCollect.value = !isCollect.value

    videoInfo.value.collectCount = response.data.data


}

// 分享
const handleShare = () => {
    console.log('分享视频')
}

// 关注UP主
async function handleFollow() {
    if (userStore.isLoggedIn === false) {
        // 用户还未登录，提示用户登录
        ElMessage.warning("未登录，请先登录后再进行操作");
        return;

    }

    //用户已登录
    const response = await axios.post('http://localhost:8888/api/user/follow',
        null,
        {
            params: {
                userId: userStore.userId,
                upId: upInfo.value.id,
                isFollowed: upInfo.value.isFollowed
            }
        })

    upInfo.value.isFollowed = !upInfo.value.isFollowed

}


// 跳转到视频详情
const goToDetail = (id: number) => {
    router.push(`/video/${id}`)
}

// 格式化数字
const formatNumber = (num: number): string => {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万'
    }
    return num.toString()
}

// 格式化日期
const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diff === 0) return '今天'
    if (diff === 1) return '昨天'
    if (diff < 7) return `${diff}天前`

    return date.toLocaleDateString()
}

// 格式化视频时长
const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

onMounted(async () => {
    userStore.restore()
    await fetchVideoDetail()
    await getUpInfo()
    initPlayer()
    await fetchRecommendVideos()
})



</script>

<style scoped>


* {
    box-sizing: border-box;
}

.video-detail-container {
    display: flex;
    margin-top: 50px;
    padding: 20px;
    background-color: #fff;

}


.video-detail-left {
    display: flex;
    flex-direction: column;
    width: 75%;
    
}

.video-detail-right {
    width: 25%;
    padding-left: 10px;
}


.video-player-section {
    margin-bottom: 20px;
}

.video-player-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;
    /* 首选现代方式 */
    overflow: hidden;
    background-color: #000;
    border-radius: 4px;
}


#dplayer {
    width: 100%;
    height: 100%;
}

/* 让视频填满播放器 */
.dplayer-video {
    object-fit: cover;
    /* 视频会填满容器，可能会裁剪边缘 */
    /* 或者使用 `contain` 保持完整比例，但可能有黑边 */
}

.video-title {
    font-size: 22px;
    font-weight: 500;
    margin: 0;
    color: #212121;
    flex: 3.2;
}

.video-actions {
    display: flex;
    flex: 1;
    margin-top: 15px;
    gap: 20px;
}

.action-btn {
    width: 80px;
    height: 28px;
    display: flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 4px;
    background-color: gainsboro;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: #505050;
    margin-right: 20px;
}


.like-btn {
    width: 20px;
    margin-right: 15px;

}


.player-num {
    width: 20px;
    margin-right: 15px;
}

.collect-btn {
    width: 20px;
    margin-right: 15px;
}

.share-btn {
    width: 20px;
    margin-right: 8px;
}

.action-btn i {
    margin-right: 5px;
}

.video-content-section {
    display: flex;
    gap: 20px;
}


.up-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

}

.up-info-left {
    margin-right: 10px;
}

.up-info-right {
    display: flex;
    flex-direction: column;
    width: 100%;


}

.nameAndSend {
    margin-left: 10px;
    display: flex;
    align-items: center;
}


.up-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;


}

.up-avatar img {
    width: 100%;
    height: 100%;

}


.up-name {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 4px;
    margin-right: 5px;
}

.up-fans {
    font-size: 12px;
    color: #999;
}

.follow-btn {
    padding: 6px 16px;
    background-color: #fb7299;
    color: white;
    width: 100%;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;

}

.follow-btn:hover {
    background-color: #ff85ad;
}

.video-description {
    background-color: #f4f4f4;
    padding: 15px;
    border-radius: 4px;
    margin-bottom: 20px;
    white-space: pre-line;
}

.publish-info {
    display: flex;
    gap: 15px;
    margin-bottom: 10px;
    font-size: 12px;
    color: #999;
}

.description-text {
    line-height: 1.6;
}


.video-duration {
    position: absolute;
    right: 5px;
    bottom: 5px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    font-size: 12px;
    padding: 2px 5px;
    border-radius: 2px;
}



.follow-btn {
    padding: 8px 16px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
    border: 1px solid transparent;
    cursor: pointer;
    outline: none;
}

/* 未关注样式：蓝色按钮 */
.not-followed-in {
    background-color: #66b1ff;
    color: white;
    border-color: #66b1ff;
}

.not-followed-in:hover {
    background-color: skyblue;
    border-color: skyblue;
}

/* 已关注样式：灰色按钮 */
.followed-in {
    background-color: #e0e0e0;
    color: #606266;
    border-color: #dcdcdc;
}

.followed-in:hover {
    background-color: #cfcfcf;
    border-color: #cfcfcf;
}


.not-liked-in {
    background-color: #e0e0e0;
    color: #606266;
    border-color: #dcdcdc;
}


.liked-in {
    background-color: skyblue;
    border-color: skyblue;
}


.not-collect-in {
    background-color: #e0e0e0;
    color: #606266;
    border-color: #dcdcdc;
}


.collect-in {
    background-color: skyblue;
    border-color: skyblue;
}


.video-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 20px;
    border-radius: 15px;
}

.video-tag {
    display: inline-block;
    padding: 6px 12px;
    background-color: #f0f0f0;
    border-radius: 15px;
    color: #666;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.video-tag:hover {
    background-color: #e0e0e0;
}

.video-tag.active {
    background-color: #409eff;
    color: white;
}



.video-tags-container {
    /* padding: 12px 16px; */
    margin-bottom: 16px;
    border-top: 1px solid gainsboro;
}

.video-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.video-tag {
    display: inline-block;
    padding: 6px 12px;
    background-color: #f0f0f0;
    border-radius: 15px;
    color: #666;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.video-tag:hover {
    background-color: #e0e0e0;
}

.video-tag.active {
    background-color: #409eff;
    color: white;
}

.custom-message-btn {
    border: none !important;
    background: transparent !important;
    color: #409EFF !important;
    padding: 8px 12px;
    transition: all 0.3s;
}

.custom-message-btn:hover {
    background: rgba(64, 158, 255, 0.1) !important;
    transform: translateY(-1px);
}


.recommend-container {
  width: 300px;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.recommend-title {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.recommend-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 为视频卡片添加悬停效果 */
.video-card {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.video-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>