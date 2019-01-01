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
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    Header
  },
  created () {
    this.getTypeList()
    this.getTagList()
  },
  methods: {
    ...mapActions({
      getTypeList: 'post/getTypeList',
      getTagList: 'post/getTagList'
    })
  }
}
</script>

<style lang="stylus">
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
</style>
