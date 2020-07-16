import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import util from './modules/util';
import notice from './modules/notice';
import vod from './modules/vod';
import songRequest from './modules/songRequest';
import playlist from './modules/playlist';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    rules: {
      image: (value) =>
        !value ||
        value.size < 2000000 ||
        '아바타 이미지 용량은 2 MB 보다 작아야 합니다.',
      required: (value) => !!value || '필수 입력항목 입니다.',
      min3: (value) => (value || '').length >= 3 || '최소 3글자 이상 입력해야 합니다.',
      min8: (value) => (value || '').length >= 8 || '최소 8글자 이상 입력해야 합니다.',
      min9: (value) => (value || '').length >= 9 || '최소 8글자 이상 입력해야 합니다.',
      max10: (value) =>
        (value || '').length < 11 || '휴대폰번호는 총 10자리 입니다.',
      max20: (value) =>
        (value || '').length < 21 || '최대 20글자까지 입력이 가능합니다.',
      max30: (value) =>
        (value || '').length < 31 || '최대 30글자까지 입력이 가능합니다.',
      emailCheck: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || '이메일 주소를 입력하세요.';
      },
      url: (value) => {
        const regex = /^(http|https)/;
        if (value.length > 8 && value.match(regex)) return true;
        else return '유효하지 않은 주소 입니다.';
        // return (value.length > 8 && value.match(regex)) || 'Invalid url.'
      },
    },
    themeColor: {
      color: '#3F51B5',
      backgroundColor: '#9FA8DA',
      cardTitleColor: '#3F51B5',

      btnColor: '#1A237E',
      dialogColor: '#E8EAF6',

      tagColor: '#b3b018',
      errorColor: '#5f394a',
      successColor: '#3fb180',
    },
    avatarUrl: process.env.VUE_APP_IMAGE_URL,
    activeTab: 0,
  },
  mutations: {
    SET_ACTIVE_TAB(state, payload) {
      state.activeTab = payload;
    },
  },
  actions: {},
  modules: {
    user,
    util,
    notice,
    vod,
    songRequest,
    playlist,
  },
});
