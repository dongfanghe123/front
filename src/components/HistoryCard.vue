<template>
  <div class="history-card">
    <div class="history-cover">
      <img :src="videoCover" alt="视频封面" class="cover-image">
      <div class="video-duration">
        {{ formatDuration(duration) }}
      </div>
    </div>

    <div class="video-info">
      <h3 class="video-title">{{ title }}</h3>
      <div class="video-meta">
        <div class="video-author">
          <span class="up-tag">UP</span> {{ author }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  videoId: number,
  videoCover: string,
  author: string,
  title: string
  duration: string
}>()


// 格式化时长（兼容数字秒数或字符串）
const formatDuration = (duration) => {
  // 如果已经是 B 站格式的字符串（如 "1:23:45"），直接返回
  if (typeof duration === 'string' && duration.includes(':')) {
    return duration;
  }

  // 处理数字秒数
  const seconds = Number(duration);
  if (isNaN(seconds)) return "0:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // 返回 HH:MM:SS 或 MM:SS
  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    : `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

</script>

<style scoped>
.history-card {
  background-color: white;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.history-cover {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

.history-card:hover .cover-image {
  transform: scale(1.05);
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}



.video-info {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.video-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.video-meta {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

.up-tag {
  display: inline-block;
  background-color: #fb7299;
  color: white;
  padding: 0 4px;
  border-radius: 2px;
  margin-right: 4px;
  font-size: 11px;
}
</style>