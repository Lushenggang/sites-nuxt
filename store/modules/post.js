import postApi from '@/api/post'
import iView from 'iview'

export default {
  namespaced: true,
  state: {
    typeList: [],
    tagList: [],
  },
  actions: {
    getTypeList (context) {
      postApi.getPostType().then(res => {
        if (res.status === 200) {
          context.commit('refreshType', res.data.list)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getTagList (context) {
      postApi.getTagList().then(res => {
        if (res.status === 200) {
          context.commit('refreshTag', res.data.list)
        }
      })
    },
    updateType (context, data) {
      postApi.updateType({ list: data.list }).then(res => {
        if (res.status === 200) {
          context.dispatch('getTypeList')
          data.notify && iView.Message.success('更新成功')
        }
      }).catch(error => {
        data.notify && iView.Message.error('更新失败')
      })
    },
    updateTag (context, data) {
      postApi.updateTag({ list: data.list }).then(res => {
        if (res.status === 200) {
          context.dispatch('getTagList')
          data.notify && iView.Message.success('更新成功')
        }
      }).catch(error => {
        data.notify && iView.Message.error('更新失败')
      })
    }
  },
  mutations: {
    refreshType (state, data) {
      state.typeList = data
    },
    refreshTag (state, data) {
      state.tagList = data
    }
  }
}