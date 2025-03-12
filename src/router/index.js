import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import SignIn from '@/views/SignIn.vue';
import Main from '@/views/Main.vue';
import Join from '@/views/Join.vue';
import Profile from '@/components/Profile.vue';
import PrivateMessage from '@/components/PrivateMessage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { authRequired: false },
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn,
      meta: { authRequired: false },
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      meta: { authRequired: true },
      children: [
        {
          path: '/profile',
          name: 'profile',
          component: Profile,
          meta: { authRequired: true },
        },
        {
          path: '/user/:userId',
          name: 'private-message',
          component: PrivateMessage,
          meta: { authRequired: true },
          props: true,
        },
      ],
    },
    {
      path: '/join',
      name: 'join',
      component: Join,
      meta: { authRequired: false },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

export default router;
