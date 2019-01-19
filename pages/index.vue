<template>
  <div class="page-container">
    <div class="header-img">
      <div class="header-title">
        <span class="author-name">腾冲小刚哥</span>
        个人站点
      </div>
    </div>
    <div class="header-component">
      <Header />
    </div>
    <div class="content">
      <nuxt-child class="content-child" />
    </div>
    <Modal
      v-model="loginShow"
      footer-hide
      transfer>
      <div 
        slot="header" 
        class="login-title">请选择登录方式</div>
      <div class="login-container">
        <div class="login-tabs">
          <div 
            v-for="(tab, idx) of loginTabs" 
            :key="idx"
            :class="{
              tab: true,
              current: tab.type === loginType 
            }"
            @click.stop="loginType = tab.type">{{ tab.title }}</div>
        </div>
        <div class="login-tab-content">
          <div
            v-if="loginType === 'github'"
            class="login-github" 
            @click.stop="loginWithGithub">
            <Icon
              type="logo-github"
              class="icon"/>
            <div>github登录</div>
          </div>
          <Login 
            v-else-if="loginType === 'passwd'"
            class="login-passwd"
            @register-link="showRegister"
            @success="loginWithPasswd"></Login>
        </div>
      </div>
    </Modal>
    <Drawer
      v-model="infoShow"
      class-name="info-drawer-container"
      title="个人资料">
      <div 
        v-if="userInfo.id" 
        class="info-container">
        <div
          slot="header"
          class="header">
          <avatar 
            :user-id="userInfo.id" 
            class="info-avatar">
            <div 
              v-if="userinfo" 
              slot-scope="{ userinfo }" 
              class="avatar-slot">
              <img 
                :src="userinfo.avatar" 
                alt="用户头像" 
                class="avatar-img">
              <div class="info-abstract">
                <div class="info-username">{{ userinfo.username }}</div>
                <div 
                  v-if="userinfo.manager"
                  class="info-manager">
                  <Icon
                    type="md-star"
                    class="icon" />
                  站长
                </div>
                <div class="info-comments">
                  评论
                  <span>{{ userInfo.comments.length }}</span>
                </div>
                <div class="info-bbs">
                  留言
                  <span>{{ userInfo.bbs.length }}</span>
                </div>
              </div>
              <div 
                v-if="currentUser.manager" 
                class="setting-manage">
                <Button
                  type="primary"
                  size="small" 
                  @click.stop="newPost">
                  添加文章
                </Button>
              </div>
            </div>
          </avatar>
        </div>
        <div class="info-content">
          <div class="info-tabs">
            <div
              :class="{
                'info-tab': true,
                current: infoTab === 'info' }"
              @click.stop="infoTab='info'">
              <Icon type="md-person" />
            </div>
            <div
              v-if="userInfo.id === currentUser.id"
              :class="{
                'info-tab': true,
                current: infoTab === 'setting'
              }"
              @click.stop="infoTab='setting'">
              <Icon type="md-settings" />
            </div>
          </div>
          <div 
            v-show="infoTab === 'info'" 
            class="show-content">
            <div class="info-show-tabs">
              <div
                :class="{
                  'info-comment': true,
                  current: infoShowTab === 'comments'
                }"
                @click.stop="infoShowTab = 'comments'">
                评论（<span>{{ userInfo.comments.length }}</span>）
              </div>
              <div
                :class="{
                  'info-bbs': true,
                  current: infoShowTab === 'bbs'
                }"
                @click.stop="infoShowTab = 'bbs'">
                留言（<span>{{ userInfo.bbs.length }}</span>）
              </div>
            </div>
            <div class="info-show-content">
              <div
                v-if="infoShowTab==='comments'"
                class="comments">
                <div
                  v-for="(comment, idx) of userInfo.comments"
                  :key="idx"
                  class="comment">
                  <!-- {{ comment }} {{ typeof comment }} -->
                  <avatar
                    :user-id="userInfo.id"
                    class="avatar">
                    <div
                      v-if="userinfo" 
                      slot-scope="{ userinfo }" 
                      class="avatar-slot">
                      <img
                        :src="userinfo.avatar"
                        alt="用户头像" />
                      <div class="comment-info">
                        <div class="comment-username">{{ userinfo.username }}</div>
                        <div class="comment-content">{{ comment.body }}</div>
                        <div class="comment-post">
                          <router-link
                            :to="{ path: `/home/${comment.post_id}` }"
                            class="post">
                            {{ comment.post_title }}
                          </router-link>
                          <div class="time">{{ $formatTime(comment.timestamp) }}</div>
                        </div>
                      </div>
                    </div>
                  </avatar>
                </div>
              </div>
              <div 
                v-else 
                class="bbs-list">
                <div 
                  v-for="(bbs, idx) of userInfo.bbs" 
                  :key="idx" 
                  class="bbs">
                  <avatar 
                    :user-id="userInfo.id" 
                    class="avatar">
                    <div 
                      v-if="userinfo" 
                      slot-scope="{ userinfo }" 
                      class="avatar-slot">
                      <img 
                        :src="userinfo.avatar" 
                        alt="用户头像" />
                      <div class="bbs-info">
                        <div class="bbs-username">{{ userinfo.username }}</div>
                        <div class="bbs-content">{{ bbs.body }}</div>
                      </div>
                    </div>
                  </avatar> 
                </div>
              </div>
            </div>
          </div>
          <div 
            v-show="infoTab === 'setting'" 
            class="setting-content">
            <div class="change-avatar">
              <div class="title">修改头像</div>
              <img
                :src="currentUser.avatar"
                :style="{
                  width: '8rem',
                  height: '8rem',
                  borderRadius: '50%'
                }"
                alt="用户头像"
                @click.stop="clickAvatar"/>
              <form>
                <input 
                  ref="avatarInput" 
                  :style="'display:none'" 
                  type="file" 
                  accept="imag/png,image/jpeg" 
                  @change="checkAvatarUpload"/>
              </form>
              <div>点击图片更换头像</div>
            </div>
            <div class="change-username">
              <div class="title">修改用户名</div>
              <div class="change-username-content">
                <Input 
                  v-model="usernameString"
                  class="username" />
                <Button 
                  type="primary" 
                  @click.stop="chagneUsername">确定修改用户名</Button>
              </div>
            </div>
            <!-- 第三方登录不允许修改密码 -->
            <div 
              v-if="!currentUser.id_string" 
              class="change-passwd">
              <div class="title">修改密码</div>
              <Form 
                ref="changePasswd" 
                :model="changePasswd" 
                :rules="ruleValidate">
                <FormItem prop="oldPasswd">
                  <span 
                    slot="label" 
                    class="label">旧密码</span>
                  <Input 
                    v-model="changePasswd.oldPasswd" 
                    type="password" 
                    placeholder="请输入旧密码" />
                </FormItem>
                <FormItem prop="newPasswd">
                  <span 
                    slot="label" 
                    class="label">新密码</span>
                  <Input 
                    v-model="changePasswd.newPasswd" 
                    type="password" 
                    placeholder="请输入新密码" />
                </FormItem>
                <FormItem prop="newPasswd2">
                  <span 
                    slot="label" 
                    class="label">确认新密码</span>
                  <Input 
                    v-model="changePasswd.newPasswd2" 
                    type="password" 
                    placeholder="请确认新密码" />
                </FormItem>
                <FormItem :label-width="0">
                  <Button 
                    type="primary" 
                    @click.stop="changePassword('changePasswd')">确认修改密码</Button>
                </FormItem>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
    <Drawer
      v-model="registerShow"
      class-name="register-drawer-container"
      title="创建帐号">
      <div class="draw-body">
        <Register
          class="register-container"
          @login-link="showLogin('passwd')"
          @success="showLogin('passwd')">
        </Register>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { CLIENT_ID } from '@/libs/config'
