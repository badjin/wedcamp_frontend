<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs24 sm16 md10>
        <v-card class>
          <v-data-table dense
            class="elevation-1 pa-2 mb-12"
            :headers="headers"
            :items="requests"
            sort-desc
            :expanded.sync="expanded"
            hide-default-footer
            @click:row="clicked"
          >
            <template v-slot:top>
              <v-toolbar flat class="hidden-xs-only">
                <v-tooltip v-if="!editFlag" bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-show="isLogin" icon @click="addSongReq" v-on="on" class="mr-4">
                      <v-icon>mdi-email-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>글쓰기</span>
                </v-tooltip>
                <v-tooltip v-if="!editFlag" bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-show="searchFlag" icon @click="listAll" v-on="on">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                  <span>전체목록</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    :placeholder="searchText"
                    single-line
                    hide-details
                    @keyup.enter="findingByTag(search)"
                  ></v-text-field>
                </v-col>
                <v-tooltip v-if="!editFlag" bottom>
                  <template v-slot:activator="{ on }">
                    <v-switch v-model="searchField" class="mt-5" v-on="on"></v-switch>
                  </template>
                  <span>검색항목</span>
                </v-tooltip>
              </v-toolbar>
              <v-toolbar flat class="hidden-sm-and-up mt-10">
                <v-row>
                  <v-tooltip v-if="!editFlag" bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-show="isLogin" icon @click="addSongReq" v-on="on" class="mr-4">
                        <v-icon>mdi-email-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>글쓰기</span>
                  </v-tooltip>
                  <v-tooltip v-if="!editFlag" bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-show="searchFlag" icon @click="listAll" v-on="on">
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </template>
                    <span>전체목록</span>
                  </v-tooltip>
                  <v-spacer />
                  <v-tooltip v-if="!editFlag" bottom>
                    <template v-slot:activator="{ on }">
                      <v-switch v-model="searchField" class="mt-3" v-on="on"></v-switch>
                    </template>
                    <span>검색항목</span>
                  </v-tooltip>
                  <v-col cols="12" xs="12">
                    <v-text-field
                      class="mt-n6 mb-8"
                      v-model="search"
                      append-icon="mdi-magnify"
                      :placeholder="searchText"
                      single-line
                      hide-details
                      @keyup.enter="findingByTag(search)"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-toolbar>
            </template>

            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <div class="pa-8">{{ item.description }}</div>
              </td>
            </template>

            <template v-slot:item.id="{ item }">{{ item.id }}</template>

            <template v-slot:item.avatar_id="{ item }">
              <v-avatar v-if="item.avatar_id > 0">
                <v-img :src="`${avatarUrl}users-${item.avatar_id}.svg`" />
              </v-avatar>
              <v-avatar v-else size="42">
                <v-img :src="item.avatar_image" max-height="100px" max-width="100px" />
              </v-avatar>
            </template>

            <template v-slot:item.name="{ item }">
              <v-btn text @click.stop="sortingByTag(item.name)">{{ item.name }}</v-btn>
            </template>

            <template v-slot:item.title="{ item }">
              <div class="myFontNormal">{{item.title}}</div>
            </template>

            <template v-slot:item.updated_at="{ item }">{{ item.updated_at | formatDate }}</template>

            <template v-slot:item.actions="{ item }">
              <div v-if="isLogin && (userRole !== 'Member' || userInfo.id === item.user_id)">
                <v-icon small class="mr-3" @click.stop="editSongReq(item)">mdi-pencil</v-icon>
                <v-icon small @click.stop="deleteSongReq(item)">mdi-delete</v-icon>
              </div>
            </template>
          </v-data-table>
          <Paginate
            :table="searchTable"
            :keyword="searchKeyword"
            :store="storeName"
            class="pa-3 mt-n12 mb-12" />
        </v-card>
      </v-flex>
    </v-layout>
    <song-request-dialog ref="dialog" :edited-song-req="editedSongReq" />
    <confirm ref="confirm"></confirm>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import SongRequestDialog from "../components/SongRequestDialog";
import confirm from "../components/ConfirmDialog";
import Paginate from "../components/Paginate";

