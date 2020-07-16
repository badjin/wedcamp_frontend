<template>
  <v-list v-if="SongList.length > 0">
    <v-subheader class="mt-n6">
      <span style="color: darkgreen; font-size: small">{{ airedDate }}</span>
      <v-spacer></v-spacer>
      <small style="color: orangered">{{ count }}</small>
      <small> / {{SongList.length}}</small>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon
                 v-on="on"
                 class="mr-n2"
                 @click="setActiveToggle"
          >
            <v-icon
              v-if="!active"
              color="grey lighten-1"
            >
              mdi-star-outline
            </v-icon>

            <v-icon
              v-else
              color="orange"
            >
              mdi-star
            </v-icon>
          </v-btn>
        </template>
        <span>Select All</span>
      </v-tooltip>
    </v-subheader>
    <v-divider class="mb-2"></v-divider>
    <v-list-item-group v-model="selected" style="max-height: 204px" class="overflow-y-auto mb-n4">
      <template v-for="(item, index) in SongList">
        <v-list-item :key="index" @click="setList(index)">
          <v-hover v-slot:default="{ hover }">
            <v-card
              :elevation="hover ? 12 : 2"
              class="ml-n1 mr-4 mb-2"
              max-width="80"
              max-height="45"
              link
              @click.stop="playMusic({item, selectedList})"
            >
              <v-img
                :src="`https://img.youtube.com/vi/${item.video_id}/default.jpg`"
                max-width="80"
                max-height="45"
              ></v-img>
            </v-card>
          </v-hover>
          <v-list-item-content>
            <v-list-item-subtitle v-text="item.title"></v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-icon v-if="!isActive[index]" color="grey lighten-1">mdi-star-outline</v-icon>
            <v-icon v-else color="orange">mdi-star</v-icon>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list-item-group>
  </v-list>
</template>

<script>
export default {
  name: "SongList",
  props: ["SongList", "airedDate", "permission"],

  data() {
    return {
      selected: [-1],
      isActive: [],
      selectedList: [],
      active: false,
      count: 0
    };
  },

  mounted() {
    this.isActive = this.SongList.map(song => {
      return !song.title;
    });
  },

  methods: {
    playMusic(item) {
      if (!this.permission) {
        this.$emit("needLogin");
      } else {
        for (let i = 0; i < this.SongList.length; i++) {
          if (this.isActive[i]) this.selectedList.push(this.SongList[i]);
        }
        this.$emit("playMusic", item);
      }
    },

    setList(index) {
      this.isActive[index] = !this.isActive[index]
      this.count = (this.isActive.filter(i => i === true)).length
    },

    setActiveToggle() {
      this.active = !this.active
      this.count = this.active ? this.SongList.length : 0
      this.isActive = this.SongList.map(() => {
        return this.active
      })
    }
  }
};
</script>

<style scoped>
</style>
