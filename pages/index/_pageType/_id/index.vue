<template>
  <div>
    <div class="post main-content">
      <div class="post-title">{{ postInfo.title }}</div>
      <div class="post-info">
        <div 
          v-if="postInfo.tags" 
          class="post-tags">
          <div 
            v-for="(tag, idx) in postInfo.tags" 
            v-if="tagList[tag]"
            :key="idx"
            class="post-tag">
            {{ tagList[tag].name }}
          </div>
        </div>
        <div class="placeholder"/>
        <div class="info-time">
          <div 
            v-if="postInfo.author_id" 
            class="author">
            <avatar 
              :user-id="postInfo.author_id" 
              class="avatar">
              <div 
                v-if="userinfo" 
                slot-scope="{ userinfo }" 
                class="avatar-slot">
                <img
                  :src="userinfo.avatar"
                  :style="{
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '.5rem'
                  }"
                  alt=""
                  class="avatar-img">
                <span class="avatar-username">{{ userinfo.username }}</span>
              </div>
            </avatar>
          </div>
          <span class="title">发布于</span>
          <Icon 
            type="ios-time-outline" 
            class="icon" 
            title="发布时间"/>
          <span class="format">{{ $formatTime(postInfo.timestamp) }}</span>
        </div>
        <div class="info-read">
          <Icon 
            type="md-eye" 
            class="icon" 
            title="阅读次数"/>
          <span class="title">阅读</span>
          <span class="count">{{ postInfo.read_times }}</span>
        </div>
        <div 
          v-if="postInfo.author_id && userInfo.id === postInfo.author_id" 
          class="menu-edit">
          <Button 
            type="primary" 
            size="small" 
            @click.stop="editPost">编辑</Button>
        </div>
      </div>
      <div class="post-content">
        <Button 
          v-if="postInfo.hide && postInfo.error_secret" 
          type="success" 
          @click.stop="secretInputShow=true">输入密令查看文章内容</Button>
        <div 
          v-else 
          v-html="postInfo.body_html"/>
      </div>
      <div class="post-link">
        <div 
          v-if="postInfo.before" 
          class="last" 
          @click.stop="showPost('before')">
          上一篇: <span class="title">{{ postInfo.before.title }}</span>
        </div>
        <div class="placeholder"/>
        <div 
          v-if="postInfo.after" 
          class="next" 
          @click.stop="showPost('after')">
          下一篇：<span class="title">{{ postInfo.after.title }}</span>
        </div>
      </div>
      <div class="post-comments">
        <div class="comment-title">评论({{ commentNum }})</div>
        <div class="add-comment">
          <comment-input v-model="comment"/>
          <Button 
            type="primary" 
            class="submit" 
            @click.stop="addComment(comment)">提交</Button>
        </div>
        <div class="post-comment">
          <transition>
            <simple-tree
              :expand="false"
              :node-class="'tree-node-container'"
              :max-indent="36"
              :tree-data="commentTree"
              class="post-comment-tree">
              <div
                slot-scope="{ parentData, data }"
                :class="parentData.isRoot ? 'root-comment' : ''"
                class="comment-tree-node">
                <avatar
                  :user-id="data.author_id" 
                  class="comment-avatar">
                  <div
                    v-if="userinfo" 
                    slot-scope="{ userinfo }" 
                    class="avatar-slot">
                    <img
                      :src="userinfo.avatar" 
                      class="avatar-img">
                    <span
                      v-if="data.timestamp" 
                      class="avatar-username">{{ userinfo.username }}</span>
                    <span class="reply-time">
                      {{ $formatTime(data.timestamp) }}
                    </span>
                    <span 
                      v-if="data.response_id" 
                      class="reply-comment reply">
                      <span class="reply-action">
                        回复
                      </span>
                      <avatar
                        :user-id="commentInfo[data.response_id].author_id"
                        class="reply-avatar">
                        <div 
                          v-if="userinfo" 
                          slot-scope="{ userinfo }" 
                          class="reply-avatar-slot">
                          <img :src="userinfo.avatar" >
                          <span>{{ userinfo.username }}</span>
                        </div>
                      </avatar>
                    </span>
                    <span 
                      v-else 
                      class="reply-post reply">
                      <span class="reply-action">评论：</span>
                    </span>
                  </div>
                </avatar>
                <div class="comment-body">
                  {{ data.body }}
                </div>
                <div class="comment-menu">
                  <div class="comment-like">
                    <Icon 
                      class="like" 
                      type="md-thumbs-up" />
                    <span class="like-times">23 </span>
                  </div>
                  <div class="reply">
                    <Icon 
                      class="reply-icon" 
                      type="ios-undo" 
                      @click.stop="setComment(data)" />
                  </div>
                </div>
                <div 
                  v-if="data.commentEdit" 
                  class="reply-edit">
                  <Input
                    :rows="2"
                    :autosize="true"
                    v-model="data.comment"
                    class="reply-input"
                    type="textarea" />
                  <Button 
                    class="cancel" 
                    @click.stop="setComment(data)">取消</Button>
                  <Button 
                    class="save" 
                    type="success" 
                    @click.stop="addComment(data.comment, data.id)">提交评论</Button>
                </div>
              </div>
            </simple-tree>
          </transition>
        </div>
      </div>
    </div>
    <Modal
      v-model="secretInputShow"
      title="本文需要提供密令才能查看，请输入">
      <Input 
        v-model="secretCode" 
        placeholder="请输入本文密令" />
      <div slot="footer">
        <Button 
          type="primary" 
          @click.stop="getPostInfo()">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import postApi from '@/api/post'
