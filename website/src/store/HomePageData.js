// initial state
const state = () => ({
  aboutBlurb:
    'I am an engineering manager, located in the San Francisco bay area, experienced in hiring, mentoring software engineers and building and running a team. I have nearly 12 years of software engineering experience, including collaboration with users, executive leadership, product management and customer support. I am a quick learner and self-driven with proven track record in delivering projects that involved learning new technologies. My recent experience is in cloud computing and distributed systems. My current core competencies are in large scale system design and people, project management.',
  highlights: [
    'Created high-value engineering team that developed product which spawned v-next series of solutions.',
    'Successfully completed research project and developed prototype for distributed data store that I subsequently took to product stage as engineering manager.',
    'Worked throughout the stack, from using front-end frameworks to develop web apps to back-end development including storage, access layers, API and middleware SDK.'
  ],
  interests: [
    {
      name: 'Distributed Systems and Cloud Computing',
      value:
        'I am interested in the design, architecture and organizational challenges of distributed systems. I enjoy working on problems around scale, data consistency, availability, reliability, and how to build and run teams that solve these problems.'
    },
    {
      name: 'Data Storage',
      value:
        'General interest around concepts involved in data storage and database technologies, specifically in the context of large scale distributed systems.'
    },
    {
      name: 'Building and running high efficiency engineering teams',
      value:
        'I am interested and experienced in building high functioning engineering teams by hiring and retaining top talent. I follow an agile data driven approach to team management that includes close collaboration with stakeholders and mining project metadata to drive team velocity. At the end of the day, I find it gratifying to see someone I hired, mentored, coached ramp up to become a productive software engineer, building something as part of my team or a greater organization, that provides value to users.'
    },
    {
      name: 'Technology',
      value:
        'I love technology in general and I am always on the lookout for any new development in the industry that I could either learn out of personal interest, or potentially apply at work if relevant.'
    },
    {
      name: 'Hiking',
      value:
        'I love nature and like to go on hikes around the San Francisco bay area. I particularly enjoy the redwood forests in California.'
    }
  ],
  recentUpdates: [
    {
      Reading: [
        {
          name: 'Distributed systems for fun and profit',
          value:
            'I recently finish re-reading this (free and open source) [e-book](http://book.mixu.net/distsys/) on distributed systems. It is authored by a fellow engineer in the industry. I think this e-book, while slightly dated, outlines some of the core conceptual aspects of distributed systems in a very concise form, that other literature has done so or expanded upon in forms many times larger.'
        }
      ]
    },
    {
      Work: [
        {
          name: 'Cloud Services',
          value:
            'I am current managing a team working on metadata for large scale distributed store.'
        }
      ]
    },
    {
      Other: [
        {
          name: 'Personal Website',
          value:
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
