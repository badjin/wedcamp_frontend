<template>
  <v-dialog v-model="dialog" persistent max-width="1024">
    <v-card color="black">
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="white" text @click="closePlayer">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-actions>
      <v-responsive :aspect-ratio="16/9">
        <div class="text-center wrapper h_iframe mb-n2">
          <v-img
            :src="media"
          >
          </v-img>

          <iframe v-if="dialog && youtube_link"
                  :src="media"
                  frameborder="0"
                  allow="autoplay; encrypted-media"
                  allowfullscreen
          />
        </div>
      </v-responsive>
    </v-card>
  </v-dialog>
</template>

<script>

  export default {
    components: {
    },
    props: ['media', 'youtube_link'],
    data () {
      return {
        dialog: false
      }
    },
    watch: {
      dialog (val) {
        val || this.close
      },
    },

    methods: {
      open() {
        this.dialog = true
        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },
      closePlayer() {
        this.resolve(false)
        this.dialog = false
      }
    }
  }
</script>

<style scoped>
  .wrapper {
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }

  .h_iframe {
    position: relative;
  }

  .h_iframe .ratio {
    display: block;
    width: 100%;
    height: auto;
  }

  .h_iframe iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
