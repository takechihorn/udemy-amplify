import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import { Auth } from '@aws-amplify/auth'
import '@aws-amplify/ui-vue'
import awsmobile from './aws-exports'
import { Logger } from '@aws-amplify/core'
import { I18n } from '@aws-amplify/core'
import  AuthClass  from '@aws-amplify/auth'
Amplify.configure(awsmobile)
Auth.configure(awsmobile)


import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(AmplifyPlugin,AmplifyModules, { AuthClass, Auth, Logger, I18n })
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
