import { createRouter, createWebHistory } from "vue-router" 
import HomeView from '../views/HomeView.vue'
import HistoryView from '../views/HistoryView.vue'
import RegisterView from "@/views/RegisterView.vue"
import LoginView from "@/views/LoginView.vue"

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: HomeView },
        { path: "/history", component: HistoryView },
        { path: "/register", component: RegisterView },
        { path: "/register/:id", component: RegisterView },
        { path: "/login", component: LoginView }
    ]
})

export default router
