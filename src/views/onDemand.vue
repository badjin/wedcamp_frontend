<template>
  <v-container fill-height>
    <v-layout justify-center>
      <v-flex xs24 sm12 md12 lg12 xl12>
        <v-card v-if="selectedTag"
          class="d-flex justify-end mt-3 mb-n12" flat>
          <v-btn color="indigo" dark @click="changedList">전체보기</v-btn>
        </v-card>
        <v-row class="pa-2 mt-12 mb-8">
          <v-col
            cols="12" xs="12" sm="4" md="3" lg="2" xl="2"
            v-if="isLogin && (userRole === 'Admin' || userRole === 'Producer')"
          >
            <v-layout justify-center>
              <v-card class="pa-2 mt-10" flat
                      max-width="180"
              >
                <div class="align-center text-center">
                  <v-btn class="mt-3"
                         fab large dark color="indigo"
                         @click="addVideo"
                  >
                    <v-icon dark>mdi-plus</v-icon>
                  </v-btn>
                </div>
                <v-card-subtitle class="text-center myFontNormal">
                  {{ cardText }}
                </v-card-subtitle>
              </v-card>
            </v-layout>
          </v-col>

          <v-col
            cols="12" xs="12" sm="4" md="3" lg="2" xl="2"
            v-for="(vod, index) in filteredVOD"
            :key="index"
          >
            <v-layout justify-center>
              <VodCard :vod="vod"
                       :selected-tag="selectedTag"
                       @showVOD="showVOD(vod)"
                       @editVOD="editVOD(vod)"
                       @deleteVOD="deleteVOD(vod)"
                       @sortingByTag="sortingByTag"
              />
            </v-layout>
          </v-col>
        </v-row>
        <infinite-loading :identifier="infiniteId" @infinite="initialize"></infinite-loading>
      </v-flex>
    </v-layout>
    <confirm ref="confirm"></confirm>
    <vod-dialog ref="dialog" />
    <embed-player ref="iframe" :index="index" :videos="videos"></embed-player>
  </v-container>
</template>

<script>

import {mapState} from "vuex"
import confirm from "../components/ConfirmDialog";
import VodDialog from "../components/VodDialog";
import VodCard from "../components/VodCard";
import embedPlayer from "../components/embedPlayer";

export default {
  components: {
    confirm,
    VodDialog,
    VodCard,
    embedPlayer
  },
  mounted() {
    this.$store.commit('SET_ACTIVE_TAB', 1)
    // this.initialize()
  },

  data() {
    return {
      page: 1,
      infiniteId: +new Date(),
      isLoading: false,
      // cardText: "Add your YouTube link.",
      cardText: "유튜브 방송 추가하기",
      filteredVOD: [],
      selectedTag: "",
      media: '',
      youtube_link: false,

      vod: {
        title: '',
        video_id: '',
        video_url: '',
        tags: []
      },

      index: -1,
      videos: []
    }
  },
  computed: {
    ...mapState(['themeColor']),
    ...mapState('user', ['isLogin', 'userRole']),
    ...mapState('vod', ['videos']),
  },
  methods: {
    addVideo () {
      this.$refs.dialog.open('방송 추가하기', {
        title: '',
        video_id: '',
        video_url: '',
        tags: []
      }, 'vod/addVOD')
      .then((res) => {
        if (res) this.changedList()
      })
    },
    showVOD(vod) {
      if (vod.video_url) {
        this.videos= []
        this.youtube_link = true
        this.media = vod.video_url
        this.videos.push(vod)
        this.index = 0

        this.$refs.iframe.open()
      }
    },
    async editVOD(vod) {
      await this.$refs.dialog.open('방송 수정하기', vod, 'vod/updateVOD')
    },
    async deleteVOD(vod) {
      if (await this.$refs.confirm.open('선택된 항목을 삭제합니다.', '삭제 할까요?', { color: this.themeColor.errorColor })) {
        await this.$store.dispatch('vod/deleteVOD', vod)
        this.changedList()
      }
    },
    sortingByTag(tag) {
      let filteredVOD = this.filteredVOD.filter(vod => {
        return vod.tags.find(t => t.text === tag.text)
      })
      this.selectedTag = tag.text
      this.filteredVOD = filteredVOD
    },
    changedList() {
      setTimeout(() => {
        this.page = 1
        this.filteredVOD = []
        this.infiniteId += 1
        this.selectedTag = ""
      }, 300)
    },

    initialize($state) {
      this.$store.dispatch("vod/getVideoByPage", this.page)
        .then(res => {
          if (res.length && this.page <= this.$store.state.vod.lastPage) {
            this.page += 1;
            this.filteredVOD.push(...res)
            $state.loaded()
          }
          else $state.complete()
        })
    }
  }
}
</script>
