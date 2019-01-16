<template>
  <div class="login-form">
    <Form 
      ref="loginInfo" 
      :model="loginInfo" 
      :rules="ruleValidate">
      <FormItem prop="email" >
        <span 
          slot="label" 
          class="label">邮箱</span>
        <Input 
          v-model="loginInfo.email" 
          type="text" 
          placeholder="请输入邮箱" 
          autocomplete="on" 
          @on-enter="login('loginInfo')"/>
      </FormItem>
      <FormItem prop="password">
        <span 
          slot="label" 
          class="label">密码</span>
        <Input 
          v-model="loginInfo.password" 
          type="password" 
          placeholder="请输入密码" 
          @on-enter="login('loginInfo')" />
      </FormItem>
      <FormItem :label-width="0" >
        <div class="action">
          <Button 
            class="button" 
            type="primary" 
            @click.stop="login('loginInfo')">登录</Button>
          <span class="register-link">
            没有账号？
            <span 
              class="link" 
              @click.stop="$emit('register-link')">
              点此注册
            </span>
          </span>
        </div>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import userApi from '@/api/user'
import { setToken } from '@/libs/tool'

export default {
  data () {
    return {
      loginInfo: {
        email: '',
        password: ''
      },
      ruleValidate: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur'},
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login (name) {
      this.$refs.loginInfo.validate(valid => {
        if (valid) {
          userApi.login(this.loginInfo).then(res => {
            if (res.status === 200) {
              this.$Message.success('登录成功')
              let token = res.data.token
              setToken(token)
              this.$emit('success')
            }
          }).catch(error => {
            this.$Message.error('登录失败')
          })
        } else {
          this.$Message.error('请检查账号密码输入')
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.login-form
  max-width 20rem
  display flex!important
  .label
    margin .5rem 0
  .label, .register-link
    font-size 1rem
  .register-link
    margin-top .5rem
    .link
      cursor pointer
      color blue
      &:hover
        text-decoration underline
  .action
    display flex
    justify-content center
    align-items center
    .button
      padding 5px 1rem
      margin-right 1rem
</style>
