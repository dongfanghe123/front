<template>
  <div class="video-card">


    <div class="video-cover">
      <img :src="cover" :alt="title" class="cover-image" />
      <div class="video-overlay">
        <div class="left-info">
          <span class="icon play-icon" />{{ views }}
          <span class="icon comment-icon" />{{ likes }}
        </div>
        <div class="video-duration">{{ duration }}</div>
      </div>
    </div>


    <div class="video-info">
      <h3 class="video-title">{{ title }}</h3>
      <div class="video-meta">
        <div class="video-author">
          <span class="up-tag">UP</span> {{ author }}
        </div>
        <div class="video-time">{{ uploadTime }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


const props = defineProps<{
  title: string
  author: string
  views: string
  likes: string
  duration: string
  cover: string
  uploadTime: string
  id: number
}>()

</script>



<style>

* {
    box-sizing: border-box;
}

.video-card {
  background-color: white;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-top: 15px;
}




.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.video-cover {
  position: relative;
  padding-top: 75%;
  /* 比如改为 10:16 的比例，图更大些 */
  overflow: hidden;
}

.cover-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 6px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  color: #fff;
  font-size: 12px;
}

.left-info {
  display: flex;
  gap: 10px;
  align-items: center;
}



.stats {
  display: flex;
  gap: 6px;
}

.stat-item {
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  /* 黑底半透明 */
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  color: #fff;
  /* 数字白色 */
}

.icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  background-size: contain;
  background-repeat: no-repeat;
  margin-right: 4px;
  /* 强制图标也白色，可用滤镜把深色PNG/黑色SVG都反转成白 */
  filter: brightness(0) invert(1);
}

.play-icon {
  background-image: url('@/assets/播放数.png');

}

.comment-icon {
  background-image: url('@/assets/评论数.png');
}

.video-duration {
  background-color: gray;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  color: #fff;
}

.video-info {
  padding: 14px;
}

.video-title {
  font-size: 16px;
  font-weight: bold;
  color: #222;
  line-height: 1.4;
  height: 40px;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.video-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #888;
  align-items: center;
}

.video-author {
  display: flex;
  align-items: center;
  gap: 4px;
}

.up-tag {
  background-color: whitesmoke;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 2px;
  color: #333;
}


.video-title {
  /* 字体系列：优先自定义，其次回退到系统字体 */
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;

  /* 字体大小 */
  font-size: 18px;

  /* 字重（400 正常，500 中等，600 半粗，700 粗体） */
  font-weight: 600;

  /* 文字颜色 */
  color: #222;
  /* 或者你想要的任何色值 */

  /* 行高，保证两行文本的垂直居中 */
  line-height: 1.3;

  /* 如需首行或整段大写 */
  /* text-transform: uppercase; */

  /* 如果想加点字间距 */
  /* letter-spacing: 0.5px; */

  /* 斜体 */
  /* font-style: italic; */

  /* 阴影（可选） */
  /* text-shadow: 1px 1px 2px rgba(0,0,0,0.1); */

  /* 保证截断依旧生效 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>