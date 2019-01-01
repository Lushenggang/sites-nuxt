// 用户信息集，避免重复获取
import userApi from '@/api/user'
import { BASE_URL } from '@/libs/config'
import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    info: {}
  },
  actions: {
    getInfo (context, data) {
      if (context.state.info[data.id] && !data.force) {
        data.callback && data.callback()
        return 
      }
      userApi.getUserInfoById(data.id).then(res => {
        if (res.status === 200) {
          context.commit('setInfo', res.data)
          data.callback && data.callback()
        }
      }).catch(error => {
        console.log(error)
      })
    }
  },
  mutations: {
    setInfo (state, data) {
      data.avatar = `${BASE_URL}/api/get-file/?filename=${data.avatar}&path=avatar`
      state.info[data.id] = data
      let tmp = state.info
      state.info = {}
      state.info = tmp
    }
  }
}
