import Vue from 'vue'
import App from './App.vue'

import './assets/main.css'
import '@shopware-ag/meteor-component-library/dist/style.css';

new Vue({
  render: (h) => h(App)
}).$mount('#app')
