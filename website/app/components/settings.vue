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
import setCorrectHJsStyle from "~/utils/setCorrectHJsStyle.ts";
import { useTheme } from 'vuetify';
const theme = useTheme();
const navigationStore = useNavigationStore();
var { settingsDialogVisible } = storeToRefs(navigationStore);
watch(settingsDialogVisible, () => {
  //console.log('settingsDialogVisible changed', settingsDialogVisible)
});
function closeDialog() {
  navigationStore.setSettingsDialogVisibility(false);
}

const themeLookup = {
  "darkForestTheme": "Dark Forest",
  "darkNightTheme": "Dark Night",
  "lightTheme": "Light"
}
const myThemes = Object.values(themeLookup);

// Load saved theme from localStorage or use current theme
const savedTheme = localStorage.getItem('selectedTheme');
var selectedTheme = ref(savedTheme || themeLookup[theme.global.name.value]);

// Apply saved theme on component mount
onMounted(() => {
  if (savedTheme) {
    Object.entries(themeLookup).forEach(([k,v]) => {
      if (v === savedTheme) {
        theme.change(k);
        setCorrectHJsStyle(theme);
      }
    });
  }
});

const setTheme = () => {
  Object.entries(themeLookup).forEach(([k,v]) => {
    if (v === selectedTheme.value) {
      theme.change(k);
      // Save theme to localStorage
      localStorage.setItem('selectedTheme', selectedTheme.value);
    }
  });
  setCorrectHJsStyle(theme);
};
</script>
