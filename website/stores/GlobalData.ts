import { defineStore } from 'pinia'

// initial state
const initialState = () => ({
    appTitle: 'Manas Talukdar',
    appOwner: 'Manas Talukdar',
    homepageTitle: 'Manas Talukdar | Enterprise AI, Data Infrastructure',
    copyrightStartYear: '2018',
    copyrightEndYear: new Date().getFullYear(),
    currentPageName: '',
})

export const useGlobalDataStore = defineStore('GlobalData', {
  state: initialState,
  actions: {
    setCurrentPageName(name: any) {
      this.currentPageName = name
    },
  }
})
