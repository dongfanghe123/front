<template>
    <div class="video-card">


        <div class="video-cover">
            <img :src="cover" :alt="title" class="cover-image" />
        </div>

        <div class="video-info">


            <span class="video-title">{{ title }}</span>


            <div class="video-author">
                <div class="up-name">
                    <img src="@/assets/UP主.png" style="width: 16px; height: 16px;" >
                    <span style="margin-left: 6px;">{{props.author}}</span>
                </div>
            </div>
 

            <div class="count">
                <img src="@/assets/播放数.png" style="width: 16px; height: 16px;">
                <span class="viewCount">{{ props.views }}</span>
                <img src="@/assets/评论数.png" style="margin-left: 8px; width: 16px; height: 16px;">
                <span class="commentCount">{{ 111 }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">


const props = defineProps<{
    title: string
    author: string
    views: number
    comments: number
    cover: string
    id: number
}>()
</script>


<style scoped>


* {
    box-sizing: border-box;
}

.video-card {
    display: flex;
    flex-direction: row;
    background-color: white;
    border-radius: 6px;
    cursor: pointer;
    transition: transform 0.2s ease;
    margin-top: 15px;
    height: 180px;
}


.video-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.video-cover {
    position: relative;
    flex: 2;
}

.cover-image {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover
}


.video-info {
    display: flex;
    flex-direction: column;
    justify-content: start;
    padding: 8px;
    flex: 1;
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


.up-info-btn{
    justify-content: start;
    border: 2px solid black;
}

.up-info-btn:hover{
    background-color: white;
}

.up-name{
    display: flex;
    align-items: center;
}

.up-name:hover{
    color: skyblue;
}

.count{
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 16px;
    color: gray;
    font-family: sans-serif;
}

</style>