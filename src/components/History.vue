<template>
    <div class="history-container" ref="historyListRef">
        <div class="history-grid">
            <HistoryCard v-for="history in historys" :key="history.videoId" :video-id="history.videoId"
                :author="history.author" :title="history.title" :video-cover="history.videoCover"
                :duration="history.duration" @click="goToDetail(history.videoId)">
            </HistoryCard>
        </div>
    </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from '@/utils/axiosInstance'
import { useUserStore } from '@/stores/user'
import { hi, pa } from 'element-plus/es/locale'
import HistoryCard from './HistoryCard.vue'
import { useRouter } from 'vue-router'
import { RefSymbol } from '@vue/reactivity'


const router = useRouter()

const lastScore = ref<number | null>(null)
const userStore = useUserStore()



interface HistoryCard {
    videoId: number,
    videoCover, string,
    title: string,
    author: string,
    duration: string
}



const historys = ref<HistoryCard[]>([])
const pageSize = 8;
const loading = ref(false); //防止重复请求
const finished = ref(false); // 是否加载完所有数据

const historyListRef = ref<HTMLElement | null>(null)



async function getHistoryPlayer() {

    if (loading.value || finished.value) return
    loading.value = true;

    try {
        const response = await axios.get('http://localhost:8888/api/user/history', {
            params: {
                lastScore: lastScore.value,
                pageSize: pageSize,
                userId: userStore.userId
            }
        })

        const data = response.data.data

        if (data.length === 0) {
            finished.value = true;
            return;
        }

        lastScore.value = data[data.length - 1].score

        if (data.length < pageSize) {
            finished.value = true
        }
        historys.value.push(...data)
    } catch (error) {
        console.log("获取历史记录错误", error)
    }

}


function handleScroll() {
    const el = historyListRef.value
    if (!el || historyListRef.value || historyListRef.value) return

    const scrollTop = el.scrollTop         // 已滚动距离
    const clientHeight = el.clientHeight   // 可视高度
    const scrollHeight = el.scrollHeight   // 内容总高度

    // 如果滚动到底部 100px 以内
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        getHistoryPlayer()
    }
}


function goToDetail(id: number) {
    router.push(`/video/${id}`);
}


onMounted(async() => {
    userStore.restore();
    await getHistoryPlayer();
    historyListRef.value?.addEventListener('scroll', handleScroll)
})

</script>


<style>
.history-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(270px, 1fr));
    gap: 22px;
}
</style>