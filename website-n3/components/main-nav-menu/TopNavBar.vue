<template>
  <v-app-bar color="headerAndFooterColor" app>
    <v-app-bar-nav-icon class="hidden-sm-and-up">
      <nuxt-link v-slot="{ navigate }" to="/">
        <div class="home-link">
        <span role="link" @click="navigate" @keypress.enter="navigate"
          ><v-icon>mdi-home</v-icon></span
        >
      </div>
      </nuxt-link>
    </v-app-bar-nav-icon>
    <v-toolbar-title class="hidden-xs-only text-h5">
      <nuxt-link v-slot="{ navigate }" to="/">
        <div class="home-link">
        <span role="link" @click="navigate" @keypress.enter="navigate" class="home-link">{{
          appTitle
        }}</span>
      </div>
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

<script setup>
import { useGlobalDataStore } from '@/stores/GlobalData';
import { useNavigationStore } from '@/stores/Navigation';
const globalDataStore = useGlobalDataStore();
const navigationStore = useNavigationStore();
import MainNavMenuBlog from './Blog.vue';
import MainNavMenuAbout from './About.vue';
import MainNavMenuLegal from './Legal.vue';
import MainNavMenuContact from './Contact.vue';
import { useTheme } from 'vuetify';
const appTitle = globalDataStore.appTitle;
const theme = useTheme();
onMounted(() => {
  setCorrectHJsStyle();
});
function flipSidebarVisibility() {
  navigationStore.flipSidebarVisibility();
};
function flipThemeMode() {
  //console.log(theme.global.name.value)
  //console.log(theme.global.current.value)
  theme.global.name.value = 'darkTheme1' ? 'lightTheme' : 'darkTheme1';
  //console.log(theme.global.current.value)
  setCorrectHJsStyle();
};
function setCorrectHJsStyle() {
  if (theme.global.name.value = 'darkTheme1') {
    setCorrectHJsStyleBase('dark', 'light')
  } else {
    setCorrectHJsStyleBase('light', 'dark')
  }
};
function setCorrectHJsStyleBase(styleToEnable, styleToDisable) {
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
    var head = document.getElementsByTagName('head')[0]
    var elementToCreate = document.createElement('link')
    elementToCreate.rel = 'stylesheet'
    elementToCreate.id = 'highlightjs-' + styleToEnable
    elementToCreate.href = '/styles/' + fileName
    //console.log(elementToCreate)
    head.appendChild(elementToCreate)
  }
  const elementToDisable = document.getElementById(
    'highlightjs-' + styleToDisable
  )
  if (elementToDisable != null) {
    elementToDisable.remove()
  }
};
</script>

<style scoped>
.home-link {
  cursor: pointer
}

</style>
