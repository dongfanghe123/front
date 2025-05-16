<template>
    <header class="creation-header">
        <div class="header-container">
            <!-- 主标题 -->
            <h1 class="header-title">
                <span class="bilibili-icon">📺</span>
                <span>bilibili 创作中心</span>
            </h1>

            <!-- 可选导航菜单 -->
            <nav class="header-nav">
                <router-link to="/creation/home" class="nav-item active">首页</router-link>
                <router-link to="/creation/data" class="nav-item">数据</router-link>
                <router-link to="/creation/fans" class="nav-item">粉丝</router-link>
            </nav>

            <!-- 用户区域 -->
            <div class="user-area">
                <div class="user-avatar">
                    <img src="@/assets/bilibili.png">
                </div>
            </div>
        </div>
    </header>



    <div class="content">


        <!---------------------------------------------------------------------------------------->
        <div class="left-sidebar">

            <div class="sidebar-title">
                <img src="@/assets/投稿.png" class="sidebar-icon">
                <span class="sidebar-text">投稿</span>
            </div>

            <ul class="nav-menu">
                <li v-for="item in navItems" :key="item.id" :class="{ 'active': item.checked }">
                    <img :src="item.icons" :key="item.id" class="nav-menu-img">
                    <a :href="`#${item.id}`" @click="toggleItem(item.id)" class="nav-link">
                        <span class="nav-text">{{ item.text }}</span>
                    </a>
                </li>
            </ul>
        </div>


        <!---------------------------------------------------------------------------------------->

        <div class="right-content">
            <!-- 顶部导航 -->
            <div class="upload-nav">
                <div v-for="tab in tabs" :key="tab" class="nav-item" :class="{ active: activeTab === tab }"
                    @click="activeTab = tab">
                    {{ tab }}
                </div>
            </div>

            <!-- 上传区域 -->
            <div class="upload-area">
                <div class="drag-drop-area">
                    <div class="drag-drop-content">
                        <div class="upload-icon">↑</div>
                        <p>拖拽到此处也可上传</p>

                        <!-- 隐藏的文件选择器 -->
                        <input ref="videoInput" type="file" accept="video/*" @change="handleVideoUpload"
                            style="display: none" />

                        <button class="upload-btn" @click="triggerFileSelect">上传视频</button>
                    </div>
                </div>

                <div class="queue-info">
                    <span>当前审核队列 <span class="queue-status">快速</span></span>
                </div>
            </div>

            <!-- 快捷方式区域 -->
            <div class="quick-section">
                <h3>bilibili投稿快捷方式</h3>
                <p>保存bilibili投稿入口到桌面，界面更简单，加载更快捷</p>
            </div>

            <!-- 必剪桌面端 -->
            <div class="quick-section">
                <h3>必剪桌面端</h3>
                <p>一键字幕，海量素材，全能剪辑，支持一键投稿</p>
            </div>

            <!-- 视频要求 -->
            <div class="requirements">
                <h3>视频要求</h3>
                <div class="requirement-grid">
                    <div class="requirement-item">
                        <h4>禁止发布的视频内容</h4>
                        <p>色情、暴力、违法内容等</p>
                    </div>
                    <div class="requirement-item">
                        <h4>视频大小</h4>
                        <p>不超过8GB</p>
                    </div>
                    <div class="requirement-item">
                        <h4>视频格式</h4>
                        <p>MP4, AVI, MOV等</p>
                    </div>
                    <div class="requirement-item">
                        <h4>视频码率</h4>
                        <p>建议2000-6000kbps</p>
                    </div>
                </div>
            </div>

            <!-- 协议声明 -->
            <div class="agreement">
                <p>上传视频，即表示您已同意 <a href="#">单哩单哩使用协议</a> 与 <a href="#">单哩单哩社区公约</a>，请勿上传色情、反动违法视频。</p>
            </div>

            <!-- 第三方工具 -->
            <div class="tools-section">
                <h3>第三方工具</h3>
                <div class="tools-grid">
                    <div class="tool-item">
                        <h4>小丸压制工具原版</h4>
                        <button class="tool-btn">立即安装</button>
                    </div>
                    <div class="tool-item">
                        <h4>小丸压制工具bilibili定制版</h4>
                        <button class="tool-btn">立即下载</button>
                    </div>
                </div>
            </div>
        </div>

    </div>






