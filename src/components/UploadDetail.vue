<template>
  <div class="video-upload-container">
    <h2>发布视频</h2>

    <div class="upload-section">

    </div>

    <div class="settings-section">
      <h3>基本设置</h3>
      <div class="form-group">
        <label>封面</label>
        <div class="cover-preview">
          <div class="cover-placeholder">
            <p>系统默认选中第一帧为视频封面</p>
            <img :src="coverUrl">
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>标题</label>
        <input type="text" placeholder="请输入视频标题" v-model="videoTitle">
        <div class="form-group">



          <label>类型</label>
          <div class="radio-group">
            <label><input type="radio" name="video-type" value="original" checked v-model="videoType"> 自制</label>
            <label><input type="radio" name="video-type" value="repost" v-model="videoType"> 转载</label>
          </div>
        </div>

        <div class="form-group">
          <label>分区</label>
          <select v-model="category">
            <option value="travel">旅游出行</option>
            <option value="life">生活记录</option>
            <option value="aviation">飞机</option>
            <option value="toys">玩具</option>
          </select>
        </div>


        <div class="form-group">
          <label>标签</label>
          <div class="tags-input">
            <input type="text" placeholder="按回车键Enter创建标签" @keydown.enter.prevent="addTag" v-model="tagInput">
            <span class="tags-count">{{ tags.length }}/80</span>
          </div>

          <div class="tags-display">
            <span class="tag selected-tag" v-for="(tag, index) in tags" :key="index">
              {{ tag }}
              <span class="remove-tag" @click="removeTag(index)">×</span>
            </span>
          </div>

          <div class="tags-hint">选择以添加最多 7 个标签</div>

          <div class="recommended-tags">
            <span>推荐标签：</span>
            <span class="tag" v-for="tag in recommendedTags" :key="tag" @click="addRecommendedTag(tag)">
              {{ tag }}
            </span>
          </div>
        </div>


        <div class="form-group">
  <label>简介</label>
  <textarea
    v-model="description"
    placeholder="填写更全面的相关信息，让更多的人能找到你的视频吧"
    maxlength="2000"
  ></textarea>
  <div class="char-count">{{ description.length }}/2000</div>
</div>

        <div class="form-group">
          <label>
            <input type="checkbox"> 定时发布
          </label>
          <p class="hint-text">(可选择距离当前最早2小时/最晚≤15天的时间，花火稿件或距发布不足5分钟时不可移动/取消)</p>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox"> 加入合集
          </label>
          <p class="hint-text">合集功能可用于收集整理系列性稿件<br>开通合集功能需满足长途中心等设备Lv2，您可前往创作中心-长途中心查看相关数据</p>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" checked> 允许二创
          </label>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox"> 商业推广
          </label>
          <p class="hint-text">增加商业推广信息</p>
        </div>

        <div class="more-settings">
          <span>更多设置</span>
          <span>（含声明与权益、视频元素、互动管理等）</span>
        </div>
      </div>

      <div class="action-buttons">
        <button class="save-draft">存单箱</button>
        <button class="publish" @click="submit">立即发布</button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useRoute,useRouter } from 'vue-router'
import axios from '@/utils/axiosInstance'
const route = useRoute()
const router=useRouter()

// const coverUrl = ref(route.query.coverUrl)
const coverUrl = ref<string>(route.query.coverUrl as string || '');
const videoTitle = ref('')
const videoType = ref('original')
const category = ref('travel') //默认选中"旅游出行"
const description = ref('');  // 初始化简介为空字符串
const videoId = ref<number>(parseInt(route.query.videoId as string || '0'));


// 标签输入框内容
const tagInput = ref('');

// 用户已选标签列表
const tags = ref([])



const recommendedTags = ref([
  '生活记录', '飞机', '玩具', '购物', 'video', '航空', '风飞', '旅游'
]);
// const topics = ref([
//   '静候时光', '旅行影像大赛', '马上出门越早的',
//   'B站全景选秀', '好好散步快玩', '阳极梦境户外'
// ]);

const addTag = () => {
  if (tagInput.value.trim() && tags.value.length < 80) {
    tags.value.push(tagInput.value.trim());
    tagInput.value = '';
  }
};

const addRecommendedTag = (tag) => {
  if (tags.value.length < 80 && !tags.value.includes(tag)) {
    tags.value.push(tag);
  }
};


// 删除某个标签
function removeTag(index: number) {
  tags.value.splice(index, 1);
}


// 点击“立即发布”
async function submit() {
  if (!videoTitle.value ) {
    alert('标题尚未填写/上传');
    return;
  }

  try {
    const payload = {
      title: videoTitle.value,
      type: videoType.value,
      category: category.value,
      description: description.value,
      tags: tags.value,
      coverUrl: coverUrl.value,
      videoId:videoId.value
    };

    const response = await axios.post('http://localhost:8888/api/video/publish', payload);

    if (response.data.code === 200) {
      alert('发布成功！');
      router.push('/home'); // 跳转到个人页或首页
    } else {
      alert('发布失败：' + response.data.msg);
    }
  } catch (error: any) {
    alert('请求错误：' + (error.response?.data?.msg || error.message));
  }
};

</script>


<style scoped>

* {
    box-sizing: border-box;
}

.video-upload-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

h2 {
  font-size: 24px;
  margin-bottom: 30px;
  color: #222;
}




.settings-section {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

h3 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #222;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

input[type="text"],
input[type="number"],
textarea,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

textarea {
  height: 120px;
  resize: vertical;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.cover-selector {
  display: flex;
  gap: 20px;
}

.cover-preview {
  width: 160px;
  height: 100px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  overflow: hidden;
}

.cover-placeholder {
  color: #999;
}

.cover-options {
  flex: 1;
}

.cover-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-top: 10px;
}



.cover-thumbnail {
  color: #999;
  font-size: 12px;
}

.tags-input {
  position: relative;
}

.tags-count {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 12px;
}

.tags-hint {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.recommended-tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.recommended-tags span:first-child {
  color: #999;
  font-size: 12px;
}

.tag {
  background-color: #f5f5f5;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.tag:hover {
  background-color: #e5e5e5;
}

.topics-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.topic {
  background-color: #f0f7ff;
  color: #06a7ff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.search-more {
  color: #06a7ff;
  font-size: 12px;
  cursor: pointer;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.hint-text {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  line-height: 1.5;
}

.more-settings {
  color: #06a7ff;
  font-size: 14px;
  cursor: pointer;
  margin-top: 20px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.save-draft {
  padding: 10px 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
}

.publish {
  padding: 10px 20px;
  background-color: #fb7299;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.publish:hover {
  background-color: #fc8bab;
}
</style>