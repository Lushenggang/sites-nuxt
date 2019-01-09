<template>
  <div>
    <template v-if="loaded">
      <slot :userinfo="userinfo"></slot>
    </template>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      loaded: false,
    }
  },
  computed: {
    userinfo () {
      if (!this.loaded) return null
      return this.$store.state.user.info[this.userId]
    }
  },
  watch: {
    userId () {
      this.refreshInfo()
    }
  },
  created () {
    this.refreshInfo()
  },
  methods: {
    ...mapActions({
      getInfo: 'user/getInfo'
    }),
    refreshInfo () {
      if (this.userId) {
        this.getInfo({
          id: this.userId,
          callback: () => {
            this.loaded = true
          }
        })
      }
    }
  }
}
</script>
