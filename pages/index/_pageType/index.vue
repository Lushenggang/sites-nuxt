<template>
  <div class="content-page">
    <PostList v-if="type === 'postlist'" />
    <Category v-else-if="type === 'category'" />
    <Tag v-else-if="type === 'tag'" />
    <TimeLine v-else-if="type === 'timeline'" />
    <Other v-else-if="type === 'other'" />
    <BBS v-else-if="type === 'bbs'"></BBS>
  </div>
</template>

<script>
import PostList from '@/components/PostList'
import Category from '@/components/Category'
import Tag from '@/components/Tag'
import TimeLine from '@/components/TimeLine'
import Other from '@/components/Other'
import BBS from '@/components/BBS'

export default {
  components: {
    PostList,
    Category,
    Tag,
    TimeLine,
    Other,
    BBS
  },
  data () {
    return {}
  },
  computed: {
    type () {
      return this.$route.params.pageType
    }
  }
}
</script>

<style lang="stylus" scoped>
.content-page
  // 
</style>

