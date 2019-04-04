// initial state
const state = () => ({
  aboutBlurb:
    'I am an engineering manager, located in the San Francisco bay area, experienced in hiring, mentoring software engineers and building and running a team. I have nearly 12 years of software engineering experience, including collaboration with users, executive leadership, product management and customer support. I am a quick learner and self-driven with proven track record in delivering projects that involved learning new technologies. My recent experience is in cloud computing and distributed systems. My current core competencies are in large scale system design and people, project management.',
  interests: [
    {
      'Distributed Systems and Cloud Computing':
        'I am interested in the design, architecture and organizational challenges of distributed systems. I enjoy working on problems around scale, data consistency, availability, reliability, and how to build and run teams that solve these problems.'
    },
    {
      Storage:
        'General interest in data storage paradigms and concepts involved in database technologies, specifically in the context of distributed systems.'
    },
    {
      'Building and running high efficiency engineering teams':
        'I am interested and experienced in building high functioning engineering teams by hiring and retaining top talent. I follow an agile data driven approach to team management that includes close collaboration with stakeholders and mining project metadata to drive team velocity. At the end of the day, I find it very gratifying to see someone I hired, mentored and coached ramp up to become a productive software engineer who as part of my team or a greater organization, along with the rest of us, is geared towards building something that provides value to users.'
    },
    {
      Hiking:
        'I love nature and like to go on hikes around the San Francisco bay area. I particularly enjoy the redwood forests in California.'
    },
    {
      Technology:
        'I love technology in general and I am always on the lookout for any new development in the industry that I could either learn out of personal interest, or potentially apply at work if relevant.'
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
const actions = {}

// mutations
const mutations = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
