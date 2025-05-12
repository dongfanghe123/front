<template>
    <div class="video-detail-container">
        <!-- 视频播放器区域 -->
        <div class="video-player-section">
            <div class="video-player-wrapper">
                <!-- 使用DPlayer作为视频播放器 -->
                <div id="dplayer" ref="dplayerRef"></div>
            </div>

            <!-- 视频标题和操作区 -->
            <div class="video-info-header">
                <h1 class="video-title">{{ videoInfo.title }}</h1>


                <div class="action-btn">
                    <img class="player-num"  src="@/assets/播放数.png">
                    <span>{{ videoInfo.viewCount }}</span>
                </div>


                <div class="video-actions">

                    <button class="action-btn" 
                    :class="{
                        'liked-in':isLike,
                        'not-liked-in':!isLike
                    }"
                    @click="handleLike">
                        <img class='like-btn' 
                        src="@/assets/点赞.png">
                        <span>{{ formatNumber(videoInfo.likeCount) }}</span>
                    </button>

                    <button class="action-btn"
                    
                    :class="{
                        'collect-in':isCollect,
                        'not-collect-in':!isCollect
                    }"
                    @click="handleCollect">
                        <img class='collect-btn' src="@/assets/收藏.png">
                        <span>{{ formatNumber(videoInfo.collectCount) }}</span>
                    </button>

                    <button class="action-btn" @click="handleShare">
                        <img class='share-btn' src="@/assets/分享.png">
                        <span>分享</span>
                    </button>


                </div>


            </div>
        </div>

        <!-- 视频信息区域 -->
        <div class="video-content-section">
            <div class="video-main-content">
                <!-- UP主信息 -->
                <div class="up-info">
                    <div class="up-avatar">
                        <img :src="upInfo.avatar" alt="UP主头像">
                    </div>
                    <div class="up-detail">
                        <div class="up-name">{{ upInfo.name }}</div>
                        <div class="up-fans">粉丝: {{ formatNumber(upInfo.fans) }}</div>
                    </div>


                    <button :class="{
                        'followed-in': upInfo.isFollowed,
                        'not-followed-in': !upInfo.isFollowed
                    }"
                      class="follow-btn"
                       @click="handleFollow">
                        {{ upInfo.isFollowed ? '已关注' : '+ 关注' }}
                    </button>



                </div>

                <!-- 视频简介 -->
                <div class="video-description">
                    <div class="publish-info">
                        <span>发布时间: {{ formatDate(videoInfo.publishTime) }}</span>
                        <span>播放量: {{ formatNumber(videoInfo.viewCount) }}</span>
                    </div>
                    <div class="description-text">
                        {{ videoInfo.description }}
                    </div>
                </div>

                <!-- 评论区 -->
                <div class="comment-section">

                    <h3 class="comment-title">
                        评论 <span class="comment-count">{{ videoInfo.commentCount }}</span>
                    </h3>

                    <div class="comment-input-area">

                        <div class="user-avatar">
                            <img :src="userStore.userAvatar || defaultAvatar" alt="用户头像">
                        </div>

                        <div class="input-wrapper">
                            <input type="text" v-model="commentContent" placeholder="发个友善的评论吧~"
                                @keyup.enter="submitComment">
                            <button class="submit-btn" @click="submitComment">发布</button>
                        </div>

                    </div>

                    <div class="comment-list" ref="commentListRef">
                        <div class="comment-item" v-for="comment in comments" :key="comment.id">
                            <div class="comment-avatar">
                                <img :src="comment.userAvatar" alt="用户头像">
                            </div>
                            <div class="comment-content">
                                <div class="comment-user">{{ comment.userName }}</div>
                                <div class="comment-text">{{ comment.content }}</div>
                                <div class="comment-meta">
                                    <span>{{ formatDate(comment.time) }}</span>
                                    <span class="like-count">
                                        <i class="iconfont icon-dianzan"></i>
                                        {{ comment.likeCount }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- 右侧推荐视频列表 -->
            <div class="recommend-section">
                <h3 class="recommend-title">相关推荐</h3>
                <div class="recommend-list">
                    <div class="recommend-item" v-for="video in recommendVideos" :key="video.id"
                        @click="goToDetail(video.id)">
                        <div class="recommend-cover">
                            <img :src="video.cover" alt="视频封面">
                            <div class="video-duration">{{ formatDuration(video.duration) }}</div>
                        </div>
                        <div class="recommend-info">
                            <div class="recommend-title">{{ video.title }}</div>
                            <div class="recommend-up">{{ video.upName }}</div>
                            <div class="recommend-stats">
                                <span>{{ formatNumber(video.viewCount) }}观看</span>
                                <span>{{ formatNumber(video.danmakuCount) }}弹幕</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DPlayer from 'dplayer'
import { useUserStore } from '@/stores/user'
import axios from '@/utils/axiosInstance'
import { ca } from 'element-plus/es/locale'
import { ElMessage } from 'element-plus'


const route = useRoute()
const router = useRouter()
const userStore = useUserStore()


const videoId = ref(Number(route.params.id));

// 默认头像,用于在用户未登录时显示一个默认头像
const defaultAvatar = ref('src/assets/default.png')

// 视频播放器实例
const dplayerRef = ref<DPlayer | null>(null)

//是否点赞
const isLike=ref<boolean | null>(null)

//是否收藏
const isCollect=ref<boolean | null>(null)


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
})


