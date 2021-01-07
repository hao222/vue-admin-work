import Vue from 'vue'
import Router from 'vue-router'
import taskRouter from './modules/taskpro'
import workingRouter from './modules/working'
import userRouter from './modules/user'
import operatorRouter from './modules/operate'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '工时系统',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '工时系统', icon: 'dashboard' }
    }]
  },
  taskRouter,
  workingRouter,
  userRouter,
  operatorRouter,
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
