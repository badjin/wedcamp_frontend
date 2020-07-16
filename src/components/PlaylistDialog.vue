<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-form v-model="valid">
        <v-card class="pa-4">
          <v-container>
            <v-card-text class="myFont33">{{subject}}</v-card-text>
            <v-row>
              <v-col cols="12" sm="3" class="myFont22 mt-3">
                <v-chip color="orange darken-3" dark>Episode {{ episode }}</v-chip>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="12" sm="6" class="myFont22">
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="on_air"
                      label="방송일자"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="on_air" @input="menu = false"></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-card flat>
              <v-app-bar>
                <v-toolbar-title>찬양 추가하기 |
                  <small style="color: #ff4500">{{ editedPlaylist.song_list.length }}</small>
                  <small> / 10</small>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon :disabled="editedPlaylist.song_list.length === 10"
                       @click="addSong"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-app-bar>
              <song-list-staff :song-list="editedPlaylist.song_list"
                               @deleteSong="deleteSong"
              />
            </v-card>

          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancel"><h1>취소</h1></v-btn>
            <v-btn color="blue darken-1" text @click="save" :disabled=disabled><h1>저장</h1></v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
      <song-dialog ref="dialog" thumb-nail="thumbNail"
                   @addSongToList="addSongDone"
                   @deleteSong="deleteSong"
      />
      <iFramePlayer ref="iframe" :media="media" :youtube_link="youtube_link"/>
      <confirm ref="confirm"></confirm>
    </v-dialog>
  </v-row>
</template>

<script>
  import {mapState} from "vuex"
  import SongDialog from "./SongDialog";
  import SongListStaff from "./SongListStaff";
  import iFramePlayer from "./iFramePlayer";
  import confirm from "../components/ConfirmDialog";

  export default {
    name: "PlaylistDialog",
    props: ['editedPlaylist'],
    components: {
      SongDialog,
      SongListStaff,
      iFramePlayer,confirm
    },

    data () {
      return {
        valid: false,
        dialog: false,
        updateTagFlag: false,
        menu: false,

        media: '',
        youtube_link: false
      }
    },

    watch: {
      dialog (val) {
        if (val) {
          this.initialize()
        }
        val || this.close
      },

      on_air(newVal, prev) {
        if (prev === undefined) return
        if (newVal) this.updateTagFlag = true
      },

      songList (newVal, prev) {
        if (prev === undefined) return
        if (newVal) this.updateTagFlag = true
      }
    },

    computed: {
      ...mapState(['rules', "themeColor"]),

      episode: {
        get() {
          if (this.$store.state.playlist.playlists.length === 0) return 1
          return (!this.editedPlaylist.episode) ?
            this.$store.state.playlist.playlists[0].episode+1 : this.editedPlaylist.episode
        }
      },
      on_air: {
        get() {
          return this.editedPlaylist.on_air
        },
        set(value) {
          this.editedPlaylist.on_air = value
        }
      },
      songList: {
        get() {
          return this.editedPlaylist.song_list
        }
      },
      disabled: function() {
        return !this.updateTagFlag
      },
      permission: {
        get() {
          return this.$store.state.user.isLogin && (this.$store.state.user.userRole !== 'Member');
        }
      }
    },

    methods: {
      open(subject) {
        this.dialog = true
        this.subject = subject
        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },

      save() {
        this.editedPlaylist.episode = this.episode
        this.resolve(true)
        this.dialog = false
      },

      cancel() {
        this.resolve(false)
        this.dialog = false
      },

      async initialize() {
        this.valid = false
        this.updateTagFlag = false
      },
      async addSong() {
        let song = Object.assign({}, {
          video_id: '',
          video_url: '',
          title: ''
        });
        await this.$refs.dialog.open("찬양 추가하기", song)
      },
      addSongDone(song) {
        this.editedPlaylist.song_list.push(song)
      },
      playMusic(item) {
        if (item.video_url) {
          this.youtube_link = true
          this.media = item.video_url
          this.$refs.iframe.open()
        }
      },
      async deleteSong(item) {
        const index = this.editedPlaylist.song_list.indexOf(item)
        if (await this.$refs.confirm.open('선택된 항목을 삭제합니다.', '삭제 할까요?', { color: this.themeColor.errorColor })) {
          this.editedPlaylist.song_list.splice(index, 1)
        }
      },
    }
  }
</script>

<style scoped>

</style>
