import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/operate/',
    method: 'get',
    params: query
  })
}
