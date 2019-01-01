import axios from '@/libs/request'

export default {
  getPosts (params) {
    return axios.post('/api/posts/', params)
  },
  getPost (params) {
    return axios.post('/api/post/', params)
  },
  getPostType () {
    return axios.get('/api/post-types/')
  },
  savePost (params) {
    return axios.post('/api/save-post/', params)
  },
  updateType (params) {
    return axios.post('/api/type-manage/', params)
  },
  addType (params) {
    return axios.post('/api/type-add/', params)
  },
  getTagList () {
    return axios.get('/api/post-tags/')
  },
  updateTag (params) {
    return axios.post('/api/tag-manage/', params)
  },
  addTag (params) {
    return axios.post('/api/tag-add/', params)
  },
  addComment (params) {
    return axios.post('/api/add-comment/', params)
  },
  getComments (postId) {
    return axios.get('/api/get-comments/?postId=' + postId)
  }
}