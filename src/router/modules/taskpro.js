/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const taskRouter = {
  path: '/taskpro',
  component: Layout,
  redirect: '/taskpro/task-table',
  name: '任务管理',
  meta: {
    title: '任务管理',
    icon: 'table'
  },
  children: [
    {
      path: 'task-table',
      component: () => import('@/views/taskpro/task-table'),
      name: '任务列表',
      meta: { title: '任务管理' }
    }
  ]
}
export default taskRouter
