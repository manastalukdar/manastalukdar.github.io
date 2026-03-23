import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalDataStore = defineStore('GlobalData', () => {
  const appTitle = ref('Manas Talukdar')
  const appOwner = ref('Manas Talukdar')
  const homepageTitle = ref('Manas Talukdar | Enterprise AI, Data Infrastructure')
  const copyrightStartYear = ref('2018')
  const copyrightEndYear = ref(new Date().getFullYear())
  const currentPageName = ref('')

  function setCurrentPageName(name: any) {
    currentPageName.value = name
  }

  return { appTitle, appOwner, homepageTitle, copyrightStartYear, copyrightEndYear, currentPageName, setCurrentPageName }
})