//up主信息
const upInfo = ref({
    id: 0,
    name: '',
    avatar: '',
    fans: 0,
    isFollowed: null as boolean | null
})


interface CommentInfo {
    id: number
    userId: number
    userName: string
    userAvatar: string
    content: string
    time: string
    likeCount: number
}

// 评论相关
const commentContent = ref('')   //当前登录用户在评论框输入的内容
const comments = ref<CommentInfo[]>([])  //评论列表
const commentPage = ref(1)  //当前页码
const commentPageSize = ref(10)  //分页大小
const commentLoading = ref(false)  //是否正在加载中
const commentFinished = ref(false) //是否已经加载完全部评论
const commentListRef = ref<HTMLElement | null>(null)

// 获取评论
async function fetchComments() {
    if (commentLoading.value || commentFinished.value) return
    commentLoading.value = true

    try {
        const response = await axios.get('http://localhost:8888/api/video/comment/page', {
            params: {
                videoId: videoInfo.value.id,
                page: commentPage.value,
                pageSize: commentPageSize.value
            }
        })

        const data = response.data.data || []

        if (data.length < commentPageSize.value) {
            commentFinished.value = true
        }

        comments.value.push(...data)
        commentPage.value += 1


    } catch (error) {
        console.log('加载评论失败:', error)
    } finally {
        commentLoading.value = false

    }

}


function handleCommentScroll() {
    const el = commentListRef.value
    if (!el || commentLoading.value || commentFinished.value) return

    const scrollTop = el.scrollTop         // 已滚动距离
    const clientHeight = el.clientHeight   // 可视高度
    const scrollHeight = el.scrollHeight   // 内容总高度

    // 如果滚动到底部 100px 以内
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        fetchComments()
    }
}




// 提交评论
const submitComment = async () => {
    if (!commentContent.value.trim()) return

    try {
        const response = await axios.post('http://localhost:8888/api/video/comment/submit', {
            videoId: videoInfo.value.id,
            content: commentContent.value
        })


        //在评论成功提交后，立即将新评论插入到前端页面的评论列表最前面，实现“即时显示”的用户体验。
        comments.value.unshift({
            id: response.data.id,
            userId: userStore.userId,
            userName: userStore.userName,
            userAvatar: userStore.userAvatar || defaultAvatar.value,
            content: commentContent.value,
            time: new Date().toISOString(),
            likeCount: 0
        })

        commentContent.value = ''
        videoInfo.value.commentCount++
    } catch (error) {
        console.error('提交评论失败:', error)
    }
}



