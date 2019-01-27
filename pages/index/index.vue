<template>
  <div class="home-page">
    <div class="post-area">
      <div 
        v-if="recentPost.length" 
        class="recent-article">
        <div class="recent-article-title">
          近期文章
        </div>
        <div class="recent-article-carousel">
          <div
            v-for="(post, idx) of recentPost"
            :key="idx"
            :style="{
              left: idx === recentIdx ? 0 : (idx - recentIdx) * 100 + '%',
              right: idx === recentIdx ? 0 : (recentIdx - idx) * 100 + '%'
            }"
            class="carousel-item"
            @mouseenter="stopAutoChange"
            @mouseleave="startAutoChange"
            @click.stop="readPost(post.id)">
            <img
              :src="post.abstract_image"
              alt="缩略图" />
            <div class="post-title">{{ post.title }}</div>
          </div>
          <div class="dot-buttons">
            <div
              v-for="dotIdx in recentPost.length"
              :class="{
                'dot-button': true,
                'current': dotIdx === recentIdx + 1
              }"
              :key="dotIdx"
              @click.stop="setRecentIdx(dotIdx - 1)">
            </div>
          </div>
        </div>
      </div>
      <div class="hot-article">
        <div class="title">热门文章</div>
        <div
          v-for="(post, idx) of hotPost"
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
    <div class="activity-area">
      <div class="recent-bbs">
        <div class="recent-bbs-title">
          最新留言
        </div>
        <div class="recent-bbs-content">
          <div
            v-for="(bbs, idx) of recentBBS"
            :key="idx"
            class="bbs"
            @click.stop="jumpToBBS">
            <avatar
              :user-id="bbs.author_id"
              class="avatar">
              <div slot-scope="{ userinfo }">
                {{ userinfo.username }}
              </div>
            </avatar>
            : 
            <div class="bbs-body">{{ bbs.body }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import postApi from '@/api/post'
import bbsApi from '@/api/bbs'

export default {
  data() {
    return {
      recentIdx: 0,
      timerIdx: 0
    }
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
    let recentPost = postApi.getRecentPosts()
    let hotPost = postApi.getHotPosts()
    let recentBBS = bbsApi.getRecentBBS()
    return Promise.all([recentPost, hotPost, recentBBS]).then(([recentPostRes, hotPostRes, recentBBSRes]) => {
      return {
        recentPost: recentPostRes.data.list || [],
        hotPost: hotPostRes.data.list || [],
        recentBBS: recentBBSRes.data.list || []
      }
    }).catch(e => {
      error({ statusCode: 404, message: '获取后台数据失败' })
    })
  },
  mounted () {
    this.startAutoChange()
  },
  beforeDestroy() {
    clearInterval(this.timerIdx)
  },
  methods: {
    readPost (id) {
      this.$router.push({ path: `/home/${id}` })
    },
    autoChangeRecentPost () {
      if (!this.recentPost.length) return
      this.recentIdx = (this.recentIdx + 1) % this.recentPost.length
    },
    setRecentIdx (idx) {
      this.recentIdx = idx
    },
    stopAutoChange () {
      this.timerIdx && clearInterval(this.timerIdx)
      this.timerIdx = 0
    },
    startAutoChange () {
      this.timerIdx = setInterval(this.autoChangeRecentPost, 3000)
    },
    jumpToBBS () {
      this.$router.push({ path: '/bbs' })
    }
  }
}
</script>

<style lang="stylus" scoped>
.home-page
  display flex
  padding 4rem 2rem
  justify-content center
  .post-area
    flex auto
    max-width 760px
    width 400px
    .recent-article
      height 22rem
      display flex
      flex-direction column
      background white
      padding 2rem
      margin-bottom 1rem
      border-radius 2px
      .recent-article-title
        flex-shrink 0
      .recent-article-carousel
        flex auto
        position relative
        overflow hidden
        .carousel-item
          position absolute 
          top 0
          bottom 0
          transition all .8s ease-in-out
          cursor pointer
          img
            width 100%
            height 16rem
            position absolute
            bottom 0
          .post-title
            position absolute
            bottom 0
            left 0
            right 0
            background rgba(0, 0, 0, 0.5)
            font-size 20px
            color white
            height 2.5rem
            display flex
            align-items center
            padding 0 .5rem
        .dot-buttons
          position absolute
          bottom 0
          right 0
          display flex
          align-items center
          height 2.5rem
          .dot-button
            background white
            width 1rem
            height 1rem
            border-radius 50%
            margin-right .5rem
            cursor pointer
            &:hover
              background #FFD96B
            &.current
              background #FFC82C
    .hot-article
      padding 2rem
      background white
      .post
        padding 2rem
        border-bottom 1px solid #B1B1B1
        display flex
        flex-direction column
        text-align left
        flex-shrink 0
        .post-title
          font-size 1.5rem
          font-weight bold
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
  .activity-area
    margin-left 2rem
    width 30%
    flex-shrink 0
    padding 2rem
    background white
    .recent-bbs-content
      .bbs
        display flex
        margin 2px 0
        cursor pointer
        &:hover
          text-decoration underline
        .bbs-body
          color #3361d8
          
</style>
