import Vue from 'vue'
import {
  Button,
  Input,
  Modal,
  Icon,
  Message,
  Drawer
} from 'iview'

Vue.component('Button', Button)
Vue.component('Modal', Modal)
Vue.component('Input', Input)
Vue.component('Icon', Icon)
Vue.component('Drawer', Drawer)
Vue.prototype.$Message = Message

import 'iview/dist/styles/iview.css'