</template>

<script setup>
// 这里可以添加交互逻辑

import axios from '@/utils/axiosInstance'
import {useRouter} from 'vue-router'

import { ref } from 'vue';


const router=useRouter()



const navItems = ref([
    { id: 1, text: '首页', icons: 'src/assets/icons/首页.png', checked: false },
    { id: 2, text: '内容管理', icons: 'src/assets/icons/内容管理.png', checked: false },
    { id: 3, text: '数据中心', icons: 'src/assets/icons/粉丝中心.png', checked: false },
    { id: 4, text: '粉丝管理', icons: 'src/assets/icons/粉丝管理.png', checked: false },
    { id: 5, text: '互动管理', icons: 'src/assets/icons/互动管理.png', checked: false },
    { id: 6, text: '收益管理', icons: 'src/assets/icons/收益管理.png', checked: false },
    { id: 7, text: '创作成长', icons: 'src/assets/icons/创作成长.png', checked: false },
    { id: 11, text: '创作权益', icons: 'src/assets/icons/内容管理.png', checked: false },
    { id: 12, text: '创作实验室', icons: 'src/assets/icons/创作实验室.png', checked: false },
    { id: 13, text: '社区公约', icons: 'src/assets/icons/社区公约.png', checked: false },
    { id: 14, text: '创作设置', icons: 'src/assets/icons/创作设置.png', checked: false }
]);




const videoInput = ref(null)



// 触发文件选择
function triggerFileSelect() {
    videoInput.value.click();
};

let coverUrl=ref('')
let videoId=ref('')

async function handleVideoUpload(event) {
    //file表示用户选中的那个文件
    const file = event.target.files[0];


    if (!file) return;
    await uploadVideo(file)
    console.log("Upload====>"+coverUrl.value)
    // 路由跳转，用户填写视频信息
    router.push({
        path:'/uploadDetail',
        query:{
            coverUrl:coverUrl.value,
            videoId:videoId.value
        }
    })

}

//视频上传方法
async function uploadVideo(file) {
    const formData = new FormData();
    formData.append('video', file);

    try {
        const response = await axios.post('http://localhost:8888/api/video/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(`上传进度：${percent}%`);
            }
        });

        console.log('上传成功，服务器返回：', response.data);
        coverUrl.value=response.data.data.videoCoverUrl;
        videoId.value=response.data.data.videoId;
        console.log("videoId====>"+videoId.value)
    } catch (error) {
        console.error('上传失败：', error.response?.data || error.message);
    }
}


</script>


<style scoped>

* {
    box-sizing: border-box;
}

.creation-header {
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.header-title {
    font-size: 18px;
    font-weight: 500;
    color: #18191c;
    display: flex;
    align-items: center;
    margin: 0;
}

.bilibili-icon {
    margin-right: 10px;
    font-size: 20px;
    color: #fb7299;
}

.header-nav {
    display: flex;
    gap: 30px;
}

.nav-item {
    color: #61666d;
    text-decoration: none;
    font-size: 14px;
    padding: 5px 0;
    position: relative;
}

.nav-item.active {
    color: #fb7299;
    font-weight: 500;
}

.nav-item.active::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #fb7299;
}

.user-area {
    display: flex;
    align-items: center;
    gap: 15px;
}

.notification-btn {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #61666d;
}

.user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
}

.user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}


.content {
    display: flex;
}

.left-sidebar {
    width: 200px;
    background-color: #f4f5f6;
    padding: 20px 0;
    height: 100vh;
    position: sticky;
    top: 0;
}

.nav-menu {
    list-style: none;
    padding: 0;
    margin: 0;
}

.nav-menu li {
    padding: 10px 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 20px;
}

.nav-menu li:hover {
    background-color: #e5e6eb;
}

