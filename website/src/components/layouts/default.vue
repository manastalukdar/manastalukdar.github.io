<template>
  <v-app>
    <MainNavMenuTopNavBar />
    <MainNavMenuNavigationDrawer />

    <v-content>
      <v-container class="content-body px-6 py-3">
        <transition name="fade">
          <!-- component matched by the route will render here -->
          <nuxt />
        </transition>
      </v-container>
    </v-content>

    <Footer />
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import MainNavMenuNavigationDrawer from '../other/main-nav-menu/NavigationDrawer.vue'
import MainNavMenuTopNavBar from '../other/main-nav-menu/TopNavBar.vue'
import Footer from '../other/footer.vue'
export default {
  pageTransition: {
    name: 'fade',
    mode: 'out-in'
  },
  /* name: 'App', */
  components: {
    MainNavMenuNavigationDrawer,
    MainNavMenuTopNavBar,
    Footer
  },
  computed: {
    ...mapState({
      appOwner: state => state.GlobalData.appOwner
    })
  },
  mounted() {
    // this.$vuetify.theme.dark = true
  },
  head() {
    return {
      title: this.appOwner
    }
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
/*
.application .theme--dark .v-content {
  background-color: #141e24 !important; // : var(--v-accent-lighten2)
}
*/

.theme--dark .v-navigation-drawer {
  background-color: #263238; /* var(--v-cardColor) */
}

.theme--dark a {
  color: #42b983;
}
.theme--dark a:hover {
  color: #ce7720;
}
.theme--dark a:active {
  color: #e90e0e;
}
/*.theme--dark a:visited {
  color: #b1be80;
}*/

.theme--light a {
  color: #31805c;
}
.theme--light a:hover {
  color: #ca6a2a;
}
.theme--light a:active {
  color: #e90e0e;
}
/*.theme--light a:visited {
  color: #797a33;
}*/

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
h2,
h3 {
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
*/
.blogPostContent h1 {
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
