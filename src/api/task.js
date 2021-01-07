import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/task/',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createTask(data) {
  return request({
    url: '/task/',
    method: 'post',
    data
  })
}

export function updateTask(data, id) {
  return request({
    url: `/task/${id}/`,
    method: 'put',
    data
  })
}

export function deleteTask(id) {
  return request({
    url: `/task/${id}/`,
    method: 'delete'
  })
}

export function detailTask(id) {
  return request({
    url: `/task/${id}/`,
    method: 'get'
  })
}

export function parentTask(query) {
  return request({
    url: '/task/',
    method: 'get',
    params: query
  })
}
