/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const workingRouter = {
  path: '/working',
  component: Layout,
  redirect: '/working/working-table',
  name: '工时管理',
  meta: {
    title: '工时管理',
    icon: 'form'
  },
  children: [
    {
      path: 'working-table',
      component: () => import('@/views/working/working-table'),
      name: '工时管理',
      meta: { title: '工时管理' }
    }
  ]
}
export default workingRouter
