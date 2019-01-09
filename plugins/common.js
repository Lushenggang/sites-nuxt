import Vue from 'vue'
import Avatar from '@/components/Avatar'

Vue.component('avatar', Avatar)
Vue.prototype.$bus = new Vue()
