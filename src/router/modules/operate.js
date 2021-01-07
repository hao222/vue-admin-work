/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const operatorRouter = {
  path: '/operate',
  component: Layout,
  redirect: '/operate/operate-table',
  name: '操作日志',
  meta: {
    title: '操作日志',
    icon: 'link'
  },
  children: [
    {
      path: 'operate-table',
      component: () => import('@/views/operatorlog/operate-table'),
      name: '操作日志',
      meta: { title: '操作日志' }
    }
  ]
}
export default operatorRouter
