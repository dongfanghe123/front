<template>

  <img src="@/assets/header-background.png" class="header-background">


  <div class="user-header">
    <div class="left-section">
      <img :src="user.avatar" class="avatar" />
      <span class="username">{{ user.username }}</span>
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
      <div 
        v-for="(tab, index) in tabs" 
        :key="index"
        class="tab" 
        :class="{ active: activeTab === index }"
        @click="switchTab(index)"
      >
        {{ tab.label }}
      </div>

      <div class="history-search">
        <input type="text" placeholder="搜索你的历史记录" />
        <i class="icon-search"></i>
      </div>
    </div>
  </div>


  <component :is="currentComponent"></component>

</template>

<script lang="ts" setup>
import { onMounted, ref,computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import axios from '@/utils/axiosInstance'

import History from '@/components/History.vue'
import Offline from './Offline.vue'
import Favorites from './Favorites.vue'
import WatchLater from './WatchLater.vue'



const userStore = useUserStore()

interface User {
  id: number
  avatar: string;
  username: string;
  follows: number;
  fans: number;
}


const user = ref<User>({
  id: 0,
  avatar: '',
  username: '',
  follows: 0,
  fans: 0,
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
    fans: data.fansCount

  }



  console.log(user.value.avatar)


}


onMounted(async () => {
  userStore.restore()
  await getUserInfo()
})

</script>


<style>
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
  flex: 2;

}

.right-section {
  display: flex;
  flex: 3;
  padding-left: 800px;
  align-items: center;
  gap:15px

}

.username {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  line-height: 1.4;
  margin-right: 8px;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  /* 微阴影 */
}

.avatar {
  width: 95px;
  margin-right: 10px;
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


.history-search {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-left: 770px;
  width: 240px;
  height: auto;
  background-color: #fff;
  transition: border-color 0.2s;
  text-align: right;
}

.history-search:focus-within {
  border-color: #409EFF;
  /* 聚焦时边框变蓝 */
}

.history-search input {
  border: none;
  outline: none;
  flex: 1;
  height: 28px;
  font-size: 16px;
  color: #333;
  background-color: transparent;
}

.icon-search {
  font-size: 18px;
  color: #888;
  margin-left: 8px;
  cursor: pointer;
}
</style>