// 推荐视频
const recommendVideos = ref<any[]>([])


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
        };
        isLike.value=data.liked
        isCollect.value=data.collect

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
        const response = await axios.get('/api/video/recommend', {
            params: {
                videoId: route.params.id,
                limit: 5
            }
        })
        recommendVideos.value = response.data
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


    const response=await axios.post('http://localhost:8888/api/video/islike',null,{
        params:{
            videoId:videoInfo.value.id,
            userId:userStore.userId,
            isLike:isLike.value
        }
    })

    isLike.value=!isLike.value

    videoInfo.value.likeCount=response.data.data


}



// 收藏
async function handleCollect () {

    if (userStore.isLoggedIn === false) {
        // 用户还未登录，提示用户登录
        ElMessage.warning("未登录，请先登录后再进行操作");
        return;

    }

    const response=await axios.post('http://localhost:8888/api/user/collect',null,{
        params:{
            videoId:videoInfo.value.id,
            userId:userStore.userId,
            isCollect:isCollect.value
        }
    })


    isCollect.value=!isCollect.value

    videoInfo.value.collectCount=response.data.data


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
    await fetchComments()
    initPlayer()

    commentListRef.value?.addEventListener('scroll', handleCommentScroll)

})



</script>

<style scoped>
.video-detail-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
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

.video-info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
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
    gap: 10px;
    flex: 1;
    justify-content: space-between;
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

.video-main-content {
    flex: 1;
}

.up-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.up-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;
}

.up-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.up-detail {
    flex: 1;
}

.up-name {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 4px;
}

.up-fans {
    font-size: 12px;
    color: #999;
}

.follow-btn {
    padding: 6px 16px;
    background-color: #fb7299;
    color: white;
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

.comment-section {
    margin-top: 30px;
}

.comment-title {
    font-size: 18px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
}

.comment-count {
    margin-left: 8px;
    font-size: 14px;
    color: #999;
}

.comment-input-area {
    display: flex;
    margin-bottom: 20px;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;
}

.user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.input-wrapper {
    flex: 1;
    position: relative;
}

.input-wrapper input {
    width: 100%;
    padding: 10px 15px;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    outline: none;
}

.input-wrapper input:focus {
    border-color: #00a1d6;
}

.submit-btn {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background-color: #00a1d6;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 10px;
    cursor: pointer;
}

.comment-list {
    border-top: 1px solid #e5e5e5;
    padding-top: 15px;
}

.comment-item {
    display: flex;
    margin-bottom: 20px;
}

.comment-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;
}

.comment-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.comment-content {
    flex: 1;
}

.comment-user {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 5px;
}

.comment-text {
    line-height: 1.5;
    margin-bottom: 5px;
}

.comment-meta {
    font-size: 12px;
    color: #999;
    display: flex;
    gap: 15px;
}

.like-count {
    display: flex;
    align-items: center;
}

.like-count i {
    margin-right: 3px;
}

.recommend-section {
    width: 300px;
}

.recommend-title {
    font-size: 16px;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e5e5e5;
}

.recommend-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.recommend-item {
    display: flex;
    gap: 10px;
    cursor: pointer;
}

.recommend-cover {
    position: relative;
    width: 120px;
    height: 75px;
    border-radius: 4px;
    overflow: hidden;
    flex-shrink: 0;
}

.recommend-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

.recommend-info {
    flex: 1;
}

.recommend-title {
    font-size: 14px;
    margin-bottom: 5px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
}

.recommend-up {
    font-size: 12px;
    color: #999;
    margin-bottom: 5px;
}

.recommend-stats {
    font-size: 12px;
    color: #999;
    display: flex;
    gap: 10px;
}


.follow-btn {
  padding: 8px 16px;
  border-radius: 20px;
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

</style>