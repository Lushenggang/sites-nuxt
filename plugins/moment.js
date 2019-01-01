import Vue from 'vue'
import * as moment from 'moment'

Vue.prototype.$formatTime = function (timestamp, format = 'YYYY/MM/DD HH:mm') {
  return moment((timestamp + 8 * 3600) * 1000).format(format)
}
