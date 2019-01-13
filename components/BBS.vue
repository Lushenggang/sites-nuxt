<template>
  <div class="bbs-page">
    <div class="comment-input">
      <CommentInput
        v-model="content"
        placeholder="来都来了，说点啥吧" />
      <Button
        type="primary"
        class="submit"
        @click.stop="addBBS(this.content)">
        留言
      </Button>
    </div>
    <div class="bbs-list">
      {{ bbsList }}
      <simple-tree
        :expand="false"
        :max-indent="36"
        :node-class="'tree-node-container'"
        :tree-data="bbsList"
        class="bbs-tree"
      >
        <div
          slot-scope="{ parentData, data }"
          :class="{ 
            'root-bbs': parentData.isRoot, 
            'bbs-tree-node': true,
        }">
          <avatar
            :user-id="bbs.author_id"
            class="bbs-avatar">
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
              <span class="reply-time">{{ $formatTime(data.timestamp) }}</span>
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
                    <img :src="userinfo.avatar" />
                    <span>{{ userinfo.username }}</span>
                  </div>
                </avatar>
              </span>
            </div>
          </avatar>
          <div class="bbs-body">{{ data.body }}</div>
          <div class="bbs-menu">
            <Icon 
              class="reply-icon" 
              type="ios-undo" 
              @click.stop="setReply(data)" />
          </div>
          <div 
            v-if="data.replyEdit" 
            class="reply-edit">
            <Input 
              :rows="2" 
              :autosize="true" 
              v-model="data.reply" 
              class="reply-input" 
              type="textarea" />
            <Button 
              class="cancel" 
              @click.stop="setReply(data)">取消</Button>
            <Button 
              class="save" 
              type="success" 
              @click.stop="addBBS(data.reply, data.id)">提交评论</Button>
          </div>
        </div>
      </simple-tree>
    </div>
    <div class="page-footer">
      <Page
        :total="pages"
        :current="page"/>
    </div>
  </div>
</template>

<script>
import bbsApi from '@/api/bbs'
import CommentInput from './CommentInput'

export default {
  components: {
    CommentInput
  },
  data () {
    return {
      page: 1,
      pages: 1,
      bbsList: [],
      content: ''
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  created () {
    this.getBBSList()
  },
  methods: {
    getBBSList (page) {
      if (!page) {
        page = this.page
      }
      bbsApi.getAllBBS(page).then(res => {
        if (res.status === 200) {
          this.generateBBSTree(res.data.bbs)
          let list = res.data.bbs
          this.page = res.data.page
          this.pages = res.data.pages
        }
      })
    },
    addBBS (content, response) {
      if (!content) {
        this.$Message.info('内容不能为空')
        return
      }
      if (!this.userInfo.id) {
        this.$bus.$emit('login-show')
        this.$Message.info('请先登录再进行留言')
        return
      }
      bbsApi.addBBS({
        content: this.content,
        responseId: response ? response : undefined
      }).then(res => {
        if (res.status === 200) {
          this.$Message.success('成功')
          this.getBBSList(1)
        }
      })
    },
    generateBBSTree (bbsList) {
      bbsList.sort((a, b) => a.timestamp > b.timestamp ? 1 : -1)
      let info = {}
      let list = []
      for (let bbs of bbsList) {
        if (!bbs.response_id) {
          bbs.children = []
          info[bbs.id] = bbs.children
          list.push(bbs)
        } else { // 评论一定在原留言之后
          if (!info[bbs.response_id]) continue
          info[bbs.response_id].push(bbs)
          info[bbs.id] = info [bbs.response_id]
        }
      }
      list.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1)
      this.bbsList = list
    },
    setReply (data) {
      if (!this.userInfo.id) {
        this.$bus.$emit('login-show')
        this.$Message.info('请先登录再进行留言')
        return
      }
      this.$set(data, 'replyEdit', !data.replyEdit)
      if (!data.reply) {
        this.$set(data, 'reply', '')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.bbs-page
  padding 2rem
  .comment-input
    border-bottom 1px solid #ACACAC
    overflow hidden
    .submit
      margin .5rem 0
      float right
  .page-footer
    text-align center
    padding 1rem
</style>
