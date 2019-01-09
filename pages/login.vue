<template>
  <div class="login-page">
  </div>
</template>

<script>
import userApi from '@/api/user'
import { setToken } from '@/libs/tool'

export default {
  data () {
    return {}
  },
  mounted () {
    this.loginWithCode()
  },
  methods: {
    loginWithCode () {
      if (!this.$route.query.code) return
      userApi.githubLogin(this.$route.query.code).then(res => {
        let token = res.data.token
        setToken(token)
        window.opener && window.opener._loginCallback && window.opener._loginCallback(true)
        this.$bus.$emit('login-callback', true)
      }).catch(error => {
        window.opener && window.opener._loginCallback && window.opener._loginCallback(false)
        this.$bus.$emit('login-callback', false)
      })
    }
  }
}
</script>

