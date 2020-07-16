import Api from '../../axios';
import router from '@/router/'

export default {
  namespaced: true,
  state: {
    users: {},

    errorMessage: "",
    successMessage: "",
    userInfo: {},
    isLogin: false,
    tempEmail: "",
    config: {},
    roles: ["TEST", "Admin", "Producer", "Staff", "Member"],
    userRole: "",
    urlPath: ""
  },
  mutations: {
    LOGIN_SUCCESS(state, payload) {
      state.isLogin = true
      state.userInfo = payload
      state.userRole = state.roles[payload.role_id]
    },
    LOGIN_FAIL(state) {
      state.isLogin = false
    },
    LOGOUT(state) {
      state.isLogin = false
      state.userInfo = {}
      state.users = {}
    },
    SET_TEMP_EMAIL(state, payload) {
      state.tempEmail = payload
    },
    SET_USER_INFO(state, payload) {
      state.isLogin = true
      state.userInfo = payload
      state.userRole = state.roles[payload.role_id]
    },
    SET_ALL_USERS(state, payload) {
      state.users = payload
    },
    SET_HEADER(state, token) {
      state.config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + token
        }
      }
    }
  },

  actions: {
    getErrorMessage({commit}, payload) {
      let message = payload.data.message
      if (payload.status === 422 && payload.data.errors) {
        if (payload.data.errors.email) message = payload.data.errors.email[0]
        else if (payload.data.errors.password) message = payload.data.errors.password[0]
      }
      commit('util/SET_ALERT_MESSAGE', {
        value: true,
        type: 'error',
        message: message
      }, {root: true})
    },

    login({commit, dispatch}, loginObj) {
      return new Promise((resolve) => {
        Api.post('login', loginObj)
          .then(response => {
            let token = response.data.token
            localStorage.setItem("Authorization", token)
            commit('LOGIN_SUCCESS', response.data.user)
            resolve(true)
          })
          .catch(err => {
            dispatch('getErrorMessage', err.response)
            commit('LOGIN_FAIL')
            console.log(err.response)
          });
      })
    },

    register({commit, dispatch}, userObj) {
      return new Promise((resolve) => {
        Api.post('register', userObj)
          .then(res => {
            commit('util/SET_SNACKBAR_MESSAGE', {
              type: 'success',
              message: res.data.message
            }, {root: true})
            commit('SET_TEMP_EMAIL', res.data.email)
            resolve(true)
          })
          .catch(err => {
            dispatch('getErrorMessage', err.response)
          })
      })
    },

    logout({state, commit, dispatch}) {
      commit('SET_HEADER', localStorage.getItem("Authorization"))
      return new Promise((resolve, reject) => {
        Api.post('logout', [], state.config)
          .then(() => {
            localStorage.removeItem("Authorization")
            commit('LOGOUT')
            resolve(true)
          })
          .catch(() => {
            dispatch('gotoLogin')
            reject(true)
          })
      })
    },

    getMemberInfo({commit, dispatch}) {
      dispatch('util/getData', {path: 'user', data: ''}, {root: true}).then(res => {
        commit('SET_USER_INFO', res.user)
      })
    },

    getList({commit, dispatch}) {
      return new Promise((resolve) => {
        dispatch('util/getData', {path: 'admin/users', data: ''}, {root: true}).then(res => {
          commit('SET_ALL_USERS', res.users)
          resolve(true)
        })
      })
    },

    updateUser ({ dispatch }, payload) {
      dispatch('util/postData', {path: 'update-user', data: payload}, {root: true})
    },

    updateMember ({ dispatch }, payload) {
      dispatch('util/postData', {path: 'update-member', data: payload}, {root: true})
    },

    changePassword ({ dispatch }, payload) {
      dispatch('util/postData', {path: 'change-password', data: payload}, {root: true})
    },

    deleteMember ({ dispatch }, payload) {
      dispatch('util/postData', {path: 'delete-member', data: payload}, {root: true})
    },

    gotoLogin({commit}) {
      localStorage.removeItem("Authorization")
      commit('LOGOUT')
      router.push({name: 'Login'})
    },

    // getNotice({commit}) {
    //   return new Promise(resolve => {
    //     Api.get('admin/notice/index')
    //       .then(res => {
    //         commit('notice/SET_NOTICE', res.data.notices, {root: true})
    //         resolve(true)
    //       })
    //       .catch(err => {
    //         commit('util/SET_SNACKBAR_MESSAGE', {
    //           'type': 'error',
    //           'message': err.response.data.message
    //         }, {root: true})
    //       })
    //   })
    // },
    //
    // postNotice({commit}, notice) {
    //   return new Promise((resolve) => {
    //     Api.post('admin/notice/store', notice, {
    //       headers: {
    //         'Authorization': 'Bearer ' + localStorage.getItem("Authorization")
    //       }
    //     })
    //       .then(res => {
    //         commit('util/SET_SNACKBAR_MESSAGE', {
    //           'type': 'success',
    //           'message': res.data.message
    //         }, {root: true})
    //         resolve(res.data.notice)
    //       })
    //       .catch(err => {
    //         commit('util/SET_SNACKBAR_MESSAGE', {
    //           'type': 'error',
    //           'message': err.response.data.message
    //         }, {root: true})
    //         console.log(err.response.data.message)
    //       })
    //   })
    // },
    //
    // deleteNotice({commit}, notice) {
    //   return new Promise((resolve) => {
    //     Api.post('admin/notice/delete', notice, {
    //       headers: {
    //         'Authorization': 'Bearer ' + localStorage.getItem("Authorization")
    //       }
    //     })
    //       .then(res => {
    //         commit('util/SET_SNACKBAR_MESSAGE', {
    //           'type': 'success',
    //           'message': res.data.message
    //         }, {root: true})
    //         resolve(true)
    //       })
    //       .catch(err => {
    //         commit('util/SET_SNACKBAR_MESSAGE', {
    //           'type': 'error',
    //           'message': err.response.data.message
    //         }, {root: true})
    //         console.log(err.response.data.message)
    //       })
    //   })
    // },

    // postData({state, commit}, payload) {
    //   Api.post(state.urlPath, payload, {
    //     headers: {
    //       'Authorization': 'Bearer ' + localStorage.getItem("Authorization")
    //     }
    //   })
    //     .then(res => {
    //       commit('util/SET_SNACKBAR_MESSAGE', {
    //         'type': 'success',
    //         'message': res.data.message
    //       }, {root: true})
    //     })
    //     .catch(err => {
    //       commit('util/SET_SNACKBAR_MESSAGE', {
    //         'type': 'error',
    //         'message': err.response.data.message
    //       }, {root: true})
    //     })
    // },
    //
    // getData({state, commit}) {
    //   return new Promise((resolve) => {
    //     Api.get(state.urlPath, {
    //       headers: {
    //         'Authorization': 'Bearer ' + localStorage.getItem("Authorization")
    //       }
    //     })
    //       .then(res => {
    //         resolve(res.data)
    //       })
    //       .catch(err => {
    //         commit('util/SET_SNACKBAR_MESSAGE', {
    //           'type': 'error',
    //           'message': err.response.data.message
    //         }, {root: true})
    //       })
    //   })
    // },
  },

  getters: {
    getLoginState: state => {
      state.isLogin = !!localStorage.getItem("Authorization")
      return state.isLogin
    },
    getUserEmail: state => {
      return state.tempEmail
    },
    getUserRole: state => {
      return state.userRole
    }
  }
}
