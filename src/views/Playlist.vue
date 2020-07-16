<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs24 sm10 md10 lg8 xl8>
        <v-card max-width="600" class="mx-auto">
          <v-toolbar color="indigo" dark>
            <v-toolbar-title class="myFont33">수요찬양캠프 선곡표</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="isLogin && (userRole !== 'Member')" icon @click="addPlaylist">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-toolbar>

          <v-row justify="center" class="pa-4">
            <v-expansion-panels accordion>
              <v-expansion-panel v-for="(playlist, index) in playlists" :key="index">
                <v-expansion-panel-header>
                  <v-col cols="12" xs="3">
                    <div>Episode {{playlist.episode}}</div>
                  </v-col>
<!--                  <v-col cols="12" xs="3">-->
<!--                    <span style="color: darkgreen; font-size: small">{{ playlist.on_air }}</span>-->
<!--                  </v-col>-->

                  <v-spacer></v-spacer>
                  <v-col v-if="isLogin && (userRole !== 'Member')" class="mr-n3" cols="12" sm="3">
                    <v-icon small class="mr-3" @click.stop="editPlaylist(playlist)">mdi-pencil</v-icon>
                    <v-icon small @click.stop="deletePlaylist(playlist)">mdi-delete</v-icon>
                  </v-col>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <song-list
                    v-if="playlist.song_list.length"
                    :song-list="playlist.song_list"
                    :aired-date="playlist.on_air"
                    :permission="isLogin"
                    @playMusic="playMusic"
                    @needLogin="needLogin"
                  />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-row>
          <Paginate
            :table="searchTable"
            :keyword="searchKeyword"
            :store="storeName"
            class="pa-3 mt-n5 mb-12"
          />
        </v-card>
      </v-flex>
    </v-layout>
    <playlist-dialog ref="dialog" :edited-playlist="editedPlaylist" />
    <confirm ref="confirm"></confirm>
    <embedPlayer ref="iframe" :index="index" :youtube_link="youtube_link" :videos="videos" />
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import Paginate from "../components/Paginate";
import PlaylistDialog from "../components/PlaylistDialog";
import confirm from "../components/ConfirmDialog";
import SongList from "../components/SongList";
import embedPlayer from "../components/embedPlayer";

export default {
  components: {
    Paginate,
    PlaylistDialog,
    confirm,
    SongList,
    embedPlayer
  },
  data() {
    return {
      searchTable: "",
      searchKeyword: "",
      storeName: "playlist",

      editedIndex: -1,
      editedPlaylist: {},

      index: -1,
      videos: [],
      youtube_link: false,

      localPlaylists: []
    };
  },
  mounted() {
    this.$store.commit("SET_ACTIVE_TAB", 3);
    this.getList();
  },
  computed: {
    ...mapState(["themeColor"]),
    ...mapState("user", ["isLogin", "userRole"]),
    ...mapState("playlist", ["playlists"])
  },
  methods: {
    getList() {
      if (this.$store.dispatch("playlist/getList")) {
        this.localPlaylists = this.$store.state.playlist.playlists;
      }
    },
    async addPlaylist() {
      this.editedPlaylist = Object.assign(
        {},
        {
          episode: 0,
          song_list: [],
          on_air: new Date().toISOString().substr(0, 10)
        }
      );
      if (await this.$refs.dialog.open("선곡표 추가하기")) {
        await this.add();
      } else this.close();
    },
    async editPlaylist(item) {
      this.editedIndex = this.$store.state.playlist.playlists.indexOf(item);
      this.editedPlaylist = Object.assign({}, item);
      if (await this.$refs.dialog.open("선곡표 수정하기")) {
        this.save();
      } else this.close();
    },

    deletePlaylist(item) {
      const index = this.$store.state.playlist.playlists.indexOf(item);
      if (
        this.$refs.confirm.open("선택된 선곡표를 삭제합니다", "삭제할까요?", {
          color: this.themeColor.errorColor
        })
      ) {
        this.editedPlaylist = this.$store.state.playlist.playlists[index];
        if (this.$store.dispatch("playlist/deletePlaylist", item)) {
          this.$store.commit("playlist/DELETE_PLAYLIST", index);
          this.close();
          // this.getList()
        }
      }
    },
    save() {
      if (this.editedIndex > -1) {
        this.$store
          .dispatch("playlist/updatePlaylist", this.editedPlaylist)
          .then(res => {
            if (res) {
              this.$store.commit("playlist/UPDATE_PLAYLIST", {
                index: this.editedIndex,
                data: this.editedPlaylist
              });
              this.close();
            }
          });
      }
    },
    add() {
      this.$store
        .dispatch("playlist/addPlaylist", this.editedPlaylist)
        .then(res => {
          if (res) {
            this.localPlaylists.unshift(this.editedPlaylist);
            this.close();
          }
        });
    },
    playMusic(item) {
      this.videos = [];
      this.videos = item.selectedList

      if (!this.videos.length) {
        this.videos.push(item.song);
        this.index = 0;
      } else {
        this.index = item.selectedList.indexOf(item.song);
        if (this.index === -1) this.index = 0;
      }

      this.$refs.iframe.open()
    },
    needLogin() {
      this.$refs.confirm
        .open("로그인이 필요한 서비스입니다.", "로그인 페이지로 이동합니다.", {
          color: this.themeColor.errorColor
        })
        .then(res => {
          if (res) {
            this.$router.push({ name: "Login" });
          }
        });
    },
    close() {
      setTimeout(() => {
        this.editedPlaylist = {};
        this.editedIndex = -1;
      }, 300);
    }
  }
};
</script>
