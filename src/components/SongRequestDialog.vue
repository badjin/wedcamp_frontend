<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-form v-model="valid">
        <v-card class="pa-4">
          <v-container>
            <v-card-text class="myFont33">{{subject}}</v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field counter="30"
                              placeholder="게시글 제목"
                              v-model="title"
                              prepend-icon="mdi-format-title"
                              :rules="[rules.required, rules.min3, rules.max30]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="mt-n8">
                <v-text-field placeholder="신청자 이름"
                              v-model="name"
                              prepend-icon="mdi-account"
                              hint="방송에 소개될 이름을 입력하세요."
                              :rules="[rules.max20]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="mt-n8">
                <v-text-field placeholder="휴대폰번호"
                              type="number"
                              v-model="mobile"
                              prepend-icon="mdi-cellphone"
                              hint="방송중에 통화할 수 있어요."
                              class="mobileNumber"
                              :rules="[rules.max10]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="mt-n8">
                <v-textarea
                  placeholder="사연을 작성해 주세요."
                  prepend-icon="mdi-text-subject"
                  clearable
                  clear-icon="mdi-close"
                  label=""
                  rows="5"
                  v-model="description"
                  :rules="[rules.required, rules.min8]"
                />
              </v-col>
              <v-col cols="12" sm="7" class="mt-n8">
                <v-checkbox
                  v-model="isMFGC"
                  label="멜번 순복음 교회 성도님 이신가요?"
                >
                </v-checkbox>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancel"><h1>취소</h1></v-btn>
            <v-btn color="blue darken-1" text @click="save" :disabled=disabled><h1>저장</h1></v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-row>
</template>

<script>
  import {mapState} from "vuex"

  export default {
    name: "SongRequestDialog",
    props: ['editedSongReq'],

    data () {
      return {
        valid: false,
        dialog: false,
        updateTagFlag: false
      }
    },

    watch: {
      dialog (val) {
        if (val) {
          this.initialize()
        }
        val || this.close
      },

      title(newVal, prev) {
        if (prev === undefined) return
        if (newVal) this.updateTagFlag = true
      },

      name(newVal, prev) {
        if (prev === undefined) return
        if (newVal) this.updateTagFlag = true
      },

      isMFGC(newVal, prev) {
        if (prev === undefined) return
        if (newVal) this.updateTagFlag = true
      },

      mobile(newVal, prev) {
        if (prev === undefined) return
        if (newVal) this.updateTagFlag = true
      },

      description (newVal, prev) {
        if (prev === undefined) return
        if (newVal) this.updateTagFlag = true
      }
    },

    computed: {
      ...mapState(['rules']),

      title: {
        get() {
          return this.editedSongReq.title
        },
        set(value) {
          this.editedSongReq.title = value
        }
      },

      name: {
        get() {
          return this.editedSongReq.real_name
        },
        set(value) {
          this.editedSongReq.real_name = value
        }
      },

      mobile: {
        get() {
          return this.editedSongReq.mobile
        },
        set(value) {
          this.editedSongReq.mobile = value
        }
      },

      isMFGC: {
        get() {
          return this.editedSongReq.is_mfgc
        },
        set() {
          this.editedSongReq.is_mfgc = !this.editedSongReq.is_mfgc
        }
      },

      description: {
        get() {
          return this.editedSongReq.description
        },
        set(value) {
          this.editedSongReq.description = value
        }
      },
      disabled: function() {
        return (!this.valid || !this.updateTagFlag)
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
      }
    }
  }
</script>

<style lang="scss">
  /*.mobileNumber input[type='number'] {*/
  /*  -moz-appearance:textfield;*/
  /*}*/
  .mobileNumber input::-webkit-outer-spin-button,
  .mobileNumber input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
</style>