export default {
  components: {
    SongRequestDialog,
    confirm,
    Paginate
  },
  data() {
    return {
      headers: [
        {
          text: "번호",
          align: "center",
          sortable: false,
          value: "id",
          width: 55
        },
        {
          text: "아바타",
          align: "center",
          sortable: false,
          value: "avatar_id"
        },
        { text: "글쓴이", align: "center", sortable: false, value: "name" },
        {
          text: "신청곡",
          align: "center",
          sortable: false,
          value: "title",
          width: 304
        },
        {
          text: "등록일",
          align: "center",
          sortable: false,
          value: "updated_at"
        },
        { text: "", align: "end", value: "actions", sortable: false, width: 76 }
      ],
      search: "",
      singleExpand: false,
      expanded: [],
      filteredReq: [],
      searchFlag: false,
      editedSongReq: {},
      defaultSongReq: {
        title: "",
        name: "",
        mobile: "",
        isMFGC: false,
        description: ""
      },
      editedIndex: -1,
      searchField: true,
      searchText: "신청곡에서 검색",
      searchTable: "title",
      searchKeyword: "",
      storeName: 'songRequest'
    };
  },
  mounted() {
    this.$store.commit('SET_ACTIVE_TAB', 2)
    this.listAll();
  },
  computed: {
    ...mapState(["avatarUrl", "themeColor"]),
    ...mapState("user", ["isLogin", "userRole", "userInfo"]),
    ...mapState("songRequest", ["requests"])
  },
  watch: {
    searchField(val) {
      this.searchTable = val ? "title" : "name";
      this.searchText = val ? "신청곡에서 검색" : "글쓴이에서 검색";
    }
  },
  methods: {
    initialize() {
      this.$store
        .dispatch("songRequest/getList", { page: 1, table: "id", keyword: "*" })
        .then(() => {
          this.filteredReq = this.$store.state.songRequest.requests;
        });
    },
    async getList(table, keyword) {
      await this.$store.dispatch("songRequest/getList", {
        page: 1,
        table: table,
        keyword: keyword
      });
    },
    listAll() {
      this.searchTable = "title";
      this.searchKeyword = "";
      this.getList(this.searchTable, this.searchKeyword);
      this.searchFlag = false;
      this.searchField = true;
    },

    async addSongReq() {
      this.editedSongReq = Object.assign({}, this.defaultSongReq);
      if (await this.$refs.dialog.open("신청곡 작성하기")) {
        await this.add();
      } else this.close();
    },
    async editSongReq(item) {
      this.editedIndex = this.$store.state.songRequest.requests.indexOf(item);
      this.editedSongReq = Object.assign({}, item);
      if (await this.$refs.dialog.open("게시글 수정하기")) {
        await this.save();
      } else this.close();
    },
    async deleteSongReq(item) {
      const index = this.$store.state.songRequest.requests.indexOf(item);
      if (
        await this.$refs.confirm.open(
          "선택된 게시글을 삭제합니다",
          "삭제할까요?",
          { color: this.themeColor.errorColor }
        )
      ) {
        this.editedSongReq = this.$store.state.songRequest.requests[index];
        await this.$store.dispatch("songRequest/deleteSongReq", item);
        await this.getList(this.searchTable, this.searchKeyword);
      }
    },
    close() {
      setTimeout(() => {
        this.editedSongReq = {};
        this.editedIndex = -1;
      }, 300);
    },
    async save() {
      if (this.editedIndex > -1) {
        // Object.assign(this.filteredReq[this.editedIndex], this.editedSongReq)
        this.close();
        await this.$store.dispatch(
          "songRequest/updateSongReq",
          this.editedSongReq
        );
        await this.getList(this.searchTable, this.searchKeyword);
      }
    },
    async add() {
      this.close();
      await this.$store.dispatch("songRequest/addSongReq", this.editedSongReq);
      this.listAll();
    },

    sortingByTag(name) {
      if (!name) {
        this.listAll();
        return;
      }
      this.searchTable = "name";
      this.searchKeyword = name;
      this.getList(this.searchTable, this.searchKeyword);
      // this.filteredReq = this.filteredReq.filter(song => {
      //   return (song.name === name)
      // })
      this.searchFlag = true;
      this.search = "";
    },
    findingByTag(tag) {
      if (!tag) {
        this.listAll();
        return;
      }
      this.searchKeyword = tag;
      this.getList(this.searchTable, this.searchKeyword);
      // this.filteredReq = this.filteredReq.filter(song => {
      //   if (this.searchField) return (song.title.search(tag) >= 0)
      //   return (song.name.search(tag) >= 0)
      // })
      this.searchFlag = true;
      this.search = "";
    },
    clicked(value) {
      const index = this.expanded.indexOf(value);
      if (index === -1) {
        if (this.expanded.length > 0) this.expanded.splice(index, 1);
        this.expanded.push(value);
      } else {
        this.expanded.splice(index, 1);
      }
    }
  }
};
</script>

<style scoped>
.v-btn {
  text-transform: none !important;
}
</style>
