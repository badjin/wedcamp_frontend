<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md8>
        <v-card
          max-width="400"
          color="white"
          class="elevation-20 mx-auto pa-3 transparent"
          shaped
          dark
        >
          <AlertInForm />

          <dialog-title :title="title" :sub-title="subTitle" />

          <v-form v-model="valid">
            <v-row class="pa-2 mb-n7">
              <v-col cols="undefined">
                <v-text-field
                  v-model="user.name"
                  solo
                  light
                  prepend-icon="mdi-account"
                  type="text"
                  label="이름"
                  outlined
                  :rules="[rules.required, rules.min3]"
                />
              </v-col>
              <v-col cols="4">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn fab icon class="ml-4" v-on="on" @click="openAvatarPicker">
                      <v-avatar v-if="user.avatar_image">
                        <v-img :src="user.avatar_image" max-height="100px" max-width="100px" />
                      </v-avatar>
                      <v-avatar v-else>
                        <v-img :src="`${avatarUrl}users-${user.avatar_id}.svg`" />
                      </v-avatar>
                    </v-btn>
                  </template>
                  <span>개인 프로필 이미지를 선택하세요</span>
                </v-tooltip>
              </v-col>
            </v-row>

            <div class="pa-2">
              <v-text-field
                v-model="user.email"
                solo
                light
                prepend-icon="mdi-email"
                type="email"
                label="이메일"
                outlined
                :rules="[rules.required, rules.emailCheck]"
              />
              <v-text-field
                v-model="user.password"
                solo
                light
                prepend-icon="mdi-lock"
                label="비밀번호"
                outlined
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                @click:append="show = !show"
                hint="At least 8 characters"
                :rules="[rules.required, rules.min8]"
              />
              <v-text-field
                v-model="user.password_confirmation"
                solo
                light
                prepend-icon="mdi-lock-alert"
                label="비밀번호 확인"
                outlined
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                @click:append="show1 = !show1"
                @keyup.enter="registerUser"
                :rules="[rules.required, passwordConfirmationRule]"
              />
            </div>

            <v-card-actions>
              <v-btn
                class="mb-2"
                large
                block
                :color="themeColor.btnColor"
                @click="registerUser"
                :disabled="!valid"
              >
                <h1>회원가입</h1>
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
    <avatar-picker
      v-model="showAvatarPicker"
      :currentAvatar="user.avatar_id"
      :path="path"
      @selected="selectAvatar"
    />
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import AlertInForm from "../components/AlertInForm";
import AvatarPicker from "../components/User/AvatarPicker";
import DialogTitle from "../components/DialogTitle";

export default {
  components: {
    AlertInForm,
    AvatarPicker,
    DialogTitle
  },
  props: {
    source: String
  },
  data() {
    return {
      title: "환영합니다",
      subTitle: "개인 세부사항을 아래에 입력하세요",
      showAvatarPicker: false,
      valid: false,
      show: false,
      show1: false,
      passFlag: false,
      path: "",

      user: {
        name: null,
        avatar_id: 1,
        avatar_image: null,
        email: null,
        password: null,
        password_confirmation: null
      }
    };
  },
  computed: {
    ...mapState(["rules", "avatarUrl", "themeColor"]),
    passwordConfirmationRule() {
      return () =>
        this.user.password === this.user.password_confirmation ||
        "비밀번호가 일치하지 않습니다";
    }
  },
  methods: {
    ...mapActions({
      register: "user/register"
    }),
    registerUser() {
      if (!this.valid) return;
      this.register(this.user).then(() => {
        this.$router.push({ name: "Login" });
      });
    },
    openAvatarPicker() {
      this.showAvatarPicker = true;
    },
    selectAvatar(avatar) {
      this.user.avatar_id = avatar.avatar;
      this.user.avatar_image = avatar.image;
    }
  }
};
</script>

<style lang="scss" scoped>
.transparent {
  background-color: #3f51b5 !important;
  opacity: 0.9;
  border-color: transparent !important;
}
</style>
