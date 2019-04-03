import _ from 'lodash'
import blogMetadata from '../src/static/blogdata/metadata/blog_metadata.json'

const sitemapRoutes = []
const nuxtGenerateRoutes = []

const functions = {
  generateRoutes() {
    const tags = []
    const categories = []
    this.sitemapRoutes = []
    this.nuxtGenerateRoutes = []

    nuxtGenerateRoutes.push({
      route: '/',
      payload: 'dummy'
    })

    nuxtGenerateRoutes.push({
      route: '/blog/posts',
      payload: blogMetadata
    })

    blogMetadata.map(postmetadata => {
      const route =
        '/blog/' +
        postmetadata['first-published-on'].replace(/-/g, '/') +
        '/' +
        postmetadata['url-slug']
      nuxtGenerateRoutes.push({
        route: route,
        payload: postmetadata
      })
      sitemapRoutes.push(route)
    })

    const groupedByPostFormat = _.groupBy(blogMetadata, function(postmetadata) {
      return postmetadata['post-format']['url-slug']
    })
    for (const [key, value] of Object.entries(groupedByPostFormat)) {
      const route = '/blog/post-format/' + key
      nuxtGenerateRoutes.push({
        route: route,
        payload: value
      })
      sitemapRoutes.push(route)
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
      nuxtGenerateRoutes.push({
        route: route,
        payload: value
      })
      sitemapRoutes.push(route)
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
      tags.push({ key: value.length })
      nuxtGenerateRoutes.push({
        route: route,
        payload: value
      })
      sitemapRoutes.push(route)
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
      categories.push({ key: value.length })
      nuxtGenerateRoutes.push({
        route: route,
        payload: value
      })
      sitemapRoutes.push(route)
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
      nuxtGenerateRoutes.push({
        route: route,
        payload: value
      })
      sitemapRoutes.push(route)
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
      nuxtGenerateRoutes.push({
        route: route,
        payload: value
      })
      sitemapRoutes.push(route)
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
      nuxtGenerateRoutes.push({
        route: route,
        payload: value
      })
      sitemapRoutes.push(route)
    }
  }
}

module.exports = {
  sitemapRoutes,
  nuxtGenerateRoutes,
  functions
}
