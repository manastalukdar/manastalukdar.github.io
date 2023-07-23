<template>
  <v-dialog
    v-model="settingsDialogVisible"
    width="auto"
  >
  <v-container>
    <v-col cols="12">
      <v-card
      class="pa-8">
      <v-row>
        <v-card-title>
          <span class="text-h5">Settings</span>
        </v-card-title>
      </v-row>
      <v-row class="pt-5 justify-center">
        <v-col class="justify-center">
          <v-icon>mdi-theme-light-dark</v-icon>
        </v-col>
        <v-col>
          <span>Theme</span>
        </v-col>
      </v-row>
        <v-row>
          <v-select
          label=""
          class="theme-selector"
          density="default"
          chips
          variant="solo"
          v-model="selectedTheme"
          :items="myThemes"
          @update:modelValue="setTheme()"
        ></v-select>
        </v-row>
        <v-col cols="auto">
          <v-btn block @click=closeDialog()>Close</v-btn>
        </v-col>
      </v-card>
    </v-col>
  </v-container>
  </v-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useNavigationStore } from '@/stores/Navigation';

import { useTheme } from 'vuetify';
const navigationStore = useNavigationStore();
var { settingsDialogVisible } = storeToRefs(navigationStore);
watch(settingsDialogVisible, () => {
  //console.log('settingsDialogVisible changed', settingsDialogVisible)
});
function closeDialog() {
  navigationStore.setSettingsDialogVisibility(false);
}

const theme = useTheme();
const themeLookup = {
  "darkForestTheme": "Dark Forest",
  "darkNightTheme": "Dark Night",
  "lightTheme": "Light"
}
const myThemes = Object.values(themeLookup);
var selectedTheme = ref(themeLookup[theme.global.name.value]);

function setCorrectHJsStyle() {
  if (theme.global.name.value.includes("dark")) {
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
const setTheme = () => {
  Object.entries(themeLookup).forEach(([k,v]) => {
    if (v === selectedTheme.value) {
      //console.log(selectedTheme.value)
      //console.log("k: " + k)
      //console.log("v: " +v)
      theme.global.name.value = k
      //console.log(theme.global.name.value)
    }
  })
  //theme.global.name.value = selectedTheme.value;
  //console.log(selectedTheme.value);
  setCorrectHJsStyle();
};
</script>
