import vuePdfSyl from './vue-pdf-syl.vue'
import Vue from 'vue'
const VuePdf = {
  install: function (Vue) {
    Vue.component(vuePdfSyl.name, vuePdfSyl)
  }
}
if (typeof window !== 'undefined' && window.Vue) {
  window.VuePdf = VuePdf
  Vue.use(VuePdf)
}
export default VuePdf