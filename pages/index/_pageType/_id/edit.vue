<template>
  <div 
    v-show="show" 
    class="editor-page">
    <div class="post-title">
      <Input 
        v-model="postInfo.title" 
        placeholder="输入文章标题" />
    </div>
    <div class="post-content">
      <mavon-editor
        ref="md"
        v-model="postInfo.body"
        class="editor"
        @change="changeString"
        @imgAdd="imgAdd"
        @imgDel="imgDel"/>
    </div>
    <div class="post-menu">
      <Button 
        type="primary" 
        class="button" 
        @click="showPostSetting">文章设置</Button>
      <Button 
        type="primary" 
        class="button" 
        @click="save">保存</Button>
    </div>
    <Modal 
      v-model="showSetting" 
      title="文章设置" 
      width="80">
      <div class="post-setting">
        <div class="post-image">
          <div class="title">文章缩略图</div>
          <div></div>
        </div>
        <div class="post-hide">
          <Checkbox v-model="postInfo.hide">隐藏</Checkbox>
          <Input 
            v-if="postInfo.hide" 
            v-model="postInfo.secretCode" 
            class="secrect-code" 
            placeholder="请输入密令"/>
        </div>
        <div class="post-abstract">
          <div class="title">文章摘要</div>
          <Input 
            v-model="postInfo.abstract" 
            type="textarea" 
            autosize />
        </div>
        <div class="post-type">
          <div class="title">文章分类</div>
          <Select v-model="postInfo.type">
            <Option
              v-for="(item, idx) of types"
              :value="item.id"
              :label="item.name"
              :key="idx">
            </Option>
          </Select>
        </div>
        <div class="post-tags">
          <div class="title">文章标签</div>
          <CheckboxGroup v-model="postInfo.tags">
            <Checkbox 
              v-for="(tag, idx) of tags" 
              :label="tag.id" 
              :key="idx">
              {{ tag.name }}
            </Checkbox>
          </CheckboxGroup>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import postApi from '@/api/post'
import axios from '@/libs/request'
import { BASE_URL } from '@/libs/config'

export default {
  data () {
    return {
      loaded: false,
      showSetting: false,
      postInfo: {
        abstract: '',
        title: '',
        body: '',
        body_html: '',
        type: 0,
        tags: [],
        secretCode: '',
        hide: false
      }
    }
  },
  computed: {
    isNew () {
      return this.$route.params.id === undefined
    },
    show () {
      if (this.isNew) return true
      if (this.loaded) return true
      return false
    },
    tags () {
      return this.$store.state.post.tagList
    },
    types () {
      return this.$store.state.post.typeList
    }
  },
  mounted () {
    this.getPostInfo()
  },
  methods: {
    changeString (value, render) {
      this.postInfo.body_html = render
    },
    save () {
      if (!this.postInfo.type) {
        this.$Message.warning('请设置文章类型')
        return
      }
      if (this.postInfo.hide && !this.postInfo.secretCode) {
        this.$Message.warning('隐藏文章，请设置一个密令')
        return
      }
      if (!this.postInfo.hide) {
        this.postInfo.secretCode = ''
      }
      postApi.savePost(this.postInfo).then(res => {
        if (res.status === 200) {
          this.$Message.success('保存成功')
          this.$router.push({
            path: `/home/${res.data.id}`,
            query: {
              type: this.$route.query.type
            }
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getPostInfo () {
      let postId = this.$route.params.id
      if (!postId) return
      postApi.getPost({
        postId
      }).then(res => {
        if (res.status === 200) {
          this.postInfo = res.data
          this.loaded = true
        }
      }).catch (error => {
        console.log(error)
        this.$Message.error('获取文章失败')
      })
    },
    imgAdd (pos, file) {
      let formdata = new FormData()
      formdata.append('image', file)
      axios({
        url: '/api/save-image/',
        method: 'put',
        data: formdata,
        headers: { 'content-Type': 'multipart/form-data' }
      }).then(res => {
        if (res.status === 200) {
          let url = BASE_URL + '/api/get-file/?filename=' + res.data.filename
          this.$refs.md.$img2Url(pos, url)
        }
      })
    },
    imgDel () {
      // 
    },
    showPostSetting () {
      this.showSetting = true
      if (!this.postInfo.abstract) {
        this.postInfo.abstract = this.postInfo.body.slice(0, 500)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.editor-page
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  padding .5rem
  background #ECF5FD
  display flex
  flex-direction column
  .post-title
    margin-bottom .5rem
  .post-content
    flex auto
    position relative
    .editor
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      z-index 1
  .post-menu
    margin-top .5rem
    text-align right
    .button
      margin .5rem

.post-setting
  .post-type, .post-tags, .post-hide, .post-abstract
    margin-bottom 1rem
    .title
      margin-bottom .5rem
</style>
