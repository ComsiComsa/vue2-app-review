import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'

Vue.config.productionTip = false

Vue.use(Vuex)
// название стора ни о чем не говорит
const store = new Vuex.Store({
  state: {
    tasks: []
  },
  // нет публичного api
  mutations: {
    updateTasks (state, tasks) {
      state.tasks = tasks
    }
  }
})

new Vue({
  render: h => h(App),
  store: store,
}).$mount('#app')
