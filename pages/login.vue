<template>
  <div class="login-page">
  </div>
</template>

<script>
import userApi from '@/api/user'

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
        console.log(res)
        this.$Message.success('登录成功')
      })
    }
  }
}
</script>

