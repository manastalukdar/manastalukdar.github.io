// initial state
const state = () => ({
  appTitle: 'Manas Talukdar',
  appOwner: 'Manas Talukdar',
  copyrightStartYear: '2018',
  copyrightEndYear: new Date().getFullYear(),
  currentPageName: '',
  aboutBlurb:
    'I am an engineering manager, located in the San Francisco bay area, experienced in hiring, mentoring software engineers and building and running a team. I have nearly 12 years of software engineering experience, including collaboration with users, executive leadership, product management and customer support. I am a quick learner and self-driven with proven track record in delivering projects that involved learning new technologies. My recent experience is in cloud computing, distributed systems and data infrastructure. My current core competencies are in large scale system design and people, project management.',
  interests: [
    {
      'Distributed Systems':
        'I am interested in the design, architecture and organizational challenges of distributed systems.'
    },
    { 'Cloud Computing': '' },
    {
      Storage:
        'General interest in data storage paradigms and concepts involved in database technologies, specifically in the context of distributed systems.'
    }
  ],
  highlights: [
    'Created high-value engineering team that developed product which spawned v-next series of solutions',
    'Worked on research project and developed prototype that I subsequently took to product stage as engineering manager',
    'Worked throughout the stack - using front-end frameworks to develop web apps to back-end development including storage, access layers and API.'
  ],
  recentAndCurrentUpdates: [
    {
      Reading: [
        {
          'Distributed systems for fun and profit':
            'I recently finish re-reading this (free and open source) e-book (http://book.mixu.net/distsys/) on distributed systems. It is authored by a fellow engineer in the industry. I think this e-book, while slightly dated, outlines some of the core conceptual aspects of distributed systems in a very concise form, that other literature has done so or expanded upon in forms many times larger.'
        }
      ],
      Work: [{ OCS: '' }],
      Other: [
        {
          'Personal Website':
            'I recently built this website (with blog). Learnt Vue.js and Nuxt.js for this project and it was a lot of fun.'
        }
      ]
    }
  ]
})

// getters
const getters = {}

// actions
const actions = {
  setCurrentPageName({ commit }, name) {
    commit('currentPageName', name)
  }
}

// mutations
const mutations = {
  setCurrentPageName(state, name) {
    state.currentPageName = name
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
