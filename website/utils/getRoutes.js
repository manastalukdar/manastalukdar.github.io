import _ from 'lodash'
import moment from 'moment'
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
    properties.postFormats = []
  },
  setBaseUrl(baseUrl) {
    properties.baseUrl = baseUrl
  },
  generateRoutes() {
    this.initializeProperties()

    properties.nuxtGenerateRoutes.push({
      route: '/',
      payload: blogMetadata
    })

    properties.nuxtGenerateRoutes.push({
      route: '/blog/posts/',
      payload: blogMetadata
    })

    blogMetadata.map(postmetadata => {
      const momentObj = moment(postmetadata['first-published-on'])
      const route =
        '/blog/' +
        momentObj.format('YYYY-MM-DD').replace(/-/g, '/') +
        '/' +
        postmetadata['url-slug'] +
        '/'
      properties.nuxtGenerateRoutes.push({
        route: route,
        payload: postmetadata
      })
      properties.sitemapRoutes.push(route)
      if (properties.feedItems.length < 10) {
        properties.feedItems.push(
          helperFunctions.getFeedItem(postmetadata, route)
        )
      }
    })

    const groupedByPostFormat = _.groupBy(blogMetadata, function(postmetadata) {
      return postmetadata['post-format']['url-slug']
    })
    for (const [key, value] of Object.entries(groupedByPostFormat)) {
      const route = '/blog/post-format/' + key + '/'
      const postFormatName = value[0]['post-format'].name
      properties.postFormats.push({
        name: postFormatName,
        slug: key,
        count: value.length
      })
      properties.nuxtGenerateRoutes.push({
        route: route,
        payload: value
      })
      properties.sitemapRoutes.push(route)
    }

    properties.nuxtGenerateRoutes.push({
      route: '/blog/post-formats/',
      payload: properties.postFormats
    })

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
      const route = '/blog/author/' + key + '/'
      const authorName = value[0].authors.filter(author => {
        if (author['url-slug'] === key) {
          return author.name
        }
      })
      properties.authors.push({
        name: authorName[0].name,
        slug: key,
        count: value.length
      })
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
      const route = '/blog/tag/' + key + '/'
      const tagName = value[0].tags.filter(tag => {
        if (tag['url-slug'] === key) {
          return tag.name
        }
      })
      properties.tags.push({
        name: tagName[0].name,
        slug: key,
        count: value.length
      })
      properties.nuxtGenerateRoutes.push({
        route: route,
        payload: value
      })
      properties.sitemapRoutes.push(route)
    }

    properties.nuxtGenerateRoutes.push({
      route: '/blog/tags/',
      payload: properties.tags
    })

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
      const route = '/blog/category/' + key + '/'
      const catName = value[0].categories.filter(category => {
        if (category['url-slug'] === key) {
          return category.name
        }
      })
      properties.categories.push({
        name: catName[0].name,
        slug: key,
        count: value.length
      })
      properties.nuxtGenerateRoutes.push({
        route: route,
        payload: value
      })
      properties.sitemapRoutes.push(route)
    }

    properties.nuxtGenerateRoutes.push({
      route: '/blog/categories/',
      payload: properties.categories
    })

    const groupedByYear = blogMetadata.reduce(function(acc, curr) {
      const momentObj = moment(curr['first-published-on'])
      const year = momentObj.format('YYYY')
      if (acc[year]) {
        acc[year].push(curr)
      } else {
        acc[year] = [curr]
      }
      return acc
    }, {})
    for (const [key, value] of Object.entries(groupedByYear)) {
      const route = '/blog/' + key + '/'
      properties.nuxtGenerateRoutes.push({
        route: route,
        payload: value
      })
      properties.sitemapRoutes.push(route)
    }

    const groupedByMonth = blogMetadata.reduce(function(acc, curr) {
      const momentObj = moment(curr['first-published-on'])
      const year = momentObj.format('YYYY')
      const month = momentObj.format('MM')
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
      const route = '/blog/' + year + '/' + month + '/'
      properties.nuxtGenerateRoutes.push({
        route: route,
        payload: value
      })
      properties.sitemapRoutes.push(route)
    }

    const groupedByDay = blogMetadata.reduce(function(acc, curr) {
      const momentObj = moment(curr['first-published-on'])
      const year = momentObj.format('YYYY')
      const month = momentObj.format('MM')
      const day = momentObj.format('DD')
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
      const route = '/blog/' + year + '/' + month + '/' + day + '/'
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
