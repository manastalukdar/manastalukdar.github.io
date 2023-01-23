import { createApp } from 'vue'
import App from '../app.vue'
import VueDisqus from 'vue-disqus'

createApp(App)
  .use(VueDisqus, { shortname: 'manastalukdar' })
  .mount('#app')
