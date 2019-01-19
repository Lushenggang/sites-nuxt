<template>
  <div class="header">
    <div
      v-for="(nav, idx) of navList"
      :class="{
        'nav-item': true,
        'current-item': type === nav.type,
        'manage-hide': nav.type === 'manage' && !userInfo.manager
      }"
      :key="idx"
      @click.stop="clickMenu(nav.type)">
      {{ nav.title }}
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      navList: [
        {
          title: '首页',
          type: 'home'
        },
        {
          title: '文章',
          type: 'postlist'
        },
        // {
        //   title: '分类',
        //   type: 'category'
        // },
        // {
        //   title: '标签',
        //   type: 'tag'
        // },
        {
          title: '归档',
          type: 'timeline'
        },
        {
          title: '留言板',
          type: 'bbs'
        },
        {
          title: '其它',
          type: 'other'
        }
      ]
    }
  },
  computed: {
    type () {
      return this.$route.params.pageType || 'home'
    },
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    clickMenu (type) {
      let path = type === 'home' ? '/' : `/${type}`
      this.$router.push({ path })
    }
  }
}
</script>

<style lang="stylus" scoped>
.header
  display flex
  justify-content center
  font-size 1.5rem
  background #3361d8
  height 3rem
  user-select none
  color white
  .nav-item
    min-width 6rem
    display flex
    align-items center
    justify-content center
    cursor pointer
    &.current-item
      background #6190E8
    &.manage-hide
      display none
</style>

