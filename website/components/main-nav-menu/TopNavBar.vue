<template>
  <v-app-bar color="headerAndFooterColor" app>
    <v-app-bar-nav-icon class="hidden-sm-and-up">
      <nuxt-link v-slot="{ navigate }" to="/" custom style="cursor: pointer">
        <span role="link" @click="navigate" @keypress.enter="navigate"
          ><v-icon>mdi-home</v-icon></span
        >
      </nuxt-link>
    </v-app-bar-nav-icon>
    <v-toolbar-title class="hidden-xs-only text-h5">
      <nuxt-link v-slot="{ navigate }" to="/" custom style="cursor: pointer">
        <span role="link" @click="navigate" @keypress.enter="navigate">{{
          appTitle
        }}</span>
      </nuxt-link>
    </v-toolbar-title>
    <div class="flex-grow-1" />
    <v-btn text icon @click="flipThemeMode">
      <v-icon>mdi-invert-colors</v-icon>
    </v-btn>
    <v-toolbar-items class="hidden-sm-and-down">
      <MainNavMenuBlog />
      <MainNavMenuAbout />
      <MainNavMenuLegal />
      <MainNavMenuContact />
    </v-toolbar-items>

    <v-btn text icon class="hidden-md-and-up" @click="flipSidebarVisibility">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import MainNavMenuBlog from './Blog.vue'
import MainNavMenuAbout from './About.vue'
import MainNavMenuLegal from './Legal.vue'
import MainNavMenuContact from './Contact.vue'
export default {
  components: {
    MainNavMenuBlog,
    MainNavMenuAbout,
    MainNavMenuLegal,
    MainNavMenuContact,
  },
  data: () => ({}),
  computed: {
    ...mapState({
      appTitle: (state) => state.GlobalData.appTitle,
    }),
  },
  mounted() {
    this.setCorrectHJsStyle()
  },
  methods: {
    ...mapActions({
      flipSidebarVisibility: 'Navigation/flipSidebarVisibility',
    }),
    flipThemeMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      // console.log(this.$vuetify.theme.currentTheme)
      this.setCorrectHJsStyle()
    },
    setCorrectHJsStyle() {
      if (this.$vuetify.theme.isDark) {
        this.setCorrectHJsStyleBase('dark', 'light')
      } else {
        this.setCorrectHJsStyleBase('light', 'dark')
      }
    },
    setCorrectHJsStyleBase(styleToEnable, styleToDisable) {
      let fileName = null
      switch (styleToEnable) {
        case `dark`:
          fileName = 'atom-one-dark.css'
          break
        case 'light':
          fileName = 'atom-one-light.css'
          break
      }
      const elementToEnable = document.getElementById(
        'highlightjs-' + styleToEnable
      )
      if (elementToEnable == null) {
        const head = document.getElementsByTagName('head')[0]
        const elementToCreate = document.createElement('link')
        elementToCreate.rel = 'stylesheet'
        elementToCreate.id = 'highlightjs-' + styleToEnable
        elementToCreate.href = '/styles/' + fileName
        head.appendChild(elementToCreate)
      }
      const elementToDisable = document.getElementById(
        'highlightjs-' + styleToDisable
      )
      if (elementToDisable != null) {
        elementToDisable.remove()
      }
    },
  },
}
</script>

<style></style>
