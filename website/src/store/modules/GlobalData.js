const state = {
  appTitle: "Manas Talukdar",
  sidebar: {
    visible: false
  }
}

const mutations = {
  flip (state) {
    state.visible = !state.visible
  }
}

export default {
  state,
  mutations
}
