<template>
  <div class="home-page">
    <div class="recent-activity">
      <div class="recent-article">
        近期文章
      </div>
      <div class="recent-comment">
        最新评论
      </div>
    </div>
    <div class="hot-article">
      <div class="title">热门文章</div>
      <div
        v-for="(post, idx) of postList"
        :key="idx"
        class="post">
        <div
          class="post-title"
          @click.stop="readPost(post.id)">
          {{ post.title }}
        </div>
        <div
          v-if="tagList.length"
          class="post-tags">
          <div
            v-for="(tag, idx) in post.tags"
            :key="idx"
            class="post-tag">
            {{ tagList[tag].name }}
          </div>
        </div>
        <div 
          class="post-abstract" 
          v-html="$converter.makeHtml(post.abstract)"/>
        <div 
          class="post-read-link" 
          @click.stop="readPost(post.id)">阅读全文</div>
        <div class="post-info">
          <div class="info-read">
            <Icon 
              type="md-eye" 
              class="icon" 
              title="阅读次数"/>
            <span class="title">阅读</span>
            <span class="count">{{ post.read_times }}</span>
          </div>
          <div class="info-like">
            <Icon 
              type="md-heart" 
              class="icon" 
              title="点赞次数"/>
            <span class="title">喜欢</span>
            <span class="count">{{ post.likes }}</span>
          </div>
          <div class="info-comment">
            <Icon 
              type="md-text" 
              class="icon" 
              title="评论数量"/>
            <span class="title">评论</span>
            <span class="count">{{ post.comment_times }}</span>
          </div>
          <div class="info-time">
            <Icon 
              type="ios-time-outline" 
              class="icon" 
              title="发布时间"/>
            <span class="title">发布于</span>
            <span class="format">{{ $formatTime(post.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import postApi from '@/api/post'

export default {
  data() {
    return {}
  },
  computed: {
    typeList () {
      let data = {}
      this.$store.state.post.typeList.forEach(item => {
        data[item.id] = item
      })
      return data
    },
    tagList () {
      let data = {}
      this.$store.state.post.tagList.forEach(item => {
        data[item.id] = item
      })
      return data
    }
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    return postApi.getPosts({}).then(res => {
      return {
        postList: res.data.list
      }
    }).catch(e => {
      error({ statusCode: 404, message: '获取后台数据失败' })
    })
  },
  methods: {
    readPost (id) {
      this.$router.push({ path: `/home/${id}` })
    }
  }
}
</script>

<style lang="stylus" scoped>
.home-page
  .recent-activity
    .recent-comment
      margin-left 60%
      padding 2rem
    .recent-article
      float left
      overflow hidden
      width 60%
      padding 2rem
  .hot-article
    padding 2rem
    .post
      padding 1rem
      border-bottom 1px solid #B1B1B1
      display flex
      flex-direction column
      text-align left
      flex-shrink 0
      .post-title
        font-size 1.5rem
        font-weight blod
        cursor pointer
        align-self flex-start
        position relative
        &:after
          background #0593d3
          position absolute
          left 50%
          top 100%
          content ''
          width 0
          height 2px
        &:hover
          transition all .2s ease-in-out
          color #0593d3
          &:after
            width 100%
            left 0
            transition .2s all ease-in
        &:active
          left 1px
          top 1px
      .post-tags
        display flex
        padding .5rem
        user-select none
        .post-tag
          background #ECF2FC
          color #0593d3
          margin-right .5rem
          padding 4px .5rem
          border-radius 4px
          cursor pointer
          font-weight 700
          &:hover
            background #0593d3
            color white
          &:active
            position relative
            left 1px
            top 1px
      .post-info
        padding .5rem
        padding-left 0
        display flex
        flex-wrap wrap
        .info-read, .info-like, .info-comment, .info-time
          margin-right 1rem
          display flex
          align-items center
          .icon
            font-size 1rem
            font-weight bloder
            cursor pointer
            color #0593d3
          .title
            margin 0 2px
        .info-like .icon
          color #FF3939
      .post-abstract
        color #777777
      .post-read-link
        user-select none
        margin-top 4px
        cursor pointer
        align-self flex-start
        text-decoration underline
        &:hover
          color #0593d3
        &:active
          position relative
          top 1px
          left 1px
</style>
