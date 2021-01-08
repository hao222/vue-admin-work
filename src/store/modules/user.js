import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, setUid, removeUid, setName, removeName } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = 'Bearer ' + token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_UID: (state, uid) => {
    state.uid = uid
  },
  SET_ROLE: (state, role) => {
    state.role = role
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        if (response.status === 200) {
          const data = response['data']
          const { tk, uId } = data
          commit('SET_TOKEN', tk)
          commit('SET_UID', uId)
          Message({ message: '登录成功', type: 'success', duration: 500 })

          setToken(tk)
          resolve()
        }
      }).catch(error => {
        Message({ message: error.response.data['detail'], type: 'error', duration: 1000})
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.uid).then(response => {
        const { data } = response
        if (!data) {
          return reject('请求错误， 请重新登录')
        }
        const { username, role_name, id } = data
        commit('SET_NAME', username)
        commit('SET_ROLE', role_name)
        setUid(id)
        setName(username)
        // 添加username cookies
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        removeUid()
        removeName()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeUid()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

