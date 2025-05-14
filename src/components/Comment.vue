<template>
    <div class="comment-section">

        <div class="comment-header">
            <span style="font-size: 30px; font-weight: bold; margin-right: 10px;">评论</span>
            <span style="font-size: 16px; color: gray; margin-right: 30px;">111</span>



            <div class="sort-style">
                <span class="sort-item" :class="{ 'active': hotOrNew === '最新' }" @click="hotOrNew = '最新'">最新</span>
                <span> |</span>
                <span class="sort-item" :class="{ 'active': hotOrNew === '最热' }" @click="hotOrNew = '最热'">最热</span>

            </div>
        </div>



        <div class="comment-input-area">
            <div class="user-avatar">
                <img   v-if="userStore.userAvatar"  :src="userStore.userAvatar" alt="用户头像">
            </div>

            <div class="input-wrapper">
                <input type="text" v-model="commentContent" placeholder="发个友善的评论吧~" @keyup.enter="submitComment">
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


</template>


<script lang="ts" setup>

import { ref, onMounted, onBeforeUnmount,watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import axios from '@/utils/axiosInstance'



const userStore = useUserStore()
const defaultAvatar = ref('src/assets/default.png')


const hotOrNew = ref('最新')


// 评论相关

interface CommentInfo {
    id: number
    userId: number
    userName: string
    userAvatar: string
    content: string
    time: string
    likeCount: number
}

const commentContent = ref('')   //当前登录用户在评论框输入的内容
const comments = ref<CommentInfo[]>([])  //评论列表
const commentPage = ref(1)  //当前页码
const commentPageSize = ref(10)  //分页大小
const commentLoading = ref(false)  //是否正在加载中
const commentFinished = ref(false) //是否已经加载完全部评论
const commentListRef = ref<HTMLElement | null>(null)



const props = defineProps(['videoId'])


// 提交评论
const submitComment = async () => {
    if (!commentContent.value.trim()) return

    try {
        const response = await axios.post('http://localhost:8888/api/video/comment/submit', {
            videoId: props.videoId,
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
    } catch (error) {
        console.error('提交评论失败:', error)
    }
}


// 获取评论
async function fetchComments() {
    if (commentLoading.value || commentFinished.value) return
    commentLoading.value = true

    try {
        const response = await axios.get('http://localhost:8888/api/video/comment/page', {
            params: {
                videoId: props.videoId,
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



onMounted(async ()=>{
    "XXXXXXXXXXXXXXXXXXXXX"
    userStore.restore()
    await fetchComments()
    commentListRef.value?.addEventListener('scroll', handleCommentScroll)
})

</script>


<style scoped>
.comment-header {
    display: flex;
    line-height: 60px;
    /* 设置行高，需根据内容高度调整 */
    border-top: 1px solid gainsboro;
}

.comment-header span {
    vertical-align: middle;
    /* 垂直居中 */
    display: inline-block;
    /* 确保 span 能应用 vertical-align */
}


.sort-style {
    display: flex;
    gap: 8px;

}

.sort-item {
    font-size: 16px;
    color: gray;
}

.sort-item:hover {
    color: skyblue;
    cursor: pointer;
}

.sort-item.active {
    color: black;
    font-weight: bold;
    /* 可选：选中时加粗 */
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
    margin-top: 20px;
    margin-bottom: 20px;
}


.user-avatar {
    width: 40px;
    height: 40px;
    margin-right: 12px;
}

.user-avatar img{
    height: 100%;
    width: 100%;
}

.input-wrapper {
    flex: 0.9;
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
</style>