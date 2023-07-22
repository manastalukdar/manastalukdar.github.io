<template>
  <v-app-bar color="headerAndFooterColor" app class="px-3">
    <v-app-bar-nav-icon class="hidden-sm-and-up home-icon">
      <nuxt-link v-slot="{ navigate }" to="/">
        <span role="link" @click="navigate" @keypress.enter="navigate"
          ><v-icon>mdi-home</v-icon></span
        >
      </nuxt-link>
    </v-app-bar-nav-icon>
    <v-toolbar-title class="hidden-xs text-h5 home-link">
      <nuxt-link v-slot="{ navigate }" to="/">
        <span role="link" @click="navigate" @keypress.enter="navigate" class="home-link">{{
          appTitle
        }}</span>
      </nuxt-link>
    </v-toolbar-title>
    <div class="flex-grow-1" />
<!--     <v-btn text icon @click="flipThemeMode">
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn> -->
    <v-toolbar-items class="hidden-sm-and-down">
      <MainNavMenuBlog />
      <MainNavMenuAbout />
      <MainNavMenuLegal />
      <MainNavMenuContact />
    </v-toolbar-items>

    <v-select
      label="Theme"
      class="theme-selector"
      density="compact"
      chips
      variant="solo-filled"
      v-model="selectedTheme"
      :items="myThemes"
      @update:modelValue="setTheme()"
    ></v-select>

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
const theme = useTheme();
const themeLookup = {
  "darkForestTheme": "Dark Forest",
  "darkEasyTheme": "Dark Easy",
  "lightTheme": "Light"
}
const myThemes = Object.values(themeLookup);
var selectedTheme = ref(themeLookup[theme.global.name.value]);
const appTitle = globalDataStore.appTitle;
onMounted(() => {
  setCorrectHJsStyle();
});
function flipSidebarVisibility() {
  navigationStore.flipSidebarVisibility();
};
const setTheme = () => {
  Object.entries(themeLookup).forEach(([k,v]) => {
    if (v === selectedTheme.value) {
      //console.log(v)
      theme.global.name.value = k
    }
  })
  //theme.global.name.value = selectedTheme.value;
  //console.log(selectedTheme.value);
};
function flipThemeMode() {
  //console.log(theme.global.name.value)
  //console.log(theme.global.current.value)
  theme.global.name.value = theme.global.name.value === 'darkForestTheme' ? 'lightTheme' : 'darkForestTheme';
  //console.log(theme.global.current.value)
  selectedTheme = ref(themeLookup[theme.global.name.value]);
  setCorrectHJsStyle();
};
function setCorrectHJsStyle() {
  if (theme.global.name.value === 'darkForestTheme') {
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
.home-link a:link {
  cursor: pointer;
  text-decoration: none;
}

</style>
