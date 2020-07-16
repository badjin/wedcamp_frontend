import Api from "../../axios";

export default {
  namespaced: true,
  state: {
    vodInfo: {
      title: '',
      video_id: '',
      video_url: '',
      tags: []
    },
    videos: [],
    tags: [{ header: 'Select a tag or create one' }],

    lastPage: 1
  },
  mutations: {
    ADD_VOD (state, payload) {
      state.videos.push(payload)
      // state.videos.unshift(payload)
    },
    SET_TAGS(state, payload) {
      state.tags = payload
    },
    SET_LAST_PAGE(state, payload) {
      state.lastPage = payload
    },
    SET_VOD_INFO(state, payload) {
      state.vodInfo = payload
    },
    SET_ALL_VOD(state, payload) {
      state.videos = payload
    },
    RESET_DATA(state) {
      state.video = []
      state.tags = [{ header: 'Select a tag or create one' }]
      state.vodInfo = {
        tags: []
      }
    }
  },

  actions: {
    addVOD({ commit, dispatch }, payload) {
      dispatch('util/postData', {
        path: 'vod/store',
        data: payload
      }, {root: true}).then((res) => {
        commit('ADD_VOD', res.vod)
      })
    },

    updateTags({ dispatch }, payload) {
      dispatch('util/postData', {
        path: 'vod/updateTags',
        data: payload
      }, {root: true})
    },

    updateVOD ({ dispatch }, payload) {
      dispatch('util/postData', {
        path: 'vod/update',
        data: payload
      }, {root: true})
    },

    deleteVOD ({ dispatch }, payload) {
      return new Promise((resolve) => {
        dispatch('util/postData', {
          path: 'vod/delete',
          data: payload
        }, {root: true}).then(() => {
          resolve(true)
        })
      })
    },

    getTags ({ commit }) {
      return new Promise((resolve) => {
        Api.get('vod/getTags', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("Authorization")
          }
        })
          .then(res => {
            if (res.data.tags[0])
              commit('SET_TAGS', res.data.tags[0].tags)
            resolve(true)
          })
          .catch((err) => {
            commit('util/SET_SNACKBAR_MESSAGE', {
              'type': 'error',
              'message': err.response.statusText
            }, {root: true})
          })
      })
    },

    getAllVOD({ commit }) {
      return new Promise((resolve) => {
        Api.get('vod/index', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("Authorization")
          }
        })
          .then(res => {
            commit('SET_ALL_VOD', res.data.videos.data)
            resolve(true)
          })
          .catch((err) => {
            commit('util/SET_SNACKBAR_MESSAGE', {
              'type': 'error',
              'message': err.response.statusText
            }, {root: true})
          })
      })
    },

    getVideoByPage({ commit }, page) {
      return new Promise((resolve) => {
        Api.get('vod/index?page='+page, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("Authorization")
          }
        })
          .then(res => {
            commit('SET_LAST_PAGE', res.data.videos.last_page)
            resolve(res.data.videos.data)
          })
          .catch((err) => {
            commit('util/SET_SNACKBAR_MESSAGE', {
              'type': 'error',
              'message': err.response.statusText
            }, {root: true})
          })
      })
    }
  }
}
