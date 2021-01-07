import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/work/',
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

export function createWork(data) {
  return request({
    url: '/work/',
    method: 'post',
    data
  })
}

export function updateWork(data, id) {
  return request({
    url: `/work/${id}/`,
    method: 'put',
    data
  })
}

export function deleteWork(id) {
  return request({
    url: `/work/${id}/`,
    method: 'delete'
  })
}

export function detailWork(id) {
  return request({
    url: `/work/${id}/`,
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

export function approveWork(data, id) {
  return request({
    url: `/work/${id}/approve/`,
    method: 'put',
    data
  })
}

