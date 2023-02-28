import * as Vue from 'vue'
import * as AsyncComputed from 'vue3-async-computed';

const asyncComputed = AsyncComputed.createPlugin({ ref: Vue.ref });

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(asyncComputed, {})
})

//Vue.createApp({}).use(asyncComputed, {})
