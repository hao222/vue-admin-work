import Cookies from 'js-cookie'

const TokenKey = 'working_token'
const Uidkey = 'uid-'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setUid(uid) {
  return Cookies.set(Uidkey, uid)
}

export function removeUid() {
  return Cookies.remove(Uidkey)
}

export function getUid() {
  return Cookies.get(Uidkey)
}
