<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs24 sm10 md10 lg10 xl10>
        <v-card>
          <v-btn>Feedback</v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import {mapState} from "vuex"

export default {
  data () {
    return {

    }
  },
  computed: {
    ...mapState('user', ['userRole']),
  },
}
</script>
