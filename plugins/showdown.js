import Vue from 'vue'
import showdown from 'showdown'

Vue.prototype.$converter = new showdown.Converter()
