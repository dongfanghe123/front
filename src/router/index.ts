import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import Upload from '@/components/Upload.vue'
import UploadDetail from '@/components/UploadDetail.vue'
import VideoDetail from '@/components/VideoDetail.vue'
import Profile from '@/components/Profile.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            component: Home
        },
        {
            path: '/upload',
            component: Upload
        },
        {
            path: '/uploadDetail',
            component: UploadDetail
        },
        {
            path: '/video/:id',
            name: 'VideoDetail',
            component: VideoDetail,
        },
        {
            path: '/profile',
            name: 'Profile',
            component: Profile
        }

    ],


    scrollBehavior(to, from, savedPosition) {
        if(savedPosition){
            return savedPosition
        }

        return {top:0}
    }

})

export default router