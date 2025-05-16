<template>

  <img src="@/assets/header-background.png" class="header-background">


  <div class="user-header">
    <div class="left-section">
      <img :src="user.avatar" class="avatar" />
      <div class="userIntroduce">
        <span class="username">{{ user.username }}</span>
        <span class="userSignature">{{ user.signature === '' ? '这个人很懒，还没有个性签名' : user.signature }}</span>
      </div>

      <div class="edit" @click="showEdit = true">
        <img src="@/assets/编辑个人信息.png">
      </div>

      <el-dialog v-model="showEdit" title="编辑个人信息" width="500px">
        <el-form :model="user" label-width="80px">
          <!-- 头像上传 -->
          <el-form-item label="头像">
            <el-upload class="avatar-uploader" action="http://localhost:8888/api/user/uploadAvatar" :show-file-list="false"
              :headers="uploadHeaders" 
              :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img :src="user.avatar" class="avatar">
            </el-upload>
          </el-form-item>

          <!-- 昵称 -->
          <el-form-item label="昵称">
            <el-input v-model="user.username"></el-input>
          </el-form-item>

          <!-- 签名 -->
          <el-form-item label="签名">
            <el-input v-model="user.signature"></el-input>
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="showEdit = false">取消</el-button>
          <el-button type="primary" @click="uploadUserInfo">提交</el-button>
        </template>
      </el-dialog>


    </div>

    <div class="right-section">
      <div class="count-item">
        关注数：{{ user.follows }}
      </div>
      <div class="count-item">
        粉丝数：{{ user.fans }}
      </div>
    </div>

  </div>

  <div class="user-nav-bar">

    <div class="tab-list">
      <div v-for="(tab, index) in tabs" :key="index" class="tab" :class="{ active: activeTab === index }"
        @click="switchTab(index)">
        {{ tab.label }}
      </div>


      <el-input class="search-input" v-model="searchInput" placeholder="搜索你的历史记录"  :suffix-icon="Search"/>
    </div>
  </div>


  <component :is="currentComponent"></component>

</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue'

import { useUserStore } from '@/stores/user'
import axios from '@/utils/axiosInstance'
import History from '@/components/History.vue'
import Offline from './Offline.vue'
import Favorites from './Favorites.vue'
import WatchLater from './WatchLater.vue'



const showEdit = ref(false)
const searchInput=ref('')



const userStore = useUserStore()

interface User {
  id: number
  avatar: string;
  username: string;
  follows: number;
  fans: number;
  signature: string;
}

const user = ref<User>({
  id: 0,
  avatar: '',
  username: '',
  follows: 0,
  fans: 0,
  signature: ''
})

// 定义所有标签页数据
const tabs = [
  { label: '历史记录', component: History },
  { label: '离线缓存', component: Offline },
  { label: '我的收藏', component: Favorites },
  { label: '稍后再看', component: WatchLater }
]


// 当前激活的标签索引
const activeTab = ref(0)

// 计算当前显示的组件
const currentComponent = computed(() => tabs[activeTab.value].component)


// 切换标签页
const switchTab = (index) => {
  activeTab.value = index
}

//当跳转到个人主页时，需要向后端请求用户信息
async function getUserInfo() {
  if (userStore.isLoggedIn === false) {
    console.log(userStore.isLoggedIn)
    // 用户还未登录，提示用户登录
    ElMessage.warning("未登录，请先登录后再进行操作");
    return;
  }


  const response = await axios.get('http://localhost:8888/api/user/profile', {
    params: {
      userId: userStore.userId
    }
  })
  const data = response.data.data

  user.value = {
    id: data.id,
    avatar: data.avatar,
    username: data.userName,
    follows: data.followCount,
    fans: data.fansCount,
    signature: data.signature

  }

}

// 头像上传前校验
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2MB!')
  }

  return isImage && isLt2M
}



//头像上传成功的回调函数
function handleAvatarSuccess(response, file) {
  if (response && response.code === 200) {
    // 假设后端返回的头像地址在 response.data.url
    user.value.avatar = response.data;
      localStorage.setItem('userAvatar', user.value.avatar)
    ElMessage({
      message: '头像上传成功',
      type: 'success',
      duration: 3000
    });

  } 
}

// 提交用户信息
const uploadUserInfo = async () => {
  try {
    const response = await axios.post('http://localhost:8888/api/user/update', {
      userId: userStore.userId,
      avatar: user.value.avatar,
      nickname: user.value.username,
      signature: user.value.signature
    })

    ElMessage.success('个人信息更新成功')
    showEdit.value = false

    // 如果需要，可以在这里触发父组件更新或其他操作
    // emit('update', response.data)

  } catch (error) {
    ElMessage.error('更新失败: ' + (error.response?.data?.message || error.message))
  }
}




const uploadHeaders = ref({});

onMounted(async () => {
  userStore.restore();
  await getUserInfo();

  // 确保在浏览器环境执行，避免 undefined 报错
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authorization');
    if (token) {
      uploadHeaders.value = {
        Authorization: 'Bearer ' + token
      };
    }
  }
});

</script>


<style scoped>
* {
    box-sizing: border-box;
}

.header-background {
  width: auto;
  height: 190px;
  /* 或你想要的高度 */
}

.user-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.left-section {
  display: flex;
  align-items: center;
  flex: 3;

}

.right-section {
  display: flex;
  flex: 3;
  padding-left: 800px;
  align-items: center;
  gap: 15px
}

.avatar {
  width: 95px;
  margin-right: 10px;
}

.userIntroduce {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
}

.username {
  font-size: 18px;
  font-weight: 600;
  color: gray;
  line-height: 1.4;
  margin-right: 8px;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  /* 微阴影 */
}

.userSignature {
  font-size: 12px;
  font-weight: 600;
  color: gray;
  line-height: 1.4;
  margin-right: 8px;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  /* 微阴影 */
}


.edit {
  display: flex;
  margin-left: 20px;
  border: 1px solid #ccc;
  cursor: pointer;

}

.edit img {
  max-width: 30px;
  /* 限制图片最大宽度为容器宽度 */
  height: auto;
  /* 高度自动，保持原始比例 */
}




.count-item {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  line-height: 1.4;
  margin-right: 10px;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-bottom: 1.5px solid gainsboro;
  /* 微阴影 */

}

.count-item:hover {
  color: #409EFF;
  /* 悬浮时字体变蓝色（Element-UI 蓝） */
}


.user-nav-bar {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1.5px solid gainsboro;
}

.tab-list {
  display: flex;
}


.tab-list {
  display: flex;
  gap: 24px;
  /* 项目间距 */
  flex: 1;
  text-align: left;
}

.tab {
  font-size: 18px;
  color: #333;
  /* 默认字体颜色 */
  cursor: pointer;
  transition: color 0.2s;
}

.tab:hover {
  color: #409EFF;
  /* 悬浮变蓝色 */
}

.tab.active {
  color: #FF5C8A;
  /* 选中项粉红色，如图所示 */
  font-weight: 600;
}


.search-input {
  width: 240px;
  height: 30px;
  margin-left: 840px;
}

</style>