import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login/',
    method: 'post',
    data
  })
}

export function getInfo(id) {
  return request({
    url: `/user/${id}/`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout/',
    method: 'post'
  })
}

export function getUser(query) {
  return request({
    url: '/user/',
    method: 'get',
    params: query
  })
}

export function createUser(data) {
  return request({
    url: '/user/',
    method: 'post',
    data
  })
}

export function updateUser(data, id) {
  return request({
    url: `/user/${id}/`,
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/user/${id}/`,
    method: 'delete'
  })
}

export function roleList(query) {
  return request({
    url: '/role/',
    method: 'get',
    params: query
  })
}

export function createRole(data) {
  return request({
    url: '/role/',
    method: 'post',
    data
  })
}

export function updateRole(data, id) {
  return request({
    url: `/role/${id}/`,
    method: 'put',
    data
  })
}

export function dashCount() {
  return request({
    url: '/work/dash_count/',
    method: 'get'
  })
}
