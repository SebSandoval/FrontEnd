import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'
import { routes } from './router/router'
import VueSimpleAlert from "vue-simple-alert";
import axios from "axios";
import {store} from "../store/store.js"


import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'

Vue.use(Chartkick.use(Chart))



Vue.use(VueSimpleAlert);
Vue.use(VueRouter)
Vue.config.productionTip = false

//axios.defaults.baseURL = "http://localhost:5000/api/"
axios.defaults.baseURL = "https://compra-venta-1.herokuapp.com/api/"





const router = new VueRouter({
  routes,
  mode: "history"
})

router.beforeEach((to, from, next) =>{
  if (!store.state.token && to.path != "/"){
    next("/");
  }else{
    next();
  }
})


new Vue({
  vuetify, router, store,
  render: h => h(App)
}).$mount('#app')


