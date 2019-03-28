import Vue from 'vue'
import Vuex from 'vuex'
import vux from './modules/vux.js'
import app from './modules/app.js'
import vuexI18n from 'vuex-i18n'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    i18n: vuexI18n.store,
    vux,
    app
  }
})