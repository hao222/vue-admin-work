/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const userRouter = {
  path: '/user',
  component: Layout,
  redirect: '/user/user-table',
  name: '用户管理',
  meta: {
    title: '用户管理',
    icon: 'user'
  },
  children: [
    {
      path: 'user-table',
      component: () => import('@/views/users/user-table'),
      name: '用户列表',
      meta: { title: '用户列表' }
    },
    {
      path: 'role-table',
      component: () => import('@/views/users/role-table'),
      name: '角色列表',
      meta: { title: '角色列表' }
    }
  ]
}
export default userRouter
