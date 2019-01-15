// 用户信息集，避免重复获取
import userApi from '@/api/user'
import { BASE_URL } from '@/libs/config'

export default {
  namespaced: true,
  state: {
    info: {},
    loading: {}
  },
  actions: {
    getInfo (context, data) {
      if (context.state.loading[data.id]) return
      if (context.state.info[data.id] && !data.force) return
      context.commit('setLoading', { id: data.id, status: true})
      userApi.getUserInfoById(data.id).then(res => {
        res.status === 200 && context.commit('setInfo', res.data)
        context.commit('setLoading', { id: data.id, status: false })
      }).catch(error => {
        console.log(error)
        context.commit('setLoading', { id: data.id, status: false })
      })
    }
  },
  mutations: {
    setInfo (state, data) {
      data.avatar = `${BASE_URL}/api/get-file/?filename=${data.avatar}&path=avatar`
      state.info = Object.assign({ [data.id]: data }, state.info)
    },
    setLoading (state, data) {
      state.loading[data.id] = data.status
    }
  }
}