import commentInput from '@/components/CommentInput'

export default {
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    let addRead = !store.state.stat.postRead[params.id]
    addRead && store.commit('stat/addReadTime', { id: params.id })
    let data = {
      postId: params.id,
      addRead
    }
    if (query.type) {
      data.postType = query.type
    }
    return postApi.getPost(data).then(res => {
      return {
        postInfo: res.data,
        secretInputShow: res.data.hide && res.data.error_secret
      }
    }).catch(e => {
      error({ statusCode: 404, message: '从后台获取文章失败' })
    })
  },
  components: {
    'comment-input': commentInput
  },
  data () {
    return {
      commentTree: [],
      comment: '',
      commentNum: 0,
      commentInfo: {},
      secretCode: ''
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
    },
    userInfo () {
      return this.$store.state.userInfo
    },
    readList () {
      return this.$store.state.stat.postRead
    }
  },
  watch: {
    '$route': function () {
      this.refreshPage()
    }
  },
  mounted () {
    this.refreshPage()
    if (this.secretInputShow) {
      this.$Message.warning('本文内容需要输入密令才能查看')
    }
  },
  methods: {
    refreshPage() {
      this.secretCode = ''
      this.getComments()
    },
    getPostInfo () {
      let addRead = !this.readList[postId]
      addRead && this.$store.commit('stat/addReadTime', { id: postId })
      let data = {
        postId: this.$route.params.id,
        addRead: this.readList[postId],
        secretCode: this.secretCode
      }
      if (this.$route.query.type) {
        data.postType = this.$route.query.type
      }
      postApi.getPost({
      }).then(res => {
        this.postInfo = res.data
        this.secretInputShow = this.postInfo.hide && this.postInfo.error_secret
        if (this.secretInputShow) {
          let text = this.secretCode ? '请输入正确的密令！' : '请输入密令查看本文！'
        }
      }).catch (error => {
        console.log(error)
        this.$Message.error('获取文章失败')
      })
    },
    getComments () {
      postApi.getComments(this.$route.params.id).then(res => {
        if (res.status === 200) {
          this.generateCommentInfo(res.data)
        }
      }).catch(error => {
        console.log(error)
        this.$Message.error('加载评论失败')
      })
    },
    editPost () {
      let query = {
        type: this.$route.query.type
      }
      this.$router.push({ path:  `/home/${this.$route.params.id}/edit`, query })
    },
    showPost (type) {
      let query = {
        type: this.$route.query.type
      }
      this.$router.push({ path:  `/home/${this.postInfo[type].id}/`, query })
    },
    generateCommentInfo (comments) {
      this.commentNum = comments.length
      // 回复评论通常围绕相主题，所以评论树分为两层即可
      comments.sort((a, b) => a.timestamp > b.timestamp ? 1 : -1)
      let info = {} // 已安排的记录
      let list = []
      for (let comment of comments) {
        this.commentInfo[comment.id] = comment
        if (comment.response_id) {
          if (!info[comment.response_id]) continue
          info[comment.response_id].push(comment)
          info[comment.id] = info[comment.response_id]
        } else {
          comment.children = []
          info[comment.id] = comment.children
          list.push(comment)
        }
      }
      list.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1)
      this.commentTree = list
    },
    setComment (data) {
      if (!this.userInfo.username) {
        this.$bus.$emit('login-show')
        this.$Message.info('请先登录再进行评论')
        return
      }
      this.$set(data, 'commentEdit', !data.commentEdit)
      if (!data.comment) {
        this.$set(data, 'comment', '')
      }
    },
    addComment (comment, response) {
      if (!comment) {
        this.$Message.info('评论不能为空')
        return
      }
      if (!this.userInfo.username) {
        this.$bus.$emit('login-show')
        this.$Message.info('请先登录再进行评论')
        return
      }
      let params = {
        body: comment,
        postId: this.$route.params.id,
      }
      if (response) {
        params.responseId = response
      }
      postApi.addComment(params).then(res => {
        if (res.status === 200) {
          this.$Message.success('评论成功')
          this.getComments()
          this.comment = ''
        }
      }).catch(error => {
        this.$Message.error('评论失败')
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.post
  text-align left
  padding .5rem
  .post-title
    margin-bottom 1rem
    text-align left
    font-size 1.5rem
    padding-bottom .5rem
    border-bottom 2px solid rgba(51, 97, 216, .5)
  .post-info
    padding 0 1rem
    display flex
    margin .5rem 0
    align-items center
    flex-wrap wrap
    // justify-content center
    // font-size 1rem
    .info-time, .info-read
      display flex
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
    .placeholder
      flex auto
    .post-tags
      margin .5rem 0
      display flex
      flex-wrap wrap
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
    .author
      .avatar
        .avatar-slot
          display flex
          align-items center
          .avatar-username
            color blue
            cursor pointer
            &:hover
              text-decoration underline
            &:active
              position relative
              top 1px
              left 1px
  .post-content
    margin-top 1rem
    box-shadow 0 0 3px 1px #DFDFDF
    border-radius 2px
    padding 1rem
  .post-link
    display flex
    flex-wrap wrap
    margin 1rem 0
    cursor pointer
    user-select none
    .last, .next
      color blue
      &:hover
        text-decoration underline
      &:active
        position relative
        top 1px
        left 1px
    .placeholder
      flex auto

  .post-comments
    .comment-title
      border-bottom 1px solid #c9c9c9
      margin-bottom .5rem
      opadding-bnottom 4px
    .add-comment
      overflow hidden
      .submit
        margin-top .5rem
        float right
    .post-comment-tree
      border-top 1px solid #b2b2b2
      margin .5rem 0
      padding .5rem
      .comment-tree-node
        .comment-avatar
          padding 4px
          .avatar-slot
            display flex
            align-items center
            .avatar-img
              width 2rem
              height 2rem
              border-radius 1rem
            .avatar-username
              margin-left .5rem
              color #3361D8
              font-weight 1000
            .reply-time
              margin 0 .5rem
            .reply-comment
              display flex
              align-items center
              padding-left 4px
              .reply-avatar
                display inline-block
                .reply-avatar-slot
                  display flex
                  align-items center
                  img
                    width 2rem
                    height 2rem
                    border-radius 1rem
                    margin 0 .5rem
                  span
                    color #3361D8
                    font-weight 1000 
            .reply
              .reply-action
                color #0593d3
                font-weight 1000
        .comment-body, .reply-edit, .comment-menu
          margin-left 2.5rem
        .comment-menu
          margin-top .5rem
          display flex
          align-items center
          .comment-like .like, .reply .reply-icon
            cursor pointer
            font-size 16px
            // width 1rem
            // height 1rem
            display inline-flex
            justify-content center
            color #0593d3
            &:active
              position relative
              left 1px
              top 1px
          .reply
            margin 0 .5rem
          .comment-like
            display flex
            align-items center
            .like-times
              // font-size 1rem
      .reply-edit
        text-align right
        .reply-input
          margin .5rem 0
        .cancel, .save
          margin-left .5rem
</style>

<style lang="stylus">
.post-comment-tree
  > .tree-node-container
    margin .5rem 0
    border-radius 2px
    box-shadow 0 0 5px 0 #DFDFDF
    padding .5rem
.post-content
  img
    max-width 100%
    height auto
</style>
