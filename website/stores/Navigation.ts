import { defineStore } from 'pinia'

// initial state
const initialState = () => ({
  sidebarVisible: false,
  settingsDialogVisible: false,
  blog: {
    blogText: 'Blog',
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
    aboutItems: [
      {
        href: '/about/resume/',
        target: '_blank',
        icon: 'mdi-file-document',
        text: 'Resume',
      },
      {
        href: '/about/patents/',
        target: '_blank',
        icon: 'mdi-script-text',
        text: 'Patents',
      },
      {
        href: '/about/professional-commitments/',
        target: '_blank',
        icon: 'mdi-list-box',
        text: 'Professional Commitments',
      },
      {
        href: '/about/volunteering/',
        target: '_blank',
        icon: 'mdi-desk-lamp',
        text: 'Volunteering',
      },
      {
        href: '/about/services/',
        target: '_blank',
        icon: 'mdi-toolbox-outline',
        text: 'Services',
      },
      {
        href: '/about/recruiters/',
        target: '_blank',
        icon: 'mdi-handshake',
        text: 'Recruiters',
      },
    ],
  },
  legal: {
    legalText: 'Legal',
    legalPath: '/legal/',
  },
  contact: {
    contactText: 'Contact',
    subHeaderTextSocialMedia: { text: 'Social Media' },
    contactForm: {
      text: 'Form',
      icon: 'mdi-email-box',
      href: '/contact/form/',
    },
    socialMediaItems: [
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
        href: 'https://www.twitter.com/manastalukdar/',
        target: '_blank',
        icon: 'mdi-twitter',
        text: 'Twitter',
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
