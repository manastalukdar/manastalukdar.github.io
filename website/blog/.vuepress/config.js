module.exports = {
    title: '',
    description: '',
    port: 8090,
    base: '/blog/',
    //permalink: '/:year/:month/:day/:slug',
    //theme: '@vuepress/blog',
    themeConfig: {
      logo: '',
      displayAllHeaders: true, // Default: false
      lastUpdated: 'Last Updated',
      docsDir: 'blog'
    },
    plugins: ['@vuepress/blog', '@vuepress/plugin-pagination']
  }