import Header from '~/components/Header.vue'
import Login from '~/components/Login.vue'
import Register from '~/components/Register.vue'
import { mapActions } from 'vuex'
import userApi from '@/api/user'
import postApi from '@/api/post'

export default {
  components: {
    Header,
    Login,
    Register
  },
  data () {
    const validatePassCheck = (rule, value, callback) => {
      if (value !== this.changePasswd.newPasswd) {
        callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      loginShow: false,
      infoShow: false,
      showUserId: 0,
      userInfo: {
        comments: [],
        bbs: [],
        avatar: '',
        username: '',
        id: ''
      },
      infoTab: 'info', // info setting
      infoShowTab: 'comments', // comments bbs
      loginType: 'github', // github, passwd
      loginTabs: [
        {
          title: 'github登录',
          type: 'github',
        },
        {
          title: '帐号密码登录',
          type: 'passwd'
        }
      ],
      registerShow: false,
      usernameString: '',
      changePasswd: {
        oldPasswd: '',
        newPasswd: '',
        newPasswd2: ''
      },
      ruleValidate: {
        oldPasswd: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPasswd: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        newPasswd2: [
          { required: true, message: '密码不能为空', trigger: 'blur'},
          { validator: validatePassCheck, trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.userInfo
    }
  },
  created () {
    this.getTypeList()
    this.getTagList()
    this.getUserInfo()
    this.$bus.$on('login-show', this.showLogin)
    this.$bus.$on('click-avatar', this.showInfo)
    this.$bus.$on('login-callback', this.loginCallback)
  },
  beforeDestroy() {
    this.$bus.$off('login-show')
    this.$bus.$off('click-avatar')
    this.$bus.$off('login-callback')
  },
  methods: {
    ...mapActions({
      getTypeList: 'post/getTypeList',
      getTagList: 'post/getTagList',
      getUserInfo: 'userInfo/getUserInfo'
    }),
    showLogin (type) {
      this.loginShow = true
      if (type) this.loginType = type
    },
    showInfo (id) {
      this.infoShow = true
      this.registerShow = false
      this.showUserId = id
      this.getUserDetail()
      if (id === this.currentUser.id) {
        this.usernameString = this.currentUser.username
      }
      // if (id && id !== this.showUserId) {
      //   this.showUserId = id
      //   this.getUserDetail()
      // }
    },
    loginWithGithub () {
      let scope = "user:email"
      let loginWIndow = window.open(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${scope}`, 'login', 'resizable=yes,scrollbars=yes,status=yes,height=600,width=800')
      window._loginCallback = (success) => {
        this.$bus.$emit('login-callback', success)
        loginWIndow.close()
      }
    },
    loginCallback (success) {
      if (success) {
        this.$Message.success('登录成功')
        this.getUserInfo()
        this.loginShow = false
      } else {
        this.$Message.error('登录失败')
      }
    },
    getUserDetail () {
      userApi.getUserDetail(this.showUserId).then(res => {
        this.userInfo = res.data
      }).catch(error => {
        this.$Message.error('获取用户数据失败')
      })
    },
    showRegister () {
      this.loginShow = false
      this.infoShow = false
      this.registerShow = true
    },
    loginWithPasswd () {
      this.loginShow = false
      this.getUserInfo()
    },
    newPost () {
      postApi.savePost({
        abstract: '',
        title: '',
        body: '',
        body_html: '',
        type: 0,
        tags: [],
        secretCode: '',
        hide: true
      }).then(res => {
        if (res.status === 200) {
          this.$router.push({ path: `/home/${res.data.id}/edit` })
          this.infoShow = false
        }
      })
    },
    clickAvatar () {
      this.$refs.avatarInput.click()
    },
    checkAvatarUpload (event) {
      let formData = new FormData()
      formData.append('image', event.target.files[0])
      userApi.changeAvatar(formData).then(res => {
        if (res.status === 200) {
          this.$store.dispatch('user/getInfo', {
            id: this.userInfo.id,
            force: true
          })
          this.$store.dispatch('userInfo/getUserInfo')
          this.getUserDetail()
        } else {
          this.$Message.error('上传失败')
        }
      }).catch(error => {
        console.log(error)
        this.$Message.error('网络请求错误')
      })
      event.target.value = ''
    },
    changePassword (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          userApi.changePasswd(this.changePasswd).then(res => {
            this.$Message.success('密码修改成功')
          })
        } else {
          this.$Message.error('输入不合法，请留意表单提示！')
        }
      })
    },
    chagneUsername () {
      userApi.changeUsername({ username: this.usernameString }).then(res => {
        if (res.status === 200) {
          this.$Message.success('修改用户名成功')
          this.$store.dispatch('user/getInfo', {
            id: this.userInfo.id,
            force: true
          })
          this.$store.dispatch('userInfo/getUserInfo')
          this.getUserDetail()
        } else {
          this.$Message.error('修改用户名出错')
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.page-container
  height 100vh
  width 100vw
  overflow auto
  background #ECF5FD
  .header-img
    height 25vh
    min-height 10rem
    background center / 100vw 100% no-repeat url(/img/star.jpg)
    .header-title
      height 100%
      display flex
      align-items flex-end
      color white
      font-size 2rem
      padding 2rem
      max-width 1400px
      margin 0 auto
      .author-name
        color #FFD04C
        text-shadow 0 0 1px #fafbfc
  .content
    margin 0 auto
    max-width 1400px
.login-title
  font-weight 700
  text-align center
  padding .5rem

.login-container
  min-height 20rem
  user-select none
  padding-bottom 2rem
  display flex
  flex-direction column
  .login-tabs
    display flex
    margin-bottom 1rem
    border-bottom 1px solid #DFDFDF
    flex-shrink 0
    .tab
      flex auto
      text-align center
      border-bottom 2px solid rgba(0,0,0,0)
      padding-bottom .5rem
      cursor pointer
      &.current
        color #3361d8
        font-weight bolder
        border-bottom 2px solid #3361d8
  .login-tab-content
    display flex
    align-items center
    justify-content center
    flex auto
    .login-passwd
      align-self stretch
      width 20rem
    .login-github
      color #101C2E
      // width 12rem
      // height 12rem
      text-align center
      cursor pointer
      box-shadow 0 0 1px 1px #3361d8
      border-radius 1rem
      padding .5rem
      &:hover
        background rgba(51, 97, 216, .1)
      .icon
        font-size 10rem
      span
        font-size 1.5rem
</style>

<style lang="stylus">
.info-container
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  display flex
  flex-direction column
  overflow hidden
  padding-left .5rem
  .header
    height 6rem
    display flex
    flex-shrink 0
    .info-avatar
      .avatar-slot
        display flex
        align-items flex-end
        .avatar-img
          height 5rem
          width 5rem
          border-radius .5rem
        .info-abstract
          margin-left .5rem
          .info-username
            font-size 1.5rem
          .info-comments, .info-bbs
            span
              color #3361d8
          .info-manager
            display flex
            align-items center
            color #FFA710
            .icon
              margin-right 2px
  .info-content
    flex auto
    display flex
    min-height 10rem
    .info-tabs
      text-align center
      box-shadow 3px 0 1px -2px #3361d8
      margin-right .5rem
      .info-tab
        margin 4px
        cursor pointer
        font-size 1rem
        &.current
          color #3361d8
    .setting-content
      flex auto
      overflow auto
      padding .5rem
      .change-avatar, .change-username, .change-passwd
        margin-top .5rem
        box-shadow 0 0 1px 1px #3361d8
        border-radius 4px
        padding .5rem
        .title
          margin-bottom .5rem
          font-size 1rem
          text-align left
          box-shadow 0 1px 1px -1px #3361D8
          padding 4px
      .change-avatar
        text-align center
      .change-username
        .change-username-content
          padding .5rem
          .username
            margin-bottom .5rem
    .show-content
      flex auto
      display flex
      flex-direction column
      .info-show-tabs
        display flex
        border-bottom 1px solid #ECECEC
        justify-content space-around
        flex-shrink 0
        .info-comment, .info-bbs
          // flex auto
          text-align center
          // box-shadow 0 0 1px 1px #3361d8 inset
          padding 2px 1rem
          border-bottom 2px solid rgba(0, 0, 0, 0)
          cursor pointer
          user-select none
          span
            color #3361d8
          &.current
            border-bottom 2px solid #3361d8
      .info-show-content
        flex auto
        overflow auto
        .comments, .bbs-list
          .comment, .bbs
            .avatar
              .avatar-slot
                display flex
                border-bottom 1px solid #ECECEC
                margin-bottom 1rem
                padding .5rem
                img
                  width 3rem
                  height 3rem
                  border-radius 4px
                .comment-info, .bbs-info
                  flex auto
                  margin-left .5rem
                  .comment-username, .bbs-username
                    font-size 1rem
                    color #3361d8
                  .comment-content, .bbs-content
                    font-size 20px
                    padding .5rem 0
                  .comment-post
                    display flex
                    flex-wrap wrap
                    margin-top .5rem
                    .post
                      flex auto
                      text-decoration underline
                      color #3361d8
                    .time
                      margin-left 1rem
                      color #8DABC4

.info-drawer-container > div
  width 35rem!important
  max-width 100%
.register-drawer-container > div
  width 25rem!important
  max-width 100%
  .draw-body
    height 100%
    display flex
    .register-container
      height 100%
      display flex
      flex auto
      flex-direction column
      text-align left
      &::before
        content ''
        flex-grow 1
      &::after
        content ''
        flex-grow 2
</style>
