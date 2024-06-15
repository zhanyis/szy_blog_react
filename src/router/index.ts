import { createRouter, createWebHashHistory } from "vue-router"
import Home from "../pages/home/Home.vue";
import Comment from "../pages/comment/Comment.vue";

// admin
import Admin from "../admin/index.vue";
import AdminHome from "../admin/pages/home.vue";
import Upload from "../admin/pages/upload.vue";
import CommentManage from "../admin/pages/comment.vue";
import Property from "../admin/pages/property.vue";
import PropertyUnit from '../admin/pages/propertyUnit.vue';
import PropertyNew from '../admin/pages/propertyNew.vue';
import Video from '../admin/pages/video.vue';
import Diary from '../admin/pages/diary.vue';
import Bill from '../admin/pages/bill.vue';
import Mhxy from '../admin/pages/mhxy.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/comment', component: Comment },
    { path: '/admin', component: Admin, children: [
        {
            path: '',
            component: AdminHome 
        },
        {
            path: 'upload',
            component: Upload
        },
        {
            path: 'comment',
            component: CommentManage
        },
        {
            path: 'propertyOld',
            component: Property
        },
        {
            path: 'propertyUnit',
            component: PropertyUnit
        },
        {   
            path: 'watchVideo',
            component: Video
        },
        {
            path: 'property',
            component: PropertyNew
        },
        {
            path: 'diary',
            component: Diary
        },
        {
            path: 'bill',
            component: Bill
        },
        {
            path: 'mhxy',
            component: Mhxy
        }
    ]}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router