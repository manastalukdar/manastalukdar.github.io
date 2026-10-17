<template>
  <v-app>
    <MainNavMenuTopNavBar />
    <MainNavMenuNavigationDrawer />

    <v-main>
      <v-container id="content-body-container" class="content-body pa-3">
        <NuxtPage />
      </v-container>
    </v-main>

    <Footer />
    <LoadingIndicator />
    <LinearLoadingIndicator />
  </v-app>
  <slot />
</template>

<script setup>
import backToTop from 'vanilla-back-to-top';
import { useGlobalDataStore } from '@/stores/GlobalData';
const globalDataStore = useGlobalDataStore();
import MainNavMenuNavigationDrawer from "~/components/main-nav-menu/NavigationDrawer.vue";
import MainNavMenuTopNavBar from "~/components/main-nav-menu/TopNavBar.vue";
import Footer from "~/components/footer.vue";
import LoadingIndicator from "~/components/LoadingIndicator.vue";
import LinearLoadingIndicator from "~/components/LinearLoadingIndicator.vue";
import setCorrectHJsStyle from "~/utils/setCorrectHJsStyle.ts";
import { useTheme } from 'vuetify';
// ponytail: blog metadata is loaded by the pages that need it, not here — keeps non-blog pages from waiting on it
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

/* Content styles apply only to class-less elements (raw markdown/HTML) inside the main
   content area, so they don't leak into Vuetify components, the nav bar or the footer. */
#content-body-container p:not([class]) {
  margin-top: var(--space-m);
}
#content-body-container video:not([class]) {
  width: 100%;
  max-height: 100%;
  padding: var(--space-l);
}
.table-of-contents {
  margin: var(--space-l);
}
#content-body-container img:not([class]) {
  display: block;
  max-width: 100%;
  height: auto;
  margin-left: auto;
  margin-right: auto;
  padding: var(--space-m);
}
#mermaid {
  display: block;
  max-width: 100%;
  height: auto;
  margin-left: auto;
  margin-right: auto;
  padding: var(--space-m);
}
svg[id^='mermaid-'] {
  display: block;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: var(--space-m);
  margin-bottom: var(--space-m);
}
#content-body-container :is(h2, h3, h4, h5):not([class]) {
  margin-top: var(--space-l);
  margin-bottom: var(--space-s);
}
.footnotes-sep {
  margin-top: var(--space-l);
  margin-bottom: var(--space-l);
}
/* Code blocks scroll horizontally instead of breaking identifiers mid-word. */
#content-body-container pre:not([class]) {
  margin: var(--space-l) 0;
  white-space: pre;
  overflow-x: auto;
}
pre code.hljs {
  display: block;
  margin: 0;
  padding: var(--space-m);
  white-space: pre;
  overflow-x: auto;
}
code {
  margin-left: 0.25em;
  margin-right: 0.25em;
  background: rgb(var(--v-theme-codeBackgroundColor)) !important;
  color: rgb(var(--v-theme-codeTextColor)) !important;
}
:not(pre) > code {
  white-space: pre-wrap;
}

/* Readable line length for blog prose; code, tables, images and embeds keep full width. */
.blogPostContent > :is(p, ul, ol, blockquote, h2, h3, h4, h5, h6, .footnotes) {
  max-width: 72ch;
  margin-left: auto;
  margin-right: auto;
}
.blogPostContent h2 { font-size: var(--text-xl); }
.blogPostContent h3 { font-size: var(--text-l); }
.blogPostContent :is(h4, h5, h6) { font-size: var(--text-m); }

/*
blockquote {
  padding: 10px 20px;
  margin: 0 0 20px;
  font-size: 16px;
  font-weight: 300;
  border-left: 2px solid #eee;
}
*/

.iframe-container {
  position: relative;
  padding-bottom: 56.25%; /* set the aspect ratio here as (height / width) * 100% */
  margin: 2em;
  height: 0;
}
.iframe-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 2em;
  min-width: 100%;
  max-width: 100%;
}
.iframe-container-youtube iframe {
  min-width: 100%;
  max-width: 100%;
  padding: 2em;
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
  .blogPostContent :is(table, thead, tbody, th, td, tr) {
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

  .v-breadcrumbs {
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

.wrap-text {
  word-wrap: break-word;
  white-space: normal;
  -webkit-line-clamp: unset !important;
  width: 100px;
}
</style>
