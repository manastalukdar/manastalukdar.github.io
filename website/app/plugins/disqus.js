import Vue3Disqus from "vue3-disqus";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Disqus, {
    shortname: "manastalukdar",
  });
});
