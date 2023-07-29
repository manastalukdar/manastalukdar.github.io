<template>
  <v-app>
    <MainNavMenuTopNavBar />
    <MainNavMenuNavigationDrawer />

    <v-main>
      <v-container id="content-body-container" class="content-body pa-3">
        <transition name="fade">
          <!-- component matched by the route will render here -->
          <div>
            <NuxtPage />
          </div>
        </transition>
      </v-container>
    </v-main>

    <Footer />
  </v-app>
  <slot />
</template>

<script setup>
import backToTop from 'vanilla-back-to-top';
import { useGlobalDataStore } from '@/stores/GlobalData';
const globalDataStore = useGlobalDataStore();
import MainNavMenuNavigationDrawer from '../components/main-nav-menu/NavigationDrawer.vue';
import MainNavMenuTopNavBar from '../components/main-nav-menu/TopNavBar.vue';
import Footer from '../components/footer.vue';
import setCorrectHJsStyle from '../utils/setCorrectHJsStyle.ts';
import { useTheme } from 'vuetify';
const theme = useTheme();
/* definePageMeta({
  pageTransition: {
    name: 'fade',
    mode: 'out-in',
  }
}); */
const appOwner = globalDataStore.appOwner;
/* name: 'App', */
useHead({
  title: appOwner,
});
onMounted(() => {
  backToTop.addBackToTop({
    diameter: 50,
    zIndex: 3
  });
  setCorrectHJsStyle(theme);
});
</script>

<style>

.v-application ol, .v-application ul {
  padding-left: 24px;
}

#back-to-top {
  background: rgb(var(--v-theme-backToTopBackground));
  color: rgb(var(--v-theme-backToTopText));
  bottom: 120px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* .theme--darkForestTheme.v-application {
  background-color: var(--v-theme-background-lighten1) !important;
} */

.v-breadcrumbs-item--link, .v-list-item, a {
  color: rgb(var(--v-theme-linkColor));
}
a:hover {
  color: rgb(var(--v-theme-linkHoverColor));
}
a:active {
  color: rgb(var(--v-theme-linkActiveColor));
}
/*a:visited {
  color: rgb(var(--v-theme-linkVisitedColor));
}*/

/* .theme-selector {
  max-width: 140px;
  max-height: 45px;
} */

p {
  margin-top: 16px;
}
video {
  width: 100%;
  max-height: 100%;
  padding: 2em;
}
.table-of-contents {
  margin: 2em;
}
img {
  display: block;
  max-width: 100%;
  height: auto;
  margin-left: auto;
  margin-right: auto;
  padding: 1em;
}
#mermaid {
  display: block;
  max-width: 100%;
  height: auto;
  margin-left: auto;
  margin-right: auto;
  padding: 1em;
}
svg[id^='mermaid-'] {
  display: block;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1em;
  margin-bottom: 1em;
}
h2,
h3,
h4,
h5 {
  margin: 1em;
}
.footnotes-sep {
  margin-top: 2em;
  margin-bottom: 2em;
}
pre {
  margin: 2em;
  white-space: pre-wrap;
  word-wrap: break-word;
  text-align: justify;
}
@media all and (orientation: landscape) {
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    text-align: justify;
  }
}
pre code {
  margin: 0em;
  padding: 1em;
}
code {
  margin-left: 0.25em;
  margin-right: 0.25em;
}

code {
  background-color: var(--v-theme-codeBackgroundColor-base) !important;
  color: var(--v-theme-codeTextColor-base) !important;
}

blockquote {
  padding: 10px 20px;
  margin: 0 0 20px;
  font-size: 16px;
  font-weight: 300;
  border-left: 2px solid #eee;
}
.iframe-container {
  position: relative;
  padding-bottom: 56.25%; /* set the aspect ratio here as (height / width) * 100% */
  margin: 2em;
  height: 0;
  overflow: hidden;
  max-width: 100%;
  align-content: center;
}
.iframe-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
  margin: auto;
}

/*
Generic Styling, for Desktops/Laptops
*/
.blogPostContent table {
  border-collapse: collapse;
  table-layout: fixed;
}
.blogPostContent th {
  font-weight: bold;
}
.blogPostContent td,
.blogPostContent th {
  padding: 6px;
  border: 1px solid #ccc;
  text-align: left;
}

.blogPostContent h1 {
  display: none;
}

/*
Max width before this PARTICULAR table gets nasty
This query will take effect for any screen smaller than 760px
and also iPads specifically.
*/
@media only screen and (max-width: 760px),
  (min-device-width: 768px) and (max-device-width: 1024px) {
  /* Force table to not be like tables anymore */
  .blogPostContent table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
    max-width: 100%;
  }

  .blogPostContent tr {
    border: 1px solid #ccc;
  }

  .blogPostContent td {
    /* Behave  like a "row" */
    border: none;
    position: relative;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .blogPostContent a {
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
  }
}

/*
* https://gist.github.com/patik/89ee6092c72a9e39950445c01598517a
* https://stackoverflow.com/questions/48029165/is-there-a-way-to-make-the-headings-sections-and-subsections-numbering-in-markd
* https://codepen.io/X-Raym/pen/dBprG
*/
/*.blogPostContent h1 {
  counter-reset: h2counter;
}*/

.blogPostContent {
  counter-reset: h2counter;
}
.blogPostContent h2 {
  counter-reset: h3counter;
}
.blogPostContent h3 {
  counter-reset: h4counter;
}
.blogPostContent h4 {
  counter-reset: h5counter;
}
.blogPostContent h5 {
  counter-reset: h6counter;
}
.blogPostContent h6 {
}

.blogPostContent h2:before {
  counter-increment: h2counter;
  content: counter(h2counter) '.\0000a0\0000a0';
}

.blogPostContent h3:before {
  counter-increment: h3counter;
  content: counter(h2counter) '.' counter(h3counter) '.\0000a0\0000a0';
}

.blogPostContent h4:before {
  counter-increment: h4counter;
  content: counter(h2counter) '.' counter(h3counter) '.' counter(h4counter)
    '.\0000a0\0000a0';
}

.blogPostContent h5:before {
  counter-increment: h5counter;
  content: counter(h2counter) '.' counter(h3counter) '.' counter(h4counter) '.'
    counter(h5counter) '.\0000a0\0000a0';
}

.blogPostContent h6:before {
  counter-increment: h6counter;
  content: counter(h2counter) '.' counter(h3counter) '.' counter(h4counter) '.'
    counter(h5counter) '.' counter(h6counter) '.\0000a0\0000a0';
}
</style>
