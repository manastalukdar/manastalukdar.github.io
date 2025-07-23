import { defineStore } from 'pinia'

// initial state
const initialState = () => ({
  sidebarVisible: false,
  settingsDialogVisible: false,
  blog: {
    blogText: 'Blog',
    icon: 'mdi-newspaper',
    authorText: 'Author',
    yearText: 'Year',
    monthText: 'Month',
    dayText: 'Day',
    tagText: 'Tag',
    categoryText: 'Category',
    postFormatText: 'Post Format',
    blogItems: [
      {
        href: '/blog/',
        target: '_blank',
        icon: 'mdi-newspaper',
        text: 'Blog',
      },
      {
        href: '/blog/series/',
        target: '_blank',
        icon: 'mdi-book-open-variant',
        text: 'Series',
      },
      {
        href: '/bookmarks/',
        target: '_blank',
        icon: 'mdi-bookmark',
        text: 'Bookmarks',
      },
      {
        href: '/blog/categories/',
        target: '_blank',
        icon: 'mdi-domain',
        text: 'Categories',
      },
      {
        href: '/blog/tags/',
        target: '_blank',
        icon: 'mdi-tag-multiple',
        text: 'Tags',
      },
      {
        href: '/blog/post-formats/',
        target: '_blank',
        icon: 'mdi-format-list-bulleted-type',
        text: 'Post Formats',
      },
      {
        href: '/blog/archive/',
        target: '_blank',
        icon: 'mdi-archive',
        text: 'Archive',
      },
    ],
    dynamicItems: {
      blogBase: {
        href: '/blog/',
      },
      category: {
        href: '/blog/category/',
      },
      tag: {
        href: '/blog/tag/',
      },
      author: {
        href: '/blog/author/',
      },
      postFormat: {
        href: '/blog/post-format/',
      },
      blogPost: {
        href: '/blog/',
      },
    },
  },
  about: {
    aboutText: 'About',
    icon: 'mdi-information',
    aboutItems: [
      {
          professionalText: "Professional",
          icon: 'mdi-briefcase-outline',
          professionalItems: [
            {
              href: '/about/professional/highlights/',
              target: '_blank',
              icon: 'mdi-text',
              text: 'Highlights',
              isRouterLink: true,
            },
            {
              href: '/about/professional/resume/',
              target: '_blank',
              icon: 'mdi-file-document',
              text: 'Resume',
              isRouterLink: true,
            },
            {
              href: '/about/professional/patents/',
              target: '_blank',
              icon: 'mdi-script-text',
              text: 'Patents',
              isRouterLink: true,
            },
            {
              href: '/about/professional/engagements/',
              target: '_blank',
              icon: 'mdi-list-box',
              engagementsText: 'Engagements',
              engagementsItems: [
                {
                  href: '/about/professional/engagements/memberships-affiliations/',
                  target: '_blank',
                  icon: 'mdi-account-group',
                  text: 'Professional Memberships and Affiliations',
                },
                {
                  href: '/about/professional/engagements/fellowships/',
                  target: '_blank',
                  icon: 'mdi-seal-variant',
                  text: 'Fellowships',
                },
                {
                  href: '/about/professional/engagements/board-memberships/',
                  target: '_blank',
                  icon: 'mdi-account-tie',
                  text: 'Board Memberships',
                },
                {
                  href: '/about/professional/engagements/judging-roles/',
                  target: '_blank',
                  icon: 'mdi-scale-balance',
                  text: 'Judging Roles',
                },
                {
                  href: '/about/professional/engagements/editor-reviewer-roles/',
                  target: '_blank',
                  icon: 'mdi-book-edit',
                  text: 'Editor and Reviewer Roles',
                },
                {
                  href: '/about/professional/engagements/advisory-roles/',
                  target: '_blank',
                  icon: 'mdi-human-male-board',
                  text: 'Advisory Roles',
                },
                {
                  href: '/about/professional/engagements/speaking/',
                  target: '_blank',
                  icon: 'mdi-microphone-variant',
                  text: 'Speaking',
                },
              ]
            },
            {
              href: 'https://scholar.google.com/citations?user=42DCHoEAAAAJ&hl=en&authuser=1&scioq=manas+talukdar',
              target: '_blank',
              icon: 'mdi-school',
              text: 'Google Scholar',
              isRouterLink: false,
            },
            {
              href: '/about/professional/recruiters/',
              target: '_blank',
              icon: 'mdi-handshake',
              text: 'Recruiters',
              isRouterLink: true,
            },
          ],
      },
      {
        href: '/about/volunteering/',
        target: '_blank',
        icon: 'mdi-desk-lamp',
        text: 'Volunteering',
      },
      {
        href: '/about/interests/',
        target: '_blank',
        icon: 'mdi-thumb-up',
        text: 'Interests',
      },
      {
        href: '/about/honors/',
        target: '_blank',
        icon: 'mdi-medal',
        text: 'Honors',
      },
      {
        href: '/about/testimonials/',
        target: '_blank',
        icon: 'mdi-account-heart',
        text: 'Testimonials',
      },
      // {
      //   href: '/about/awards/',
      //   target: '_blank',
      //   icon: 'mdi-trophy',
      //   text: 'Awards',
      // },
      {
        href: '/about/media-coverage/',
        target: '_blank',
        icon: 'mdi-newspaper',
        text: 'Media Coverage',
      },
      {
        href: '/about/services/',
        target: '_blank',
        icon: 'mdi-toolbox-outline',
        text: 'Services',
      },
    ],
  },
  legal: {
    legalText: 'Legal',
    icon: 'mdi-gavel',
    legalPath: '/legal/',
  },
  contact: {
    contactText: 'Contact',
    icon: 'mdi-mail',
    subHeaderTextOtherLocations: { text: 'Other Locations' },
    contactForm: {
      text: 'Form',
      icon: 'mdi-email-box',
      href: '/contact/form/',
    },
    otherLocations: [
      {
        href: 'https://www.linkedin.com/in/manastalukdar/',
        target: '_blank',
        icon: 'mdi-linkedin',
        text: 'LinkedIn',
      },
      {
        href: 'https://github.com/manastalukdar/',
        target: '_blank',
        icon: 'mdi-github',
        text: 'GitHub',
      },
      {
        href: 'https://www.x.com/manastalukdar/',
        target: '_blank',
        icon: 'mdi-alpha-x',
        text: 'X / Twitter',
      },
    ],
  },
})

export const useNavigationStore = defineStore('Navigation', {
  state: initialState,
  actions: {
    flipSidebarVisibility() {
      this.sidebarVisible = !this.sidebarVisible
      //console.log(this.sidebarVisible)
    },
    setSidebarVisibility(value: any) {
      this.sidebarVisible = value
    },
    flipSettingsDialogVisibility() {
      this.settingsDialogVisible = !this.settingsDialogVisible
    },
    setSettingsDialogVisibility(value: any) {
      this.settingsDialogVisible = value
    },
  }
})
