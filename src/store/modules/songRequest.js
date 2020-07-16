// import Api from "../../axios";

export default {
  namespaced: true,
  state: {
    requests: [],
    currentPage: 1,
    lastPage: 1
  },
  mutations: {
    SET_ALL_REQUESTS(state, payload) {
      state.requests = payload
    },
    ADD_REQUEST (state, payload) {
      state.requests.push(payload)
    },
    SET_PAGES(state, payload) {
      state.currentPage = payload.currentPage
      state.lastPage = payload.lastPage
    },
    SET_CURRENT_PAGES(state, page) {
      state.currentPage = page
    },
    DELETE_REQUEST(state, index) {
      state.requests.splice(index, 1)
    }
  },
  actions: {
    getList({commit, dispatch}, payload) {
      return new Promise((resolve) => {
        dispatch('util/getData', {
          path: 'song-request/index?page='+payload.page+'&table='+payload.table+'&keyword='+payload.keyword
        }, {root: true})
          .then(res => {
            commit('SET_PAGES', {
              currentPage: res.song_reqs.current_page,
              lastPage: res.song_reqs.last_page
            })
            commit('SET_ALL_REQUESTS', res.song_reqs.data)
            resolve(true)
        })
      })
    },
    addSongReq({ commit, dispatch }, payload) {
      dispatch('util/postData', {
        path: 'song-request/store',
        data: payload
      }, {root: true}).then((res) => {
        commit('ADD_REQUEST', res.song_req)
      })
    },
    updateSongReq ({ dispatch }, payload) {
      dispatch('util/postData', {
        path: 'song-request/update',
        data: payload
      }, {root: true})
    },
    deleteSongReq ({ dispatch }, payload) {
      return new Promise((resolve) => {
        dispatch('util/postData', {
          path: 'song-request/delete',
          data: payload
        }, {root: true}).then(() => {
          resolve(true)
        })
      })
    },
  }
}
