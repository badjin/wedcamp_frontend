<template>
  <v-app id="inspire" class="overflow-x-hidden">

    <nav-bar @toggleDrawer="toggleDrawer"
             :menu-items="menuItems"
             :selected-tab="activeTab"
             @goTo="goTo"
    />

    <nav-drawer :drawer="drawer"
                :menu-items="menuItems"
                @offDrawer="drawer = false"
                @profile="profileUser"
                @goTo="goTo"
    />

    <v-main>
      <scroll-top />
      <router-view/>
    </v-main>

    <user-profile ref="profile" :user="userInfo" :edit-flag="true"></user-profile>

    <v-snackbar v-model="snackbarMessage.value" top class="mt-3"
                :timeout="snackbarMessage.timeout"
                :color="snackbarMessage.type === 'error' ? themeColor.errorColor : themeColor.successColor"
    >
      {{ snackbarMessage.message }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white"
               icon
               v-bind="attrs"
               @click="snackbarMessage.value = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <v-footer absolute padless>
      <v-img src="https://picsum.photos/1920/1080?random"
             gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
             width="100%" height="46px"
      >
        <div class="pt-3 pl-4 text-center">
          <span class="white--text pt-5 myFontNormal">&copy; 2020 멜번 순복음 교회</span>
        </div>
      </v-img>
    </v-footer>
  </v-app>
</template>

<script>
  import { mapState } from "vuex"
  import UserProfile from "./components/User/UserProfile"
  import NavBar from "./components/NavBar"
  import NavDrawer from "./components/NavDrawer"
  import ScrollTop from "./components/ScrollTop"

  export default {

    components: {
      UserProfile,
      NavBar,
      NavDrawer,
      ScrollTop
    },

    data () {
      return {
        drawer: false,
        menuItems: [
          // {id:0, icon: 'mdi-clipboard-outline', title: 'Notice', to: 'Home'},
          // {id:1, icon: 'mdi-youtube', title: 'On Demand', to: 'onDemand'},
          // {id:2, icon: 'mdi-headphones', title: 'Song Request', to: 'SongRequest'},
          // {id:3, icon: 'mdi-checkerboard', title: 'Feedback', to: 'Feedback'},
          // {id:4, icon: 'mdi-playlist-play', title: 'Playlist', to: 'Playlist'},
          {id:0, icon: 'mdi-clipboard-outline', title: '공지 & 이벤트', titleShort: '공지', to: 'Home'},
          {id:1, icon: 'mdi-youtube', title: '방송 다시보기', titleShort: '다시보기', to: 'onDemand'},
          {id:2, icon: 'mdi-email-plus', title: '사연과 신청곡', titleShort: '신청곡', to: 'SongRequest'},
          // {id:3, icon: 'mdi-checkerboard', title: '시청자 게시판', to: 'Feedback'},
          {id:3, icon: 'mdi-headphones', title: '수찬캠 선곡표', titleShort: '선곡표', to: 'Playlist'},
        ],
      }
    },

    computed: {
      ...mapState('user', ['userInfo']),
      ...mapState('util', ['snackbarMessage']),
      ...mapState(['themeColor', 'activeTab'])
    },
    methods: {
      async profileUser () {
        if (await this.$refs.profile.open('개인프로필', '필요한 항목을 수정하세요', false)) {
          await this.$store.dispatch('user/updateUser', this.userInfo)
        }
      },
      toggleDrawer() {
        this.drawer = !this.drawer
      },
      goTo(item) {
        this.$store.commit('SET_ACTIVE_TAB', item.id)
        if (this.$router.currentRoute.name !== item.to) {
          this.$router.push({name: item.to})
        } else if (this.$router.currentRoute.name === 'onDemand')
          window.location.reload()
      }
    }
  }
</script>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Cute+Font&&display=swap");
  .myFont {
    font-family: 'Black Han Sans', sans-serif;
    font-size: 16px;
    font-weight: 200;
  }

  .myFontNormal {
    font-family: 'Cute Font', cursive;
    font-size: 18px;
    font-weight: 300;
  }

  .myFont33 {
    font-family: 'Cute Font', cursive;
    font-size: 33px;
    font-weight: 300;
  }

  .myFont28 {
    font-family: 'Cute Font', cursive;
    font-size: 28px;
    font-weight: 300;
  }

  .myFont20 {
    font-family: 'Cute Font', cursive;
    font-size: 20px;
  }

  h1 {
    font-family: 'Cute Font', cursive;
    font-weight: 300;
  }
</style>
