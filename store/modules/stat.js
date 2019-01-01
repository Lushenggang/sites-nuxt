export default {
  namespaced: true,
  state: {
    postRead: {}
  },
  mutations: {
    addReadTime (state, data) {
      state.postRead[data.id] = true
    }
  }
}