.nav-menu li.active {
    background-color: #e5e6eb;
    color: #fb7299;
}

.checkbox {
    margin-right: 10px;
    cursor: pointer;
    width: 16px;
    height: 16px;
}

.nav-text {
    font-size: 14px;
    color: #61666d;
}

.nav-menu li.active .nav-text {
    color: #fb7299;
    font-weight: 500;
}

.sidebar-title {
    display: flex;
    justify-content: center;
    align-items: center;
    /* 使图片和文本垂直居中 */
    padding: 10px 15px;
    background-color: skyblue;
    /* 背景颜色 */
    border-radius: 8px;
    /* 圆角 */
    border: 1px solid #ddd;
    /* 边框 */
    transition: background-color 0.3s ease;
    /* 平滑的背景色过渡 */
}




.sidebar-icon {
    width: 40px;
    height: 40px;
    /* 设置高度来确保图片为正方形 */
    margin-right: 10px;
    /* 图片和文本之间的间距 */

}

.sidebar-text {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    /* 文字颜色 */
    letter-spacing: 1px;
    /* 字母间距 */
}

.sidebar-title:hover .sidebar-text {
    color: #007bff;
    /* 悬停时文字颜色变化 */
}


.nav-menu li {
    margin-bottom: 10px;
}

.nav-link {
    text-decoration: none;

}


.nav-menu-img {
    width: 30px;
    margin-right: 20px;
}



.right-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.upload-nav {
    display: flex;
    border-bottom: 1px solid #e5e6eb;
    margin-bottom: 20px;
}

.nav-item {
    padding: 10px 15px;
    cursor: pointer;
    color: #61666d;
    font-size: 14px;
}

.nav-item.active {
    color: #fb7299;
    border-bottom: 2px solid #fb7299;
    font-weight: 500;
}

.upload-area {
    margin-bottom: 30px;
}

.drag-drop-area {
    border: 2px dashed #e5e6eb;
    border-radius: 8px;
    padding: 40px;
    text-align: center;
    margin-bottom: 15px;
    background-color: #f9f9f9;
}

.drag-drop-content {
    display: flex;
    flex-direction: column; 
    align-items: center;    
    max-width: 400px;
    margin: 0 auto;
    
}

.upload-icon {
    font-size: 40px;
    color: #fb7299;
    margin-bottom: 10px;
}

.upload-btn {
    background-color: #fb7299;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 15px;
    font-size: 14px;
}

.queue-info {
    font-size: 13px;
    color: #61666d;
}

.queue-status {
    color: #fb7299;
    font-weight: 500;
}

.quick-section {
    margin-bottom: 25px;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 6px;
}

.quick-section h3 {
    font-size: 16px;
    color: #18191c;
    margin-bottom: 8px;
}

.quick-section p {
    font-size: 14px;
    color: #61666d;
    margin: 0;
}

.requirements {
    margin-bottom: 25px;
}

.requirements h3 {
    font-size: 16px;
    color: #18191c;
    margin-bottom: 15px;
}

.requirement-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
}

.requirement-item {
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 6px;
}

.requirement-item h4 {
    font-size: 14px;
    color: #18191c;
    margin: 0 0 8px 0;
}

.requirement-item p {
    font-size: 13px;
    color: #61666d;
    margin: 0;
}

.agreement {
    font-size: 13px;
    color: #61666d;
    margin-bottom: 25px;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 6px;
}

.agreement a {
    color: #00a1d6;
    text-decoration: none;
}

.tools-section {
    margin-bottom: 25px;
}

.tools-section h3 {
    font-size: 16px;
    color: #18191c;
    margin-bottom: 15px;
}

.tools-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
}

.tool-item {
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 6px;
}

.tool-item h4 {
    font-size: 14px;
    color: #18191c;
    margin: 0 0 10px 0;
}

.tool-btn {
    background-color: white;
    border: 1px solid #e5e6eb;
    padding: 5px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
}

.tool-btn:hover {
    background-color: #f4f5f6;
}
</style>