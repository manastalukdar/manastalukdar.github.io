import _ from 'lodash'
import blogMetadata from '../src/static/blogdata/metadata/blog_metadata.json'

const properties = {
  sitemapRoutes: [],
  nuxtGenerateRoutes: [],
  feedItems: [],
  tags: [],
  categories: [],
  authors: [],
  baseUrl: ''
}

const functions = {
  initializeProperties() {
    properties.sitemapRoutes = []
    properties.nuxtGenerateRoutes = []
    properties.feedItems = []
    properties.tags = []
    properties.categories = []
    properties.authors = []
  },
  setBaseUrl(baseUrl) {
    properties.baseUrl = baseUrl
  },
  generateRoutes() {
    this.initializeProperties()

    properties.nuxtGenerateRoutes.push({
      route: '/',
      payload: 'dummy'
    })

    properties.nuxtGenerateRoutes.push({
      route: '/blog/posts',
      payload: blogMetadata
    })

    blogMetadata.map(postmetadata => {
      const route =
        '/blog/' +
        postmetadata['first-published-on'].replace(/-/g, '/') +
        '/' +
        postmetadata['url-slug']
      properties.nuxtGenerateRoutes.push({
        route: route,
        payload: postmetadata
      })
      properties.sitemapRoutes.push(route)
      properties.feedItems.push(
        helperFunctions.getFeedItem(postmetadata, route)
      )
    })

    const groupedByPostFormat = _.groupBy(blogMetadata, function(postmetadata) {
      return postmetadata['post-format']['url-slug']
    })
    for (const [key, value] of Object.entries(groupedByPostFormat)) {
      const route = '/blog/post-format/' + key
      properties.nuxtGenerateRoutes.push({
        route: route,
        payload: value
      })
      properties.sitemapRoutes.push(route)
    }

    // https://stackoverflow.com/questions/55450096/how-to-groupby-in-lodash-for-each-item-in-a-nested-array
    const groupedByAuthor = blogMetadata.reduce(function(acc, curr) {
      curr.authors.forEach(function(item) {
        if (acc[item['url-slug']]) {
          acc[item['url-slug']].push(curr)
        } else {
          acc[item['url-slug']] = [curr]
        }
      })
      return acc
    }, {})
    for (const [key, value] of Object.entries(groupedByAuthor)) {
      const route = '/blog/author/' + key
      properties.authors.push({ key: value.length })
      properties.nuxtGenerateRoutes.push({
        route: route,
        payload: value
      })
      properties.sitemapRoutes.push(route)
    }

    const groupedByTag = blogMetadata.reduce(function(acc, curr) {
      curr.tags.forEach(function(item) {
        if (acc[item['url-slug']]) {
          acc[item['url-slug']].push(curr)
        } else {
          acc[item['url-slug']] = [curr]
        }
      })
      return acc
    }, {})
    for (const [key, value] of Object.entries(groupedByTag)) {
      const route = '/blog/tag/' + key
      properties.tags.push({ key: value.length })
      properties.nuxtGenerateRoutes.push({
        route: route,
        payload: value
      })
      properties.sitemapRoutes.push(route)
    }

    const groupedByCategories = blogMetadata.reduce(function(acc, curr) {
      curr.categories.forEach(function(item) {
        if (acc[item['url-slug']]) {
          acc[item['url-slug']].push(curr)
        } else {
          acc[item['url-slug']] = [curr]
        }
      })
      return acc
    }, {})
    for (const [key, value] of Object.entries(groupedByCategories)) {
      const route = '/blog/category/' + key
      properties.categories.push({ key: value.length })
      properties.nuxtGenerateRoutes.push({
        route: route,
        payload: value
      })
      properties.sitemapRoutes.push(route)
    }

    const groupedByYear = blogMetadata.reduce(function(acc, curr) {
      const year = curr['first-published-on'].split('-')[0]
      if (acc[year]) {
        acc[year].push(curr)
      } else {
        acc[year] = [curr]
      }
      return acc
    }, {})
    for (const [key, value] of Object.entries(groupedByYear)) {
      const route = '/blog/' + key
      properties.nuxtGenerateRoutes.push({
        route: route,
        payload: value
      })
      properties.sitemapRoutes.push(route)
    }

    const groupedByMonth = blogMetadata.reduce(function(acc, curr) {
      const year = curr['first-published-on'].split('-')[0]
      const month = curr['first-published-on'].split('-')[1]
      const key = year + '-' + month
      if (acc[key]) {
        acc[key].push(curr)
      } else {
        acc[key] = [curr]
      }
      return acc
    }, {})
    for (const [key, value] of Object.entries(groupedByMonth)) {
      const year = key.split('-')[0]
      const month = key.split('-')[1]
      const route = '/blog/' + year + '/' + month
      properties.nuxtGenerateRoutes.push({
        route: route,
        payload: value
      })
      properties.sitemapRoutes.push(route)
    }

    const groupedByDay = blogMetadata.reduce(function(acc, curr) {
      const year = curr['first-published-on'].split('-')[0]
      const month = curr['first-published-on'].split('-')[1]
      const day = curr['first-published-on'].split('-')[2]
      const key = year + '-' + month + '-' + day
      if (acc[key]) {
        acc[key].push(curr)
      } else {
        acc[key] = [curr]
      }
      return acc
    }, {})
    for (const [key, value] of Object.entries(groupedByDay)) {
      const year = key.split('-')[0]
      const month = key.split('-')[1]
      const day = key.split('-')[2]
      const route = '/blog/' + year + '/' + month + '/' + day
      properties.nuxtGenerateRoutes.push({
        route: route,
        payload: value
      })
      properties.sitemapRoutes.push(route)
    }
  }
}

const helperFunctions = {
  getFeedItem(postMetadata, route) {
    const authors = []
    postMetadata.authors.forEach(function(author) {
      authors.push({
        name: author.name
      })
    })
    const item = {
      title: postMetadata.title,
      id: route,
      link: properties.baseUrl + route,
      description: postMetadata.meta.description,
      content: postMetadata.excerpt + ' ...read more',
      date: new Date(postMetadata['first-published-on']),
      author: authors
    }

    return item
  }
}

module.exports = {
  properties,
  functions,
  helperFunctions
}
