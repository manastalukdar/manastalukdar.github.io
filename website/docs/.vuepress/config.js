module.exports = {
    title: 'Manas Talukdar',
    description: '',
    themeConfig: {
      logo: '',
      displayAllHeaders: true, // Default: false
      nav: [
        {
          text: 'Blog',
          items: [
            { text: 'Blog', link: '/blog/' },
            { text: 'Categories', link: '/blog/categories' },
            { text: 'Tags', link: '/blog/tags' },
            { text: 'Archive', link: '/blog/archive' }
          ]
        },
        { text: 'About', link: '/about/' },
        { text: 'Legal', link: '/legal/' },
        { text: 'Contact', link: '/contact/' },
      ],
      lastUpdated: 'Last Updated'
    }
  }
